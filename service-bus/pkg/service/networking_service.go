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

// CreateNamespacedIngresses ...
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

// CreateIngressClasses ...
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

// ListNetworkPoliciesForAllNamespaces ...
func ListNetworkPoliciesForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().NetworkingV1().NetworkPolicies(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedNetworkPolicies ...
func ListNamespacedNetworkPolicies(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().NetworkingV1().NetworkPolicies(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListIngressesForAllNamespaces ...
func ListIngressesForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().NetworkingV1().Ingresses(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedIngresses ...
func ListNamespacedIngresses(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().NetworkingV1().Ingresses(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListIngressClasses ...
func ListIngressClasses(ctx echo.Context) error {
	list, err := client.GetKubeClient().NetworkingV1().IngressClasses().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedNetworkPolicies ...
func GetNamespacedNetworkPolicies(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().NetworkingV1().NetworkPolicies(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedIngresses ...
func GetNamespacedIngresses(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().NetworkingV1().Ingresses(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetIngressClasses ...
func GetIngressClasses(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().NetworkingV1().IngressClasses().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
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

// DeleteNamespacedNetworkPolicies ...
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

// DeleteNamespacedIngresses ...
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

// DeleteIngressClasses ...
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
