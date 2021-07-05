package crud

import (
	// system libs
	"context"
	"fmt"
	"net/http"
	"github.com/labstack/echo"
	//"github.com/labstack/echo/middleware"
	"go.mongodb.org/mongo-driver/bson"

	// libs own
	"face_api/keys"
	"face_api/libs"
	
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func SelectAllData(ec echo.Context) error{
    faceDB := libs.MongoStart(keys.Face,"iHomeWhiz","",true)
	collectionAllData := faceDB.Database("iHomeWhiz").Collection("setting")
	cursor, err := collectionAllData.Find(context.Background(),bson.M{})
	if err != nil{
	    fmt.Println("error select data all ",err)
	    return ec.JSON(http.StatusOK, echo.Map{
		    "status":false,
		    "msg":"error select all data",
	    })
	}
	var episodes []bson.M

	if err = cursor.All(context.Background(),&episodes);err != nil{
	    fmt.Println("error feth all data",err)
	    return ec.JSON(http.StatusOK, echo.Map{
		    "status":false,
		    "msg":"error feth all data",
	    })
	}

	return ec.JSON(http.StatusOK, echo.Map{
		    "status":true,
		    "msg":episodes,
	    })
}

func SelectForJwt() (string, string, string) {
    var data []bson.M
    faceDB := libs.MongoStart(keys.Face,"iHomeWhiz","",true)
    colSelectForJwt := faceDB.Database("iHomeWhiz").Collection("setting")
    
    dataPipline := bson.A{
        bson.M{
            "$addFields":bson.M{
                "deviceName":"$device_name",
                "lang":"$language",
            },
        },
        bson.M{
            "$project":bson.M{
                "deviceName":1,
                "lang":1,
            },
        },
    }
    cursor, err := colSelectForJwt.Aggregate(context.Background(),dataPipline)
    fmt.Println("cursor",cursor)
    if err != nil{
        return "error select data for jwt1","error","error"
    }
    if err := cursor.All(context.TODO(), &data); err != nil{
        return "error select data for jwt2","error","error"
    }
    
    //select _id
    cdataID,_ := data[0]["_id"]
    stringObID := cdataID.(primitive.ObjectID).Hex()
    fmt.Println("cdataID",stringObID)
   
    cdataDeviceName,exDN := data[0]["deviceName"].(string)
    fmt.Println("cdataDeviceName",cdataDeviceName)
    if exDN != true{
        fmt.Println("error select device name for jwt")
        return "error select device name for jwt","error","error"
    }
    
    cdataLang,exLang := data[0]["lang"].(string)
    fmt.Println("cdataLang",cdataLang)
    if exLang != true{
        fmt.Println("error select language for jwt")
        return "error select language for jwt","error","error"
    }
    
    return stringObID, cdataDeviceName, cdataLang
}

func Dock(_echo *echo.Group){
    _echo.POST("/selectAllData",SelectAllData)
}

