package memberSetting

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
)

func RemoveMemberGroup(ec echo.Context) error {
	id := ec.FormValue("id")
	if id == "" {
		fmt.Println("id is empty")
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "id is empty",
		})
	}

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colRemoveMemberGroup := faceDB.Database("iHomeWhiz").Collection("member_setting")

	filter := bson.D{{"_id", objID}}
	_, err = colRemoveMemberGroup.DeleteOne(context.Background(), filter)

	if err != nil {
		fmt.Println("error remove member group", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error remove member group",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateMemberGroup(ec echo.Context) error {
	idx := ec.FormValue("id")
	if idx == "" {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "id is empty",
		})
	}
	memberGroupName := ec.FormValue("group_name")
	if memberGroupName == "" {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "group name is empty",
		})
	}

	objID, err := primitive.ObjectIDFromHex(idx)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateMemberGroup := faceDB.Database("iHomeWhiz").Collection("member_setting")

	updateMemberGroup := bson.M{"$set": bson.D{
		{"group_name", memberGroupName},
	}}

	filter := bson.M{"_id": objID}
	_, err = colUpdateMemberGroup.UpdateMany(
		context.Background(),
		filter,
		updateMemberGroup,
	)

	if err != nil {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update member group",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})

}

func AddMemberGroup(ec echo.Context) error {
	groupname := ec.FormValue("group_name")
	if groupname == "" {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "group name is empty",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colAddMemberGroup := faceDB.Database("iHomeWhiz").Collection("member_setting")

	insertGroupName := bson.M{
		"group_name":   groupname,
		"sms_report":   true,
		"email_report": true,
	}

	_, err := colAddMemberGroup.InsertOne(context.Background(), insertGroupName)
	if err != nil {
		fmt.Println("error add group name: ", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error add group name",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})

}

func GetMemberGroup(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectMemberGroup := faceDB.Database("iHomeWhiz").Collection("member_setting")

	dataPipline := bson.A{
		bson.M{
			"$addFields": bson.M{
				"group": "$group_name",
			},
		},
		bson.M{
			"$project": bson.M{
				"group": 1,
			},
		},
	}

	cursor, err := colSelectMemberGroup.Aggregate(context.Background(), dataPipline)
	fmt.Println("cursor", cursor)
	if err != nil {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select member group1",
		})
	}

	if err := cursor.All(context.TODO(), &data); err != nil {
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select member group2",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    data,
	})
}

func FindMemberByID(ec echo.Context) error {
	groupID := ec.FormValue("group_id")
	fmt.Println("data from user:", groupID)
	fmt.Println("groupID:", groupID)
	if groupID == "" {
		fmt.Println("group id is empty:", groupID)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "group id is empty",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectMemberByGroup := faceDB.Database("iHomeWhiz").Collection("member")

	var data []bson.M

	objID, err := primitive.ObjectIDFromHex(groupID)
	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	// fmt.Println("objID:", objID)

	dataPipline := bson.A{
		bson.M{
			"$addFields": bson.M{
				"user_id":   "$info.user_id",
				"nickname":  "$info.nick_name",
				"firstname": "$info.first_name",
				"lastname":  "$info.last_name",
				"role":      "$info.role",
			},
		},
		bson.M{
			"$project": bson.M{
				"_id":       0,
				"user_id":   1,
				"nickname":  1,
				"firstname": 1,
				"lastname":  1,
				"role":      1,
			},
		},
		bson.M{
			"$lookup": bson.M{
				"from":         "member_setting",
				"localField":   "role",
				"foreignField": "_id",
				"as":           "mm",
			},
		},
		bson.M{
			"$match": bson.M{
				"role": objID,
			},
		},
	}

	cursor, err := colSelectMemberByGroup.Aggregate(context.Background(), dataPipline)
	if err != nil {
		fmt.Println("error select member by id1", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select member by id1",
		})
	}

	if err := cursor.All(context.TODO(), &data); err != nil {
		fmt.Println("error select member by id2", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select member by id2",
		})
	}

	fmt.Println("findMemberByID method")
	fmt.Println("data from mongodb:", data)

	return ec.JSON(http.StatusOK, echo.Map{
		"msg":    data,
		"status": true,
	})

}

func Dock(_echo *echo.Group) {
	_echo.POST("/findMemberByID", FindMemberByID)
	_echo.GET("/getMemberGroup", GetMemberGroup)
	_echo.POST("/addMemberGroup", AddMemberGroup)
	_echo.POST("/updateMemberGroup", UpdateMemberGroup)
	_echo.POST("/removeMemberGroup", RemoveMemberGroup)
}
