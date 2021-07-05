import cv2

import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.applications.mobilenet_v2 import decode_predictions
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2

from tensorflow.keras.optimizers import Adam
from tensorflow.keras.activations import softmax
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model


import numpy as np
from utility import gstreamer_pipeline, read_camera
from csi_camera import CSI_Camera


def model_mask():
    model_mobilenetv2 = MobileNetV2(include_top=False, input_shape = (227,227,3))
    models = model_mobilenetv2.output
    models = GlobalAveragePooling2D()(models)
    predictions = Dense(2, activation='softmax')(models)
    
    model = Model(inputs=model_mobilenetv2.input, outputs=predictions)
    model.compile(optimizer='adam', loss='categorical_crossentropy',metrics=['accuracy'])
    model.load_weights('../../model/tf_mobilenet_mask.h5')
    return model

if __name__ == '__main__':
    SENSOR_MODE_720 = 3
    DISPLAY_HEIGHT = 540
    DISPLAY_WIDTH = 960
    
    model = model_mask()
    img = cv2.imread('test3.jpeg')
    image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image,(227,227))
    image = img_to_array(image)
    image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
    image = preprocess_input(image)
    y_hat = model.predict(image)
    
    label = np.argmax(y_hat)
    if label == 1:
        print('unmask')
    else:
        print('mask')
    
    #cv2.imshow("Face Detect", img)
            
            
        
        
        
