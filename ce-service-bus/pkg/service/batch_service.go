package service

import (
	"context"
	"net/http"

	"github.com/compactedge/cewizontech/ce-service-bus/pkg/client"
	"github.com/compactedge/cewizontech/ce-service-bus/pkg/util"
	"github.com/labstack/echo/v4"
	batchv1 "k8s.io/api/batch/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// CreateNamespacedJobs ...
func CreateNamespacedJobs(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*batchv1.Job).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().BatchV1().Jobs(namespace).Create(context.TODO(), body.(*batchv1.Job), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}

// ListJobs ...
func ListJobs(ctx echo.Context) error {
	list, err := client.GetKubeClient().BatchV1().Jobs(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetJobs ...
func GetJobs(ctx echo.Context) error {
	namespace, name := util.CheckNames(ctx, "", "")
	get, err := client.GetKubeClient().BatchV1().Jobs(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, get)
}

// ReplaceJobs ...
func ReplaceJobs(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace, _ := util.CheckNames(ctx, body.(*batchv1.Job).Namespace, "")
	updated, err := client.GetKubeClient().BatchV1().Jobs(namespace).Update(context.TODO(), body.(*batchv1.Job), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceJobStatuses ...
func ReplaceJobStatuses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace, _ := util.CheckNames(ctx, body.(*batchv1.Job).Namespace, "")
	updated, err := client.GetKubeClient().BatchV1().Jobs(namespace).UpdateStatus(context.TODO(), body.(*batchv1.Job), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// DeleteCollectionJobs ...
func DeleteCollectionJobs(ctx echo.Context) error {
	namespace, _ := util.CheckNames(ctx, "", "")
	err := client.GetKubeClient().BatchV1().Jobs(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteJobs ...
func DeleteJobs(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace, name := util.CheckNames(ctx, body.(*batchv1.Job).Namespace, body.(*batchv1.Job).Name)
	err = client.GetKubeClient().BatchV1().Jobs(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}
