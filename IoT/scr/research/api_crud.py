# run on server

import pymongo
from flask import Flask, request, jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = uuid.uuid4().hex

myclient = pymongo.MongoClient(
    "mongodb://ihomewhiz:gridwhiz@127.0.0.1:27018/iHomeWhiz")
mydb = myclient["iHomeWhiz"]

# get user id 
def get_userid():
    mycol = mydb["member"]
    mydoc = mycol.find({},{'info.user_id':1})
    list_docs = list()
    for docs in mydoc:
        # print(docs['info']['user_id'])
        list_docs.append(docs['info']['user_id'])
    return list_docs
        
def next_userid():
    if request.method == 'POST':
        list_userid = get_userid()
        print(list_userid)
        if len(list_userid) != 0:
            for i in range(0, len(list_userid)): 
                list_userid[i] = int(list_userid[i])
        else:
            return 1
        return np.add(np.max(list_userid),1)

@app.route("/insert_data_train_face", methods=["POST"])
def insert_data_train_face():
    if request.method == 'POST':
        data = request.form['data']
        userid = request.form['user_id']
        
        if data != None and data != '' and userid != '':
            try:
                mycol.update_one({"info.user_id": str(userid)},{"$set":{"data": data,"activated":True}}, upsert=True)
            except Exception as e:
                print('error insert_data_train_face api:',e)
                return jsonify({"status":False,"msg":"error insert_data_train_face api"})
        else:
            print('need more data|data: {}, userid: {}'.format(data,userid))
            return jsonify({"status":False,"msg":"need more data"})
    return jsonify({"status":True,"msg":"success"})
    
    
@app.route("/register_mongo", methods= ["POST"])
def register_mongo(userid,nickname,gender,firstname,lastname,role,email,phone,line,video_name):
    if request.method == 'POST':
        userid = request.form['userid']
        nickname = request.form['nickname']
        gender = request.form['gender']
        firstname = request.form['firstname']
        lastname = request.form['lastname']
        role = request.form['role']
        email = request.form['email']
        phone = request.form['phone']
        line = request.form['line']
        video_name = request.form['video_name']
    mycol = mydb['member']
    
    data = {
        'info.user_id':str(userid),
        'info.nick_name':nickname,
        'info.gender':gender,
        'info.first_name':firstname,
        'info.last_name':lastname,
        'info.role':ObjectId(role),
        'info.email':email,
        'info.phone':phone,
        'info.line':line,
            # 'video_name':video_name,
            # 'activated':True
            }
    print(ObjectId(role))
    print(type(ObjectId(role)))

    data1 = {
        'video_name':video_name,
        'activated':False
        }

    mycol.update_one(data,{"$set": data1}, upsert=True)
    return 'success'


        
            
         
            
        
        
    
