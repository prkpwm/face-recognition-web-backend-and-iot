package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type (
	MongoConfig struct {
		Host       string
		DBName     string
		Collection string
	}
)

func InitMongo(host string, dbname string, collection string, dev bool) *mongo.Client {

	mc := new(MongoConfig)

	mc.Host = host
	mc.DBName = dbname
	mc.Collection = collection

	_ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	_client, _err := mongo.Connect(_ctx, options.Client().ApplyURI(mc.Host+"/"+mc.DBName))
	if _err != nil {
		log.Fatal(_err.Error())
	}

	// if dev {
	// 	mc.LogMongo()
	// }

	return _client

}

// func (mc *MongoConfig) LogMongo() {

// 	fmt.Println("Host : " + mc.Host)
// 	fmt.Println("DBName : " + mc.DBName)
// 	fmt.Println("Collection : " + mc.Collection)

// }
