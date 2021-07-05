package report

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
	"backend/keys"
	"backend/libs"
)

// UpdateValueSms return true when updated and return false and error when not update
func UpdateValueSms(ec echo.Context) error {
	groupID := ec.FormValue("Gid")
	statusSMS := ec.FormValue("status_sms")
	fmt.Println("groupID:", groupID)
	fmt.Println("statusSMS:", statusSMS)

	if statusSMS == "" {
		fmt.Println("status sms is empty", statusSMS)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "status sms is empty",
		})
	}

	statusConvSMS, err := strconv.ParseBool(statusSMS)
	if err != nil {
		fmt.Println("status sms:", statusSMS)
		fmt.Println("status sms, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "status sms, error convert to boolean",
		})
	}

	if groupID == "" {
		fmt.Println("group id is empty", groupID)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "Group is empty",
		})
	}

	objID, err := primitive.ObjectIDFromHex(groupID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateValueSms := faceDB.Database("iHomeWhiz").Collection("member_setting")

	updateValueSms := bson.M{"$set": bson.D{
		{"sms_report", statusConvSMS},
	}}

	filter := bson.M{"_id": objID}
	_, err = colUpdateValueSms.UpdateMany(
		context.Background(),
		filter,
		updateValueSms,
	)

	if err != nil {
		fmt.Println("Error update status sms", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update status sms",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})

}

// UpdateValueEmail return true when updated and return false and error when not update
func UpdateValueEmail(ec echo.Context) error {
	groupID := ec.FormValue("Gid")
	statusEmail := ec.FormValue("status_email")

	fmt.Println("groupID:", groupID)
	fmt.Println("statusEmail:", statusEmail)

	if statusEmail == "" {
		fmt.Println("status email is empty", statusEmail)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "status email is empty",
		})
	}

	statusConvEmail, err := strconv.ParseBool(statusEmail)
	if err != nil {
		fmt.Println("status email:", statusEmail)
		fmt.Println("status email, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "status email, error convert to boolean",
		})
	}

	if groupID == "" {
		fmt.Println("group id is empty", groupID)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "Group is empty",
		})
	}

	objID, err := primitive.ObjectIDFromHex(groupID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateValueEmail := faceDB.Database("iHomeWhiz").Collection("member_setting")

	updateValueEmail := bson.M{"$set": bson.D{
		{"email_report", statusConvEmail},
	}}

	filter := bson.M{"_id": objID}
	_, err = colUpdateValueEmail.UpdateMany(
		context.Background(),
		filter,
		updateValueEmail,
	)

	if err != nil {
		fmt.Println("Error update status email", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update status email",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

// SelectGroupReport return data group have sms and email status
func SelectGroupReport(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectLanguage := faceDB.Database("iHomeWhiz").Collection("member_setting")

	dataPipline := bson.A{
		bson.M{
			"$addFields": bson.M{
				"groupName":   "$group_name",
				"smsReport":   "$sms_report",
				"emailReport": "$email_report",
			},
		},
		bson.M{
			"$project": bson.M{
				"groupName":   1,
				"smsReport":   1,
				"emailReport": 1,
			},
		},
	}
	cursor, err := colSelectLanguage.Aggregate(context.Background(), dataPipline)
	if err != nil {
		fmt.Println("error select group report1: ", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"msg":    "error select group report1",
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

// SelectReportByID return data from member setting mongo
func SelectReportByID(ec echo.Context) error {
	groupID := ec.FormValue("Gid")
	fmt.Println("groupID:", groupID)
	if groupID == "" {
		fmt.Println("group is empty:", groupID)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "group is empty",
		})
	}

	objID, err := primitive.ObjectIDFromHex(groupID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectReportByGroup := faceDB.Database("iHomeWhiz").Collection("member_setting")

	var data []bson.M
	dataPipline := bson.A{
		bson.M{
			"$addFields": bson.M{
				"group_name": "$group_name",
				"sms":        "$sms_report",
				"email":      "$email_report",
			},
		},
		bson.M{
			"$project": bson.M{
				"_id":        1,
				"group_name": 1,
				"sms":        1,
				"email":      1,
			},
		},
		bson.M{
			"$match": bson.M{
				"_id": objID,
			},
		},
	}

	cursor, err := colSelectReportByGroup.Aggregate(context.Background(), dataPipline)
	if err != nil {
		fmt.Println("error select member by group1", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select member by group1",
		})
	}

	if err := cursor.All(context.TODO(), &data); err != nil {
		fmt.Println("error select member by group2", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select member by group2",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    data,
	})
}

// Dock is private group
func Dock(_echo *echo.Group) {
	_echo.POST("/updateValueSms", UpdateValueSms)
	_echo.POST("/updateValueEmail", UpdateValueEmail)
	_echo.POST("/selectReportByID", SelectReportByID)
	_echo.GET("/selectGroupReport", SelectGroupReport)
}
