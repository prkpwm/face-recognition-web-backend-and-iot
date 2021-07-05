package bcrypt

import (
    //"reflect"
	//"fmt"
	//"crypto/sha256"
	//"encoding/hex"
	"golang.org/x/crypto/bcrypt"
	//"github.com/kyokomi/emoji"
	
)

func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

/*func HashSha256Password(password string) string{
    _hash := sha256.Sum256([]byte(password))
    encodeHex := hex.EncodeToString(_hash[:])
    return encodeHex
}*/
