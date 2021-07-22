import numpy as np
from collections import deque
import requests
import threading
import cv2
from flask_opencv_streamer.streamer import Streamer
from PIL import Image, ImageFont, ImageDraw
import time
import os
from ml_lib import draw_border, video_cap
from utility import gstreamer_pipeline, read_camera, generate_uuid ,checkTemperature, check_weather_pm25

from csi_camera import CSI_Camera
import multiprocessing as mp

# from flask import Flask,request,jsonify

import uvicorn
from starlette.applications import Starlette
from starlette.routing import Route
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.responses import JSONResponse
# import json
import dlib
from mongo_lib import insert_data_train_face, next_userid, register_mongo, get_frame_display, update_register_mongo, select_videoname_by_uid, get_status_mask, update_status_mask_predict
import shutil
# import subprocess
# from flask_cors import CORS
# import uuid

try:
    mp.set_start_method('spawn')
except RuntimeError:
    pass

check_reg = False
classifier = cv2.CascadeClassifier('../model/haarcascade_frontalface_default.xml')
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(
    '../model/face_landmarks68.dat')
face_recognition = dlib.face_recognition_model_v1(
    '../model/dlib_face_recognition_resnet_model_v1.dat')
#is_detect = False
port = 3050
require_login = False
streamer = Streamer(port, require_login)
check_camera_register = mp.Value('i',True)
check_camera_detection = mp.Value('i',True)
check_camera_mask = mp.Value('i',False)

# thread for face prediction
thread_predict = None
face_desc = []
face_name = []
#check_video_success = mp.Value('i',True)
#video_array = mp.Array('i',640)
#video_data = list()
#video_keep = mp.Value(c_char_p,"empty".encode('utf-8'))

#camera
DISPLAY_WIDTH=960
DISPLAY_HEIGHT=540
SENSOR_MODE_1080=2
SENSOR_MODE_720=3

middleware = [
    Middleware(
        CORSMiddleware, 
        allow_origins=['*']
        )
]

#flask api
# app = Flask(__name__)
# CORS(app)
# app.config['SECRET_KEY'] = uuid.uuid4().hex
# socketio = SocketIO(app,cors_allowed_origins='*')

# http://0.0.0.0:3050/video_feed
def video_streaming(frame):
    if not streamer.is_streaming:
        streamer.start_streaming()
    else:
        streamer.update_frame(frame)

# send thread request to fr_api
# receive data for crop face
# receive log_predict_id for save log predict
def thread_function(image_name, log_predict_id):
    print("Thread")
    url = 'http://192.168.0.252:2323/recognition/predict'
    image_msg = {'image_name': image_name, 'log_predicted':log_predict_id}
    r = requests.post(url,image_msg)
    res_json = r.json()
    print('Thread predict:',res_json)
   
# send thread request to fr_api
# receive data for crop face mask
def thread_mask_prediction(image_name_mask, log_predict_id):
    print('Thread mask')
    url = 'http://192.168.0.252:2323/recognition/predict_mask'
    image_msg = {'image_name_mask': image_name_mask}
    r = requests.post(url,image_msg)
    res_json = r.json()
    print('Thread predict mask:',res_json)
    
    # check mask status
    if res_json['status'] == True:
        thread_predict.join()
        if res_json['msg'] == 'mask':
            update_status_mask_predict(log_predict_id, 1)
            #check_camera_mask.value = True
        else:
            update_status_mask_predict(log_predict_id, 0)
        
def thread_send2socket(check_value_send):
    print("Thread send2socket")
    url = 'http://192.168.0.252:2626/wait_process'
    if check_value_send == 'process':
        send2socket = {'wait':False, 'process':True}
    else:
        send2socket = {'wait':True, 'process':False}
    requests.post(url,send2socket)

# check face movement
# def thread_send2socket_checkmovement_face(check_face_movement):
#     send2socket_facemovement = None
#     url = 'http://192.168.0.252:2626/face_movement'
#     if check_face_movement == 'T':
#         send2socket_facemovement = {'movement':'T'}
#         # send2socket_facemovement = {'top':True, 'bottom':False, 'right':False, 'left':False}
#     if check_face_movement == 'B':
#         send2socket_facemovement = {'movement':'B'}
#         # send2socket_facemovement = {'top':False, 'bottom':True, 'right':False, 'left':False}
#     if check_face_movement == 'R':
#         send2socket_facemovement = {'movement':'R'}
#         # send2socket_facemovement = {'top':False, 'bottom':False, 'right':True, 'left':False}
#     if check_face_movement == 'L':
#         send2socket_facemovement = {'movement':'L'}
#         # send2socket_facemovement = {'top':False, 'bottom':False, 'right':False, 'left':True}
#     sent = requests.post(url,send2socket_facemovement)
    
#save video
def saveVideo(video_frame,uuid):
    #delete anything
    print('dir: ',os.getcwd())
    file_for_del = os.listdir('../video_freeze')
    print(file_for_del)
    
    print('check file in video_freeze folder')
    if len(file_for_del) > 0:
        print('found {} file'.format(len(file_for_del)))
        for files in file_for_del:
            print('remove {} file'.format(files))
            os.remove('../video_freeze/'+files)

    #check file in folder
    print('save video')
    out = cv2.VideoWriter('../video_freeze/{}.mp4'.format(uuid),cv2.VideoWriter_fourcc('M','J','P','G'), 30, (DISPLAY_WIDTH,DISPLAY_HEIGHT))
    #len_frame = len(video_frame)
    for video in video_frame:
        out.write(video)
    print('done')
    del video_frame

def camera_recognition(check_camera_register, check_camera_detection, check_camera_mask):
    #global video_data
    global thread_predict
    #print('thread_rec_mask:',thread_rec_mask)
    is_detect = False
    N_SAMPLE = 5
    shifter = 200
    # image_wait = None
    checkis_detection = True # do one time, for get data from mongodb to check draw rectangle in image 
    q = deque([time.time() for i in range(N_SAMPLE)])
    
    # #start_time = time.time()
    # left_camera = CSI_Camera()
    # left_camera.create_gstreamer_pipeline(
    #         sensor_id=1,
    #         sensor_mode=SENSOR_MODE_720,
    #         framerate=30,
    #         flip_method=0,
    #         display_height=DISPLAY_HEIGHT,
    #         display_width=DISPLAY_WIDTH,
    # )
    # left_camera.open(left_camera.gstreamer_pipeline)
    # left_camera.start()

    list_file_in_folder = os.listdir(os.getcwd())
    print(list_file_in_folder)
    print('list file in folder src')
    if 'image_no_crop' not in list_file_in_folder:
        print('create image_no_crop folder')
        os.mkdir('image_no_crop') 
    
    if 'image_face_cropped' not in list_file_in_folder:
        print('create image_face_cropped folder')
        os.mkdir('image_face_cropped')

    print('pass to check create folder')


    # if (not left_camera.video_capture.isOpened()):
    #     print("Unable to open any cameras")
    #     SystemExit(0)
    cap = cv2.VideoCapture('http://192.168.1.28:4747/video')
    try:
        while True:
            ret, img = cap.read()
            # rotate image
            img = cv2.rotate(img,cv2.ROTATE_90_COUNTERCLOCKWISE)
         
            # extract width , height
            w_origin = img.shape[1]

            frame_regular = img.copy()
            video_streaming(frame_regular)
            # streaming frame
            
            # check camera detection
            if check_camera_detection.value == False:
                rec = None
                check_mask = None
                
                print('camera detection mode')
                print('start check draw rectangle')
                print('get data from mongodb')
                if checkis_detection:
                    data_frame_setting = get_frame_display()
                    rec = data_frame_setting[0]['display']['frame_setting']['rectangle_frame']
                    #data_scanner_mode = getStatusFace()
                    #is_recognition = data_scanner_mode[0]['scanner_mode']['face_recognition']['status']
                    checkis_detection = False
                    print('status rec',rec)
                    #print('status predict',is_recognition)
                    
                check_mask = get_status_mask()
                
                while True:
                    ret, img = cap.read()
                    img = cv2.rotate(img,cv2.ROTATE_90_COUNTERCLOCKWISE)
                  

                    w_origin = img.shape[1]
                    # img = img[:,shifter:shifter+int(w_origin*0.3)]
                    h,w = img.shape[:2]
                    new_width = int(w/2)
                    new_height = int(h/2)
                    left = (w - new_width)/2
                    top = (h - new_height)/2
                    right = (w + new_width)/2
                    bottom = (h + new_height)/2.5

                    frame_detection = img.copy()

                    open_cv_image = cv2.cvtColor(frame_detection, cv2.COLOR_BGR2GRAY)
                    
                    # detection
                    bboxes = classifier.detectMultiScale(open_cv_image, 1.3, 5)
                    if len(bboxes) == 1:
                        #print('1',is_detect)
                        if is_detect == False:
                            for box in bboxes:
                                x, y, width, height = box
                                x2, y2 = x + width, y + height

                                # check face movement
                                # if x < left:
                                #     thread1 = mp.Process(target=thread_send2socket_checkmovement_face,args=('R',))
                                #     thread1.start()
                                
                                # if x2 > right:
                                #     thread2 = mp.Process(target=thread_send2socket_checkmovement_face,args=('L',))
                                #     thread2.start()

                                # if y < top:
                                #     thread3 = mp.Process(target=thread_send2socket_checkmovement_face,args=('B',))
                                #     thread3.start()

                                # if y2 > bottom:
                                #     thread4 = mp.Process(target=thread_send2socket_checkmovement_face,args=('T',))
                                #     thread4.start()

                                x_percent = (x2-x)/min(w, h)
                                print('percent:',x_percent)
                                # check distance between face and camera
                                if x_percent >= 0.4 and x_percent <= 0.8:
                                    check_reg = True
                                    
                                    id_log_prediction = generate_uuid()
                                    id_log_prediction = id_log_prediction[:24]
                                    
                                    #generate uuid for image name
                                    image_name = generate_uuid()
                                    #save image for send to api
                                    cv2.imwrite(os.path.join(os.getcwd(),'image_no_crop','{}.bmp'.format(image_name)),img)
                                    print('path predicted:',os.path.join(os.getcwd(),'image_no_crop','{}.bmp'.format(image_name)))
                                    thread_predict = threading.Thread(target=thread_function,args=('{}.bmp'.format(image_name),id_log_prediction,))
                                    thread_predict.start()

                                    # check mask model status
                                    # variable mask recognition
                                    if check_mask:
                                        print('mask recognition')
                                        start_time_mask = time.time()
                                        waittime_mask = 20
                                        current = time.time() # get once
                                        check_current_once = False # check 
                                        
                                        # send and receive id of log_predict
                                        #thread_rec_mask = threading.Thread(target=thread_function,args=('{}.bmp'.format(image_name),image_name,))
                                        #thread_rec_mask.start()
                                        # define font
                                        font = cv2.FONT_HERSHEY_PLAIN

                                        while True:
                                            ret, img = cap.read()
                                            img = cv2.rotate(img,cv2.ROTATE_180)
                                            img = cv2.flip(img,1)
                                            h_mask,w_mask = img.shape[:2]
                                            #w_origin = img.shape[1]
                                            # img = img[:720,shifter:shifter+int(w_mask*0.3)]

                                            # get current time and change variable 
                                            if check_current_once == False:
                                                current = time.time()
                                                check_current_once = True
                                                
                                            # if mask detected then loop exit
                                            if check_camera_mask.value:
                                                check_camera_mask.value = False
                                                break
                                            
                                            # send wait message to frontend 
                                            
                                            # waiting for mask recognition
                                            if int(time.time() - current) == 5:
                                                print('now!! predict mask')
                                                print('check camera mask:',check_camera_mask.value)
                                                
                                                #TODO
                                                image_name_mask = generate_uuid()
                                                cv2.imwrite(os.path.join(os.getcwd(),'image_no_crop','{}.bmp'.format(image_name_mask)),img)
                                                print('path mask predicted:',os.path.join(os.getcwd(),'image_no_crop','{}.bmp'.format(image_name_mask)))
                                                thread_predict_mask = threading.Thread(target=thread_mask_prediction,args=('{}.bmp'.format(image_name_mask),id_log_prediction,))
                                                thread_predict_mask.start()
                                                
                                                check_current_once = False
                                                
                                            # crete text
                                            frame = Image.fromarray(img)
                                            draw = ImageDraw.Draw(frame)
                                            # wait record video
                                            font = ImageFont.truetype(os.path.join(os.getcwd(),'font',"Anuphan-Bold.ttf"),200)

                                            text = str('{}'.format(waittime_mask-int(time.time()-start_time_mask)))
                                            draw.text((int(w_mask*0.45),int(h_mask*0.25)),text,font=font,fill=(255,255,255))
                                            
                                            frame = cv2.cvtColor(np.array(frame),cv2.COLOR_RGB2BGR)
                                            frame = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
                                                
                                            # check timeout when unmask
                                            if int(time.time() - start_time_mask) >= waittime_mask:
                                                print('time out')
                                                break
                                                
                                            # steam video
                                            video_streaming(frame)

                                    is_detect = True
                                else:
                                    check_reg = False
                    else:
                        is_detect = False
                        check_reg = False
                    
                    fps = N_SAMPLE/(time.time()-q.popleft())
                    q.append(time.time())
                    #position x,y
                    
                    # wait test
                    frame_detection = Image.fromarray(frame_detection)
                    draw = ImageDraw.Draw(frame_detection)

                    #print('start font')
                    #print('os path',os.getcwd())
                    font = ImageFont.truetype(os.path.join(os.getcwd(),'font',"Anuphan-Bold.ttf"),50)
                    # draw.text((int(h*0.1),int(w*0.1)),'{:6.3f} fps'.format(fps),font=font,fill=(255,255,255))
                    #print('end font')

                    frame_detection = cv2.cvtColor(np.array(frame_detection),cv2.COLOR_RGB2BGR)					
                    frame_detection = cv2.cvtColor(frame_detection,cv2.COLOR_BGR2RGB)
                    #cv2.putText(frame_detection,'{:6.3f} fps'.format(fps),(int(h*0.2),int(w*0.1)),cv2.FONT_HERSHEY_PLAIN,1,(255,255,0))

                    # if rec:
                        # if check_reg:
                        #     frame_detection = draw_border(frame_detection, (int(left), int(top)), (int(right),int(bottom)), (0, 255, 0))
                        # else:
                        #     frame_detection = draw_border(frame_detection, (int(left), int(top)), (int(right), int(bottom)), (255, 0, 0))

                    video_streaming(frame_detection)

                    if check_camera_detection.value == True:
                        checkis_detection = True
                        break

            # check camera register
            if check_camera_register.value == False:
                print('camera register mode')
                video_data = list()
                #uuid_video= ''
                waittime = 5
                capture_duration =5
                font = cv2.FONT_HERSHEY_PLAIN
                check_break = False
                start_time = time.time()
                #wait to ready
                while True:
                    #start_time = time.time()
                    ret, frame = cap.read()
                    frame = cv2.rotate(frame,cv2.ROTATE_90_COUNTERCLOCKWISE)
                  
                    w_origin = frame.shape[1]
                    #frame = frame[:720,shifter:shifter+int(w_origin*0.3)]
                    h,w = frame.shape[:2]

                    frame = Image.fromarray(frame)
                    draw = ImageDraw.Draw(frame)
                    # wait record video
                    font = ImageFont.truetype(os.path.join(os.getcwd(),'font',"Anuphan-Bold.ttf"),200)

                    text = str('{}'.format(waittime-int(np.subtract(time.time(),start_time))))
                    draw.text((int(w*0.45),int(h*0.25)),text,font=font,fill=(255,255,255))
                    
                    frame = cv2.cvtColor(np.array(frame),cv2.COLOR_RGB2BGR)
                    frame = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
                    #cv2.putText(frame, text, (int(w*0.3),int(h*0.6)), font, 10, (255, 255, 0),8)

                    video_streaming(frame)
                    #start_time = time.time()
                    if int(time.time() - start_time) >= waittime:
                    

                        # check wait success and then send socket
                        # send socket
                        print('send wait socket')
                        send_socket = mp.Process(target=thread_send2socket,args=('wait',))
                        send_socket.start()
                        
                        uuid = generate_uuid()
                        #out = cv2.VideoWriter('../video_freeze/{}.mp4'.format(uuid),cv2.VideoWriter_fourcc('M','J','P','G'), 30, (DISPLAY_WIDTH,DISPLAY_HEIGHT))
                        start_time = time.time()
                        #record
                        while True:
                            ret, frame = cap.read()
                            frame = cv2.rotate(frame,cv2.ROTATE_90_COUNTERCLOCKWISE)
                   
                            #w_origin = frame.shape[1]
                            #frame = frame[:720,shifter:shifter+int(w_origin*0.3)]

                            frame_copy = frame.copy()
                            h, w = frame_copy.shape[:2]

                            #frame_copy = frame_copy[:720,shifter:shifter+int(w*0.3)]
                            # = frame_copy.shape[:2]
                            
                            frame_copy = Image.fromarray(frame_copy)
                            draw = ImageDraw.Draw(frame_copy)
                            font = ImageFont.truetype(os.path.join(os.getcwd(),'font','Anuphan-Bold.ttf'),80)

                            text = str('{}'.format('Rec.. ',capture_duration-int(np.subtract(time.time(),start_time))))
                            draw.text((0,int((h/2)+((h/2)*(-0.7)))),text,font=font,fill=(255, 255, 255))

                            frame_copy = cv2.cvtColor(np.array(frame_copy),cv2.COLOR_RGB2BGR)
                            frame_copy = cv2.cvtColor(frame_copy,cv2.COLOR_BGR2RGB)
                            #cv2.putText(frame_copy, text, (0,int((frame_copy.shape[0]/2)+((frame_copy.shape[0]/2)*(-0.7)))), font, 5, (255, 255, 0),5)
                            #keep video to variable
                            video_data.append(frame)

                            video_streaming(frame_copy)
                            
                            # save image when video time == 0 sec
                            '''if int(time.time() - start_time) == 0:
                                image_wait = frame.copy()
                                image_wait = image_wait[:720,shifter:shifter+int(w*0.3)]'''
                                
                            if int(time.time() - start_time) >= capture_duration:
                                check_break = True
                                break
                    if check_break == True:
                        break

                check_camera_register.value = True
                saveVideo(video_data,uuid)
                #pp = mp.Process(target=saveVideo,args = (video_data,uuid,))
                #pp.start()
                
                # test
                print('wait recorded')
                '''while True:
                    video_streaming(image_wait)
                    if check_camera_register.value == False or check_camera_detection.value == False:
                        break
                '''       
                #pp.join()
                del video_data
                print('send done socket')
                send_socket = mp.Process(target=thread_send2socket,args=('process',))
                send_socket.start()
                
    except Exception as e:
       print('error process:',e)
    #    left_camera.stop()
    #    left_camera.release()

    finally:
        # left_camera.stop()
        # left_camera.release()
        cv2.destroyAllWindows()

def camera_recognition2(check_camera_register, check_camera_detection, check_camera_mask):
    #global video_data
    global thread_predict
    #print('thread_rec_mask:',thread_rec_mask)
    is_detect = False
    N_SAMPLE = 5
    shifter = 200
    # image_wait = None
    checkis_detection = True # do one time, for get data from mongodb to check draw rectangle in image 
    q = deque([time.time() for i in range(N_SAMPLE)])
    
    #start_time = time.time()
    left_camera = CSI_Camera()
    left_camera.create_gstreamer_pipeline(
            sensor_id=1,
            sensor_mode=SENSOR_MODE_720,
            framerate=30,
            flip_method=0,
            display_height=DISPLAY_HEIGHT,
            display_width=DISPLAY_WIDTH,
    )
    left_camera.open(left_camera.gstreamer_pipeline)
    left_camera.start()

    list_file_in_folder = os.listdir(os.getcwd())
    print(list_file_in_folder)
    print('list file in folder src')
    if 'image_no_crop' not in list_file_in_folder:
        print('create image_no_crop folder')
        os.mkdir('image_no_crop') 
    
    if 'image_face_cropped' not in list_file_in_folder:
        print('create image_face_cropped folder')
        os.mkdir('image_face_cropped')

    print('pass to check create folder')


    if (not left_camera.video_capture.isOpened()):
        print("Unable to open any cameras")
        SystemExit(0)
    
    try:
        while True:
            img=read_camera(left_camera,False)
            # rotate image
            img = cv2.rotate(img,cv2.ROTATE_180)
            img = cv2.flip(img,1)
            # extract width , height
            w_origin = img.shape[1]

            frame_regular = img.copy()
            video_streaming(frame_regular)
            # streaming frame
            
            # check camera detection
            if check_camera_detection.value == False:
                rec = None
                check_mask = None
                
                print('camera detection mode')
                print('start check draw rectangle')
                print('get data from mongodb')
                if checkis_detection:
                    data_frame_setting = get_frame_display()
                    rec = data_frame_setting[0]['display']['frame_setting']['rectangle_frame']
                    #data_scanner_mode = getStatusFace()
                    #is_recognition = data_scanner_mode[0]['scanner_mode']['face_recognition']['status']
                    checkis_detection = False
                    print('status rec',rec)
                    #print('status predict',is_recognition)
                    
                check_mask = get_status_mask()
                
                while True:
                    img = read_camera(left_camera,False)
                    img = cv2.rotate(img,cv2.ROTATE_180)
                    img = cv2.flip(img,1)

                    w_origin = img.shape[1]
                    img = img[:,shifter:shifter+int(w_origin*0.3)]
                    h,w = img.shape[:2]
                    new_width = int(w/2)
                    new_height = int(h/2)
                    left = (w - new_width)/2
                    top = (h - new_height)/2
                    right = (w + new_width)/2
                    bottom = (h + new_height)/2.5

                    frame_detection = img.copy()

                    open_cv_image = cv2.cvtColor(frame_detection, cv2.COLOR_BGR2GRAY)
                    
                    # detection
                    bboxes = classifier.detectMultiScale(open_cv_image, 1.3, 5)
                    if len(bboxes) == 1:
                        #print('1',is_detect)
                        if is_detect == False:
                            for box in bboxes:
                                x, y, width, height = box
                                x2, y2 = x + width, y + height

                                # check face movement
                                # if x < left:
                                #     thread1 = mp.Process(target=thread_send2socket_checkmovement_face,args=('R',))
                                #     thread1.start()
                                
                                # if x2 > right:
                                #     thread2 = mp.Process(target=thread_send2socket_checkmovement_face,args=('L',))
                                #     thread2.start()

                                # if y < top:
                                #     thread3 = mp.Process(target=thread_send2socket_checkmovement_face,args=('B',))
                                #     thread3.start()

                                # if y2 > bottom:
                                #     thread4 = mp.Process(target=thread_send2socket_checkmovement_face,args=('T',))
                                #     thread4.start()

                                x_percent = (x2-x)/min(w, h)
                                print('percent:',x_percent)
                                # check distance between face and camera
                                if x_percent >= 0.4 and x_percent <= 0.8:
                                    check_reg = True
                                    
                                    id_log_prediction = generate_uuid()
                                    id_log_prediction = id_log_prediction[:24]
                                    
                                    #generate uuid for image name
                                    image_name = generate_uuid()
                                    #save image for send to api
                                    cv2.imwrite(os.path.join(os.getcwd(),'image_no_crop','{}.bmp'.format(image_name)),img)
                                    print('path predicted:',os.path.join(os.getcwd(),'image_no_crop','{}.bmp'.format(image_name)))
                                    thread_predict = threading.Thread(target=thread_function,args=('{}.bmp'.format(image_name),id_log_prediction,))
                                    thread_predict.start()

                                    # check mask model status
                                    # variable mask recognition
                                    if check_mask:
                                        print('mask recognition')
                                        start_time_mask = time.time()
                                        waittime_mask = 20
                                        current = time.time() # get once
                                        check_current_once = False # check 
                                        
                                        # send and receive id of log_predict
                                        #thread_rec_mask = threading.Thread(target=thread_function,args=('{}.bmp'.format(image_name),image_name,))
                                        #thread_rec_mask.start()
                                        # define font
                                        font = cv2.FONT_HERSHEY_PLAIN

                                        while True:
                                            img = read_camera(left_camera,False)
                                            img = cv2.rotate(img,cv2.ROTATE_180)
                                            img = cv2.flip(img,1)
                                            h_mask,w_mask = img.shape[:2]
                                            #w_origin = img.shape[1]
                                            img = img[:720,shifter:shifter+int(w_mask*0.3)]

                                            # get current time and change variable 
                                            if check_current_once == False:
                                                current = time.time()
                                                check_current_once = True
                                                
                                            # if mask detected then loop exit
                                            if check_camera_mask.value:
                                                check_camera_mask.value = False
                                                break
                                            
                                            # send wait message to frontend 
                                            
                                            # waiting for mask recognition
                                            if int(time.time() - current) == 5:
                                                print('now!! predict mask')
                                                print('check camera mask:',check_camera_mask.value)
                                                
                                                #TODO
                                                image_name_mask = generate_uuid()
                                                cv2.imwrite(os.path.join(os.getcwd(),'image_no_crop','{}.bmp'.format(image_name_mask)),img)
                                                print('path mask predicted:',os.path.join(os.getcwd(),'image_no_crop','{}.bmp'.format(image_name_mask)))
                                                thread_predict_mask = threading.Thread(target=thread_mask_prediction,args=('{}.bmp'.format(image_name_mask),id_log_prediction,))
                                                thread_predict_mask.start()
                                                
                                                check_current_once = False
                                                
                                            # crete text
                                            frame = Image.fromarray(img)
                                            draw = ImageDraw.Draw(frame)
                                            # wait record video
                                            font = ImageFont.truetype(os.path.join(os.getcwd(),'font',"Anuphan-Bold.ttf"),200)

                                            text = str('{}'.format(waittime_mask-int(time.time()-start_time_mask)))
                                            draw.text((int(w_mask*0.45),int(h_mask*0.25)),text,font=font,fill=(255,255,255))
                                            
                                            frame = cv2.cvtColor(np.array(frame),cv2.COLOR_RGB2BGR)
                                            frame = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
                                                
                                            # check timeout when unmask
                                            if int(time.time() - start_time_mask) >= waittime_mask:
                                                print('time out')
                                                break
                                                
                                            # steam video
                                            video_streaming(frame)

                                    is_detect = True
                                else:
                                    check_reg = False
                    else:
                        is_detect = False
                        check_reg = False
                    
                    fps = N_SAMPLE/(time.time()-q.popleft())
                    q.append(time.time())
                    #position x,y
                    
                    # wait test
                    frame_detection = Image.fromarray(frame_detection)
                    draw = ImageDraw.Draw(frame_detection)

                    #print('start font')
                    #print('os path',os.getcwd())
                    font = ImageFont.truetype(os.path.join(os.getcwd(),'font',"Anuphan-Bold.ttf"),50)
                    # draw.text((int(h*0.1),int(w*0.1)),'{:6.3f} fps'.format(fps),font=font,fill=(255,255,255))
                    #print('end font')

                    frame_detection = cv2.cvtColor(np.array(frame_detection),cv2.COLOR_RGB2BGR)					
                    frame_detection = cv2.cvtColor(frame_detection,cv2.COLOR_BGR2RGB)
                    #cv2.putText(frame_detection,'{:6.3f} fps'.format(fps),(int(h*0.2),int(w*0.1)),cv2.FONT_HERSHEY_PLAIN,1,(255,255,0))

                    # if rec:
                        # if check_reg:
                        #     frame_detection = draw_border(frame_detection, (int(left), int(top)), (int(right),int(bottom)), (0, 255, 0))
                        # else:
                        #     frame_detection = draw_border(frame_detection, (int(left), int(top)), (int(right), int(bottom)), (255, 0, 0))

                    video_streaming(frame_detection)

                    if check_camera_detection.value == True:
                        checkis_detection = True
                        break

            # check camera register
            if check_camera_register.value == False:
                print('camera register mode')
                video_data = list()
                #uuid_video= ''
                waittime = 5
                capture_duration =5
                font = cv2.FONT_HERSHEY_PLAIN
                check_break = False
                start_time = time.time()
                #wait to ready
                while True:
                    #start_time = time.time()
                    frame = read_camera(left_camera,False)
                    frame = cv2.rotate(frame,cv2.ROTATE_180)
                    frame = cv2.flip(frame,1)
                    w_origin = frame.shape[1]
                    #frame = frame[:720,shifter:shifter+int(w_origin*0.3)]
                    h,w = frame.shape[:2]

                    frame = Image.fromarray(frame)
                    draw = ImageDraw.Draw(frame)
                    # wait record video
                    font = ImageFont.truetype(os.path.join(os.getcwd(),'font',"Anuphan-Bold.ttf"),200)

                    text = str('{}'.format(waittime-int(np.subtract(time.time(),start_time))))
                    draw.text((int(w*0.45),int(h*0.25)),text,font=font,fill=(255,255,255))
                    
                    frame = cv2.cvtColor(np.array(frame),cv2.COLOR_RGB2BGR)
                    frame = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
                    #cv2.putText(frame, text, (int(w*0.3),int(h*0.6)), font, 10, (255, 255, 0),8)

                    video_streaming(frame)
                    #start_time = time.time()
                    if int(time.time() - start_time) >= waittime:
                    

                        # check wait success and then send socket
                        # send socket
                        print('send wait socket')
                        send_socket = mp.Process(target=thread_send2socket,args=('wait',))
                        send_socket.start()
                        
                        uuid = generate_uuid()
                        #out = cv2.VideoWriter('../video_freeze/{}.mp4'.format(uuid),cv2.VideoWriter_fourcc('M','J','P','G'), 30, (DISPLAY_WIDTH,DISPLAY_HEIGHT))
                        start_time = time.time()
                        #record
                        while True:
                            frame=read_camera(left_camera,False)
                            frame = cv2.rotate(frame,cv2.ROTATE_180)
                            frame = cv2.flip(frame,1)
                            #w_origin = frame.shape[1]
                            #frame = frame[:720,shifter:shifter+int(w_origin*0.3)]

                            frame_copy = frame.copy()
                            h, w = frame_copy.shape[:2]

                            #frame_copy = frame_copy[:720,shifter:shifter+int(w*0.3)]
                            # = frame_copy.shape[:2]
                            
                            frame_copy = Image.fromarray(frame_copy)
                            draw = ImageDraw.Draw(frame_copy)
                            font = ImageFont.truetype(os.path.join(os.getcwd(),'font','Anuphan-Bold.ttf'),80)

                            text = str('{}'.format('Rec.. ',capture_duration-int(np.subtract(time.time(),start_time))))
                            draw.text((0,int((h/2)+((h/2)*(-0.7)))),text,font=font,fill=(255, 255, 255))

                            frame_copy = cv2.cvtColor(np.array(frame_copy),cv2.COLOR_RGB2BGR)
                            frame_copy = cv2.cvtColor(frame_copy,cv2.COLOR_BGR2RGB)
                            #cv2.putText(frame_copy, text, (0,int((frame_copy.shape[0]/2)+((frame_copy.shape[0]/2)*(-0.7)))), font, 5, (255, 255, 0),5)
                            #keep video to variable
                            video_data.append(frame)

                            video_streaming(frame_copy)
                            
                            # save image when video time == 0 sec
                            '''if int(time.time() - start_time) == 0:
                                image_wait = frame.copy()
                                image_wait = image_wait[:720,shifter:shifter+int(w*0.3)]'''
                                
                            if int(time.time() - start_time) >= capture_duration:
                                check_break = True
                                break
                    if check_break == True:
                        break

                check_camera_register.value = True
                saveVideo(video_data,uuid)
                #pp = mp.Process(target=saveVideo,args = (video_data,uuid,))
                #pp.start()
                
                # test
                print('wait recorded')
                '''while True:
                    video_streaming(image_wait)
                    if check_camera_register.value == False or check_camera_detection.value == False:
                        break
                '''       
                #pp.join()
                del video_data
                print('send done socket')
                send_socket = mp.Process(target=thread_send2socket,args=('process',))
                send_socket.start()
                
    except Exception as e:
       print('error process:',e)
       left_camera.stop()
       left_camera.release()

    finally:
        left_camera.stop()
        left_camera.release()
        cv2.destroyAllWindows()


# def save data
def retrain_model(video_name,id_user):
    data_video = video_cap(video_name)
    print('check')
    if data_video == 'tva':
        print('data less than 5')
        #remove data when data less than 5
        if os.path.isfile('../video_freeze/'+video_name):
            os.remove('../video_freeze/'+video_name)
        return 'DL5' #data less than 5
    print('res')

    res = insert_data_train_face(data_video,id_user)

    if res != 'success':
        print('fail insert data train')
        return 'FIDT' # fail insert data train

    print('url')
    # send post to retrain
    url = 'http://192.168.0.253:2525/train_face_data'
    try:
        r = requests.post(url)
    except Exception as e:
        print('error post train face data:',e)
        return 'EPTFS'

    print('json')
    res_data = r.json()
    print('res_data:',res_data)
    if res_data['msg'] == 'CLT2':
        print('data less than two')
        return 'DLTT' # data less than two
    if res_data['msg'] == 'error':
        print('error sent model to host')
        return 'ESMTH' # error sent data to train

    return 'success'
    
# @app.route('/update_var_mask',methods=['POST'])
async def update_var_mask(request):
    try:
        request_update_var_mask = await request.form()
        mask_var = request_update_var_mask.get("mask")
        print('mask variable is:',mask_var)

        if mask_var == 'mask':
            check_camera_mask.value = True
            return JSONResponse({"status":True})

        print('update_var_mask is invalid')
        return JSONResponse({"status":False})

    except Exception as e:
        print('[Error] update_var_mask:',e)
        return JSONResponse({"status":False})
            
            

# @app.route('/update_register',methods=['POST'])
async def update_register(request):
    request_update_register = await request.form()
    nickname = request_update_register.get('nickname')
    gender = request_update_register.get('gender')
    firstname = request_update_register.get('firstname')
    lastname = request_update_register.get('lastname')
    role = request_update_register.get('role')
    email = request_update_register.get('email')
    phone = request_update_register.get('phone')
    line = request_update_register.get('line')
    ids = request_update_register.get('id')
    status_update = request_update_register.get('status_update')

    if status_update == "":
        return JSONResponse({"status":False,"msg":"status update is empty"})
    if nickname == "":
        return JSONResponse({"status":False,"msg":"nickname is empty"})
    if gender == "":
        return JSONResponse({"status":False,"msg":"gender is empty"})
    if firstname == "":
        return JSONResponse({"status":False,"msg":"firstname is empty"})
    if lastname == "":
        return JSONResponse({"status":False,"msg":"lastname is empty"})
    if role == "":
        return JSONResponse({"status":False,"msg":"role is empty"})

    #[TODO] check email format
    if email == "":
        return JSONResponse({"status":False,"msg":"email is empty"})
    if phone == "":
        return JSONResponse({"status":False,"msg":"phone is empty"})
    if line == "":
        return JSONResponse({"status":False,"msg":"line is empty"})
    if ids == "":
        return JSONResponse({"status":False,"msg":"id is empty"})

    print('ids:', ids,'\nnickname:',nickname,'\ngender:', gender,'\nfirstname:', firstname,'\nlastname:',lastname,'\nrole',role,'\nemail',email,'\nphone',phone,'\nline',line)

    print(os.getcwd())
    list_check_folder = os.listdir('../')
    print('list file in IoT folder',list_check_folder)

    # check video_freeze_update folder 
    if 'video_freeze' not in list_check_folder:
        print('video_freeze not exit, create')
        os.mkdir('../video_freeze')
    
    # check video
    if 'video' not in list_check_folder:
        print('video not exit, create')
        os.mkdir('../video')

    #check video
    print('update register',os.getcwd())
    file_freeze_update = os.listdir('../video_freeze/')
    print('file freeze update',str(len(file_freeze_update)))
    if len(file_freeze_update) > 0:

        #video process and insert data
        #print(file_freeze[0])
        # check_register = register_mongo(next_user_id,nickname,gender,firstname,lastname,role,email,phone,line,file_freeze[0])

        # update register
        update_register = update_register_mongo(ids,nickname,gender,firstname,lastname,role,email,phone,line,file_freeze_update[0])

        if update_register != 'success':
            return JSONResponse({'status':False,'msg':'update register fail'})

        next_user_id = next_userid()
        res_retrain = retrain_model(file_freeze_update[0],next_user_id)
        #print(res_retrain)
        
        if res_retrain == 'DL5':
            print('data less than five')
            #check_camera_register.value = False
            return JSONResponse({'status':False,'msg':'data less than five'})
        elif res_retrain == 'FIDT':
            print('fail insert data train to database')
            return JSONResponse({'status':False,'msg':'fail insert data train to database'})
        elif res_retrain == 'ERSPTFD':
            return JSONResponse({'status':False,'msg':'error response data post train face data'})
        elif res_retrain == 'EPTFS':
            return JSONResponse({'status':False,'msg':'error post train face data'})
        elif res_retrain == 'DLTT':
            return JSONResponse({'status':True,'msg':'data less than two'})
        elif res_retrain == 'ESMTH':
            return JSONResponse({'status':False,'msg':'error sent model to host'})
        else: #if success
            #split name between name and type file
            file_split = file_freeze_update[0].split('.')
            #make directory
            os.mkdir('../video/{}'.format(file_split[0]))
            #move file
            shutil.move('../video_freeze/{}'.format(file_freeze_update[0]),'../video/{}/{}'.format(file_split[0],file_freeze_update[0]))

            # select file name 
            video_name = select_videoname_by_uid()
            # check error select data
            if video_name == 'error':
                return JSONResponse({'status':False,'msg':'error select video name'})
                
            # split video name
            split_video_name = video_name.split('.')

            # remove old file
            for video in os.listdir('../video/'):
                if video == split_video_name[0]:
                    print('video remove',video)
                    shutil.rmtree(video)

    return JSONResponse({'status':True,'msg':'register success'})

# insert register
# @app.route('/insert_register',methods=['POST'])
async def insert_register(request):
    #global video_data
    request_insert_register = await request.form()
    nickname = request_insert_register.get('nickname')
    gender = request_insert_register.get('gender')
    firstname = request_insert_register.get('firstname')
    lastname = request_insert_register.get('lastname')
    role = request_insert_register.get('role')
    email = request_insert_register.get('email')
    phone = request_insert_register.get('phone')
    line = request_insert_register.get('line')

    if nickname == "":
        return JSONResponse({"status":False,"msg":"nickname is empty"})
    if gender == "":
        return JSONResponse({"status":False,"msg":"gender is empty"})
    if firstname == "":
        return JSONResponse({"status":False,"msg":"firstname is empty"})
    if lastname == "":
        return JSONResponse({"status":False,"msg":"lastname is empty"})
    if role == "":
        return JSONResponse({"status":False,"msg":"role is empty"})

    #[TODO] check email format
    if email == "":
        return JSONResponse({"status":False,"msg":"email is empty"})
    if phone == "":
        return JSONResponse({"status":False,"msg":"phone is empty"})
    if line == "":
        return JSONResponse({"status":False,"msg":"line is empty"})

    print(nickname, gender, firstname,lastname,role,email,phone,line)
    next_user_id = next_userid()

    print(os.getcwd())
    list_check_folder = os.listdir('../')
    print('list file in IoT folder',list_check_folder)

    if 'video_freeze' not in list_check_folder:
        print('video_freeze not exit, create')
        os.mkdir('../video_freeze')
    
    if 'video' not in list_check_folder:
        print('video not exit, create')
        os.mkdir('../video')

    #check video
    print('insert_register',os.getcwd())
    file_freeze = os.listdir('../video_freeze/')
    print('file_freeze',str(len(file_freeze)))
    if len(file_freeze) > 0:

        #video process and insert data
        #print(file_freeze[0])
        check_register = register_mongo(next_user_id,nickname,gender,firstname,lastname,role,email,phone,line,file_freeze[0])
        if check_register != 'success':
            return JSONResponse({'status':False,'msg':'register fail'})

        res_retrain = retrain_model(file_freeze[0],next_user_id)
        #print(res_retrain)
        
        if res_retrain == 'DL5':
            print('data less than five')
            #check_camera_register.value = False
            return JSONResponse({'status':False,'msg':'data less than five'})
        elif res_retrain == 'FIDT':
            print('fail insert data train to database')
            return JSONResponse({'status':False,'msg':'fail insert data train to database'})
        elif res_retrain == 'ERSPTFD':
            return JSONResponse({'status':False,'msg':'error response data post train face data'})
        elif res_retrain == 'EPTFS':
            return JSONResponse({'status':False,'msg':'error post train face data'})
        elif res_retrain == 'DLTT':
            return JSONResponse({'status':True,'msg':'data less than two'})
        elif res_retrain == 'ESMTH':
            return JSONResponse({'status':False,'msg':'error sent model to host'})
        else: #if success
            #split name between name and type file
            file_split = file_freeze[0].split('.')
            #make directory
            os.mkdir('../video/{}'.format(file_split[0]))
            #move file
            shutil.move('../video_freeze/{}'.format(file_freeze[0]),'../video/{}/{}'.format(file_split[0],file_freeze[0]))
            
            print("into register")

    return JSONResponse({'status':True,'msg':'register success'})

# manage camera
# @app.route('/manage_camera',methods=['POST'])
async def manage_camera(request):
    res_data = dict()
    request_manage_camera = await request.form()
    receive_data = request_manage_camera.get('camera')
    if receive_data == 'detection':
        print('detection')
        res_data.update({'status':True,'msg':'detection'})
        check_camera_detection.value = False
    elif receive_data == 'undetection':
        print('undetection')
        res_data.update({'status':True,'msg':'undetection'})
        check_camera_detection.value = True
    elif receive_data == 'register':
        print('register')
        res_data.update({'status':True,'msg':'register'})
        check_camera_register.value = False
    else:
        res_data.update({'status':False,'msg':'fail'})

    return JSONResponse(res_data)


async def get_weather(request):
    # if request.method == 'GET':
    pm25, weather,position = check_weather_pm25()
    print('pm25:{}\nweather:{}'.format(pm25,weather))
    try:
        return JSONResponse({"pm25":pm25,"weather":weather,"position":position})
    except Exception as e:
        print('error get sound volume:',e)
        return JSONResponse({"status":False})

async def get_network(request):
    net2d = []
    net=os.popen("nmcli dev wifi").read().split('\n')
    for i in range(1,len(net)-1):
        net2d.append(net[i][8:].strip().replace("Infra"," : Channel"))
    try:

        return JSONResponse({"available":net2d})
    except Exception as e:
        return JSONResponse({"status":False,"network":"error networking"})


async def connect_network(request):
    
    # if request.method == 'GET':
    try:
        config = await request.form()
        print(config)
        net = os.popen('nmcli dev wifi connect {} password {}'.format(config['ssid'],config['password'])).read()
        if net.split(':')[0]=="Error":
            return JSONResponse({"status":False})
        return JSONResponse({"status":True})
    except Exception as e:
        return JSONResponse({"status":False,"network":"error networking"})



def recognitionMember():
    frame = cv2.imread("../img/test3.jpg")
    bboxes = classifier.detectMultiScale(frame, 1.3, 5)
    if len(bboxes) == 1:
        for box in bboxes:
            x, y, w, h = box
            frame = cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            dets = detector(frame, 1)
            if len(dets) != 0:
                for k, d in enumerate(dets):
                    shape = predictor(frame, d)
                    face_descriptor = face_recognition.compute_face_descriptor(
                        frame, shape, 1)
                    face_desc.append(face_descriptor)
                    face_name.append("ทักษิฯ")
                    print(face_desc)

def recognitionSearch():
    cap = cv2.VideoCapture('http://192.168.1.28:4747/video')
    # Check if camera opened successfully
    if (cap.isOpened()== False): 
        print("Error opening video stream or file")

    # Read until video is completed
    while(cap.isOpened()):
        # Capture frame-by-frame
        ret, frame = cap.read()
        if ret == True:
            frame = cv2.rotate(frame,cv2.ROTATE_90_COUNTERCLOCKWISE)
            # frame = cv2.flip(frame,1)
            # Display the resulting frame
            bboxes = classifier.detectMultiScale(frame, 1.8, 5)
            if len(bboxes) == 1:
                for box in bboxes:
                    x, y, w, h = box
                    frame = cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                    dets = detector(frame, 1)
                    if len(dets) != 0:
                        for k, d in enumerate(dets):
                            shape = predictor(frame, d)
                            face_descriptor = face_recognition.compute_face_descriptor(
                                frame, shape, 1)
                            for i,FACE_DESC in enumerate(face_desc):
                                if np.linalg.norm(np.array(FACE_DESC) - np.array(face_descriptor)) < 0.2:
                                    print(face_name[i])
                                    break
            # cv2.imshow('',frame)
            video_streaming(frame)
            # cv2.imshow('Frame',frame)

            # Press Q on keyboard to  exit
            if cv2.waitKey(25) & 0xFF == ord('q'):
                break

        # Break the loop
        else: 
            break

    # When everything done, release the video capture object
    cap.release()

    # Closes all the frames
    cv2.destroyAllWindows()


routes = [
    Route("/update_var_mask", endpoint=update_var_mask, methods=["POST"]),
    Route("/update_register", endpoint=update_register, methods=["POST"]),
    Route("/insert_register", endpoint=insert_register, methods=["POST"]),
    Route("/manage_camera", endpoint=manage_camera, methods=["POST"]),
    Route("/get_weather", endpoint=get_weather, methods=["POST"]),
    Route("/available_networks", endpoint=get_network, methods=["POST"]),
    Route("/new_connection", endpoint=connect_network, methods=["POST"])
]

app = Starlette(middleware=middleware,routes= routes)


if __name__ == '__main__':
    p_process = mp.Process(target=camera_recognition,args=(check_camera_register,check_camera_detection,check_camera_mask,))
    p_process.start()
    # p_process = mp.Process(target=recognitionSearch)
    # p_process.start()
    #server_wsgi = WSGIServer(('0.0.0.0',2424),app)
    #server_wsgi.serve_forever()
    # app.run(host = '192.168.0.252',port=2424,threaded=True)
    uvicorn.run(app,host='192.168.0.252',port=2424)



