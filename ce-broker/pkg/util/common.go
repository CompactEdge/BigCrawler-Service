package util

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/labstack/gommon/log"
)

// const is member of util package
const (
	TagRequest         = "<Request>"
	TagResponse        = "<Response>"
	TagStatusCodeStart = "<StatusCode>"
	TagStatusCodeEnd   = "</StatusCode>"
	TagStatusCodeLen   = len(TagStatusCodeStart)
	TagSystem          = "<System>"
	TagMethodStart     = "<Method>"
	TagMethodEnd       = "</Method>"
	TagMethodLen       = len(TagMethodStart)
	TagURIStart        = "<URI>"
	TagURIEnd          = "</URI>"
	TagURILen          = len(TagURIStart)
	TagFileDataStart   = "<FileData>"
	TagFileDataEnd     = "</FileData>"
	//TagFileDataLen     = len(TagFileDataStart)
	TagBodyStart = "<Body>"
	TagBodyEnd   = "</Body>"
	//TagBodyLen         = len(TagBodyStart)
	TagResDataStart   = "<ResData>"
	TagResDataEnd     = "</ResData>"
	TagResDataLen     = len(TagResDataStart)
	TagNamespaceStart = "<Namespace>"
	TagNamespaceEnd   = "</Namespace>"
	TagNamespaceLen   = len(TagNamespaceStart)
	TagNameStart      = "<Name>"
	TagNameEnd        = "</Name>"
	TagNameLen        = len(TagNameStart)
)

// RequestAPI ...
func RequestAPI(responseWriter http.ResponseWriter, request *http.Request, reqURL string) (int, string) {
	log.Info("Request to", reqURL)

	client := &http.Client{}

	newReq, err := http.NewRequest(request.Method, reqURL, request.Body)
	if err != nil {
		if responseWriter != nil {
			HTTPResponse(responseWriter, nil, nil, err)
		}
		return http.StatusInternalServerError, ""
	}
	newReq.Header = request.Header
	newReq.Form = request.Form
	newReq.Method = request.Method
	newReq.ContentLength = request.ContentLength

	resp, err := client.Do(newReq)
	if err != nil {
		if responseWriter != nil {
			HTTPResponse(responseWriter, nil, nil, err)
		}
		return http.StatusInternalServerError, ""
	} else if resp.Body == http.NoBody {
		if responseWriter != nil {
			HTTPResponseAbort(responseWriter, resp.StatusCode)
		}
		return resp.StatusCode, ""
	}

	defer resp.Body.Close()
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	log.Info("bodyBytes :", string(bodyBytes))
	if err != nil {
		if responseWriter != nil {
			HTTPResponse(responseWriter, nil, nil, err)
		}
		return resp.StatusCode, ""
	}

	var bodyString interface{}
	errUnmarshal := json.Unmarshal(bodyBytes, &bodyString)
	if errUnmarshal != nil {
		log.Info("Unmarshal Error")
		if responseWriter != nil {
			HTTPResponse(responseWriter, nil, nil, errUnmarshal)
		}
		return resp.StatusCode, string(bodyBytes)
	}

	if responseWriter != nil {
		HTTPResponse(responseWriter, resp, bodyString, err)
	}

	return resp.StatusCode, string(bodyBytes)
}

// HTTPResponse ...
func HTTPResponse(rw http.ResponseWriter, res *http.Response, result interface{}, err error) {
	rw.Header().Set("Content-Type", "application/json")

	var statusCode int
	if res != nil {
		statusCode = res.StatusCode
	} else {
		statusCode = http.StatusInternalServerError // 500
	}

	if err != nil {
		field := strings.SplitN(err.Error(), ",", 2)
		if len(field) < 2 {
			HTTPResponseAbort(rw, statusCode)
			return
		}

		beginIndex := strings.Index(field[1], ":")
		if beginIndex < 1 || !strings.Contains(field[1], "Body") {
			HTTPResponseAbort(rw, statusCode)
			return
		}

		bodyString := strings.SplitN(field[1], ":", 2)
		if len(bodyString[1]) < 3 {
			HTTPResponseAbort(rw, statusCode)
			return
		}

		bodyString[1] = strings.TrimLeft(bodyString[1], " ")

		rw.WriteHeader(statusCode)
		_, _ = rw.Write([]byte(bodyString[1]))
		return
	}

	content, err := json.Marshal(result)
	if err != nil {
		HTTPResponseAbort(rw, http.StatusNoContent)
		return
	}

	rw.WriteHeader(statusCode)
	_, _ = rw.Write(content)
}

// HTTPResponseAbort ...
func HTTPResponseAbort(rw http.ResponseWriter, statusCode int) {
	rw.WriteHeader(statusCode)

	reason := http.StatusText(statusCode)
	var content string
	if statusCode == http.StatusOK {
		content = fmt.Sprintf("{\"status\": \"%s\", \"code\": %d}", "OK", statusCode)
	} else {
		content = fmt.Sprintf("{\"status\": \"%s\", \"reason\": \"%s\", \"code\": %d}", "Failure", reason, statusCode)
	}
	_, _ = rw.Write([]byte(content))
}

// ParseFileDataToString ...
func ParseFileDataToString(request *http.Request) (string, error) {
	file, header, err := request.FormFile("file")
	if err == nil {
		log.Info("Parsing from ", header.Filename)

		var Buf bytes.Buffer
		_, _ = io.Copy(&Buf, file)
		defer file.Close()

		contentType := header.Header.Get("Content-Type")
		if strings.EqualFold(contentType, "text/yaml") == false {
			return "", nil
		}

		fileExt := filepath.Ext(header.Filename)
		if strings.EqualFold(fileExt, ".yaml") == false {
			return "", nil
		}
		return string(Buf.Bytes()), nil
	}
	return "", err
}

// RabbitMqError ...
func RabbitMqError(msg string, err error) {
	if err != nil {
		// log.Fatalf("%s: %s", msg, err)
		log.Warnf("%s: %s", msg, err)
	}
}
