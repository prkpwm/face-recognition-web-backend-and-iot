package auth

import(
    "github.com/dgrijalva/jwt-go"
)

type JwtClaim struct{
    Idx string `json:"id"`
    DeviceName string `json:"device_name"`
    Language string `json:"language"`
    jwt.StandardClaims
}
