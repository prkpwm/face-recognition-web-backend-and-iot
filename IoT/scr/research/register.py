import cv2
import numpy as np
import time

# Create a VideoCapture object
cap = cv2.VideoCapture(0)

# Check if camera opened successfully
if (cap.isOpened() == False): 
  print("Unable to read camera feed")

capture_duration =5
waittime = 4
font = cv2.FONT_HERSHEY_SIMPLEX

# ช่วงรอเวลา 3 วินาที
# รอเวลา 3 วินาที
start_time = time.time()

while(int(time.time() - start_time) < waittime):
  ret, frame = cap.read()
  if ret == True:

    text = str('{} {}'.format('Ready to record in ',int(np.subtract(time.time(),start_time))))
    cv2.putText(frame, text, (0,int((frame.shape[0]/2)+((frame.shape[0]/2)*(-0.8)))), font, 2, (255, 255, 255), 10)

  cv2.imshow('wait',frame)
  if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# ช่วงบันทึกวิดิโอ
frame_width = int(cap.get(3))
frame_height = int(cap.get(4))
out = cv2.VideoWriter('outpy.mp4',cv2.VideoWriter_fourcc('M','J','P','G'), 30, (frame_width,frame_height))
start_time = time.time()

while(int(time.time() - start_time) < capture_duration):
    # print(int(time.time() - start_time))
    ret, frame = cap.read()
    frame_copy = frame.copy()
    if ret == True: 

        text = str('{} {}'.format('Recording.. ',int(np.subtract(time.time(),start_time))))
        cv2.putText(frame_copy, text, (0,int((frame_copy.shape[0]/2)+((frame_copy.shape[0]/2)*(-0.8)))), font, 2, (255, 255, 255), 10)
        
        out.write(frame)
        # Display the resulting frame    
        cv2.imshow('record',frame_copy)

        # Press Q on keyboard to stop recording
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    else:
        break  

# When everything done, release the video capture and video write objects
cap.release()
out.release()

# Closes all the frames
cv2.destroyAllWindows() 
