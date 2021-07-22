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
face_desc = []
face_name = []

def rec2():
    frame = cv2.imread("../img/test2.jpg")
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
                    face_name.append("ประยุทฯ")
                    print(face_desc)

def rec3():
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

def recognition():
    cap = cv2.VideoCapture('http://192.168.1.27:4747/video')
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
            cv2.imshow('',frame)
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


rec2()
rec3()
recognition()