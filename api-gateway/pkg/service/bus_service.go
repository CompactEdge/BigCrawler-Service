package service

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/compactedge/cewizontech/api-gateway/pkg/mq"
	"github.com/compactedge/cewizontech/api-gateway/pkg/util"

	"github.com/labstack/gommon/log"

	"github.com/labstack/echo/v4"
	"github.com/spf13/viper"
)

type busData struct {
	Method string `json:"method"`
	Host   string `json:"host"`
	Body   string `json:"body"`
}

// SendToBus ...
func SendToBus(ctx echo.Context) (int, interface{}) {
	// requestURI := request.URL.Path[4:] // remove the "/svc"
	requestURI := ctx.Request().RequestURI[len("/api/v1/svc"):] // remove the "/api/v1/svc"
	log.Debug("requestURI :", requestURI)
	// TODO: modify uri format
	rewriteURI := fmt.Sprintf("http://%s:%s/api/v1%s", viper.GetString("svcbus.server.ip"), viper.GetString("svcbus.server.port"), requestURI)
	// rewriteURI := fmt.Sprintf("/api/v1%s", requestURI)
	log.Debug("rewriteURI :", rewriteURI)

	// 1. Redirect to svc api
	if viper.GetBool("apigw.UseRedirectURL") == true {
		log.Debugf("Redirect to %s", rewriteURI)
		http.Redirect(ctx.Response().Writer, ctx.Request(), rewriteURI, http.StatusPermanentRedirect)
		return http.StatusPermanentRedirect, ""
	}

	// 2. Send to MessageQueue
	if viper.GetBool("enable.rabbitmq") == true {
		log.Debug("Send to MessageQueue")

		// Create a message in JSON format
		var msg strings.Builder
		var bodyBytes []byte
		if ctx.Request().Body != nil {
			bodyBytes, _ = ioutil.ReadAll(ctx.Request().Body)
		}
		bd := new(busData)
		bd.Method = ctx.Request().Method
		bd.Host = rewriteURI
		bd.Body = string(bodyBytes)
		bd.Body = strings.ReplaceAll(bd.Body, "\n", "")
		log.Debugf("bd.Body: %s\n", bd.Body)
		jsonData, err := json.Marshal(bd)
		if err != nil {
			return http.StatusInternalServerError, err.Error()
		}
		msg.Write(jsonData)

		// Send the message
		ret, err := mq.SendMessage(msg.String(), ctx.Request().Header.Get("Content-Type"))
		if err != nil {
			return http.StatusInternalServerError, err.Error()
		}
		// Empty interface w/o escape characters
		var m map[string]interface{}
		if err := json.Unmarshal(ret, &m); err != nil {
			log.Fatal(err)
		}
		log.Debug(m)
		return http.StatusOK, m
	}

	// 3. New request to Service Bus API
	log.Infof("New request to %s", rewriteURI)
	statusCode, bodyString := util.RequestAPI(ctx.Response().Writer, ctx.Request(), rewriteURI)
	log.Debugf("bodyString 2 :\n%d\n%s\n", statusCode, bodyString)
	return statusCode, bodyString
}
