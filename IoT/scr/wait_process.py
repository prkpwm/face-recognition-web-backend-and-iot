# import requests
from flask_socketio import SocketIO, emit
from flask import Flask,request, jsonify
# import threading
import uuid
from datetime import datetime
#from flask_cors import CORS

app = Flask(__name__)
#CORS(app)
app.config['SECRET_KEY'] = uuid.uuid4().hex
socketio = SocketIO(app,cors_allowed_origins="*")

@socketio.on("register")
@app.route('/wait_process',methods=['POST'])
def wait_process():
    if request.method == 'POST':
        wait = request.form['wait']
        process = request.form['process']
        print('wait:{}\nprocess:{}'.format(wait,process))
        print('type wait:{} {}'.format(type(process),type(wait)))
        if wait == 'True':
            print('wait')
            socketio.emit('register',{'wait':True,'done':False},broadcast=True)
        if process == 'True':
            print('done')
            socketio.emit('register',{'wait':False,'done':True},broadcast=True)
        print('wait:{}\nprocess:{}'.format(wait,process))
    else:
        return jsonify({'status':False,'msg':'send wrong'})
        
    return jsonify({'status':True,'msg':'success methods'})

@socketio.on("predict_face")
@app.route('/predict_face',methods=['POST'])
def predict_face():
    if request.method == 'POST':
        status = request.form['status']
        nickname = request.form['name']
        role = request.form['role']
        weather = request.form['weather']
        pm25 = request.form['pm25']
        timelateonot = request.form['timelateonot']
        temp = request.form['temp']

        date = datetime.now()
        time_format = date.strftime("%H:%M")

        socketio.emit('predict_face',{
            'status':status,
            'nickname':nickname,
            'role':role,
            'weather':weather,
            'pm25':pm25,
            'timelateonot':timelateonot,
            'temp':temp,
            'time':time_format
        },broadcast=True)

    return jsonify({'status':True})


#@socketio.on("facemovement")
#@app.route('/face_movement',methods=['POST'])
#def face_movement():
#    if request.method == 'POST':
#        movement = request.form['movement']
#        if check_face_movement == 'T':
#            socketio.emit('movement',{'top':True, 'bottom':False, 'right':False, 'left':False},broadcast=True)
#        if check_face_movement == 'B':
#            socketio.emit('movement',{'top':False, 'bottom':True, 'right':False, 'left':False},broadcast=True)
#        if check_face_movement == 'R':
#            socketio.emit('movement',{'top':False, 'bottom':False, 'right':True, 'left':False},broadcast=True)
#        if check_face_movement == 'L':
#            socketio.emit('movement',{'top':False, 'bottom':False, 'right':False, 'left':True},broadcast=True)



if __name__ == '__main__':
    socketio.run(app,host='192.168.0.252',port=2626)
