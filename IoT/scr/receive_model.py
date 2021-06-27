from flask import Flask, jsonify, request
import uuid

#from gevent.pywsgi import WSGIServer

app = Flask(__name__)

# random hash on flask
app.config['SECRET_KEY'] = uuid.uuid4().hex

@app.route('/receive_model', methods = ['POST'])
def receive_model():
    if request.method == 'POST':
        print('receive model')
        upload_file = request.files['model']
        if upload_file.filename != '':
            print('file name:',upload_file.filename)
            if '.sav' in upload_file.filename:
                print('save model')
                upload_file.save('../model/'+upload_file.filename)
                return jsonify({"msg":"success"})
            else:
                print('[model] file is not correct')
                return jsonify({"msg":"file is not correct"})
        else:
            print('[model] file is empty')
            return jsonify({"msg":"file is empty"})

if __name__ == '__main__':
    #server_receive = WSGIServer(('0.0.0.0',2727),app)
    #server_receive.serve_forever()
    app.run(host='192.168.0.252',port=2727,threaded=True)
    
        
