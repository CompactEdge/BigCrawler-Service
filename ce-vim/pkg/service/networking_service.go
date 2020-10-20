package service

import (
	"context"
	"net/http"

	"github.com/compactedge/cewizontech/ce-vim/pkg/client"
	"github.com/compactedge/cewizontech/ce-vim/pkg/util"
	"github.com/labstack/echo/v4"
	networkingv1 "k8s.io/api/networking/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// CreateNamespacedNetworkPolicies ...
func CreateNamespacedNetworkPolicies(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*networkingv1.NetworkPolicy).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().NetworkingV1().NetworkPolicies(namespace).Create(context.TODO(), body.(*networkingv1.NetworkPolicy), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}
