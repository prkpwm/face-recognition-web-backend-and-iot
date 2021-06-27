# mask recognition
# must import cv2 first and second is tensorflow

import cv2
import numpy as np
from ml_lib import model_mask
from csi_camera import CSI_Camera
from utility import gstreamer_pipeline, read_camera, generate_uuid 


DISPLAY_WIDTH=960
DISPLAY_HEIGHT=540
SENSOR_MODE_1080=2
SENSOR_MODE_720=3

classifier = cv2.CascadeClassifier('../model/haarcascade_mcs_mouth.xml')

'''
if __name__ == '__main__':
    model = model_mask()
    
    left_camera = CSI_Camera()
    left_camera.create_gstreamer_pipeline(
            sensor_id=0,
            sensor_mode=SENSOR_MODE_720,
            framerate=30,
            flip_method=0,
            display_height=DISPLAY_HEIGHT,
            display_width=DISPLAY_WIDTH,
    )
    left_camera.open(left_camera.gstreamer_pipeline)
    left_camera.start()
    
    if (not left_camera.video_capture.isOpened()):
        print("Unable to open any cameras")
        # TODO: Proper Cleanup
        SystemExit(0)
       
    while True:
        img=read_camera(left_camera,False)
        # rotate image
        img = cv2.rotate(img,cv2.ROTATE_180)
        img = cv2.flip(img,1)
        
        
        #cv2.imshow('img',img)
        '''
        
        
        
        
        


