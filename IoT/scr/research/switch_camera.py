from utility import gstreamer_pipeline, read_camera
from csi_camera import CSI_Camera
import time
import cv2

#setting camera
DISPLAY_WIDTH=640
DISPLAY_HEIGHT=360
SENSOR_MODE_1080=2
SENSOR_MODE_720=3

if __name__ == '__main__':
    left_camera = CSI_Camera()
    left_camera.create_gstreamer_pipeline(sensor_id=0,sensor_mode=SENSOR_MODE_720,framerate=30,flip_method=0,display_height=DISPLAY_HEIGHT,display_width=DISPLAY_WIDTH)
    left_camera.open(left_camera.gstreamer_pipeline)
    left_camera.start()
    if (not left_camera.video_capture.isOpened()):
        print("Unable to open any cameras")
        SystemExit(0)
    
    # time 
    current = time.time()
    check_current_once = False
    start_time = time.time()
    wait = 6
    try:
        while True:
            img=read_camera(left_camera,False)
            img = cv2.rotate(img,cv2.ROTATE_180)
            cv2.imshow("Face Detect", img)
                    
            # get current time and change variable 
            if check_current_once == False:
                current = time.time()
                check_current_once = True
            
            # check every 1 second
            if int(time.time() - current) == 1:
                print('one second later')
                check_current_once = False
            
            # wait timeout 
            print('time:',str(int(time.time() - start_time)))
            if int(time.time() - start_time) >= wait:
                break
            
            keyCode = cv2.waitKey(5) & 0xFF
            if keyCode == 27:
                break
    finally:
        left_camera.stop()
        left_camera.release()
        cv2.destroyAllWindows()
