# Created by Wuttichai Hung
from time import sleep
import os
from numpy import dot
from numpy.linalg import norm
import cv2
import uuid
import time
import pymongo
import numpy as np

myclient = pymongo.MongoClient(
    "mongodb://127.0.0.1:27017")
mydb = myclient["iHomeWhiz"]

def get_mac():
    mac_adress = ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff)
                           for ele in range(0, 8*6, 8)][::-1])
    return mac_adress


def gen_user_id():
    return (np.round(np.multiply((np.subtract(time.time(),1594286371)),1000)))
    # return (round((time.time()-1594286371)*1000))


def get_group_id():
    mycol = mydb["devices"]
    group_id = list(mycol.find({"device_uuid": get_mac()}, {
                    "_id": 0, "group_id": 1}))[0]
    return group_id['group_id']

def get_fr_config():
    mycol = mydb['setting']
    mydoc = mycol.find({}, {"_id": 0, "scanner_mode.face_recognition": 1})
    fr_config = list(mydoc)[0]['scanner_mode']['face_recognition']
    print(fr_config)
    return fr_config


def get_sound_config():
    mycol = mydb['setting']
    mydoc = mycol.find({}, {"_id": 0, "sound": 1})
    sound_config = list(mydoc)[0]['sound']
    return sound_config


def get_tm_config():
    mycol = mydb['setting']
    mydoc = mycol.find({}, {"_id": 0, "scanner_mode.thermal_scan": 1})
    tm_config = list(mydoc)[0]['scanner_mode']['thermal_scan']
    return tm_config


def get_video_name(user_id):
    mycol = mydb['member']
    mydoc = mycol.find({"info.user_id": str(user_id)}, {
                       "_id": 0, "video_name": 1})
    video_name = list(mydoc)[0]['video_name']
    return video_name


def insert_log_predict(data_insert):
    mycol = mydb["log_predict"]
    mycol.insert(data_insert)

# select all data from mongodb unless '_id'
def get_data_to_predict():
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {
                       "_id": 0, "info.nick_name": 1, "info.first_name": 1, "info.last_name": 1, "info.role": 1, "data": 1})
    return list(mydoc)

# receive data for train 
def get_data2train():
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"info.user_id":1,"data":1})
    return list(mydoc)

# get nickname data
def get_nickname_data():
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"info.nick_name": 1})
    return list(mydoc)

# get first_name data
def get_first_name():
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"info.first_name": 1})
    return list(mydoc)    

# get lastname data
def get_last_name():
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"info.last_name": 1})
    return list(mydoc)

# get role data
def get_role():
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"info.role": 1})
    return list(mydoc)

# get user id 
def get_userid():
    mycol = mydb["member"]
    mydoc = mycol.find({},{'info.user_id':1})
    list_docs = list()
    for docs in mydoc:
        # print(docs['info']['user_id'])
        list_docs.append(docs['info']['user_id'])
    return list_docs

# get data 
def get_data():
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"data": 1})
    return list(mydoc)

# get user id on mongodb
def get_userID():
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"info.user_id": 1})
    return list(mydoc)

# บวก userid , เลือกค่ามากที่สุดมาแล้วบวกด้วย 1
def next_userid():
    list_userid = get_userid()
    print(list_userid)
    for i in range(0, len(list_userid)): 
        # print(list_userid[i])
        list_userid[i] = int(list_userid[i])
    return np.add(np.max(list_userid),1)

# role:สถานะ
def register_mongo(userid,nickname,gender,firstname,lastname,role,email,phone,line,video_name):
    mycol = mydb['member']
    # try:
        # เช็คว่าข้อมูลทุกช่องว่างหรือไม่
    if nickname == -1 or gender == '' or firstname == '' or lastname == '' or role == '' or email == '' or phone == '' or line == '' or video_name == '':
        return 'missingValue'
        # return jsonify({'status':False,'ret_msg':'missing value'})
    else:
        data = {
            'info.user_id':str(userid),
            'info.nick_name':nickname,
            'info.gender':gender,
            'info.first_name':firstname,
            'info.last_name':lastname,
            'info.role':role,
            'info.email':email,
            'info.phone':phone,
            'info.line':line,
            # 'video_name':video_name,
            # 'activated':True
        }

        data1 = {
            'video_name':video_name,
            'activated':True
        }

        mycol.update_one(
        data,
        {"$set": data1
         }, upsert=True
        )
        return 'success'
            # return jsonify({'status':True,'ret_msg':'register complete'})
    # except Exception as e:
        # print(e)
        # return 'systemError'
        # return jsonify({'status':False,'ret_msg':'system error'})

def insert_data_train_face(data,userid):
    mycol = mydb['member']
    if data != None and data != '':
        mycol.update_one(
        {"info.user_id": str(userid)},
        {"$set":
         {"data": data}
         }, upsert=True
    )
    else:
        return 'valueIsNull'
    return 'success'

def insert_user_data(user_id, data_list):
    mycol = mydb["member"]
    mycol.update_one(
        {"info.user_id": user_id},
        {"$set":
         {"data": data_list}
         }, upsert=True
    )


def insert_user_register(data_insert):
    mycol = mydb["member"]
    mycol.update_one(
        {"info.user_id": data_insert["info"]["user_id"]},
        {"$set": data_insert
         }, upsert=True
    )


def set_activate(user_id, new_state):
    mycol = mydb["member"]
    mycol.update_one(
        {"info.user_id": user_id},
        {"$set":
         {"activated": True}
         }, upsert=False
    )
