package language

import (
	// system libs
	"context"
	"fmt"
	"net/http"

	"github.com/labstack/echo"

	//"github.com/labstack/echo/middleware"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	// libs own
	"backend/keys"
	"backend/libs"
)

func SelectLanguage(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectLanguage := faceDB.Database("iHomeWhiz").Collection("setting")

	dataPipline := bson.A{
		bson.M{
			"$addFields": bson.M{
				"lang": "$language",
			},
		},
		bson.M{
			"$project": bson.M{
				"lang": 1,
				"_id":  0,
			},
		},
	}
	cursor, err := colSelectLanguage.Aggregate(context.Background(), dataPipline)
	if err != nil {
		fmt.Println("error select language1: ", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"msg":    "error select language1",
			"status": false,
		})
	}
	if err := cursor.All(context.TODO(), &data); err != nil {
		fmt.Println("error select language2: ", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"msg":    "error select language2",
			"status": false,
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"msg":    data,
		"status": true,
	})
}

func UpdateLanguage(ec echo.Context) error {
	language := ec.FormValue("language")
	fmt.Println("language:", language)
	if language == "" {
		fmt.Println("language is empty", language)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "language is empty",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateLanguage := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{"$set": bson.D{
		{"language", language},
	}}

	filter := bson.M{"_id": objID}
	_, err = colUpdateLanguage.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update face recognition scanner mode", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "Error update face recognition scanner mode",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func Dock(_echo *echo.Group) {
	_echo.GET("/selectLanguage", SelectLanguage)
	_echo.POST("/updateLanguage", UpdateLanguage)
}
