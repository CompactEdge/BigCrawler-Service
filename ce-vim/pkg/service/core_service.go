package service

import (
	"context"
	"net/http"

	"github.com/compactedge/cewizontech/ce-vim/pkg/client"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// CreateNamespace ...
func CreateNamespace(ctx echo.Context) error {
	log.Debug(">>>>>>>>>>>>>>>>>>> CreateNamespace <<<<<<<<<<<<<<<<<<<<")
	// TODO: ctx.Request().Body
	// json, yaml
	client.GetKubeClient().CoreV1().Namespaces().Create(context.TODO(), &v1.Namespace{}, metav1.CreateOptions{})
	return ctx.JSON(http.StatusOK, nil)
}

// ListNode ...
func ListNode(ctx echo.Context) error {
	log.Debug(">>>>>>>>>>>>>>>>>>> ListNode <<<<<<<<<<<<<<<<<<<<")
	list, err := client.GetKubeClient().CoreV1().Nodes().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}