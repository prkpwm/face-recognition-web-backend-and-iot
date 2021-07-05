# mask recognition
# must import cv2 first and second is tensorflow

import cv2
import numpy as np
from ml_lib import model_mask
from csi_camera import CSI_Camera
from utility import gstreamer_pipeline, read_camera, generate_uuid 
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


DISPLAY_WIDTH=960
DISPLAY_HEIGHT=540
SENSOR_MODE_1080=2
SENSOR_MODE_720=3

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
        
        image = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
        image = cv2.resize(img,(227,227))
        image = img_to_array(image)
        image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
        image = preprocess_input(image)
        y_hat = model.predict(image)
        label = np.argmax(y_hat)
        print(label)
        
        #cv2.imshow('img',img)
        
        
        
        
        
        


