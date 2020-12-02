package util

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/labstack/gommon/log"
)

// BodyData ...
type BodyData struct {
	Method string `json:"method"`
	Host   string `json:"host"`
	Body   string `json:"body"`
}

// RequestAPI ...
func RequestAPI(data *BodyData) (int, interface{}) {
	log.Info("Request to: ", data.Host)

	req, err := http.NewRequest(data.Method, data.Host, bytes.NewReader([]byte(data.Body)))
	if err != nil {
		log.Error(err)
		return http.StatusInternalServerError, err
	}
	client := http.Client{}
	res, err := client.Do(req)
	if err != nil {
		log.Error(err)
		return http.StatusInternalServerError, err
	}
	defer res.Body.Close()

	var resJSON map[string]interface{}
	err = json.NewDecoder(res.Body).Decode(&resJSON)
	if err != nil {
		log.Error(err)
		return http.StatusInternalServerError, err
	}
	log.Debug(resJSON)
	return http.StatusOK, resJSON
}
