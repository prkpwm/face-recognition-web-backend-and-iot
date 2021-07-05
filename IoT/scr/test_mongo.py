import pymongo

myclient = pymongo.MongoClient(
    "mongodb://127.0.0.1:27017")
mydb = myclient["iHomeWhiz"]

def get_status_face():
    mycol = mydb["setting"]
    mydoc = mycol.find({},{"scanner_mode.face_recognition.status":1,
        "scanner_mode.face_recognition.threshold":1,
        "scanner_mode.thermal_scan.status":1,
        "scanner_mode.thermal_scan.threshold.highest":1,
        "scanner_mode.thermal_scan.threshold.lowest":1})
    return list(mydoc)



def get_frame_display():
    mycol = mydb['setting']
    mydoc = mycol.find({},{"display.frame_setting"})
    return list(mydoc)


#print(get_frame_display())
data_frame_display = get_frame_display()
print(data_frame_display[0]['display']['frame_setting']['rectangle_frame'])
print(data_frame_display[0]['display']['frame_setting']['person_frame'])
'''rectangle_frame_display = data_frame_display[0]['display']['frame_setting']['ractangle_frame']
person_frame_display = data_frame_display[0]['display']['frame_setting']['person_frame']'''
#print('rantangle: {}\nperson: {}'.format(ractangle_frame_display,person_frame_display))_

data = get_status_face()
status_face_recognition = data[0]['scanner_mode']['face_recognition']['status']
threshold_face_recognition = data[0]['scanner_mode']['face_recognition']['threshold']

thermal_status = data[0]['scanner_mode']['thermal_scan']['status']
thermal_hight = data[0]['scanner_mode']['thermal_scan']['threshold']['highest']
thermal_lowest = data[0]['scanner_mode']['thermal_scan']['threshold']['lowest']
print("status face: {}\nthreshold face: {}\nthermal status: {}\nthermal highest: {}\nthermal lowest: {}".format(status_face_recognition,threshold_face_recognition, thermal_status, thermal_hight, thermal_lowest))
