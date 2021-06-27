import numpy as np
import cv2
from PIL import Image

cap = cv2.VideoCapture(0)
font = cv2.FONT_HERSHEY_SIMPLEX 
new_width = 300
new_height = 300
check_reg = False
check_take_photo_one = False
check_crop_one = False
classifier = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
while(True):
    # Capture frame-by-frame
    ret, frame = cap.read()
    frame_copy = frame.copy()
    frame = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
    frame_copy = cv2.cvtColor(frame_copy,cv2.COLOR_BGR2RGB)
    pil_im = Image.fromarray(frame_copy)
    w, h = pil_im.size
    left = (w - new_width)/2
    top = (h - new_height)/2
    right = (w + new_width)/2
    bottom = (h + new_height)/2

    pil_im = pil_im.crop((left, top, right, bottom))
    open_cv_image = np.array(pil_im) 
    open_cv_image = open_cv_image[:, :, ::-1].copy() 

    

    bboxes = classifier.detectMultiScale(open_cv_image)
    if len(bboxes) > 0:
        print('detected')
    else:
        print('None')

    # print(fps)
    for box in bboxes:
        x, y, width, height = box
        x2, y2 = x + width, y + height
        x_percent = (x2-x)/300
        print(x_percent)

        if x_percent >= .68 and x_percent <= .75:
            img_crop_frame = open_cv_image.copy()
            cv2.rectangle(open_cv_image, (x, y), (x2, y2), (0,255,0), 1)
            if check_crop_one == False:
                img_crop_frame = cv2.cvtColor(img_crop_frame,cv2.COLOR_BGR2RGB)
                crop_face = Image.fromarray(img_crop_frame)
                croped = crop_face.crop((x,y,x2,y2))
                croped.save('crop_facexml.bmp')
                check_crop_one = True
            check_reg = True
        else:
            check_reg = False
            cv2.rectangle(open_cv_image, (x, y), (x2, y2), (0,0,255), 1)
        # cv2.putText(open_cv_image,'face',(x,y),font,3,(255,0,0),cv2.LINE_4)

    if check_reg:
        cv2.rectangle(frame_copy, (int(left), int(top)), (int(right), int(bottom)), (0,255,0), 1)
        if check_take_photo_one == False:
            pil_im_takephoto = Image.fromarray(frame)
            img_crop = pil_im_takephoto.crop((left,top,right,bottom))
            img_crop.save("face_takephoto.bmp")
            check_take_photo_one=True
    else:
        cv2.rectangle(frame_copy, (int(left), int(top)), (int(right), int(bottom)), (255,0,0), 1)

    # Display the resulting frame
    frame_copy = cv2.cvtColor(frame_copy,cv2.COLOR_RGB2BGR)
    cv2.imshow('crop',open_cv_image)
    cv2.imshow('original',frame_copy)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()