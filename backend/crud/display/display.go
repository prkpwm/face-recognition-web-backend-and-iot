package display

import (
	// system libs
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/labstack/echo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	// libs own
	"backend/keys"
	"backend/libs"
)

// select mask
func SelectMaskRecStatus(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectMaskStatusSetting := faceDB.Database("iHomeWhiz").Collection("setting")

	dataDisplay := bson.A{
		bson.M{
			"$addFields": bson.M{
				"MaskStatus": "$scanner_mode.mask_recognition.status",
			},
		},
		bson.M{
			"$project": bson.M{
				"MaskStatus": 1,
				"_id":        0,
			},
		},
	}

	cur, err := colSelectMaskStatusSetting.Aggregate(context.Background(), dataDisplay)
	if err != nil {
		fmt.Println("error select mask status setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select mask status setting",
		})
	}

	if err := cur.All(context.TODO(), &data); err != nil {
		fmt.Println("error select mask recognition setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select mask recognition setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    data,
	})
}

// Update mask
func UpdateValueMaskRecog(ec echo.Context) error {
	maskStatus := ec.FormValue("mask_status")
	fmt.Println("mask status:", maskStatus)
	if maskStatus == "" {
		fmt.Println("error mask status is empty:", maskStatus)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error mask status is empty",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateMaskRecog := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"scanner_mode.mask_recognition.status", maskStatus},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateMaskRecog.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update value status mask setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update value status mask setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})

}

// update weather
func UpdateValueWeather(ec echo.Context) error {
	weatherStatus := ec.FormValue("weather_status")
	fmt.Println("weather status:", weatherStatus)
	if weatherStatus == "" {
		fmt.Println("error weather status is empty:", weatherStatus)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error weather status is empty",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateWeather := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.information.weather", weatherStatus},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateWeather.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update value status weather setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update value status weather setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

// select weather
func SelectValueWeather(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectWeatherStatusSetting := faceDB.Database("iHomeWhiz").Collection("setting")

	dataDisplay := bson.A{
		bson.M{
			"$addFields": bson.M{
				"WeatherStatus": "$display.information.weather",
			},
		},
		bson.M{
			"$project": bson.M{
				"WeatherStatus": 1,
				"_id":           0,
			},
		},
	}

	cur, err := colSelectWeatherStatusSetting.Aggregate(context.Background(), dataDisplay)
	if err != nil {
		fmt.Println("error [Aggregate] select weather status setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error [Aggregate] select weather status setting",
		})
	}

	if err := cur.All(context.TODO(), &data); err != nil {
		fmt.Println("error [All] select weather setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error [All] select weather setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    data,
	})
}

// update pm25
func UpdateValuePM25(ec echo.Context) error {
	PM25Status := ec.FormValue("pm25_status")
	fmt.Println("pm25:", PM25Status)
	if PM25Status == "" {
		fmt.Println("error pm25 is empty:", PM25Status)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error pm25 is empty",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdatePM25 := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.information.pm25", PM25Status},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdatePM25.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update value status pm25 setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update value status pm25 setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})

}

// select pm25
func SelectValuePM25(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectPM25StatusSetting := faceDB.Database("iHomeWhiz").Collection("setting")

	dataDisplay := bson.A{
		bson.M{
			"$addFields": bson.M{
				"PM25Status": "$display.information.pm25",
			},
		},
		bson.M{
			"$project": bson.M{
				"PM25Status": 1,
				"_id":        0,
			},
		},
	}

	cur, err := colSelectPM25StatusSetting.Aggregate(context.Background(), dataDisplay)
	if err != nil {
		fmt.Println("error [Aggregate] select weather status setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error [Aggregate] select weather status setting",
		})
	}

	if err := cur.All(context.TODO(), &data); err != nil {
		fmt.Println("error [All] select weather setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error [All] select weather setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    data,
	})
}

// Logo setting update start
func UpdateSettingLogoImg(ec echo.Context) error {
	// TODO
	getImage, err := ec.FormFile("image")
	fmt.Println("getImage: ", getImage)
	if err != nil {
		fmt.Println("error get image", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error get image",
		})
	}

	// split file name
	stringFileName := strings.Split(getImage.Filename, ".")
	fmt.Println("string name", stringFileName[len(stringFileName)-1])

	// check extension file name
	typeFile := stringFileName[len(stringFileName)-1]
	if typeFile != "jpg" && typeFile != "png" && typeFile != "jpeg" && typeFile != "JPG" && typeFile != "PNG" && typeFile != "JPEG" {
		fmt.Println("file not supported")
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "file not supported",
		})
	}

	// open file name start
	src, err := getImage.Open()
	if err != nil {
		fmt.Println("error open image", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error open image",
		})
	}
	defer src.Close()
	pathImageSaved := "./frontend/public/image/Logo/logo-office.png"

	dst, err := os.Create(pathImageSaved)
	if err != nil {
		fmt.Println("error create image", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error create image",
		})
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		fmt.Println("error copy image", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error copy image",
		})
	}

	// open file name end

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateOganizLogoImg := faceDB.Database("iHomeWhiz").Collection("setting")

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
		{"display.logo_setting.logo_path", "logo-office.png"},
	},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateOganizLogoImg.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("error update image logo setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update image logo setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

// Logo setting update end

// organization setting start
func UpdateOrganizSettName(ec echo.Context) error {
	OrganizName := ec.FormValue("organiz_name")
	fmt.Print("OrganizName:", OrganizName)

	if OrganizName == "" {
		fmt.Println("organiz name is empty", OrganizName)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "organiz name is empty",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateOrganizName := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.scanner_header.organization_name", OrganizName},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateOrganizName.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update value organiz name setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update value organiz name  setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

// organization setting end

// frame setting start
func UpdateFrameSettingRec(ec echo.Context) error {
	recFrame := ec.FormValue("rec_frame")
	fmt.Println("recFrame:", recFrame)

	if recFrame == "" {
		fmt.Println("rectangle frame is empty", recFrame)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "rectangle frame is empty",
		})
	}

	statusConvRecFrame, err := strconv.ParseBool(recFrame)
	if err != nil {
		fmt.Println("rectangle frame, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "rectangle frame, error convert to boolean",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateRecFrame := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.frame_setting.rectangle_frame", statusConvRecFrame},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateRecFrame.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update rectangle in frame setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update rectangle in frame setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateFrameSettingPerson(ec echo.Context) error {
	personFrame := ec.FormValue("person_frame")
	fmt.Println("personFrame:", personFrame)

	if personFrame == "" {
		fmt.Println("person frame is empty", personFrame)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "person frame is empty",
		})
	}

	statusConvPersonFrame, err := strconv.ParseBool(personFrame)
	if err != nil {
		fmt.Println("person frame, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "person frame, error convert to boolean",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdatePersonFrame := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.frame_setting.person_frame", statusConvPersonFrame},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdatePersonFrame.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update rectangle in frame setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update rectangle in frame setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

// frame setting end

// scanner logo start
func UpdateScanLogoHead(ec echo.Context) error {
	logoHeader := ec.FormValue("logo_header")
	fmt.Println("logoHeader:", logoHeader)

	if logoHeader == "" {
		fmt.Println("logo header is empty", logoHeader)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "logo header is empty",
		})
	}

	statusConvLogoHeader, err := strconv.ParseBool(logoHeader)
	if err != nil {
		fmt.Println("logo header, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "logo header, error convert to boolean",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateLogoHeader := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.scanner_header.logo_header", statusConvLogoHeader},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateLogoHeader.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update scanner header logo header setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update scanner header logo header setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateScanShowInfo(ec echo.Context) error {
	showInfo := ec.FormValue("show_info")
	fmt.Println("showInfo:", showInfo)
	if showInfo == "" {
		fmt.Println("show info is empty", showInfo)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "show info is empty",
		})
	}

	statusConvShowInfo, err := strconv.ParseBool(showInfo)
	if err != nil {
		fmt.Println("show info, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "show info, error convert to boolean",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateShowInfo := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.scanner_header.show_info", statusConvShowInfo},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateShowInfo.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update scanner header show info setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update scanner header show setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

// scanner logo end

//welcome word start
func UpdateWelcomeSettingStatus(ec echo.Context) error {
	WelcomeSettingStatus := ec.FormValue("welcome_status")
	fmt.Println("WelcomeSettingStatus:", WelcomeSettingStatus)

	if WelcomeSettingStatus == "" {
		fmt.Println("welcome status is empty", WelcomeSettingStatus)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "welcome status is empty",
		})
	}

	statusConvWelcomeStatus, err := strconv.ParseBool(WelcomeSettingStatus)
	if err != nil {
		fmt.Println("welcome status, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "welcome status, error convert to boolean",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateWelcomeStatus := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.information.welcome_setting.status_welcome_word", statusConvWelcomeStatus},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateWelcomeStatus.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update status weelcome word setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update status weelcome word setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateWelcomeWordSetting(ec echo.Context) error {
	WelcomeWord := ec.FormValue("welcome_word")
	fmt.Println("WelcomeWord:", WelcomeWord)

	if WelcomeWord == "" {
		fmt.Println("welcome word is empty", WelcomeWord)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "welcome word is empty",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateWelcomeWord := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.information.welcome_setting.welcome_word", WelcomeWord},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateWelcomeWord.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update welcome word setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update welcome word setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

// welcome word end

// information start
func UpdateInfoNicknameStatus(ec echo.Context) error {
	nicknameStatus := ec.FormValue("nickname_status")
	fmt.Println("nicknameStatus:", nicknameStatus)

	if nicknameStatus == "" {
		fmt.Println("welcome word is empty", nicknameStatus)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "welcome word is empty",
		})
	}

	statusConvNicknameStatus, err := strconv.ParseBool(nicknameStatus)
	if err != nil {
		fmt.Println("welcome status, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "welcome status, error convert to boolean",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateNicknameStatus := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.information.nickname_repres", statusConvNicknameStatus},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateNicknameStatus.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update nickname status setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update nickname status setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateInfoGroupStatus(ec echo.Context) error {
	groupStatus := ec.FormValue("group_status")
	fmt.Println("groupStatus:", groupStatus)

	if groupStatus == "" {
		fmt.Println("group status is empty", groupStatus)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "group status is empty",
		})
	}

	statusConvGroupStatus, err := strconv.ParseBool(groupStatus)
	if err != nil {
		fmt.Println("group status, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "group status, error convert to boolean",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateGroupStatus := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.information.group_repres", statusConvGroupStatus},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateGroupStatus.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update group status setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update group status setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateInfoChecktimeStatus(ec echo.Context) error {
	checktimeStatus := ec.FormValue("checktime_status")
	fmt.Println("checktimeStatus:", checktimeStatus)

	if checktimeStatus == "" {
		fmt.Println("checktime status is empty", checktimeStatus)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "checktime status is empty",
		})
	}

	statusConvChecktimeStatus, err := strconv.ParseBool(checktimeStatus)
	if err != nil {
		fmt.Println("checktime status, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "checktime status, error convert to boolean",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateChecktimeStatus := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.information.checktime_repres", statusConvChecktimeStatus},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateChecktimeStatus.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update checktime status setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update checktime status setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateInfoTempStatus(ec echo.Context) error {
	tempStatus := ec.FormValue("temp_status")
	fmt.Println("tempStatus:", tempStatus)

	if tempStatus == "" {
		fmt.Println("temp status is empty", tempStatus)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "temp status is empty",
		})
	}

	statusConvTempStatus, err := strconv.ParseBool(tempStatus)
	if err != nil {
		fmt.Println("temp status, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "temp status, error convert to boolean",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateCheckTempStatus := faceDB.Database("iHomeWhiz").Collection("setting")

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	update := bson.M{
		"$set": bson.D{
			{"display.information.temp_repres", statusConvTempStatus},
		},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateCheckTempStatus.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("Error update temp status setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update temp status setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

// information end
func SelectFrameSetting(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectFrameSetting := faceDB.Database("iHomeWhiz").Collection("setting")

	dataDisplay := bson.A{
		bson.M{
			"$addFields": bson.M{
				"RecFrame":    "$display.frame_setting.rectangle_frame",
				"PersonFrame": "$display.frame_setting.person_frame",
			},
		},
		bson.M{
			"$project": bson.M{
				"RecFrame":    1,
				"PersonFrame": 1,
				"_id":         0,
			},
		},
	}

	cur, err := colSelectFrameSetting.Aggregate(context.Background(), dataDisplay)
	if err != nil {
		fmt.Println("error select frame setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select frame setting",
		})
	}

	if err := cur.All(context.TODO(), &data); err != nil {
		fmt.Println("error select frame setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select frame setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    data,
	})
}

func SelectScannerHeader(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectScannerSetting := faceDB.Database("iHomeWhiz").Collection("setting")

	dataDisplay := bson.A{
		bson.M{
			"$addFields": bson.M{
				"logoHeader":        "$display.scanner_header.logo_header",
				"showInfo":          "$display.scanner_header.show_info",
				"organization_name": "$display.scanner_header.organization_name",
			},
		},
		bson.M{
			"$project": bson.M{
				"logoHeader":        1,
				"showInfo":          1,
				"organization_name": 1,
				"_id":               0,
			},
		},
	}

	cur, err := colSelectScannerSetting.Aggregate(context.Background(), dataDisplay)
	if err != nil {
		fmt.Println("error select scanner setting1", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select scanner setting1",
		})
	}

	if err := cur.All(context.TODO(), &data); err != nil {
		fmt.Println("error select display setting2", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select display setting2",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    data,
	})
}

func SelectDisplayAllData(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectDisplayAllData := faceDB.Database("iHomeWhiz").Collection("setting")
	dataSelectAllData := bson.A{
		bson.M{
			"$addFields": bson.M{

				"logo_path": "$display.logo_setting.logo_path",
				// frame setting
				"fset_rec_frame":    "$display.frame_setting.rectangle_frame",
				"fset_person_frame": "$display.frame_setting.person_frame",
				//scanner header
				"scanner_logo_header": "$display.scanner_header.logo_header",
				"scanner_show_info":   "$display.scanner_header.show_info",
				"organization_name":   "$display.scanner_header.organization_name",
				//information
				"checktime_repres": "$display.information.checktime_repres",
				"group_repres":     "$display.information.group_repres",
				"temp_repres":      "$display.information.temp_repres",
				"nickname_repres":  "$display.information.nickname_repres",
				"welcome_repres":   "$display.information.welcome_setting.status_welcome_word",
				"welcome_word":     "$display.information.welcome_setting.welcome_word",
				//end information
				"color": "$display.color",
				"theme": "$display.theme",
			},
		},
		bson.M{
			"$project": bson.M{
				"logo_path":           1,
				"fset_rec_frame":      1,
				"fset_person_frame":   1,
				"scanner_logo_header": 1,
				"scanner_show_info":   1,
				"checktime_repres":    1,
				"group_repres":        1,
				"temp_repres":         1,
				"nickname_repres":     1,
				"welcome_repres":      1,
				"welcome_word":        1,
				"color":               1,
				"theme":               1,
				"organization_name":   1,
				"_id":                 0,
			},
		},
	}

	cursor, err := colSelectDisplayAllData.Aggregate(context.Background(), dataSelectAllData)

	if err != nil {
		fmt.Println("error select display all data1", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select display all data1",
		})
	}

	if err := cursor.All(context.TODO(), &data); err != nil {
		fmt.Println("error select display all data2", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select display all data2",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"msg":    data,
		"status": true,
	})
}

func SelectInformation(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectScannerHeader := faceDB.Database("iHomeWhiz").Collection("setting")
	dataSelect := bson.A{
		bson.M{
			"$addFields": bson.M{
				"checktime_repres": "$display.information.checktime_repres",
				"group_repres":     "$display.information.group_repres",
				"temp_repres":      "$display.information.temp_repres",
				"nickname_repres":  "$display.information.nickname_repres",
				"welcome_repres":   "$display.information.welcome_setting.status_welcome_word",
				"welcome_word":     "$display.information.welcome_setting.welcome_word",
			},
		},
		bson.M{
			"$project": bson.M{
				"checktime_repres": 1,
				"group_repres":     1,
				"temp_repres":      1,
				"nickname_repres":  1,
				"welcome_repres":   1,
				"welcome_word":     1,
				"_id":              0,
			},
		},
	}
	cursor, err := colSelectScannerHeader.Aggregate(context.Background(), dataSelect)
	if err != nil {
		fmt.Println("error select scanner header1", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select scanner header1",
		})
	}

	if err := cursor.All(context.TODO(), &data); err != nil {
		fmt.Println("error select scanner header2", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select scanner header2",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"msg":    data,
		"status": true,
	})
}

func SelectDisplaySetting(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectDisplaySetting := faceDB.Database("iHomeWhiz").Collection("setting")
	dataDisplay := bson.A{
		bson.M{
			"$addFields": bson.M{

				"color": "$display.color",
				"theme": "$display.theme",
			},
		},
		bson.M{
			"$project": bson.M{
				"color": 1,
				"theme": 1,
				"_id":   0,
			},
		},
	}
	cur, err := colSelectDisplaySetting.Aggregate(context.Background(), dataDisplay)
	if err != nil {
		fmt.Println("error select display setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select display setting",
		})
	}

	if err := cur.All(context.TODO(), &data); err != nil {
		fmt.Println("error select display setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select display setting command",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"msg":    data,
		"status": true,
	})
}

func Dock(_echo *echo.Group) {
	// scanner header
	_echo.GET("/selectScannerHeader", SelectScannerHeader)

	//frame setting
	_echo.GET("/selectFrameSetting", SelectFrameSetting)

	// information
	_echo.GET("/selectInformation", SelectInformation)

	//display
	_echo.GET("/selectDisplaySetting", SelectDisplaySetting)

	//select all display
	_echo.GET("/selectDisplayAllData", SelectDisplayAllData)

	// update
	_echo.POST("/updateSettingLogoImg", UpdateSettingLogoImg)
	_echo.POST("/updateOrganizSettName", UpdateOrganizSettName)
	_echo.POST("/updateFrameSettingRec", UpdateFrameSettingRec)
	_echo.POST("/updateFrameSettingPerson", UpdateFrameSettingPerson)
	_echo.POST("/updateScanLogoHead", UpdateScanLogoHead)
	_echo.POST("/updateScanShowInfo", UpdateScanShowInfo)
	_echo.POST("/updateWelcomeSettingStatus", UpdateWelcomeSettingStatus)
	_echo.POST("/updateWelcomeWordSetting", UpdateWelcomeWordSetting)
	_echo.POST("/updateInfoNicknameStatus", UpdateInfoNicknameStatus)
	_echo.POST("/updateInfoGroupStatus", UpdateInfoGroupStatus)
	_echo.POST("/updateInfoChecktimeStatus", UpdateInfoChecktimeStatus)
	_echo.POST("/updateInfoTempStatus", UpdateInfoTempStatus)

	// Mask
	_echo.GET("/selectMaskRecStatus", SelectMaskRecStatus)
	_echo.POST("/updateValueMaskRecog", UpdateValueMaskRecog)

	// Weather
	_echo.GET("/selectValueWeather", SelectValueWeather)
	_echo.POST("/updateValueWeather", UpdateValueWeather)

	// PM25
	_echo.GET("/selectValuePM25", SelectValuePM25)
	_echo.POST("/updateValuePM25", UpdateValuePM25)

}
