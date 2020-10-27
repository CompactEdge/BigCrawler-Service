package service

import (
	"context"
	"net/http"

	"github.com/compactedge/cewizontech/ce-service-bus/pkg/client"
	"github.com/compactedge/cewizontech/ce-service-bus/pkg/util"
	"github.com/labstack/echo/v4"
	storagev1 "k8s.io/api/storage/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// CreateStorageClasses ...
func CreateStorageClasses(ctx echo.Context) error {
// func CreateStorageClasses(ctx echo.Context, JSONData *util.BodyData) (int, interface{}) {
	if ctx == nil {
		return ctx.JSON(http.StatusBadRequest, nil)
	}
	body, code, err := util.ParseBody(ctx)
	// if body == nil {
	// 	body, code, err = util.ParseJSON(JSONData)
	// }
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*storagev1.StorageClass).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().StorageV1().StorageClasses().Create(context.TODO(), body.(*storagev1.StorageClass), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}

// CreateVolumeAttachments ...
func CreateVolumeAttachments(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*storagev1.VolumeAttachment).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().StorageV1().VolumeAttachments().Create(context.TODO(), body.(*storagev1.VolumeAttachment), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}

// ListStorageClasses ...
func ListStorageClasses(ctx echo.Context) error {
// func ListStorageClasses() (int, runtime.Object) {
	list, err := client.GetKubeClient().StorageV1().StorageClasses().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListVolumeAttachments ...
func ListVolumeAttachments(ctx echo.Context) error {
	list, err := client.GetKubeClient().StorageV1().VolumeAttachments().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetStorageClasses ...
func GetStorageClasses(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().StorageV1().StorageClasses().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetVolumeAttachments ...
func GetVolumeAttachments(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().StorageV1().VolumeAttachments().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ReplaceStorageClasses ...
func ReplaceStorageClasses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	updated, err := client.GetKubeClient().StorageV1().StorageClasses().Update(context.TODO(), body.(*storagev1.StorageClass), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceVolumeAttachments ...
func ReplaceVolumeAttachments(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	updated, err := client.GetKubeClient().StorageV1().VolumeAttachments().Update(context.TODO(), body.(*storagev1.VolumeAttachment), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceVolumeAttachmentStatuses ...
func ReplaceVolumeAttachmentStatuses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	updated, err := client.GetKubeClient().StorageV1().VolumeAttachments().UpdateStatus(context.TODO(), body.(*storagev1.VolumeAttachment), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// DeleteCollectionStorageClasses ...
func DeleteCollectionStorageClasses(ctx echo.Context) error {
	err := client.GetKubeClient().StorageV1().StorageClasses().DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionVolumeAttachments ...
func DeleteCollectionVolumeAttachments(ctx echo.Context) error {
	err := client.GetKubeClient().StorageV1().VolumeAttachments().DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteStorageClasses ...
func DeleteStorageClasses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	_, name := util.CheckNames(ctx, body.(*storagev1.StorageClass).Namespace, body.(*storagev1.StorageClass).Name)
	err = client.GetKubeClient().StorageV1().StorageClasses().Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteVolumeAttachments ...
func DeleteVolumeAttachments(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	_, name := util.CheckNames(ctx, body.(*storagev1.VolumeAttachment).Namespace, body.(*storagev1.VolumeAttachment).Name)
	err = client.GetKubeClient().StorageV1().VolumeAttachments().Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}
