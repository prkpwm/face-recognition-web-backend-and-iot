package password

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
	"face_api/keys"
	"face_api/libs"
	"face_api/libs/bcrypt"
)

func SelectPassword() string {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectPassword := faceDB.Database("iHomeWhiz").Collection("setting")

	dataPipline := bson.A{
		bson.M{
			"$addFields": bson.M{
				"pwd": "$password",
			},
		},
		bson.M{
			"$project": bson.M{
				"pwd": 1,
				"_id": 0,
			},
		},
	}
	cursor, err := colSelectPassword.Aggregate(context.Background(), dataPipline)
	if err != nil {
		return "error select password1"
	}
	if err := cursor.All(context.TODO(), &data); err != nil {
		return "error select password2"
	}
	cdata, ex := data[0]["pwd"].(string)
	if ex != true {
		return "error select password3"
	}
	//fmt.Println("data",cdata)
	return cdata
}

func CheckOldPassword(ec echo.Context) error {
	oldPassword := ec.FormValue("old_password")
	if oldPassword == "" {
		fmt.Println("password not found", oldPassword)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "old password not found",
		})
	}

	fmt.Println("password", oldPassword)
	selectPasswordVar := SelectPassword()
	fmt.Println("password", selectPasswordVar)

	checkPassword := bcrypt.CheckPasswordHash(oldPassword, selectPasswordVar)
	fmt.Println("checkPassword: ", checkPassword)

	if checkPassword == true {
		fmt.Println("valid password")
		return ec.JSON(http.StatusOK, echo.Map{
			"status": true,
			"msg":    "valid",
		})
	}

	fmt.Println("invalid password")
	return ec.JSON(http.StatusOK, echo.Map{
		"status": false,
		"msg":    "invalid",
	})

}

func UpdatePassword(ec echo.Context) error {
	// select old password for compare (raise)
	newPassword := ec.FormValue("new_password")

	if newPassword == "" {
		fmt.Println("password not found", newPassword)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "new password not found",
		})
	}

	if len(newPassword) < 8 {
		fmt.Println("password less then 8", len(newPassword))
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "password less then 8",
		})
	}

	_hashPassword, err := bcrypt.HashPassword(newPassword)
	if err != nil {
		fmt.Println("error hash password", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error hash password",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdatePassword := faceDB.Database("iHomeWhiz").Collection("setting")

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
		{"password", _hashPassword},
	}}

	filter := bson.M{"_id": objID}
	_, err = colUpdatePassword.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("error update password", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update password",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func Dock(_echo *echo.Group) {
	_echo.POST("/checkOldPassword", CheckOldPassword)
	_echo.POST("/updatePassword", UpdatePassword)
}
