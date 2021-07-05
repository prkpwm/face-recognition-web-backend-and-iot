package validation

import (
	"regexp"
)


func Email(email string) bool {

	_Result := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return _Result.MatchString(email)

}