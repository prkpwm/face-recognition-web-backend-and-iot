from flask import Flask, request, jsonify, send_file, safe_join 
from sklearn import svm
from joblib import load, dump
from mongo import get_data2train
import os
from gevent.pywsgi import WSGIServer
import uuid
import numpy as np
import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = uuid.uuid4().hex
app.config['MODEL_SVM'] = os.path.join(os.getcwd(),'model','svm_face_recognition.sav') 

# send file to host [POST] 
def send2host():
    with open(app.config['MODEL_SVM'],'rb') as f:
        try:
            print('send model')
            r = requests.post('http://192.168.0.252:2727/receive_model',files = {'model':f})  # ip processing machine
        except Exception as e:
            print('error post receive model:',e)
            return 'error'       
        # response data 
        res_data = r.json()
        if res_data['msg'] != 'success':
            print('error response data receive data')
            return 'error'

        return 'success'

# train face data
@app.route('/train_face_data',methods=['POST'])
def train_face_data():
    if request.method == 'POST':
        print('train_face_data',os.getcwd())

        # ดึงข้อมูล 2 อย่าง คือ 1. user_id 2. ข้อมูลใบหน้า
        get_data2train_var = get_data2train()

        # ประกาศตัวแปรรับข้อมูล เพื่อนำข้อมูลไปใช้ในการแยกเพื่อนำไปใช้ต่อไป
        data_train_list = list()
        data_label = list()

        for dt in get_data2train_var:
            if 'data' in dt:
                data_train_list.append(dt['data'])
                data_label.append(dt['info']['user_id'])

        # ประกาศตัวแปรเพื่อใช้ในการเตรียมข้อมูลเพื่อใช้ในการ train
        dats_train = list()
        dats_label = list()

        # ลูปเพื่อทำการตรียมข้อมูลเพื่อใช้ในการเตรียมข้อมูล
        for i, train in enumerate(data_train_list):
            # print(len(train))
            if len(train) == 5:  # จำนวนรูป
                # print(len(train))
                for sub_train in train:
                    dats_train.append(sub_train)
                    dats_label.append(data_label[i])
        #print(dats_label)

        # convert data to numpy array
        dats_train = np.array(dats_train)
        dats_label = np.array(dats_label)

        # SVM
        #check len class , have to more than 1 class
        unique_val = set(dats_label)
        if len(unique_val) > 1:
            clf = svm.SVC(probability=True)
            clf.fit(dats_train, dats_label)
            dump(clf, open('./model/svm_face_recognition.sav', 'wb'))
            # save and post to host
            res = send2host()
            if res != 'success':
                print('error send2host')
                return jsonify({"msg":"error"})
            #response status data
            
        else:
            return jsonify({"msg":"CLT2"}) # number of class less than 2

        # # save model
        return jsonify({"msg":"success"})

@app.route('/test_sent',methods=['POST'])
def test_sent():
    if request.method == 'POST':
        print('omg')
    return jsonify({"status":True,"msg":"success"})
        

if __name__ == '__main__':
    #server_train = WSGIServer(('0.0.0.0',2525),app)
    #server_train.serve_forever()

    app.run(host= '192.168.0.253',port=2525,threaded=True)

