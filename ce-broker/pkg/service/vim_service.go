package service

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/compactedge/cewizontech/ce-broker/pkg/mq"
	"github.com/compactedge/cewizontech/ce-broker/pkg/util"

	"github.com/labstack/gommon/log"

	"github.com/labstack/echo/v4"
	"github.com/spf13/viper"
)

type bodyData struct {
	Method string `json:"method"`
	Host   string `json:"host"`
	Body   string `json:"body"`
}

// SendToVim ...
func SendToVim(ctx echo.Context) (int, string) {
	// requestURI := request.URL.Path[4:] // remove the "/vim"
	requestURI := ctx.Request().RequestURI[len("/api/v1/vim"):] // remove the "/api/v1/vim"
	log.Debug("requestURI :", requestURI)
	// TODO: modify uri format
	rewriteURI := fmt.Sprintf("http://%s:%s/api/v1%s", viper.GetString("vim.server.ip"), viper.GetString("vim.server.port"), requestURI)
	log.Debug("rewriteURI :", rewriteURI)

	// 1. Redirect to vim api
	if viper.GetBool("broker.UseRedirectURL") == true {
		log.Infof("Redirect to %s", rewriteURI)
		http.Redirect(ctx.Response().Writer, ctx.Request(), rewriteURI, http.StatusPermanentRedirect)
		return http.StatusPermanentRedirect, ""
	}

	// 2. Send to MessageQueue
	if viper.GetBool("enable.rabbitmq") == true {
		log.Info("Send to MessageQueue")
		
		// Create a message in JSON format
		var msg strings.Builder
		var bodyBytes []byte
		if ctx.Request().Body != nil {
			bodyBytes, _ = ioutil.ReadAll(ctx.Request().Body)
		}
		body := new(bodyData)
		body.Method = ctx.Request().Method
		body.Host = rewriteURI
		body.Body = string(bodyBytes)
		jsonData, err := json.Marshal(body)
		if err != nil {
			return http.StatusInternalServerError, err.Error()
		}
		msg.Write(jsonData)

		// Send the message
		err = mq.SendMessage(msg.String(), ctx.Request().Header.Get("Content-Type"))
		if err != nil {
			return http.StatusInternalServerError, err.Error()
		}
		return http.StatusOK, ""
	}

	// 3. New request to ce-vim api
	log.Infof("New request to %s", rewriteURI)
	statusCode, bodyString := util.RequestAPI(ctx.Response().Writer, ctx.Request(), rewriteURI)
	log.Debugf("bodyString 2 :\n%d\n%s\n", statusCode, bodyString)
	return statusCode, bodyString
}
