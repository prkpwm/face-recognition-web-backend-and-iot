try:
    import httplib
except:
    import http.client as httplib

import time,board,busio
import numpy as np
import adafruit_mlx90640
from uuid import uuid4
import requests
import json
import math
import cv2

# check location
def check_location():
    res = requests.get('http://ipinfo.io/')
    data_point = res.json()
    split_point = data_point['loc'].split(',')
    lat, lng = split_point[0], split_point[1]
    return lat, lng

# check pm 2.5
def check_weather_pm25():
    # check pm 2.5
    url3 = "http://air4thai.pcd.go.th/services/getNewAQI_JSON.php"
    
    if checkInternetHttplib() == False:
        print('Internet connection fails')
        return 'ICF','ICF' # Internet connection fails
        
    try:
        r3 = requests.get(url3)
    except Exception as e:
        print('error send get weather and pm2.5 request:',e)
        return 'ESGWP','ESGWP' # Error send get weather and pm2.5 request 
        
    temp_data = dict(r3.json())

    keep_distance = list()
    lati, lng = check_location()
  
    for data in temp_data['stations']:
        distance = math.sqrt(((float(lati)-float(data['lat']))**2)+((float(lng)-float(data['long']))**2))
        keep_distance.append(distance)


    arr_distance = np.array(keep_distance)
    min_distance_index = np.argmin(arr_distance)

    # check weather
    API_KEYS = '7c12a791bd19806a6d1fde2ff0af8824'
    weather_request = requests.get('http://api.openweathermap.org/data/2.5/weather?lat={}&lon={}&appid={}&lang=th'.format(lati,lng,API_KEYS))
    res_weather = weather_request.json()

    # return pm 2.5 and weather
    return temp_data['stations'][min_distance_index]['LastUpdate']['PM25']['value'],res_weather['weather'][0]['description'],temp_data['stations'][min_distance_index]['areaTH']

def checkInternetHttplib(url="www.google.com", timeout=3):
    conn = httplib.HTTPConnection(url, timeout=timeout)
    try:
        conn.request("HEAD", "/")
        conn.close()
        return True
    except Exception as e:
        print(e)
        return False
        
def checkTemperature():
        i2c = busio.I2C(board.SCL, board.SDA, frequency=400000) # setup I2C
        mlx = adafruit_mlx90640.MLX90640(i2c) # begin MLX90640 with I2C comm
        mlx.refresh_rate = adafruit_mlx90640.RefreshRate.REFRESH_2_HZ # set refresh rate
        frame = np.zeros((24*32,)) # setup array for storing all 768 temperatures

        while True:
            try:
                mlx.getFrame(frame) # read MLX temperatures into frame var
                cv2.imshow('',frame)
                break
            except ValueError:
                continue # if error, just read again
                
        f_array = np.array(frame)
        f_array = np.divide(f_array,32)
        summary_value = 0
        counter = 0

        for i,f in enumerate(f_array):
            if f >= 1:
                counter += 1
                summary_value += frame[i]
        cv2.waitKey(0) 
  
        #closing all open windows 
        cv2.destroyAllWindows() 
        #print('temp before return:',summary_value/counter)
        return summary_value/counter

def gstreamer_pipeline(
    capture_width=1280,
    capture_height=720,
    display_width=1280,
    display_height=720,
    framerate=30,
    flip_method=0,
):
    return (
        "nvarguscamerasrc ! "
        "video/x-raw(memory:NVMM), "
        "width=(int)%d, height=(int)%d, "
        "format=(string)NV12, framerate=(fraction)%d/1 ! "
        "nvvidconv flip-method=%d ! "
        "video/x-raw, width=(int)%d, height=(int)%d, format=(string)BGRx ! "
        "videoconvert ! "
        "video/x-raw, format=(string)BGR ! appsink"
        % (
            capture_width,
            capture_height,
            framerate,
            flip_method,
            display_width,
            display_height,
        )
    )

def read_camera(csi_camera,display_fps):
    _ , camera_image=csi_camera.read()
    if display_fps:
        draw_label(camera_image, "Frames Displayed (PS): "+str(csi_camera.last_frames_displayed),(10,20))
        draw_label(camera_image, "Frames Read (PS): "+str(csi_camera.last_frames_read),(10,40))
    return camera_image


def overlay_transparent(background_img, img_to_overlay_t, x, y, overlay_size=None):
    """
    @brief      Overlays a transparant PNG onto another image using CV2

    @param      background_img    The background image
    @param      img_to_overlay_t  The transparent image to overlay (has alpha channel)
    @param      x                 x location to place the top-left corner of our overlay
    @param      y                 y location to place the top-left corner of our overlay
    @param      overlay_size      The size to scale our overlay to (tuple), no scaling if None

    @return     Background image with overlay on top
    """

    bg_img = background_img.copy()

    if overlay_size is not None:
        img_to_overlay_t = cv2.resize(img_to_overlay_t.copy(), overlay_size)

    # Extract the alpha mask of the RGBA image, convert to RGB
    b, g, r, a = cv2.split(img_to_overlay_t)
    overlay_color = cv2.merge((b, g, r))

    # Apply some simple filtering to remove edge noise
    mask = cv2.medianBlur(a, 5)

    h, w, _ = overlay_color.shape
    roi = bg_img[y:y+h, x:x+w]

    # Black-out the area behind the logo in our original ROI
    img1_bg = cv2.bitwise_and(roi.copy(), roi.copy(),
                              mask=cv2.bitwise_not(mask))

    # Mask out the logo from the logo image.
    img2_fg = cv2.bitwise_and(overlay_color, overlay_color, mask=mask)

    # Update the original image with our new ROI
    bg_img[y:y+h, x:x+w] = cv2.add(img1_bg, img2_fg)

    return bg_img

def generate_uuid():
    return uuid4().hex

