package service

import (
	"net/http"
	"time"

	"github.com/compactedge/cewizontech/api-gateway/pkg/db"
	"github.com/compactedge/cewizontech/api-gateway/pkg/model"

	"github.com/labstack/gommon/log"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"github.com/spf13/viper"
)

// Login ...
func Login(ctx echo.Context) (err error) {
	request := new(model.RequestAuth)
	response := new(model.ResponseToken)
	var user *model.ResponseUser

	if err = ctx.Bind(request); err != nil {
		return
	}

	// Throws unauthorized error
	if user = db.Login(&request.Auth.Identity.User); user == nil {
		log.Info("Unauthorized")
		return echo.ErrUnauthorized
	}

	// Create token
	token := jwt.New(jwt.SigningMethodHS256)

	// Response Body (Claims)
	response.ExpiresAt = time.Now().Add(time.Hour * 24 * 7).Unix()
	response.IssuedAt = time.Now().Unix()
	response.User.ID = user.ID
	response.User.Username = user.Username
	claims := token.Claims.(jwt.MapClaims)
	claims["token"] = response

	// Generate encoded token and send it as response.
	secret := viper.GetString("jwt.secret")
	t, err := token.SignedString([]byte(secret))
	if err != nil {
		return err
	}

	// Set Header "X-Auth-Token"
	ctx.Response().Header().Set(echo.HeaderContentType, echo.MIMEApplicationJSONCharsetUTF8)
	ctx.Response().Header().Set("X-Auth-Token", t)
	return ctx.JSON(http.StatusOK, token)
}

func restricted(ctx echo.Context) error {
	user := ctx.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	username := claims["username"].(string)
	return ctx.String(http.StatusOK, "Welcome "+username+"!")
}
