# Created by Wuttichai Hung
from time import sleep
import os
from numpy import dot
from numpy.linalg import norm
import cv2
import uuid
import datetime
import pymongo
import numpy as np
from bson.objectid import ObjectId
from sshtunnel import SSHTunnelForwarder

import sys
sys.setrecursionlimit(1500)

SERVER_HOST = "192.168.0.253"
SERVER_USER = "recognitionserver"
SERVER_PASS = "staff"
MONGO_DB = "iHomeWhiz"
MONGO_COLLECTION = "setting"

MONGO_USER = 'ihw_admin'
MONGO_PASS = 'ihw_pass'

def get_mac():
    mac_adress = ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff)
                           for ele in range(0, 8*6, 8)][::-1])
    return mac_adress

def server():
    # define ssh tunnel
    return SSHTunnelForwarder(
        SERVER_HOST,
        ssh_username=SERVER_USER,
        ssh_password=SERVER_PASS,
        remote_bind_address=('127.0.0.1', 27018)
    )

def connect_database(server):
    connection = pymongo.MongoClient("mongodb://{}:{}@127.0.0.1:{}/{}".format(MONGO_USER,MONGO_PASS,server.local_bind_port,MONGO_DB))
    db = connection[MONGO_DB]
    return db

# find role using id 
def get_name_role(idx_role):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['member_setting']
    mydoc = mycol.find({'_id':ObjectId(idx_role)})
    list_doc = list(mydoc)
    servers.stop()
    return list_doc[0]['group_name']

# update data predicted 
def update_status_mask_predict(id_log, mask_rec):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['log_predict']
    # mydoc = mycol.update_one
    data_update = {
        'mask':mask_rec
    }
    try:
        mycol.update_one({'id_log':ObjectId(id_log)},{"$set":data_update},upsert=True)
    except Exception as e:
        print('error update status mask predicted',e)
        return False
    
    return True


# get status pm 2.5
def get_status_pm25():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['setting']
    mydoc = mycol.find({},{"display.information.weather":1,'_id':0})
    list_mydoc = list(mydoc)
    servers.stop()
    return list_mydoc[0]['display']['information']['weather']

# get status weather 
def get_status_weather():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['setting']
    mydoc = mycol.find({},{"display.information.pm25":1,'_id':0})
    list_mydoc = list(mydoc)
    servers.stop()
    return list_mydoc[0]['display']['information']['pm25']

# get status thermal
def get_status_thermal():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['setting']
    mydoc = mycol.find({},{"scanner_mode.thermal_scan.status":1,'_id':0})
    list_mydoc = list(mydoc)
    servers.stop()
    return list_mydoc[0]['scanner_mode']['thermal_scan']['status']

# get status mask
def get_status_mask():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['setting']
    mydoc = mycol.find({},{"scanner_mode.mask_recognition.status":1,'_id':0})
    list_mydoc = list(mydoc)
    servers.stop()
    return list_mydoc[0]['scanner_mode']['mask_recognition']['status']

def get_checkin_status():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["setting"]
    mydoc = mycol.find({},{"attendance.checkin_status":1})
    list_mydoc = list(mydoc)
    servers.stop()
    return list_mydoc

def get_working_day():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["setting"]
    mydoc = mycol.find({},{
        "attendance.working_day.Mo":1,
        "attendance.working_day.Tu":1,
        "attendance.working_day.Wed":1,
        "attendance.working_day.Thu":1,
        "attendance.working_day.Fri":1,
        "attendance.working_day.Sat":1,
        "attendance.working_day.Sun":1
        })
    list_mydoc = list(mydoc)
    servers.stop()
    return list_mydoc

def get_ontime():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["setting"] 
    mydoc = mycol.find({},{"attendance.ontime":1})
    list_mydoc = list(mydoc)
    servers.stop()
    return list_mydoc

def getStatusFace():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["setting"]
    mydoc = mycol.find({},{"scanner_mode.face_recognition.status":1,
        "scanner_mode.face_recognition.threshold":1})
    list_mydoc = list(mydoc)
    servers.stop()
    return list_mydoc

def getStatusAndDataThermal():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["setting"]
    mydoc = mycol.find({},{"scanner_mode.thermal_scan.status":1, "scanner_mode.thermal_scan.threshold.highest":1, "scanner_mode.thermal_scan.threshold.lowest":1})
    list_mydoc = list(mydoc)
    servers.stop()
    return list_mydoc

def get_frame_display():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['setting']
    mydoc = mycol.find({},{"display.frame_setting"})
    list_mydoc = list(mydoc)
    servers.stop()
    return list_mydoc

def get_group_id():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["devices"]
    group_id = list(mycol.find({"device_uuid": get_mac()}, {
                    "_id": 0, "group_id": 1}))[0]
    servers.stop()
    return group_id['group_id']

def get_fr_config():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['setting']
    mydoc = mycol.find({}, {"_id": 0, "scanner_mode.face_recognition": 1})
    fr_config = list(mydoc)[0]['scanner_mode']['face_recognition']
    servers.stop()
    print(fr_config)
    return fr_config


def get_sound_config():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['setting']
    mydoc = mycol.find({}, {"_id": 0, "sound": 1})
    sound_config = list(mydoc)[0]['sound']
    servers.stop()
    return sound_config


def get_tm_config():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['setting']
    mydoc = mycol.find({}, {"_id": 0, "scanner_mode.thermal_scan": 1})
    tm_config = list(mydoc)[0]['scanner_mode']['thermal_scan']
    servers.stop()
    return tm_config


def get_video_name(user_id):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['member']
    mydoc = mycol.find({"info.user_id": str(user_id)}, {
                       "_id": 0, "video_name": 1})
    video_name = list(mydoc)[0]['video_name']
    servers.stop()
    return video_name


def insert_log_predict(id_log, id_predicted, image_name, temp_person, pm25, weather, mask):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["log_predict"]
    data_insert = {
        'id_log':ObjectId(id_log),
        'id_predicted':ObjectId(id_predicted),
        'timestamp':datetime.datetime.now(),
        'detected_device':get_mac(),
        'image_name':image_name,
        'temp_person':temp_person,
        'pm25':pm25,
        'weather':weather,
        'mask':mask
        
    }
    
    mycol.insert_one(data_insert)
    #mycol.update_one({},{"$set":data_insert},upsert=True)
    servers.stop()
    return 'success'

# select all data from mongodb unless '_id'
def get_data_to_predict():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {
                       "_id": 1, "info.nick_name": 1, "info.first_name": 1, "info.last_name": 1, "info.role": 1})
    list_doc = list(mydoc)
    servers.stop()
    return list_doc

# get nickname data
def get_nickname_data():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"info.nick_name": 1})
    list_doc = list(mydoc)
    servers.stop()
    return list_doc

# get first_name data
def get_first_name():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    mycol = mydoc.find({"activated": True}, {"info.first_name": 1})
    list_doc = list(mydoc)
    servers.stop()
    return list_doc    

# get lastname data
def get_last_name():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"info.last_name": 1})
    list_doc = list(mydoc)
    servers.stop()
    return list_doc

# get role data
def get_role():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"info.role": 1})
    list_doc = list(mydoc)
    servers.stop()
    return list_doc

# get user id 
def get_userid():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    mydoc = mycol.find({},{'info.user_id':1})
    list_docs = list()
    for docs in mydoc:
        # print(docs['info']['user_id'])
        list_docs.append(docs['info']['user_id'])
    servers.stop()
    return list_docs

# get data 
def get_data():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"data": 1})
    list_doc = list(mydoc)
    servers.stop()
    return list_doc

# get user id on mongodb
def get_userID():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"info.user_id": 1})
    list_doc = list(mydoc)
    servers.stop()
    return list_doc

# manage member list start
#get member list
def get_member_list():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    try:
        mydoc = mycol.find({},{"_id":0,"data":0})
        print('get member list')
        list_doc = list(mydoc)
        servers.stop()
        return list_doc
    except Exception as e:
        print('Error get member list:',e)

# update member list
def update_member_list(idx, nickname, gender, firstname, lastname, role, email, phone, line):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    try:
        data_update = {
                'info.nick_name':nickname,
                'info.gender':gender,
                'info.first_name':firstname,
                'info.last_name':lastname,
                'info.role':role,
                'info.email':email,
                'info.phone':phone,
                'info.line':line
                }

        print('data_update: ',data_update)
        mycol.update_one({'info.user_id':idx},{"$set":data_update},upsert=True)
        servers.stop()
        print('member list updated')
        return 'success'
    except Exception as e:
        print('Error update member list:',e)
        return 'fail'

def select_videoname_by_uid(user_id):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    try:
        mydoc = mycol.find({"info.user_id":user_id},{"video_name":1})
        print('select video name using user_id to find')
        list_doc = list(mydoc)
        servers.stop()
        return list_doc[0]['video_name']
    except Exception as e:
        print('error find video name by user id:',e)
        return 'error'

# remove member list
# TODO for remove member, just change status 
def remove_member_list(idx):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    try:
        mycol.delete_one({"info.user_id":idx})
        servers.stop()
        print('remove userid {}'.format(idx))
        return 'success'
    except Exception as e:
        print('Error remove member list:',e)
        return 'fail'

# manage Group start
#get member group
def get_member_group():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member_setting"]
    try:
        mydoc = mycol.find({})
        list_doc = list(mydoc)
        servers.stop()
        return list_doc
    except Exception as e:
        print('Error get member group: {}'.format(e))

#add group name
def add_group_member(group_name):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member_setting"]
    value2add = {
            'group_name':group_name
            }
    try:
        mycol.insert_one(value2add)
        servers.stop()
        print('add new group: {}'.format(group_name))
        return 'success'
    except Exception as e:
        print('Error add group name:',e)
        return 'fail'

#edit group name
def update_group_member(idx,name):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member_setting"]
    value2edit = {
            'group_name':name
            }
    print('edit member group',value2edit)
    try:
        mycol.update_one({'_id':idx},{"$set":value2edit},upsert=True)
        servers.stop()
        return 'success'
    except Exception as e:
        print('Error edit group member: {}'.format(e))
        return 'fail'

# manage group end

#header scanner manage start
def get_scanner_header():
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['setting']
    try:
        mydoc = mycol.find({})
        list_doc = list(mydoc)
        servers.stop()
    except Exception as e:
        print('Error get scanner header: {}'.format(e))
    return list_doc

# update value in scanner header
def update_scanner_header(logo_header_status,show_info_status):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['setting']
    try:
        data2update = {
                'display.scanner_header.logo_header':logo_header_status,
                'display.scanner_header.show_info':show_info_status
                }
        mycol.update_one({},{"$set":data2update},upsert=True)
        servers.stop()
        return 'success'
    except Exception as e:
        print('Error update scanner header: {}'.format(e))
        return 'fail'

#header scanner manage end

#select id and then plus one to id
def next_userid():
    list_userid = get_userid()
    print(list_userid)
    if len(list_userid) != 0:
        for i in range(0, len(list_userid)): 
            # print(list_userid[i])
            list_userid[i] = int(list_userid[i])
    else:
        return 1
    return np.add(np.max(list_userid),1)

# role
def register_mongo(userid,nickname,gender,firstname,lastname,role,email,phone,line,video_name):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['member']
    # try:
        # check null
    
    data = {
        'info.user_id':str(userid),
        'info.nick_name':nickname,
        'info.gender':gender,
        'info.first_name':firstname,
        'info.last_name':lastname,
        'info.role':ObjectId(role),
        'info.email':email,
        'info.phone':phone,
        'info.line':line
            # 'video_name':video_name,
            # 'activated':True
            }
    # print(ObjectId(role))
    # print(type(ObjectId(role)))

    data1 = {
        'video_name':video_name,
        'activated':False,
        'status':1
        }

    mycol.update_one(data,{"$set": data1}, upsert=True)
    servers.stop()
    return 'success'

def update_register_mongo(ids, nickname, gender, firstname, lastname, role, email, phone, line, video_name):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['member']

    data = {
        'info.nick_name':nickname,
        'info.gender':gender,
        'info.first_name':firstname,
        'info.last_name':lastname,
        'info.role':ObjectId(role),
        'info.email':email,
        'info.phone':phone,
        'info.line':line
    }

    data1 = {
        'video_name':video_name,
        'activated':False
    }

    # mycol.update_one({'_id':idx},{"$set":value2edit},upsert=True)
    try:
        mycol.update_one({"_id":str(ids)},{"$set":data},upsert=True)
    except Exception as e:
        print('error update register:',e)
        return 'error'
    server.stop()

    return 'success'

def insert_data_train_face(data,userid):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb['member']
    if data != None and data != '':
        mycol.update_one(
        {"info.user_id": str(userid)},
        {"$set":
         {"data": data,"activated":True}
         }, upsert=True
    )
        servers.stop()
    else:
        return 'valueIsNull'
    return 'success'

def insert_user_data(user_id, data_list):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    mycol.update_one(
        {"info.user_id": user_id},
        {"$set":
         {"data": data_list}
         }, upsert=True
    )
    servers.stop()


def insert_user_register(data_insert):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    mycol.update_one(
        {"info.user_id": data_insert["info"]["user_id"]},
        {"$set": data_insert
         }, upsert=True
    )
    servers.stop()


def set_activate(user_id, new_state):
    servers = server()
    servers.start()
    mydb = connect_database(servers)
    mycol = mydb["member"]
    mycol.update_one(
        {"info.user_id": user_id},
        {"$set":
         {"activated": True}
         }, upsert=False
    )
    servers.stop()
    
