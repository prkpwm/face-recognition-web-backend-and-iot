from sshtunnel import SSHTunnelForwarder
import pymongo

SERVER_HOST = "192.168.0.253"
SERVER_USER = "recognitionserver"
SERVER_PASS = "staff"
MONGO_DB = "iHomeWhiz"
MONGO_COLLECTION = "setting"

MONGO_USER = 'ihw_admin'
MONGO_PASS = 'ihw_pass'

# define ssh tunnel
server = SSHTunnelForwarder(
    SERVER_HOST,
    ssh_username=SERVER_USER,
    ssh_password=SERVER_PASS,
    remote_bind_address=('127.0.0.1', 27018)
)

# start ssh tunnel
server.start()

connection = pymongo.MongoClient("mongodb://{}:{}@127.0.0.1:{}/{}".format(MONGO_USER,MONGO_PASS,server.local_bind_port,MONGO_DB))
db = connection[MONGO_DB]
collection = db[MONGO_COLLECTION]
mydoc = collection.find({})
print(list(mydoc))

server.stop()

