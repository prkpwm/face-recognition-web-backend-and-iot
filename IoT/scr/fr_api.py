# from flask import Flask, jsonify, request

import uvicorn
from starlette.applications import Starlette
from starlette.routing import Host, Route
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.responses import JSONResponse

from PIL import Image
import os
from ml_lib import face_prediction, mask_recognition, prepare_prediction
from mongo_lib import  insert_log_predict,get_ontime, get_working_day, get_checkin_status, get_status_pm25, get_status_weather, get_status_thermal, getStatusFace, get_name_role
from utility import checkTemperature, check_weather_pm25
# , generate_uuid
import multiprocessing as mp
from flask_socketio import SocketIO
import datetime 
import dateutil.parser
import alsaaudio
import numpy as np
# import uuid
# from flask_cors import CORS
# import cv2
import requests

# mask recognition
#from tensorflow.keras.preprocessing.image import img_to_array
#from tensorflow.keras.applications.resnet_v2 import preprocess_input

# app = Flask(__name__)
# CORS(app)
# app.config['SECRET_KEY'] = generate_uuid()
middleware = [
    Middleware(
        CORSMiddleware, 
        allow_origins=["*"]
        )
]



# declear socketio  and cross origin
socketio = SocketIO(cors_allowed_origins="*")

pred_res = []

prepare_prediction()

# check_thermal_once = True
# check_thermal_wait = True

# load model mask recognition
#model_mask = load_mask_model()
#print('model loaded')

# check weather and pm 2.5
def thread_weather(weather_back):
    pm25, weather = check_weather_pm25()
    print('pm25:{}\nweather:{}'.format(pm25,weather))
    
    weather_back.put(pm25)
    weather_back.put(weather)

def thread_send_socket(status, name, role, weather, pm25, timelateonot, temp):
    print('[predicted] send to socket')
    url = 'http://192.168.0.252:2626/predict_face'
    face_hat = {
        'status':status,
        'weather':weather,
        'pm25':pm25,
        'timelateonot':timelateonot,
        'temp':temp,
        'name':name,
        'role':role
    }
    print('face_hat:',face_hat)
    requests.post(url,face_hat)

# temp person
def thread_temp(params_back):
    temp = checkTemperature()
    params_back.put(temp)



# send update variable to exit loop in fr_process.py
def thread_var_mask(var_mask):
    url = 'http://192.168.0.252:2424/update_var_mask'
    mask_msg = {'mask': var_mask}
    requests.post(url,mask_msg)
    
# @app.route("/recognition/predict_mask", methods=["POST"])
async def predict_mask(request):
    mask_request = await request.form()
    try:
        image_mask = mask_request["image_name_mask"]
        if image_mask != '' and image_mask != None:
        
            # prepare data
            img_mask = Image.open(os.path.join(os.getcwd(),'image_no_crop',image_mask)).convert('RGB')
            img_mask = img_mask.resize((227, 227))
            
            # prediction
            y_hat = mask_recognition(img_mask)
            
            if y_hat == 1:
                return JSONResponse({"status":True,"msg":'unmask'})
            else:
                # send request back for update
                maskback_multi = mp.Process(target=thread_var_mask,args=('mask',))
                maskback_multi.start()
                
                return JSONResponse({"status":True,"msg":'mask'})
        else:
            return JSONResponse({"status":False,"msg":'[predict_mask] image name is empty'})
    except Exception as e:
        print('error mask prediction:',e)
        return JSONResponse({"status":False,"msg":"error predict mask"})
  

# get volume system and set volume system
# @app.route("/sound_setting", methods=["POST"])
# @socketio.on("sound")
async def sound_setting(request):
    sound_request = await request.form()
    volume_value = sound_request['volume_value']
    convert2tenbase = np.multiply(int(volume_value),10)  
    try:
        m = alsaaudio.Mixer()
        cur_volume_value = m.getvolume()
        print('sound volume is:',cur_volume_value)
        m.setvolume(convert2tenbase)
        return JSONResponse({"status":True,"msg":"Success"})
    except Exception as e:
        print('error set sound setting:',e)
        return JSONResponse({"status":False,"msg":"error set sound setting"})

# @app.route("/get_volume_system", methods=["GET"])
# @socketio.on("volume_system")
async def get_volume_system(request):
    # if request.method == 'GET':
    try:
        m = alsaaudio.Mixer()
        cur_volume_value = m.getvolume()
        return JSONResponse({"status":True,"sound":str(cur_volume_value[0])})
    except Exception as e:
        print('error get sound volume:',e)
        return JSONResponse({"status":False,"sound":"error get sound volume"})

# predict face
# @app.route("/recognition/predict", methods=["POST"])
# @socketio.on("predict_face")
async def predict(request):
    predict_request = await request.form()
    # variable weather and pm2.5
    pm25_res = -1
    weather_res = -1
    is_recognition = None
    temp = -1
    idx = 'empty'
    nickname = 'empty'
    firstname = 'empty'
    lastname = 'empty'
    role = 'empty'
    confident = -1
    params_back = None
    checktime = True
    
    # get status temp
    status_thermal = get_status_thermal()
    if status_thermal == True:
        params_back = mp.Queue()
        thermal_multi = mp.Process(target=thread_temp,args=(params_back,))
        thermal_multi.start()
    print('status thermal:',status_thermal)
    
    # get status weather
    status_weather = get_status_weather()
    print('status weather:',status_weather)
    
    # get status pm 2.5
    status_pm25 = get_status_pm25()
    print('status pm 2.5:',status_pm25)

    # check temp
    '''if status_thermal == True and check_thermal_once == True:
        print('into thermal')
        params_back = mp.Queue() 
        temp_mp = mp.Process(target=thread_temp,args=(params_back,))
        check_thermal_once = False
        check_thermal_wait = True
        temp_mp.start()
    '''
    
    # check weather and pm 2.5
    if status_pm25 == True:
        print('into pm 2.5')
        weather_back = mp.Queue()
        weather_pm25_mp = mp.Process(target=thread_weather,args=(weather_back,))
        weather_pm25_mp.start()
    
    # get working time
    data_checkin_status = get_checkin_status()
    checkin_status = data_checkin_status[0]['attendance']['checkin_status']
    print('checkin status',checkin_status)
    if checkin_status:
        print('checkin is true')
        data_working_day = get_working_day()
        working_data = [
            data_working_day[0]['attendance']['working_day']['Mo'], 
            data_working_day[0]['attendance']['working_day']['Tu'],
            data_working_day[0]['attendance']['working_day']['Wed'],
            data_working_day[0]['attendance']['working_day']['Thu'],
            data_working_day[0]['attendance']['working_day']['Fri'],
            data_working_day[0]['attendance']['working_day']['Sat'],
            data_working_day[0]['attendance']['working_day']['Sun']
            ]
        
        day = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
        
        index_data = list()
        for i,data in enumerate(working_data):
            if data != True:
                index_data.append(i)
    
        check_day = True
        now = datetime.date.today()
        str_day = now.strftime("%A")
        for idx in index_data:
            if str_day == day[int(idx)]:
                check_day = False
                break
    
        print('check day',check_day)
        if check_day:
            # get ontime in mongodb
            get_time = get_ontime()
            # break time
            b_time = get_time[0]['attendance']['ontime']
            # convert time
            d = dateutil.parser.isoparse(b_time)
            date_conv = d.strftime('%H:%M')
            print('time:',date_conv)
        
    # get data from scanner mode to check recognition? or thermal scan?

    try:
        files_name = predict_request['image_name']
        log_pre = predict_request['log_predicted']
        
        print('files name:',files_name)
        print('log pre:',log_pre)
        
        global pred_res
        if files_name != '' and files_name != None and log_pre != '' and log_pre != None:
            # return image name
            
            data_scanner_mode = getStatusFace()
            is_recognition = data_scanner_mode[0]['scanner_mode']['face_recognition']['status']
            if is_recognition:
                idx, nickname, firstname, lastname, role, confident, image_name  = face_prediction(files_name)
                pred_res.append('nickname: {},firstname: {},lastname: {},role: {},confident: {},imagename: {}'.format(nickname, firstname, lastname, role, confident, image_name))
                print('nickname: {}\nfirstname: {}\nlastname: {}\nrole: {}\nconfident: {}\nimagename: {}'.format(nickname, firstname, lastname, role, confident, image_name))
            
            #time 
            date_time = datetime.datetime.now()
            datejson = date_time.strftime("%H:%M")
            print(date_time.strftime("%H:%M"))
            
            if checkin_status:
                if check_day:
                    #split time now
                    split_time_now = datejson.split(':')
                    # split time mongo to check
                    split_time_check = date_conv.split(':')
            
                    #check work to late
                    # if checktime == True: don't late else: late
                    if int(split_time_now[0]) == int(split_time_check[0]):
                        if int(split_time_now[1]) > int(split_time_check[1]):
                            checktime = False
                    if int(split_time_now[0]) > int(split_time_check[0]):
                        checktime = False
                
                    print('check time to work',checktime)
                    
            # wait weather and pm 2.5
            if status_pm25 == True:
                print('check pm25 status print value')
                weather_pm25_mp.join()
                pm25_res = weather_back.get()
                weather_res = weather_back.get()
                print('pm2.5 value:',pm25_res)
                print('weather value:',weather_res)
                
            #check body temp
            if status_thermal == True:
                print('check thermal')
                thermal_multi.join()
                temp = params_back.get()
                print('temp person:',temp)
                '''temp = checkTemperature()
                print('temp person:',temp) '''
                
            # wait thermal    
            '''if status_thermal == True and check_thermal_wait == True:    
                check_thermal_once = True
                check_thermal_wait = False
                temp_mp.join()
                tempurature_preson = params_back.get()
                print('temp person',tempurature_preson)'''
            
            # check response
            if nickname == 'fnf':
                print('face not found')
                # send thread to socket
                t2socket = mp.Process(target=thread_send_socket,args=(False,'fnf', 'fnf', weather_res, pm25_res, checktime, temp,))
                t2socket.start()
                # socketio.emit('predict_face',{'status':False,'nickname':'empty','role':'empty','date':datejson},broadcast=True) #temp not exit
                return JSONResponse({'status':False,'msg':'face not found'})
            elif nickname == 'fnd':
                print('face not detect')
                # send thread to socket
                t2socket = mp.Process(target=thread_send_socket,args=(False,'fnd', 'fnd', weather_res, pm25_res, checktime, temp,))
                t2socket.start()
                # socketio.emit('predict_face',{'status':False,'nickname':'empty','role':'empty','date':datejson},broadcast=True)
                return JSONResponse({'status':False,'msg':'face not detect'})
            else:
                print('face: {}'.format(nickname))
                # check error message ( weather and pm2.5 )
                status_log_pre = insert_log_predict(log_pre, idx, files_name, int(temp), pm25_res, weather_res, -1)
                print('insert log predict status:',status_log_pre)
                print('inserted: log_pre:{}, idx:{}, files_name:{}, temp:{}, pm25_res:{}, weather_res:{}'.format(log_pre, idx, files_name, temp, pm25_res, weather_res))
                role_name = get_name_role(role)
                print('role:',role_name)
                # send thread to socket
                t2socket = mp.Process(target=thread_send_socket,args=(True,nickname,role_name,weather_res,pm25_res,checktime,temp,))
                t2socket.start()
                # socketio.emit('predict_face',{'status':True,'nickname':nickname,'role':role_name},broadcast=True) #temp is not exit
                return JSONResponse({'status':True,'msg':'face detected'})
    except Exception as e:
        # ret_msg['status'] = 'False'
        # ret_msg['msg'] = 'error system message'
        print('error prediction fr_api:',e)
        return JSONResponse({'status':False,'msg':'error system message'})
            

    return JSONResponse({'status':False,'msg':'send wrong'})
    
async def recognition_resulte(request):
    # if request.method == 'GET':
    try:
        global pred_res
        return JSONResponse({"status":True,"result":pred_res})
    except Exception as e:
        print('error get sound volume:',e)
        return JSONResponse({"status":False,"result":"error get result"})


routes = [
    Route("/recognition/predict_mask", endpoint=predict_mask, methods=["POST"]),
    Route("/sound_setting", endpoint=sound_setting, methods=["POST"]),
    Route("/get_volume_system", endpoint=get_volume_system, methods=["GET"]),
    Route("/recognition/predict",endpoint=predict, methods=["POST"]),
    Route("/recognition/resulte",endpoint=recognition_resulte, methods=["POST"]),

]


app = Starlette(middleware=middleware,routes=routes)

if __name__ == "__main__":
    uvicorn.run(app, host='192.168.0.252',port=2323)
    # socketio.run(app,host='192.168.0.252',port=2323)
