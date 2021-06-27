package sound

import (
	// system libs
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"

	"github.com/labstack/echo"

	//"github.com/labstack/echo/middleware"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	// libs own
	"face_api/keys"
	"face_api/libs"
)

func httppostSetSound(volumeSound int) string {
	data := url.Values{
		"volume_value": {strconv.Itoa(volumeSound)},
	}
	fmt.Println("data volume:", data)
	resp, err := http.PostForm("http://192.168.0.100:2323/sound_setting", data)
	if err != nil {
		fmt.Println("error send post:", err)
		return "error"
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("error read string:", err)
		return "error"
	}
	sb := string(body)
	return sb
}

func httppostGetSound() string {
	resp, err := http.Get("http://192.168.0.100:2323/get_volume_system")
	if err != nil {
		fmt.Println("error get sound:", err)
		return "error"
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("error read string:", err)
		return "error"
	}
	sb := string(body)

	return sb
}

func SetSound(ec echo.Context) error {
	voiceVo := ec.FormValue("setVolume")
	voiceVolumeconv, err := strconv.Atoi(voiceVo)
	if err != nil {
		fmt.Println("error convert int to string:", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error convert int to string",
		})
	}
	postSound := httppostSetSound(voiceVolumeconv)
	if postSound == "error" {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error",
		})
	}

	var data map[string]interface{}
	err = json.Unmarshal([]byte(postSound), &data)
	if err != nil {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error convert json",
		})
	}

	fmt.Println("data:", data["status"])

	// fmt.Println("getsound:", getSound)
	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    data["status"],
	})

}

func GetSound(ec echo.Context) error {
	// fmt.Println("api 1")
	getSound := httppostGetSound()
	if getSound == "error" {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error",
		})
	}

	var data map[string]interface{}
	err := json.Unmarshal([]byte(getSound), &data)
	if err != nil {
		panic(err)
	}

	fmt.Println("data:", data["sound"])

	// fmt.Println("getsound:", getSound)
	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    data["sound"],
	})
}

func UploadSoundVioce(ec echo.Context) error {
	voiceEffect, err := ec.FormFile("voice")
	fmt.Println("UploadSoundVioce:", voiceEffect)
	if err != nil {
		fmt.Println("error reiceve voice", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error reiceve voice",
		})
	}

	// split file name
	stringFileName := strings.Split(voiceEffect.Filename, ".")
	fmt.Println("string name", stringFileName[len(stringFileName)-1])

	// check extension file name
	typeFile := stringFileName[len(stringFileName)-1]
	if typeFile != "mp3" && typeFile != "MP3" {
		fmt.Println("file not supported")
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "file not supported",
		})
	}

	// open file name start
	src, err := voiceEffect.Open()
	if err != nil {
		fmt.Println("error open voice", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error open voice",
		})
	}
	defer src.Close()
	pathImageSaved := "./IoT/audio/voice_file.mp3"

	dst, err := os.Create(pathImageSaved)
	if err != nil {
		fmt.Println("error create voice", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error create voice",
		})
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		fmt.Println("error copy voice", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error copy voice",
		})
	}

	// open file name end

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateSoundVoice := faceDB.Database("iHomeWhiz").Collection("setting")

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
		{"sound.voice_file", pathImageSaved},
	},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateSoundVoice.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("error update voice file setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update voice file setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UploadSoundEffect(ec echo.Context) error {
	voiceEffect, err := ec.FormFile("voice_effect")
	fmt.Println("voiceEffect:", voiceEffect)
	if err != nil {
		fmt.Println("error reiceve voice effect", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error reiceve voice effect",
		})
	}

	// split file name
	stringFileName := strings.Split(voiceEffect.Filename, ".")
	fmt.Println("string name", stringFileName[len(stringFileName)-1])

	// check extension file name
	typeFile := stringFileName[len(stringFileName)-1]
	if typeFile != "mp3" && typeFile != "MP3" {
		fmt.Println("file not supported")
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "file not supported",
		})
	}

	// open file name start
	src, err := voiceEffect.Open()
	if err != nil {
		fmt.Println("error open voice effect", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error open voice effect",
		})
	}
	defer src.Close()
	pathImageSaved := "./IoT/audio/voice_effect.mp3"

	dst, err := os.Create(pathImageSaved)
	if err != nil {
		fmt.Println("error create voice effect", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error create voice effect",
		})
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		fmt.Println("error copy voice effect", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error copy voice effect",
		})
	}

	// open file name end

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateSoundEffect := faceDB.Database("iHomeWhiz").Collection("setting")

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
		{"sound.sound_effect_file", pathImageSaved},
	},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateSoundEffect.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("error update voice effect file setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update voice effect file setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateVoiceFeedBack(ec echo.Context) error {
	voiceFeedBack := ec.FormValue("voice_feedback")
	fmt.Println("voiceFeedBack:", voiceFeedBack)

	if voiceFeedBack == "" {
		fmt.Println("voice feed back is empty", voiceFeedBack)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "voice feed back is empty",
		})
	}

	statusConvVoice, err := strconv.ParseBool(voiceFeedBack)
	if err != nil {
		fmt.Println("voice feed back:", voiceFeedBack)
		fmt.Println("voice feed back, error convert to boolean", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "voice feed back, error convert to boolean",
		})
	}

	docID := "5f17d85ae63687833bd0b4ec"
	objID, err := primitive.ObjectIDFromHex(docID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateVoiceFeedBack := faceDB.Database("iHomeWhiz").Collection("setting")

	update := bson.M{"$set": bson.D{
		{"sound.voice_feedback", statusConvVoice},
	},
	}

	filter := bson.M{"_id": objID}
	_, err = colUpdateVoiceFeedBack.UpdateMany(
		context.Background(),
		filter,
		update,
	)

	if err != nil {
		fmt.Println("error update voice feed back setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update voice feed back setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func SelectStatusVoice(ec echo.Context) error {
	fmt.Println("select sound setting")
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectStatusSound := faceDB.Database("iHomeWhiz").Collection("setting")

	dataStatusSound := bson.A{
		bson.M{
			"$addFields": bson.M{
				"statusSound": "$sound.voice_feedback",
			},
		},
		bson.M{
			"$project": bson.M{
				"statusSound": 1,
				"_id":         0,
			},
		},
	}

	cur, err := colSelectStatusSound.Aggregate(context.Background(), dataStatusSound)

	if err != nil {
		fmt.Println("error select sound setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select sound setting",
		})
	}

	if err := cur.All(context.TODO(), &data); err != nil {
		fmt.Println("error select sound setting", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select sound setting",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    data,
	})
}

func Dock(_echo *echo.Group) {
	_echo.POST("/uploadSoundVioce", UploadSoundVioce)
	_echo.POST("/uploadSoundEffect", UploadSoundEffect)
	_echo.POST("/updateVoiceFeedBack", UpdateVoiceFeedBack)
	_echo.GET("/selectStatusVoice", SelectStatusVoice)
	_echo.GET("/getSound", GetSound)
	_echo.POST("/setSound", SetSound)
}
