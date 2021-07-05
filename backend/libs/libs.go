package libs

import (
	"backend/libs/database"

	"go.mongodb.org/mongo-driver/mongo"
)

func MongoStart(host string, dbname string, collection string, isDev bool) *mongo.Client {

	return database.InitMongo(host, dbname, collection, isDev)

}
