package scannerMode

import (
	// system libs
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo"

	//"github.com/labstack/echo/middleware"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	// libs own
	"face_api/keys"
	"face_api/libs"
)

func SelectScannerMode(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectScannerMode := faceDB.Database("iHomeWhiz").Collection("setting")
	dataScanner := bson.A{
		bson.M{
			"$addFields": bson.M{
				"face_status":    "$scanner_mode.face_recognition.status",
				"face_threshold": "$scanner_mode.face_recognition.threshold",
				"thermal_status": "$scanner_mode.thermal_scan.status",
				"thermal_hight":  "$scanner_mode.thermal_scan.threshold.highest",
				"thermal_lowest": "$scanner_mode.thermal_scan.threshold.lowest",
			},
		},
		bson.M{
			"$project": bson.M{
				"face_status":    1,
				"face_threshold": 1,
				"thermal_status": 1,
				"thermal_hight":  1,
				"thermal_lowest": 1,
				"_id":            0,
			},
		},
	}

	cursor, err := colSelectScannerMode.Aggregate(context.Background(), dataScanner)
	if err != nil {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": true,
			"msg":    "error select scanner mode1",
		})
	}

	if err := cursor.All(context.TODO(), &data); err != nil {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": true,
			"msg":    "error select scanner mode2",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"msg":    data,
		"status": true,
	})
}

func UpdateScannerModeFaceRecognition(ec echo.Context) error {
	statusFaceRecognition := ec.FormValue("status_face_recognition")
	fmt.Println("statusFaceRecognition:", statusFaceRecognition)
	if statusFaceRecognition == "" {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "status face recognition not found",
		})
	}

	statusConvFaceRecognition, err := strconv.ParseBool(statusFaceRecognition)
	if err != nil {
		fmt.Println("status face recognition, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "status face recognition, error convert to boolean",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateScannerModeFaceRec := faceDB.Database("iHomeWhiz").Collection("setting")

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
		{"scanner_mode.face_recognition.status", statusConvFaceRecognition},
	}}

	filter := bson.M{"_id": objID}
	_, err = colUpdateScannerModeFaceRec.UpdateMany(
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

func UpdateScannerModeHThermal(ec echo.Context) error {
	thermalHighest := ec.FormValue("thermal_hight")
	fmt.Println("thermalHighest:", thermalHighest)
	if thermalHighest == "" {
		fmt.Println("Thermal hight not found", thermalHighest)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "Thermal hight not found",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateScannerModeThermal := faceDB.Database("iHomeWhiz").Collection("setting")

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
		{"scanner_mode.thermal_scan.threshold.highest", thermalHighest},
	}}

	filter := bson.M{"_id": objID}
	_, err = colUpdateScannerModeThermal.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("error update hight thermal scanner mode", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update high thermal scanner mode",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateScannerModeLThermal(ec echo.Context) error {
	thermalLowest := ec.FormValue("thermal_low")
	fmt.Println("thermalLowest:", thermalLowest)
	if thermalLowest == "" {
		fmt.Println("Thermal low not found", thermalLowest)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "Thermal low not found",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateScannerModeThermal := faceDB.Database("iHomeWhiz").Collection("setting")

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
		{"scanner_mode.thermal_scan.threshold.lowest", thermalLowest},
	}}

	filter := bson.M{"_id": objID}
	_, err = colUpdateScannerModeThermal.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("error update low thermal scanner mode", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update low thermal scanner mode",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateStatusScannerModeThermal(ec echo.Context) error {
	statusThermal := ec.FormValue("status_thermal")
	fmt.Println("statusThermal:", statusThermal)
	if statusThermal == "" {
		fmt.Println("Status thermal not found", statusThermal)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "Status thermal not found",
		})
	}

	statusConvThermal, err := strconv.ParseBool(statusThermal)
	if err != nil {
		fmt.Println("status thermal, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "status thermal, error convert to boolean",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateScannerModeThermal := faceDB.Database("iHomeWhiz").Collection("setting")

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
		{"scanner_mode.thermal_scan.status", statusConvThermal},
	}}

	filter := bson.M{"_id": objID}
	_, err = colUpdateScannerModeThermal.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("error update thermal scanner mode", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update thermal scanner mode",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func Dock(_echo *echo.Group) {
	_echo.GET("/selectScannerMode", SelectScannerMode)
	_echo.POST("/updateScannerModeFaceRecognition", UpdateScannerModeFaceRecognition)
	_echo.POST("/updateStatusScannerModeThermal", UpdateStatusScannerModeThermal)
	_echo.POST("/updateScannerModeHThermal", UpdateScannerModeHThermal)
	_echo.POST("/updateScannerModeLThermal", UpdateScannerModeLThermal)
}
