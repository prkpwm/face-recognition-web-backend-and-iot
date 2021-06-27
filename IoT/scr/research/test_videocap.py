import cv2
import os
import dlib


video_name = 'outpy.mp4'
video_path = os.path.join(os.getcwd(),video_name)
cap = cv2.VideoCapture(video_path)
frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)

# dlib
predictor_path = "../model/face_landmarks68.dat"
face_rec_model_path = "../model/face_recognition.dat"
detector = dlib.get_frontal_face_detector()  # หาใบหน้าคน
sp = dlib.shape_predictor(predictor_path)
facerec = dlib.face_recognition_model_v1(face_rec_model_path)

frame_id = 0
len_frame = 5
cap_idx = frame_count // len_frame
data_list = []
while True:
    ret, img = cap.read()
    if ret == False:
        break
    # print(frame_id % cap_idx)
    if frame_id % cap_idx == 0:
        dets = detector(img, 0)
        # print('dets',dets)
        for det in dets:
            shape = sp(img, det)
            face_descriptor = [
                i for i in facerec.compute_face_descriptor(img, shape)]
            print('face',face_descriptor)
            data_list.append(face_descriptor)

    cv2.waitKey(1)
    frame_id += 1

print(data_list)
# len วิดิโอจะได้ 6 
print(len(data_list))

if(len(data_list) < 6):
    print('กรุณาถ่ายวิดิโอแนะนำตัวใหม่เด้ออออ ค่ะ')