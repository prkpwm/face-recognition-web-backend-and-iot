package registerFace

import (
	// system libs

	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/labstack/echo"
	//"github.com/labstack/echo/middleware"
	// libs own
)

//Httppost for send post to manage camera
func Httppost() bool {
	data := url.Values{
		"camera": {"register"},
	}

	resp, err := http.PostForm("192.168.0.100:2424/manage_camera", data)
	if err != nil {
		return false
	}

	var res map[string]interface{}

	json.NewDecoder(resp.Body).Decode(&res)

	if res["status"] == true {
		return true
	}

	return false
}

// RegisterFace receive
func RegisterFace(ec echo.Context) error {
	regisValue := ec.FormValue("register")
	if regisValue == "" {
		fmt.Println("regisValue is empty")
		return ec.JSON(http.StatusOK, echo.Map{
			"status": false,
			"msg":    "regisValue is empty",
		})
	}

	if regisValue == "register" {
		httppostStatus := Httppost()
		if httppostStatus == false {
			fmt.Println("error send post request")
			return ec.JSON(http.StatusOK, echo.Map{
				"status": false,
				"msg":    "error send post request",
			})
		}
	}

	return ec.JSON(http.StatusOK, echo.Map{
		"status": true,
		"msg":    "success",
	})
}

func Dock(_echo *echo.Group) {
	_echo.POST("/registerFace", RegisterFace)
}
