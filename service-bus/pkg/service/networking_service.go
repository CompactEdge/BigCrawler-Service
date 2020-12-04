package service

import (
	"context"
	"net/http"

	"github.com/compactedge/cewizontech/service-bus/pkg/client"
	"github.com/compactedge/cewizontech/service-bus/pkg/util"
	"github.com/labstack/echo/v4"
	networkingv1 "k8s.io/api/networking/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// CreateNamespacedNetworkPolicies godoc
// @Summary 새로운 NetworkPolicy 생성
// @Description JSON 형식의 body와 함께 생성할 NetworkPolicy를 지정한다.
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param NetworkPolicy body string true "생성할 NetworkPolicy 매니페스트"
// @Router /networking/networkpolicies [post]
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

// CreateNamespacedIngresses godoc
// @Summary 새로운 Ingress 생성
// @Description JSON 형식의 body와 함께 생성할 Ingress를 지정한다.
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param Ingress body string true "생성할 Ingress 매니페스트"
// @Router /networking/ingresses [post]
func CreateNamespacedIngresses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*networkingv1.Ingress).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().NetworkingV1().Ingresses(namespace).Create(context.TODO(), body.(*networkingv1.Ingress), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}

// CreateIngressClasses godoc
// @Summary 새로운 IngressClass 생성
// @Description JSON 형식의 body와 함께 생성할 IngressClass를 지정한다.
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param IngressClass body string true "생성할 IngressClass 매니페스트"
// @Router /networking/ingressclasses [post]
func CreateIngressClasses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*networkingv1.IngressClass).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().NetworkingV1().IngressClasses().Create(context.TODO(), body.(*networkingv1.IngressClass), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}

// ListNetworkPoliciesForAllNamespaces godoc
// @Summary 모든 NetworkPolicy 조회
// @Description 모든 NetworkPolicy를 조회한다.
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /networking/networkpolicies [get]
func ListNetworkPoliciesForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().NetworkingV1().NetworkPolicies(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedNetworkPolicies godoc
// @Summary 특정 네임스페이스의 NetworkPolicy 조회
// @Description 특정 네임스페이스의 NetworkPolicy 조회
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "NetworkPolicy namespace"
// @Router /networking/networkpolicies/{namespace} [get]
func ListNamespacedNetworkPolicies(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().NetworkingV1().NetworkPolicies(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListIngressesForAllNamespaces godoc
// @Summary 모든 Ingress 조회
// @Description 모든 Ingress를 조회한다.
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /networking/ingresses [get]
func ListIngressesForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().NetworkingV1().Ingresses(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedIngresses godoc
// @Summary 특정 네임스페이스의 Ingress 조회
// @Description 특정 네임스페이스의 Ingress 조회
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Ingress namespace"
// @Router /networking/ingresses/{namespace} [get]
func ListNamespacedIngresses(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().NetworkingV1().Ingresses(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListIngressClasses godoc
// @Summary 모든 IngressClass 조회
// @Description 모든 IngressClass를 조회한다.
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /networking/ingressclasses [get]
func ListIngressClasses(ctx echo.Context) error {
	list, err := client.GetKubeClient().NetworkingV1().IngressClasses().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedNetworkPolicies godoc
// @Summary 특정 네임스페이스의 특정 NetworkPolicy 조회
// @Description 특정 네임스페이스의 특정 NetworkPolicy 조회
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "NetworkPolicy namespace"
// @Param name path string true "NetworkPolicy name"
// @Router /networking/networkpolicies/{namespace}/{name} [get]
func GetNamespacedNetworkPolicies(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().NetworkingV1().NetworkPolicies(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedIngresses godoc
// @Summary 특정 네임스페이스의 특정 Ingress 조회
// @Description 특정 네임스페이스의 특정 Ingress 조회
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Ingress namespace"
// @Param name path string true "Ingress name"
// @Router /networking/ingresses/{namespace}/{name} [get]
func GetNamespacedIngresses(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().NetworkingV1().Ingresses(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetIngressClasses godoc
// @Summary 특정 네임스페이스의 특정 IngressClass 조회
// @Description 특정 네임스페이스의 특정 IngressClass 조회
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param name path string true "IngressClass name"
// @Router /networking/ingressclasses/{name} [get]
func GetIngressClasses(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().NetworkingV1().IngressClasses().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ReplaceNamespacedNetworkPolicies ...
func ReplaceNamespacedNetworkPolicies(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := ctx.Param(util.NamespaceString)
	if namespace == "" {
		namespace = body.(*networkingv1.NetworkPolicy).Namespace
	}
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	updated, err := client.GetKubeClient().NetworkingV1().NetworkPolicies(namespace).Update(context.TODO(), body.(*networkingv1.NetworkPolicy), metav1.UpdateOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedIngresses ...
func ReplaceNamespacedIngresses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := ctx.Param(util.NamespaceString)
	if namespace == "" {
		namespace = body.(*networkingv1.NetworkPolicy).Namespace
	}
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	updated, err := client.GetKubeClient().NetworkingV1().Ingresses(namespace).Update(context.TODO(), body.(*networkingv1.Ingress), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceIngressClasses ...
func ReplaceIngressClasses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	updated, err := client.GetKubeClient().NetworkingV1().IngressClasses().Update(context.TODO(), body.(*networkingv1.IngressClass), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// DeleteCollectionNamespacedNetworkPolicies ...
func DeleteCollectionNamespacedNetworkPolicies(ctx echo.Context) error {
	namespace, _ := util.CheckNames(ctx, "", "")
	err := client.GetKubeClient().NetworkingV1().NetworkPolicies(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedIngresses ...
func DeleteCollectionNamespacedIngresses(ctx echo.Context) error {
	namespace, _ := util.CheckNames(ctx, "", "")
	err := client.GetKubeClient().NetworkingV1().Ingresses(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedIngressClasses ...
func DeleteCollectionNamespacedIngressClasses(ctx echo.Context) error {
	err := client.GetKubeClient().NetworkingV1().IngressClasses().DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedNetworkPolicies godoc
// @Summary 특정 네임스페이스의 특정 NetworkPolicy 삭제
// @Description 특정 네임스페이스의 특정 NetworkPolicy 삭제
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "NetworkPolicy namespace"
// @Param name path string true "NetworkPolicy name"
// @Router /networking/networkpolicies/{namespace}/{name} [delete]
func DeleteNamespacedNetworkPolicies(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace, name := util.CheckNames(ctx, body.(*networkingv1.NetworkPolicy).Namespace, body.(*networkingv1.NetworkPolicy).Name)
	err = client.GetKubeClient().NetworkingV1().NetworkPolicies(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedIngresses godoc
// @Summary 특정 네임스페이스의 특정 Ingress 삭제
// @Description 특정 네임스페이스의 특정 Ingress 삭제
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Ingress namespace"
// @Param name path string true "Ingress name"
// @Router /networking/ingresses/{namespace}/{name} [delete]
func DeleteNamespacedIngresses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace, name := util.CheckNames(ctx, body.(*networkingv1.Ingress).Namespace, body.(*networkingv1.Ingress).Name)
	err = client.GetKubeClient().NetworkingV1().Ingresses(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteIngressClasses godoc
// @Summary 특정 네임스페이스의 특정 IngressClass 삭제
// @Description 특정 네임스페이스의 특정 IngressClass 삭제
// @Tags networking
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "IngressClass namespace"
// @Param name path string true "IngressClass name"
// @Router /networking/ingressclasses/{name} [delete]
func DeleteIngressClasses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	_, name := util.CheckNames(ctx, body.(*networkingv1.IngressClass).Namespace, body.(*networkingv1.IngressClass).Name)
	err = client.GetKubeClient().NetworkingV1().IngressClasses().Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}
