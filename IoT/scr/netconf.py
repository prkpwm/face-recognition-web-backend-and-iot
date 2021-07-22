
import uvicorn
from starlette.applications import Starlette
from starlette.routing import Host, Route
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.responses import JSONResponse

from PIL import Image
import os

import multiprocessing as mp
from flask_socketio import SocketIO

import requests

# mask recognition
#from tensorflow.keras.preprocessing.image import img_to_array
#from tensorflow.keras.applications.resnet_v2 import preprocess_input

# app = Flask(__name__)
# CORS(app)
# app.config['SECRET_KEY'] = generate_uuid()
middleware = [
    Middleware(
        CORSMiddleware, 
        allow_origins=['*']
        )
]
async def get_network(request):
    net2d = []
    net=os.popen("nmcli dev wifi").read().strip().split('\n')
    for i in range(len(net)):
        net2d.append(net[i][8:].replace("Infra"," Channel"))
    try:

        return JSONResponse({"available":net2d})
    except Exception as e:
        return JSONResponse({"status":False,"network":"error networking"})

async def connect_network(request):
    # if request.method == 'GET':
    try:
        config = await request.form()
        net = os.system('nmcli dev wifi connect {} password {}'.format(config['ssid'],config['password']))
        return JSONResponse({net})
    except Exception as e:
        return JSONResponse({"status":False,"network":"error networking"})


routes = [
    Route("/available_networks", endpoint=get_network, methods=["GET"]),
    Route("/new_connection", endpoint=connect_network, methods=["POST"]),
]


app = Starlette(middleware=middleware,routes=routes)

if __name__ == "__main__":
    uvicorn.run(app, host='192.168.0.252',port=2828)
    # socketio.run(app,host='192.168.0.252',port=2323)