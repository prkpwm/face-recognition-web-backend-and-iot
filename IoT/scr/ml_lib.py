import cv2
import os
import dlib
import numpy as np
from PIL import Image
from flask import request
from sklearn import svm
#from pickle import load, dump
from joblib import load, dump
from mongo_lib import get_nickname_data, get_data_to_predict
from utility import generate_uuid
import random
from tflite_runtime.interpreter import Interpreter

# check load model
check_load_model_svm = False
check_load_model_face = False

predictor_path = "../model/face_landmarks68.dat"
face_rec_model_path = "../model/face_recognition.dat"
detector = dlib.get_frontal_face_detector()  # หาใบหน้าคน
sp = dlib.shape_predictor(predictor_path)
facerec = dlib.face_recognition_model_v1(face_rec_model_path)

#  bounding box
def draw_border(img, pt1, pt2, color=(255, 255, 255), thickness=3, r=10, d=20):
    # img = draw_border(img, (d.left(), d.top()), (d.right(), d.bottom()),(255, 255, 255), 3, 10, 20)
    x1, y1 = pt1
    x2, y2 = pt2
    cv2.line(img, (x1 + r, y1), (x1 + r + d, y1), color, thickness)
    cv2.line(img, (x1, y1 + r), (x1, y1 + r + d), color, thickness)
    cv2.ellipse(img, (x1 + r, y1 + r), (r, r), 180, 0, 90, color, thickness)
    cv2.line(img, (x2 - r, y1), (x2 - r - d, y1), color, thickness)
    cv2.line(img, (x2, y1 + r), (x2, y1 + r + d), color, thickness)
    cv2.ellipse(img, (x2 - r, y1 + r), (r, r), 270, 0, 90, color, thickness)
    cv2.line(img, (x1 + r, y2), (x1 + r + d, y2), color, thickness)
    cv2.line(img, (x1, y2 - r), (x1, y2 - r - d), color, thickness)
    cv2.ellipse(img, (x1 + r, y2 - r), (r, r), 90, 0, 90, color, thickness)
    cv2.line(img, (x2 - r, y2), (x2 - r - d, y2), color, thickness)
    cv2.line(img, (x2, y2 - r), (x2, y2 - r - d), color, thickness)
    cv2.ellipse(img, (x2 - r, y2 - r), (r, r), 0, 0, 90, color, thickness)
    return img

# capture face in video
def video_cap(videoname):
    print('video_cap',os.getcwd())
    video_name = '../video_freeze/{}'.format(videoname)
    #video_path = os.path.join(os.getcwd(), video_name)
    cap = cv2.VideoCapture(video_name)
    #print(cap_idx)
    data_list = []
    i_count_face_detected = 0

    print('saving data into list')
    while True:
        ret, img = cap.read()
        if ret == False:
            break

        img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
        #img = dlib.load_rgb_image(img)
        dets = detector(img, 0)
        #print(dets)

        for det in dets:
            shape = sp(img, det)
            face_descriptor = [i for i in facerec.compute_face_descriptor(img, shape)]
            data_list.append(face_descriptor)
    print('data is saved')
    
    print('checking nan data in list')
    data_send = []
    for dat in data_list:
        isnan = np.isnan(dat)
        isinf = np.isinf(dat)
        if True in isnan or True in isinf:
            #print('nan')
            continue
        else:
                #print('face', face_descriptor)
            i_count_face_detected +=1
            data_send.append(dat)

        print(i_count_face_detected)
        if i_count_face_detected > 10:
            break
            
    print('check nan data complete')
    print('clear and check data less than 5')
    del data_list
    print('len data',len(data_send))
    if len(data_send) <5:
        return 'tva'

    print('sample data in list')
    #random num
    number = random.sample(range(len(data_send)),5)
    print('data_list:',data_send)
    #print("number:",number)
    data = list()
    for i in number:
        print("i:",i)
        print("data:",data_send[i])
        data.append(data_send[i])

    del data_send
    #data_list = random.shuffle(data_list)
    #print("data list result:",data)
    print("len data list result:",len(data))
    return data


# โหลด model
def load_model_svm_classification():
    print('load_model_svm_classification',os.getcwd())
    model = None
    with open('../model/svm_face_recognition.sav', 'rb') as svm_model:
        model = load(svm_model)
    #model = load(open('../model/svm_face_recognition.sav', 'rb'))
    return model
    
# model mask recognition
def mask_recognition(img):
    model_path = '../model/resnetv2_mask.tflite'
    
    # Load TFLite model and allocate tensors
    interpreter = Interpreter(model_path=model_path)
    interpreter.allocate_tensors() 
    
    # Get input and output tensors.
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    # prepare image data 
    img_np = np.array(img)
    img_np = np.divide(img_np,255).astype('float32')
    input_data = np.expand_dims(img_np, axis=0)
    
    # send input data to predict
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    # prediction
    predictions = interpreter.get_tensor(output_details[0]['index'])[0]
    # 1:unmask, 0:mask
    return np.argmax(predictions)
    

# compare value from database
def compare_result(data_prediction):
    # declear list
    data_compare = list()

    # get data from user_id and nickname
    mongo_data = get_data_to_predict()   # get nick name

    separate_list = list()
    for data in mongo_data:
        separate_list.append(data)

    idx = separate_list[data_prediction]['_id']
    nickname = separate_list[data_prediction]['info']['nick_name']
    firstname = separate_list[data_prediction]['info']['first_name']
    lastname = separate_list[data_prediction]['info']['last_name']
    role = separate_list[data_prediction]['info']['role']

    # compare id data from predict and mongodb
    return idx, nickname, firstname, lastname, role
    
# init prediction     
def prepare_prediction():
    img = dlib.load_rgb_image('research/test.jpg')
    print('image shape init:',img.shape)
    
    dept = detector(img,0)
    print('detect person on image init:',dept)
    
    if len(dept)>0:
        shape = sp(img, dept[0])
        face_descriptor = [i for i in facerec.compute_face_descriptor(img, shape)]
        face_descriptor = np.array(face_descriptor)
        print('init complete')

# prediction method
def face_prediction(image_name):
    #print('face_prediction',os.getcwd())
    # read image
    print('path',os.getcwd())
    #img = cv2.imread(os.path.join('image_no_crop', image_name))
    img = dlib.load_rgb_image(os.path.join('image_no_crop', image_name))
    print("image shape: ",img.shape)
    # detection
    dept = detector(img, 0)
    print("dept: ",dept)

    #save image
    pil_converted = Image.fromarray(img)
    print("convert img")
    cropped_image = pil_converted.crop((dept[0].left(),dept[0].top(),dept[0].right(),dept[0].bottom()))
    print("cropped")
    uuid = generate_uuid()
    cropped_image.save(os.path.join('image_face_cropped','{}.bmp'.format(uuid)))
    print('uuid image',uuid)

    # เช็คว่าทำนายใบหน้าได้ไหม
    if len(dept) > 0:  # ถ้าได้
        # ตัวทำนาย
        shape = sp(img, dept[0])
        face_descriptor = [
            i for i in facerec.compute_face_descriptor(img, shape)]

        # convert to numpy array
        face_descriptor = np.array(face_descriptor)
        # reshape data to (1,-1)
        face_descriptor = face_descriptor.reshape(1, -1)
        # load model
        model = load_model_svm_classification()
        # prediction
        svm_proba = model.predict_proba(face_descriptor)
        print('svm_proba:',svm_proba)
        #print(svm_proba)
        # หา index ที่มี value มากที่สุด
        _argmax = np.argmax(svm_proba)
        print('confiden:',svm_proba[0][_argmax])
        if svm_proba[0][_argmax] > 0.3:
            idx, nickName, firstName, lastName, role = compare_result(_argmax) 
            print('name:',nickName)
            #return confident, result name, image name, nickname, firstname, lastname, role
            return idx, nickName, firstName, lastName, role, svm_proba[0][_argmax], '{}.bmp'.format(uuid) 
        else:
            print('not found')
            return 'fnf','fnf', 'fnf', 'fnf', 'fnf', 'fnf', 'fnf'  # หาหน้าไม่เจอใน mongodb , face not found

    else:
        print('not found')
        return 'fnd','fnd', 'fnd', 'fnd', 'fnd', 'fnd', 'fnd'  # หาหน้าไม่เจอในรูปภาพ , face not detect
