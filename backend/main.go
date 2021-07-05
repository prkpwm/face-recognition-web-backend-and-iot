package main

import (
	// libs system
	"context"
	"fmt"
	"net/http"
	"time"

	//"reflect"

	//JWT
	"github.com/dgrijalva/jwt-go"

	//ECHO
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	//CRUD
	"face_api/crud"
	"face_api/crud/attendance"
	"face_api/crud/display"
	"face_api/crud/language"
	"face_api/crud/member"
	"face_api/crud/memberSetting"
	"face_api/crud/password"
	"face_api/crud/report"
	"face_api/crud/scannerMode"
	"face_api/crud/sound"
	"face_api/libs/bcrypt"
	"face_api/libs/registerFace"

	//MODELS
	"face_api/models/auth"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	// libs own
	"face_api/keys"
	"face_api/libs"
)

func InsertPassword(ec echo.Context) error {
	passwordRe := ec.FormValue("password")
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
	fmt.Println(passwordRe)
	_hashPassword, _ := bcrypt.HashPassword(passwordRe)
	fmt.Println(_hashPassword)

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

func Authentication(ec echo.Context) error {
	receivePassword := ec.FormValue("password")
	if receivePassword == "" {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "password is empty",
			"token":  "empty",
		})
	}

	fmt.Println("password ", receivePassword)

	passwordSelected := password.SelectPassword()
	fmt.Println("passwordSelected ", passwordSelected)

	match := bcrypt.CheckPasswordHash(receivePassword, passwordSelected)
	fmt.Println("match", match)
	if match != true {
		fmt.Println("password invalid")
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "password don't match",
			"token":  "empty",
		})
	}

	fmt.Println("password valid")

	idx, deviceName, language := crud.SelectForJwt()
	fmt.Println("id:", idx, "device id", deviceName, "language", language)

	claims := &auth.JwtClaim{
		idx,
		deviceName,
		language,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte("secret"))

	fmt.Println("token", t)

	if err != nil {
		fmt.Println("error token", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error token",
			"token":  "empty",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "Login success",
		"token":  t,
	})
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	var IsLogIn = middleware.JWTWithConfig(middleware.JWTConfig{
		Claims:     &auth.JwtClaim{},
		SigningKey: []byte("secret"),
	})

	// e.GET("/findReportByID", FindReportByID)
	e.POST("/authentication", Authentication)
	e.POST("/insertPassword", InsertPassword)

	// e.POST("/testDatabase", TestDatabase)
	// e.POST("/updateValueEmail", UpdateValueEmail)

	// report.SelectReportByID()
	// e.POST("/updateDisplaySetting", UpdateDisplaySetting)
	// e.POST("/testjwt", TestJWT)

	//e.POST("/insertPassword",InsertPassword)

	_privateAPI := e.Group("/private/api/v1", IsLogIn)
	fmt.Println("_privateAPI >>>", _privateAPI)

	attendance.Dock(_privateAPI)
	display.Dock(_privateAPI)
	memberSetting.Dock(_privateAPI)
	member.Dock(_privateAPI)
	password.Dock(_privateAPI)
	scannerMode.Dock(_privateAPI)
	crud.Dock(_privateAPI)
	language.Dock(_privateAPI)
	report.Dock(_privateAPI)
	registerFace.Dock(_privateAPI)
	sound.Dock(_privateAPI)

	e.Logger.Fatal(e.Start(":1969"))
}
