import numpy as np
import cv2

cap = cv2.VideoCapture(0)
classifier = cv2.CascadeClassifier('model/haarcascade_frontalface_default.xml')

while(True):
    # Capture frame-by-frame
    c_frame = True
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)
    h ,w =  frame.shape[:2]

    new_width = int(w/2)
    new_height = int(h/2)
    left = (w - new_width)/2
    top = (h - new_height)/2
    right = (w + new_width)/2
    bottom = (h + new_height)/2

    bboxes = classifier.detectMultiScale(frame)
    for box in bboxes:
        x, y, width, height = box
        x2, y2 = x + width, y + height

        if x < left:
            print('right')
            cv2.rectangle(frame, (x, y), (x2, y2), (255,0,0), 1)
            c_frame = False

        if x2 > right:
            print('left')
            cv2.rectangle(frame, (x, y), (x2, y2), (255,0,0), 1)
            c_frame = False

        if y < top:
            print('bottom')
            cv2.rectangle(frame, (x, y), (x2, y2), (255,0,0), 1)
            c_frame = False
        
        if y2> bottom:
            print('top')
            cv2.rectangle(frame, (x, y), (x2, y2), (255,0,0), 1)
            c_frame=False

        if c_frame:
            cv2.rectangle(frame, (x, y), (x2, y2), (0,255,0), 1)

        # print('x1: {}\n y1: {}\n x2: {}\n y2: {}\n'.format(x,y,x2,y2))

    cv2.rectangle(frame, (int(left), int(top)), (int(right), int(bottom)), (0,0,255), 1)
    # print('left: {}\n top: {}\n right: {}\n bottom: {}\n'.format(left,top,right,bottom))
    #frame_copy = draw_border(frame_copy, (int(left), int(top)), (int(right),int(bottom)), (0, 255, 0))
        
    # Display the resulting frame
    cv2.imshow('frame',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
