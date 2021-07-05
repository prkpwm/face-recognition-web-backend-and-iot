package member

import (
	// system libs
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo"
	"go.mongodb.org/mongo-driver/bson"

	// libs own
	"backend/keys"
	"backend/libs"
)

// example received data to update mongodb, [1,2,3,4], update multi user_id
func RemovePersonMulti(ec echo.Context) error {
	listValueRemove := ec.FormValue("multi_value_remove")
	if listValueRemove == "" {
		fmt.Println("Value remove is empty:", listValueRemove)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "value is empty",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateStatusRemove := faceDB.Database("iHomeWhiz").Collection("member")

	updateRemoveMember := bson.M{
		"$set": bson.D{
			{"activated", false},
		},
	}

	var ints []int
	err := json.Unmarshal([]byte(listValueRemove), &ints)
	if err != nil {
		fmt.Println("[remove multi user] error parse from recieved data:", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error parse",
		})
	}

	fmt.Println("ints:", ints)

	for _, element := range ints {
		fmt.Println(element)

		// 	// 	// cout += int(element)
		filter1 := bson.M{"info.user_id": strconv.Itoa(element)}
		fmt.Println("string aio:", strconv.Itoa(element))
		_, err := colUpdateStatusRemove.UpdateMany(
			context.Background(),
			filter1,
			updateRemoveMember,
		)

		if err != nil {
			fmt.Println("error update user_id:", strconv.Itoa(element))
			fmt.Println("error update member list: ", err)
			return ec.JSON(http.StatusOK, echo.Map{
				"status": false,
				"msg":    "[remove multi user] error update member",
			})
		}

	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

// change member setting
// example received data to update mongodb, Uid_move = [1,2,3,4],var2Move = 5f6c07a66952180fe5850d64 , update multi user_id
func MoveRoleMultiPerson(ec echo.Context) error {
	listUidMove := ec.FormValue("Uid_move")
	var2MoveObjId := ec.FormValue("var2Move")

	fmt.Println(len(listUidMove))
	fmt.Println("Value move Multi is:", listUidMove)
	if listUidMove == "" {
		fmt.Println("list uid move is empty:", listUidMove)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "[move multi] value is empty",
		})
	}

	if var2MoveObjId == "" {
		fmt.Println("value to move is empty:", var2MoveObjId)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "[move multi] value is empty",
		})
	}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateStatusMove := faceDB.Database("iHomeWhiz").Collection("member")

	objID, err := primitive.ObjectIDFromHex(var2MoveObjId)

	if err != nil {
		fmt.Println("ObjectIDFromHex Error", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "OjectIDFromHex Error",
		})
	}

	updatemoveMember := bson.M{
		"$set": bson.D{
			{"info.role", objID},
		},
	}

	var ints []int
	err = json.Unmarshal([]byte(listUidMove), &ints)
	if err != nil {
		fmt.Println("[remove multi user] error parse from recieved data:", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error parse",
		})
	}

	fmt.Println("ints:", ints)

	for _, element := range ints {
		fmt.Println(element)

		// cout += int(element)
		filter1 := bson.M{"info.user_id": strconv.Itoa(element)}
		fmt.Println("string aio:", strconv.Itoa(element))
		_, err := colUpdateStatusMove.UpdateMany(
			context.Background(),
			filter1,
			updatemoveMember,
		)

		if err != nil {
			fmt.Println("error update user_id:", strconv.Itoa(element))
			fmt.Println("error update member list: ", err)
			return ec.JSON(http.StatusOK, echo.Map{
				"status": false,
				"msg":    "[remove multi user] error update member",
			})
		}

	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func UpdateMemberlist(ec echo.Context) error {
	userID := ec.FormValue("user_id")
	nickname := ec.FormValue("nickname")
	gender := ec.FormValue("gender")
	firstname := ec.FormValue("firstname")
	lastname := ec.FormValue("lastname")
	role := ec.FormValue("role")
	email := ec.FormValue("email")
	phone := ec.FormValue("phone")
	line := ec.FormValue("line")

	if userID == "" {
		fmt.Println("userID is empty: ", userID)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "id is empty",
		})
	}
	if nickname == "" {
		fmt.Println("nickname is empty: ", nickname)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "nickname is empty",
		})
	}
	if gender == "" {
		fmt.Println("gender is empty", gender)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "gender is empty",
		})
	}
	if firstname == "" {
		fmt.Println("firstname is empty", firstname)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "firstname is empty",
		})
	}
	if lastname == "" {
		fmt.Println("lastname is empty", lastname)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "lastname is empty",
		})
	}
	if role == "" {
		fmt.Println("role is empty", role)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "role is empty",
		})
	}
	if email == "" {
		fmt.Println("email is empty", email)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "email is empty",
		})
	}
	if phone == "" {
		fmt.Println("phone is empty", phone)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "phone is empty",
		})
	}
	if line == "" {
		fmt.Println("line is empty", line)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "line is empty",
		})
	}

	updateMember := bson.M{"$set": bson.D{
		{"info.nick_name", nickname},
		{"info.gender", gender},
		{"info.first_name", firstname},
		{"info.last_name", lastname},
		{"info.role", role},
		{"info.email", email},
		{"info.phone", phone},
		{"info.line", line},
	}}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colUpdateMemberGroup := faceDB.Database("iHomeWhiz").Collection("member")

	filter := bson.M{"info.user_id": userID}

	_, err := colUpdateMemberGroup.UpdateMany(
		context.Background(),
		filter,
		updateMember,
	)

	if err != nil {
		fmt.Println("error update member list: ", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error update member list",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})

}

func SelectMemberlist(ec echo.Context) error {
	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectMemberlist := faceDB.Database("iHomeWhiz").Collection("member")
	dataSelectAllData := bson.A{
		bson.M{
			"$addFields": bson.M{
				"user_id":  "$info.user_id",
				"nickname": "$info.nick_name",
				"role":     "$info.role",
			},
		},
		bson.M{
			"$match": bson.M{
				"status": 1,
			},
		},
		bson.M{
			"$project": bson.M{
				"user_id":  1,
				"nickname": 1,
				"role":     1,
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
	}

	// db.member.aggregate([
	// 	{
	// 	  $lookup:
	// 		{
	// 		  from: "member_setting",
	// 		  localField: "info.role",
	// 		  foreignField: "_id",
	// 		  as: "inventory_docs"
	// 		}
	//    }
	//  ])

	cursor, err := colSelectMemberlist.Aggregate(context.Background(), dataSelectAllData)

	if err != nil {
		fmt.Println("error select member list data1", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select member list data1",
		})
	}

	if err := cursor.All(context.TODO(), &data); err != nil {
		fmt.Println("error select member list data2", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error select member list data2",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"msg":    data,
		"status": true,
	})
}
func RemoveMemberlist(ec echo.Context) error {
	index := ec.FormValue("id")
	if index == "" {
		fmt.Println("index is empty: ", index)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "index is empty",
		})
	}

	updateMember := bson.M{"$set": bson.D{
		{"status", 0},
	}}

	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colRemoveMemberlist := faceDB.Database("iHomeWhiz").Collection("member")

	filter := bson.M{"_id": index}

	_, err := colRemoveMemberlist.UpdateMany(
		context.Background(),
		filter,
		updateMember,
	)

	if err != nil {
		fmt.Println("error remove member list: ", err)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "error remove member list",
		})
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})

}

func SelectMemberByID(ec echo.Context) error {
	userID := ec.FormValue("user_id")
	fmt.Println("user id: ", userID)
	if userID == "" {
		fmt.Println("userID is empty: ", userID)
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "user id is empty",
		})
	}

	var data []bson.M
	faceDB := libs.MongoStart(keys.Face, "iHomeWhiz", "", true)
	colSelectMemberByID := faceDB.Database("iHomeWhiz").Collection("member")
	dataSelectMemberByID := bson.A{
		bson.M{
			"$addFields": bson.M{
				"user_id":   "$info.user_id",
				"nickname":  "$info.nick_name",
				"gender":    "$info.gender",
				"firstname": "$info.first_name",
				"lastname":  "$info.last_name",
				"role":      "$info.role",
				"email":     "$info.email",
				"phone":     "$info.phone",
				"line":      "$info.line",
			},
		},
		bson.M{
			"$project": bson.M{
				"user_id":   1,
				"nickname":  1,
				"gender":    1,
				"firstname": 1,
				"lastname":  1,
				"role":      1,
				"email":     1,
				"phone":     1,
				"line":      1,
			},
		},
		bson.M{
			"$match": bson.M{
				"user_id": userID,
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
	}

	cursor, err := colSelectMemberByID.Aggregate(context.Background(), dataSelectMemberByID)
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

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    data,
	})
}

func Dock(_echo *echo.Group) {
	_echo.GET("/selectMemberlist", SelectMemberlist)
	_echo.POST("/removeMemberlist", RemoveMemberlist)
	_echo.POST("/updateMemberlist", UpdateMemberlist)
	_echo.POST("/selectMemberByID", SelectMemberByID)

	// remove multi person
	_echo.POST("/removePersonMulti", RemovePersonMulti)
	// move role multi person
	_echo.POST("/moveRoleMultiPerson", MoveRoleMultiPerson)
}
