package auth

import(
    "github.com/dgrijalva/jwt-go"
)

type JwtClaim struct{
    IDx string `json:"id"`
    DeviceName string `json:"devicename"`
    Lang string `json:language`
    jwt.StandardClaims
}
