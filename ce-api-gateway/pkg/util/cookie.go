package util

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// WriteCookie ...
func WriteCookie(ctx echo.Context, token string) {
	cookie := new(http.Cookie)
	cookie.Name = "token"
	cookie.Value = token
	ctx.SetCookie(cookie)
}

// ReadCookie ...
func ReadCookie(ctx echo.Context) *string {
	cookie, err := ctx.Cookie("token")
	if err != nil {
		ctx.Logger().Warn(err)
		return nil
	}
	return &cookie.Value
}

// ReadAllCookies ...
func ReadAllCookies(ctx echo.Context) {
	for _, cookie := range ctx.Cookies() {
		ctx.Logger().Debug("cookie.Name : ", cookie.Name)
		ctx.Logger().Debug("cookie.Value : ", cookie.Value)
	}
}
