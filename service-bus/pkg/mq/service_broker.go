package mq

import (
	"encoding/json"
	"net/http"

	"github.com/compactedge/cewizontech/ce-service-bus/pkg/util"
	"github.com/labstack/gommon/log"
)

// BusClientAPI ...
// echo Listener: Host
// [echo.go]: echo.newListener() ->
// [dial.go]: net.Listen() -> (net.ListenConfig).Listen() -> (net.DefaultResolver).resolveAddrList()
// echo Router: Path
// [echo.go]: New() ->
// [router.go]: NewRouter(*Echo) -> Find(method, path, Context)
func k8sClientAPI(data []byte) (int, interface{}) {
	var bd util.BodyData
	err := json.Unmarshal(data, &bd)
	if err != nil {
		log.Error(err)
		return http.StatusInternalServerError, nil
	}
	log.Debugf("Received a message: %s", string(data))
	log.Debugf("%v", bd.Method)
	log.Debugf("%v", bd.Host)
	log.Debugf("%v", bd.Body)
	code, result := util.RequestAPI(&bd)
	if code < http.StatusOK && http.StatusMultipleChoices <= code {
		return code, result
	}
	return http.StatusOK, result
}
