package attendance

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

func SelectAttendance(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectAttendance := faceDB.Database("iHomeWhiz").Collection("setting")

	dataPipline := bson.A{
		bson.M{
			"$addFields": bson.M{
				"checkinStatus": "$attendance.checkin_status",
				"ontime":        "$attendance.ontime",
				"workingDayMo":  "$attendance.working_day.Mo",
				"workingDayTu":  "$attendance.working_day.Tu",
				"workingDayWed": "$attendance.working_day.Wed",
				"workingDayThu": "$attendance.working_day.Thu",
				"workingDayFri": "$attendance.working_day.Fri",
				"workingDaySat": "$attendance.working_day.Sat",
				"workingDaySun": "$attendance.working_day.Sun",
			},
		},
		bson.M{
			"$project": bson.M{
				"checkinStatus": 1,
				"_id":           0,
				"ontime":        1,
				"workingDayMo":  1,
				"workingDayTu":  1,
				"workingDayWed": 1,
				"workingDayThu": 1,
				"workingDayFri": 1,
				"workingDaySat": 1,
				"workingDaySun": 1,
			},
		},
	}
	cursor, err := colSelectAttendance.Aggregate(context.Background(), dataPipline)
	if err != nil {
		fmt.Println("error select attendance data", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select attendance data1",
		})
	}
	if err := cursor.All(context.TODO(), &data); err != nil {
		fmt.Println("error select attendance data", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select attendace data2",
		})
	}
	return ec.JSON(http.StatusOK, echo.Map{
		"msg":    data,
		"status": true,
	})
}

func UpdateOntime(ec echo.Context) error {
	onTime := ec.FormValue("ontime")
	fmt.Println("onTime:", onTime)
	if onTime == "" {
		fmt.Println("ontime is empty", onTime)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "ontime is empty",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateAttendanceOntime := faceDB.Database("iHomeWhiz").Collection("setting")

	updateAttendanceOntime := bson.M{"$set": bson.D{
		{"attendance.ontime", onTime},
	}}

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	filter := bson.M{"_id": objID}

	_, err = colUpdateAttendanceOntime.UpdateMany(
		context.Background(),
		filter,
		updateAttendanceOntime,
	)

	if err != nil {
		fmt.Println("error update ontime data", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update ontime data",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateCheckStatus(ec echo.Context) error {
	checkInStatus := ec.FormValue("check_status")
	fmt.Println("checkInStatus:", checkInStatus)
	if checkInStatus == "" {
		fmt.Println("checkInStatus is empty", checkInStatus)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "checkInStatus is empty",
		})
	}

	statusConvCheckInStatus, err := strconv.ParseBool(checkInStatus)
	if err != nil {
		fmt.Println("checkin status, error convert string to bool", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "checkin status, error convert string to bool",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateAttendanceCheckInStatus := faceDB.Database("iHomeWhiz").Collection("setting")

	updateAttendance := bson.M{"$set": bson.D{
		{"attendance.checkin_status", statusConvCheckInStatus},
	}}

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	filter := bson.M{"_id": objID}

	_, err = colUpdateAttendanceCheckInStatus.UpdateMany(
		context.Background(),
		filter,
		updateAttendance,
	)

	if err != nil {
		fmt.Println("error check status data", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error check status data",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})

}

func UpdateWorkMo(ec echo.Context) error {
	workMo := ec.FormValue("work_mo")
	fmt.Println("workMo:", workMo)
	if workMo == "" {
		fmt.Println("workMo is empty", workMo)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "workMo is empty",
		})
	}

	statusConvWorkMonStatus, err := strconv.ParseBool(workMo)
	if err != nil {
		fmt.Println("check mon status, error convert string to bool", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "check mon status, error convert string to bool",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateAttendanceWorkMon := faceDB.Database("iHomeWhiz").Collection("setting")

	updateAttendanceWorkMon := bson.M{"$set": bson.D{
		{"attendance.working_day.Mo", statusConvWorkMonStatus},
	}}

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	filter := bson.M{"_id": objID}

	_, err = colUpdateAttendanceWorkMon.UpdateMany(
		context.Background(),
		filter,
		updateAttendanceWorkMon,
	)

	if err != nil {
		fmt.Println("error work mon data", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error work mon data",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateWorkTu(ec echo.Context) error {
	workTu := ec.FormValue("work_tu")
	fmt.Println("workTu", workTu)
	if workTu == "" {
		fmt.Println("workTu is empty", workTu)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "workTu is empty",
		})
	}
	statusConvWorkTuStatus, err := strconv.ParseBool(workTu)
	if err != nil {
		fmt.Println("check tu status, error convert string to bool", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "check tu status, error convert string to bool",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateAttendanceWorkTu := faceDB.Database("iHomeWhiz").Collection("setting")

	updateAttendanceWorkTu := bson.M{"$set": bson.D{
		{"attendance.working_day.Tu", statusConvWorkTuStatus},
	}}

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	filter := bson.M{"_id": objID}

	_, err = colUpdateAttendanceWorkTu.UpdateMany(
		context.Background(),
		filter,
		updateAttendanceWorkTu,
	)

	if err != nil {
		fmt.Println("error update work tu data", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update work tu data",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateWorkWed(ec echo.Context) error {
	workWed := ec.FormValue("work_wed")
	fmt.Println("workWed:", workWed)
	if workWed == "" {
		fmt.Println("workWed is empty", workWed)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "workWed is empty",
		})
	}
	statusConvWorkWedStatus, err := strconv.ParseBool(workWed)
	if err != nil {
		fmt.Println("check wed status, error convert string to bool", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "check wed status, error convert string to bool",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateAttendanceWorkWed := faceDB.Database("iHomeWhiz").Collection("setting")

	updateAttendanceWorkWed := bson.M{"$set": bson.D{
		{"attendance.working_day.Wed", statusConvWorkWedStatus},
	}}

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	filter := bson.M{"_id": objID}

	_, err = colUpdateAttendanceWorkWed.UpdateMany(
		context.Background(),
		filter,
		updateAttendanceWorkWed,
	)

	if err != nil {
		fmt.Println("error update work wed data", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update work wed data",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateWorkThu(ec echo.Context) error {
	workThu := ec.FormValue("work_thu")
	fmt.Println("workThu", workThu)
	if workThu == "" {
		fmt.Println("workThu is empty", workThu)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "workThu is empty",
		})
	}
	statusConvWorkThuStatus, err := strconv.ParseBool(workThu)
	if err != nil {
		fmt.Println("check thu status, error convert string to bool", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "check thu status, error convert string to bool",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateAttendanceWorkThu := faceDB.Database("iHomeWhiz").Collection("setting")

	updateAttendanceWorkThu := bson.M{"$set": bson.D{
		{"attendance.working_day.Thu", statusConvWorkThuStatus},
	}}

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	filter := bson.M{"_id": objID}

	_, err = colUpdateAttendanceWorkThu.UpdateMany(
		context.Background(),
		filter,
		updateAttendanceWorkThu,
	)

	if err != nil {
		fmt.Println("error update work thu data", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update work thu data",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}
func UpdateWorkFri(ec echo.Context) error {
	workFri := ec.FormValue("work_fri")
	fmt.Println("workFri", workFri)
	if workFri == "" {
		fmt.Println("workFri is empty", workFri)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "workFri is empty",
		})
	}
	statusConvWorkFriStatus, err := strconv.ParseBool(workFri)
	if err != nil {
		fmt.Println("check fri status, error convert string to bool", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "check fri status, error convert string to bool",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateAttendanceWorkFri := faceDB.Database("iHomeWhiz").Collection("setting")

	updateAttendancWorkFri := bson.M{"$set": bson.D{
		{"attendance.working_day.Fri", statusConvWorkFriStatus},
	}}

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	filter := bson.M{"_id": objID}

	_, err = colUpdateAttendanceWorkFri.UpdateMany(
		context.Background(),
		filter,
		updateAttendancWorkFri,
	)

	if err != nil {
		fmt.Println("error update work fri data", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update work fri data",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}
func UpdateWorkSat(ec echo.Context) error {
	workSat := ec.FormValue("work_sat")
	fmt.Println("workSat:", workSat)
	if workSat == "" {
		fmt.Println("workSat is empty", workSat)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "workSat is empty",
		})
	}
	statusConvWorkSatStatus, err := strconv.ParseBool(workSat)
	if err != nil {
		fmt.Println("check sat status, error convert string to bool", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "check sat status, error convert string to bool",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateAttendanceWorkSat := faceDB.Database("iHomeWhiz").Collection("setting")

	updateAttendanceWorkSat := bson.M{"$set": bson.D{
		{"attendance.working_day.Sat", statusConvWorkSatStatus},
	}}

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	filter := bson.M{"_id": objID}

	_, err = colUpdateAttendanceWorkSat.UpdateMany(
		context.Background(),
		filter,
		updateAttendanceWorkSat,
	)

	if err != nil {
		fmt.Println("error update work sat data", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update work sat data",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}
func UpdateWorkSun(ec echo.Context) error {
	workSun := ec.FormValue("work_sun")
	fmt.Println("workSun:", workSun)
	if workSun == "" {
		fmt.Println("workSun is empty", workSun)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": true,
			"msg":    "workSun is empty",
		})
	}
	statusConvWorkSunStatus, err := strconv.ParseBool(workSun)
	if err != nil {
		fmt.Println("check sun status, error convert string to bool", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "check sun status, error convert string to bool",
		})
	}
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateAttendanceWorkSun := faceDB.Database("iHomeWhiz").Collection("setting")

	updateAttendanceSun := bson.M{"$set": bson.D{
		{"attendance.working_day.Sun", statusConvWorkSunStatus},
	}}

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	filter := bson.M{"_id": objID}

	_, err = colUpdateAttendanceWorkSun.UpdateMany(
		context.Background(),
		filter,
		updateAttendanceSun,
	)

	if err != nil {
		fmt.Println("error update ontime data", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update ontime data",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func Dock(_echo *echo.Group) {
	_echo.POST("/updateOntime", UpdateOntime)
	_echo.POST("/updateCheckStatus", UpdateCheckStatus)
	_echo.POST("/updateWorkMo", UpdateWorkMo)
	_echo.POST("/updateWorkTu", UpdateWorkTu)
	_echo.POST("/updateWorkWed", UpdateWorkWed)
	_echo.POST("/updateWorkThu", UpdateWorkThu)
	_echo.POST("/updateWorkFri", UpdateWorkFri)
	_echo.POST("/updateWorkSat", UpdateWorkSat)
	_echo.POST("/updateWorkSun", UpdateWorkSun)
	_echo.GET("/selectAttendance", SelectAttendance)
}
