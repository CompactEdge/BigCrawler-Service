package service

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/compactedge/cewizontech/ce-broker/pkg/db"
	"github.com/compactedge/cewizontech/ce-broker/pkg/mq"
	"github.com/compactedge/cewizontech/ce-broker/pkg/util"

	"github.com/labstack/gommon/log"

	"github.com/labstack/echo/v4"
	"github.com/spf13/viper"
)

// ToVimDriver ...
func ToVimDriver(ctx echo.Context) (int, string) {
	log.Info("=================== ToVimDriver Strat ===================")

	requestURI := ctx.Request().RequestURI[len("/api/v1/vim"):] // remove the "/api/v1/vim"
	// uriString := request.URL.Path[4:] // remove the "/vim"
	log.Info("requestURI :", requestURI)
	// TODO: modify uri format
	redirectURI := fmt.Sprintf("http://%s:%s/api/v1%s", viper.GetString("vim.server.ip"), viper.GetString("vim.server.port"), requestURI)
	log.Info("redirectURI :", redirectURI)

	if viper.GetBool("broker.UseRedirectURL") == true {
		// 1. Redirect to ce-vim api
		log.Info("Redirect to ", redirectURI)
		http.Redirect(ctx.Response().Writer, ctx.Request(), redirectURI, http.StatusPermanentRedirect)
		return 0, ""
	} else if viper.GetBool("enable.rabbitmq") == true {
		// 2. Send to MessageQueue
		log.Info("Send to MessageQueue")
		// TODO: Markup -> JSON
		uri := fmt.Sprintf("%s%s%s%s%s%s%s", util.TagRequest, util.TagMethodStart, ctx.Request().Method, util.TagMethodEnd, util.TagURIStart, requestURI, util.TagURIEnd)
		var msg strings.Builder
		msg.WriteString(uri)

		// yamlData, err := util.ParseFileDataToString(ctx.Request())
		// if err == nil && len(yamlData) > 0 {
		// 	log.Info(yamlData)
		// 	var file strings.Builder
		// 	file.WriteString(util.TagFileDataStart)
		// 	file.WriteString(yamlData)
		// 	file.WriteString(util.TagFileDataEnd)
		// 	msg.WriteString(file.String())
		// } else {
		// 	log.Info("FileData not exist")
		// }

		keys := ctx.ParamNames()
		values := ctx.QueryParams()
		if len(keys) > 0 {
			var body strings.Builder
			body.WriteString(util.TagBodyStart + "{")

			var bodyData strings.Builder
			for _, k := range keys {
				bodyData.WriteString("\"" + k + "\":\"" + values.Get(k) + "\", ")
			}

			bodyStr := strings.TrimRight(bodyData.String(), ", ")
			body.WriteString(bodyStr)
			body.WriteString("}" + util.TagBodyEnd)
			msg.WriteString(body.String())
		}
		log.Info(msg.String())

		// Ex : <Request><Method>GET</Method><URI>/listNamespaceAll</URI><FileData>...</FileData><Body>{"name":"test"}</Body>
		var response http.Response
		var result string
		var sendResult bool
		if viper.GetBool("enable.resourceManager") == true {
			sendResult = mq.SendMessageToRscManager(msg.String())
		} else {
			sendResult = mq.SendMessageToVimDriver(msg.String())
		}

		if sendResult == true {
			log.Info("Send Success to VIM MessageQueue : " + msg.String())
			response.StatusCode = http.StatusOK
			result = "Send Success to MessageQueue (CE-VIM)"
		} else {
			log.Info("Send Fail to VIM MessageQueue (Disconnected MQ).")
			response.StatusCode = http.StatusInternalServerError
			result = "Send Fail to MessageQueue (CE-VIM)"
		}
		log.Info("result :", result)
		// util.HTTPResponse(ctx.Response().Writer, &response, result, nil)
		// return statusCode, bodyString

		// 2-2. Send to CE-VIM
		yamlData, err := util.ParseFileDataToString(ctx.Request())
		if err == nil {
			log.Info("[parsing yaml data]\n", yamlData)
		}
		return 0, ""
	} else {
		// 3. New request to ce-vim api
		log.Info("New request to ce-vim api")
		statusCode, bodyString := util.RequestAPI(ctx.Response().Writer, ctx.Request(), redirectURI)
		// redirectURI에서 에러가 날 경우 JSON 형식이 중첩되는 오류
		// Ex) {"status": "Failure", "reason": "Internal Server Error", "code": 500}{"statusCode":200,"message":"ToVimDriver"}
		// - 전자의 500은 redirectURI에서 난 에러, 후자의 200은 broker에서 반환
		// echo: http: superfluous response.WriteHeader call from github.com/labstack/echo/v4.(*Response).WriteHeader (response.go:63)

		log.Info("bodyString 1 :", bodyString)
		if http.StatusOK <= statusCode && statusCode <= http.StatusAccepted {
			uriString := requestURI
			codeData := fmt.Sprintf("%s%d%s", util.TagStatusCodeStart, statusCode, util.TagStatusCodeEnd)
			methodData := fmt.Sprintf("%s%s%s", util.TagMethodStart, ctx.Request().Method, util.TagMethodEnd)
			uriData := fmt.Sprintf("%s%s%s", util.TagURIStart, uriString, util.TagURIEnd)
			resData := fmt.Sprintf("%s%s%s", util.TagResDataStart, bodyString, util.TagResDataEnd)

			responseData := fmt.Sprintf("%s%s%s%s%s", util.TagResponse, codeData, methodData, uriData, resData)
			// log.Printf("%s", responseData)
			db.ParseMsgData(responseData)
			// bodyString = ""
		}
		log.Info("bodyString 2 :", bodyString)
		log.Info("=================== ToVimDriver End ===================")
		return statusCode, bodyString
	}
}

// AlertManager ...
// func AlertManager(ctx echo.Context) error {
// 	log.Info("=================== AlertManager Strat ===================")

// 	paramToken := ctx.ParamValues()
// 	log.Infof("log token : %p\n", paramToken)
// 	// log.Infof("log token : %s\n", paramToken)
// 	if strings.Compare(viper.GetString("broker.webhook.token"), paramToken[0]) != 0 {
// 		log.Info("=================== AlertManager End (Unauthorized) ===================")
// 		return ctx.JSON(http.StatusUnauthorized, "401 Unauthorized")
// 	}

// 	data := model.AlertData{}
// 	if err := json.NewDecoder(ctx.Request().Body).Decode(&data); err != nil {
// 		log.Info("=================== AlertManager End (Bad Request)===================")
// 		return ctx.JSON(http.StatusBadRequest, "400 Bad Request")
// 	}

// 	for _, alert := range data.Alerts {
// 		log.Infof("Alert: Status:%s, Alertname:%s, Message=%s", alert.Status, alert.Labels.Alertname, alert.Annotations.Message)
// 		db.SetAlertMsgDB(alert)
// 	}

// 	log.Info("=================== AlertManager End ===================")
// 	return ctx.JSON(http.StatusOK, "200 OK")
// }
