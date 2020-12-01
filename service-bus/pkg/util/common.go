package util

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/scheme"
)

const (
	NamespaceString = "namespace"
	NameString      = "name"
)

// ParseBody ...
func ParseBody(ctx echo.Context) (runtime.Object, int, error) {
	if ctx == nil {
		return nil, 0, nil
	}
	// 1. Parameter
	// TODO
	namespace := ctx.Param("namespace")
	ctx.Logger().Debug(namespace)
	if namespace != "" {
		return nil, http.StatusOK, nil
	}
	// 2. Body
	var bodyBytes []byte
	if ctx.Request().Body != nil {
		bodyBytes, _ = ioutil.ReadAll(ctx.Request().Body)
	} else {
		return nil, http.StatusBadRequest, nil
	}
	body, err := deserializeObject(bodyBytes)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	return body, http.StatusOK, err
}

// ParseJSON ...
func ParseJSON(JSONData *BodyData) (obj runtime.Object, code int, err error) {
	var bodyBytes []byte
	if JSONData != nil {
		bodyBytes, err = json.Marshal(JSONData)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
	} else {
		return nil, http.StatusBadRequest, nil
	}
	body, err := deserializeObject(bodyBytes)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	return body, http.StatusOK, err
}

func deserializeObject(body []byte) (runtime.Object, error) {
	decode := scheme.Codecs.UniversalDeserializer().Decode
	obj, _, err := decode(body, nil, nil)
	if err != nil {
		log.Warn("%#v", err)
		return nil, err
	}
	// kind := obj.GetObjectKind()
	// logger.Debug("kind: ", kind)
	// logger.Debug("obj: ", obj.(*v1.Namespace))
	return obj, nil
}

// Namer ...
// https://github.com/kubernetes/apiserver/blob/release-1.19/pkg/endpoints/handlers/namer.go
func Namer(ctx echo.Context) (namespace, name string, err error) {
	names := ctx.ParamNames()
	params := make(map[string]string)
	for i := 0; i < len(names); i++ {
		params[names[i]] = ctx.Param(names[i])
	}
	return params["namespace"], params["name"], nil
}

// CheckNames ...
func CheckNames(ctx echo.Context, bodyNamespace, bodyName string) (namespace, name string) {
	namespace = ctx.Param(NamespaceString)
	name = ctx.Param(NameString)
	if namespace == "" {
		namespace = bodyNamespace
	}
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	if name == "" {
		name = bodyName
	}
	return namespace, name
}
