import pymongo

myclient = pymongo.MongoClient(
    "mongodb://ihw_admin:ihw_pass@127.0.0.1:27018/iHomeWhiz")
mydb = myclient["iHomeWhiz"]


def get_data2train():
    mycol = mydb["member"]
    mydoc = mycol.find({"activated": True}, {"info.user_id":1,"data":1})
    return list(mydoc)

