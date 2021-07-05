from tflite_runtime.interpreter import Interpreter
#import cv2
import os
import numpy as np
from PIL import Image
import time

start_time = time.time()
model_path = os.path.join(os.getcwd(),'resnetv2_mask.tflite') 

# Load TFLite model and allocate tensors
interpreter = Interpreter(model_path=model_path)
interpreter.allocate_tensors()

# Get input and output tensors.
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

print('input details:',input_details)
print('output details:',output_details)

# prepare image data
img = Image.open(os.path.join(os.getcwd(),'img12.jpg')).convert('RGB')
img = img.resize((227, 227))
#image = cv2.imread(os.path.join(os.getcwd(),'test1.jpg'))
#image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#image = cv2.resize(image, (227, 227))
img_np = np.array(img)
img_np = np.divide(img_np,255).astype('float32')
print('array image:',img_np)
#img_np = (img_np/255).astype('float32')
input_data = np.expand_dims(img_np, axis=0)

# 1:unmask, 0:mask

interpreter.set_tensor(input_details[0]['index'], input_data)
interpreter.invoke()

predictions = interpreter.get_tensor(output_details[0]['index'])[0]
print('time runing:',time.time()-start_time)
print('image prediction:',predictions)
print(np.argmax(predictions))

