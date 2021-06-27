import requests

url = 'http://192.168.100.161:5005/recognition/predict'
with open('crop_facexml.bmp', 'rb') as files:
    file_transfer = {'image':files}
    requests.post(url, files=file_transfer)


