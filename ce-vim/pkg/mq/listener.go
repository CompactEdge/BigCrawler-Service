package mq

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"strings"

	"github.com/compactedge/cewizontech/ce-vim/pkg/util"
	"github.com/labstack/gommon/log"
)

// messageListenerVimDriver is member of messagequeue package
func messageListenerVimDriver() {
	// ------------------------------------------------------------------------
	// Queue : MEC-VIM
	// ------------------------------------------------------------------------

	rbmqConfig.repliesVim, rbmqConfig.rbmqErr = rbmqConfig.ch.Consume(
		util.EnvMap["rabbitmq.queue_vim"], // queue
		"consumer-vim",                       // Consumer tag
		true,                                 // auto-ack
		false,                                // exclusive
		false,                                // no-local
		false,                                // no-wait
		nil,                                  // args
	)

	if rbmqConfig.rbmqErr != nil {
		log.Error("Error consuming the Queue (rabbitmq.queue_vim)")
	}

	for msg := range rbmqConfig.repliesVim {
		parseReceivedMsg(string(msg.Body))
	}
}

func parseReceivedMsg(data string) {
	// Ex : <Request><System><Method>GET</Method><URI>/listNamespaceAll</URI><FileData>...</FileData><Body>{"name":"test"}</Body>
	log.Info("parseReceivedMsg -", data)

	if strings.HasPrefix(data, util.TagRequest) == false {
		log.Warn("parseReceivedMsg - Invalid data")
		if strings.Contains(data, util.TagSystem) == true {
			sendString := fmt.Sprintf("%s%sData invalid", util.TagResponse, util.TagSystem)
			SendMessageToBroker(sendString)
		} else {
			sendString := fmt.Sprintf("%sData invalid", util.TagResponse)
			SendMessageToBroker(sendString)
		}
		return
	}

	////////////////////////////////////////////////////////////////////
	// Check the System
	////////////////////////////////////////////////////////////////////
	var fromSystem bool

	if strings.Contains(data, util.TagSystem) == true {
		fromSystem = true
	} else {
		fromSystem = false
	}

	////////////////////////////////////////////////////////////////////
	// Split to Method
	////////////////////////////////////////////////////////////////////
	beginIndex := strings.Index(data, util.TagMethodStart)
	endIndex := strings.Index(data, util.TagMethodEnd)
	methodString := data[(beginIndex + util.TagMethodLen):endIndex]

	if len(methodString) < 3 {
		log.Warn("parseReceivedMsg - Invalid data type(Method invalid)")
		if fromSystem == true {
			sendString := fmt.Sprintf("%s%sMethod invalid", util.TagResponse, util.TagSystem)
			SendMessageToBroker(sendString)
		} else {
			sendString := fmt.Sprintf("%sMethod invalid", util.TagResponse)
			SendMessageToBroker(sendString)
		}
		return
	}

	////////////////////////////////////////////////////////////////////
	// Split to URI
	////////////////////////////////////////////////////////////////////
	beginIndex = strings.Index(data, util.TagURIStart)
	endIndex = strings.Index(data, util.TagURIEnd)
	uriString := data[(beginIndex + util.TagURILen):endIndex]

	if len(uriString) < 3 {
		log.Warn("parseReceivedMsg - Invalid data type(URI invalid)")
		if fromSystem == true {
			sendString := fmt.Sprintf("%s%sURI invalid", util.TagResponse, util.TagSystem)
			SendMessageToBroker(sendString)
		} else {
			sendString := fmt.Sprintf("%sURI invalid", util.TagResponse)
			SendMessageToBroker(sendString)
		}
		return
	}

	if Iscontrollerapi(methodString, uriString) == true {
		log.Info("Request : ", methodString, uriString)

		////////////////////////////////////////////////////////////////////
		// Split to FileData
		////////////////////////////////////////////////////////////////////
		var fileDataString string

		if strings.Contains(data, util.TagFileDataStart) == true {
			beginIndex = strings.Index(data, util.TagFileDataStart)
			endIndex = strings.Index(data, util.TagFileDataEnd)
			fileDataString = data[(beginIndex + util.TagFileDataLen):endIndex]
			log.Info("parseReceivedMsg - FileData : ", fileDataString)
		}

		////////////////////////////////////////////////////////////////////
		// Split to Body
		////////////////////////////////////////////////////////////////////
		var bodyString, bodyNamespace, bodyName string

		if strings.Contains(data, util.TagBodyStart) == true {
			beginIndex = strings.Index(data, util.TagBodyStart)
			endIndex = strings.Index(data, util.TagBodyEnd)
			bodyString = data[(beginIndex + util.TagBodyLen):endIndex]
			log.Info("parseReceivedMsg - Body : ", bodyString)

			var bodyData BodyData
			errUnmarshal := json.Unmarshal([]byte(bodyString), &bodyData)

			if errUnmarshal == nil {
				bodyNamespace = bodyData.Namespace
				bodyName = bodyData.Name
			}
		}
		reqBody := bytes.NewBufferString(bodyString)

		client := &http.Client{}
		/* Must Check url */

		url := fmt.Sprintf("http://localhost:%s%s", util.EnvMap["vim.server.port"], uriString)

		var req *http.Request
		var reqErr error

		if len(fileDataString) > 0 {
			fileContents := []byte(fileDataString)
			body := new(bytes.Buffer)
			writer := multipart.NewWriter(body)
			part, err := writer.CreateFormFile("file", "test.yaml")
			if err != nil {
				return
			}

			_, _ = part.Write(fileContents)

			params := make(map[string]string)
			err = json.Unmarshal([]byte(bodyString), &params)
			if err == nil {
				for key, val := range params {
					_ = writer.WriteField(key, val)
				}
			}
			err = writer.Close()
			if err != nil {
				return
			}

			req, reqErr = http.NewRequest(methodString, url, body)
			if reqErr == nil {
				req.Header.Set("Content-Type", writer.FormDataContentType())
			}
		} else {
			log.Infof("method is %s, url is %s, body id %s", methodString, url, reqBody)
			req, reqErr = http.NewRequest(methodString, url, reqBody)
			if reqErr == nil {
				req.Header.Add("Content-Type", "application/json")
			}
		}

		if reqErr != nil {
			return
		}

		resp, errClient := client.Do(req)

		if errClient != nil || resp == nil {
			return
		}

		defer resp.Body.Close()

		if isOkResponse(resp.StatusCode) == false {
			var responseData string
			codeData := fmt.Sprintf("%s%d%s", util.TagStatusCodeStart, resp.StatusCode, util.TagStatusCodeEnd)
			methodData := fmt.Sprintf("%s%s%s", util.TagMethodStart, methodString, util.TagMethodEnd)
			uriData := fmt.Sprintf("%s%s%s", util.TagURIStart, uriString, util.TagURIEnd)
			resData := fmt.Sprintf("%s%s%s", util.TagResDataStart, resp.Status, util.TagResDataEnd)

			if fromSystem == true {
				responseData = fmt.Sprintf("%s%s%s%s%s%s", util.TagResponse, codeData, util.TagSystem, methodData, uriData, resData)
			} else {
				responseData = fmt.Sprintf("%s%s%s%s%s", util.TagResponse, codeData, methodData, uriData, resData)
			}
			SendMessageToBroker(responseData)
			return
		}

		resBody, errRead := ioutil.ReadAll(resp.Body)
		// Ex : <Response><StatusCode>200</StatusCode><System><Method>GET</Method><URI>/listNamespaceAll</URI><RespData>...</RespData>
		if errRead != nil {
			var responseData string
			codeData := fmt.Sprintf("%s%d%s", util.TagStatusCodeStart, 500, util.TagStatusCodeEnd)

			if fromSystem == true {
				responseData = fmt.Sprintf("%s%s%s{\"status\":500, \"error\":\"Internal Server Error\", \"message\":\"Service Unavailable. Please try after sometime.\"}", util.TagResponse, codeData, util.TagSystem)
			} else {
				responseData = fmt.Sprintf("%s%s{\"status\":500, \"error\":\"Internal Server Error\", \"message\":\"Service Unavailable. Please try after sometime.\"}", util.TagResponse, codeData)
			}
			SendMessageToBroker(responseData)
		} else {
			var responseData, namespaceData, nameData string
			codeData := fmt.Sprintf("%s%d%s", util.TagStatusCodeStart, resp.StatusCode, util.TagStatusCodeEnd)
			methodData := fmt.Sprintf("%s%s%s", util.TagMethodStart, methodString, util.TagMethodEnd)
			uriData := fmt.Sprintf("%s%s%s", util.TagURIStart, uriString, util.TagURIEnd)
			resData := fmt.Sprintf("%s%s%s", util.TagResDataStart, string(resBody), util.TagResDataEnd)

			if len(bodyNamespace) > 0 {
				namespaceData = fmt.Sprintf("%s%s%s", util.TagNamespaceStart, bodyNamespace, util.TagNamespaceEnd)
			}

			if len(bodyName) > 0 {
				nameData = fmt.Sprintf("%s%s%s", util.TagNameStart, bodyName, util.TagNameEnd)
			}

			if fromSystem == true {
				responseData = fmt.Sprintf("%s%s%s%s%s%s%s%s", util.TagResponse, codeData, util.TagSystem, methodData, uriData, namespaceData, nameData, resData)
			} else {
				responseData = fmt.Sprintf("%s%s%s%s%s%s%s", util.TagResponse, codeData, methodData, uriData, namespaceData, nameData, resData)
			}
			SendMessageToBroker(responseData)
		}
	} else {
		if fromSystem == true {
			responseData := fmt.Sprintf("%s%s404%s%s404 page not found or 405 method not allowed", util.TagResponse, util.TagStatusCodeStart, util.TagStatusCodeEnd, util.TagSystem)
			SendMessageToBroker(responseData)
		} else {
			responseData := fmt.Sprintf("%s%s404%s404 page not found or 405 method not allowed", util.TagResponse, util.TagStatusCodeStart, util.TagStatusCodeEnd)
			SendMessageToBroker(responseData)
		}
	}

	if util.EnvMap["common.UseRscMgr"] == "true" {
		log.Info("Send to RSCMGR MessageQueue")
	} else {
		log.Info("Send to Broker MessageQueue")
	}
}

// Iscontrollerapi is member of messagequeue package
func Iscontrollerapi(method string, uri string) bool {
	requri := uri
	slashCount := strings.Count(uri, "/")
	if slashCount > 1 {
		secondIndex := strings.Index(uri[1:], "/") + 1
		requri = uri[:secondIndex]
	}

	// service package apilists append
	for _, api := range util.APILists {
		if strings.Compare(api.Method, method) == 0 && strings.Compare(api.URI, requri) == 0 {
			return true
		}
	}

	return false
}

// isOkResponse is member of messagequeue package
func isOkResponse(code int) bool {
	if http.StatusOK <= code && code <= http.StatusAccepted {
		return true
	}

	return false
}
