package service

import (
	"context"
	"io/ioutil"
	"net/http"

	"github.com/compactedge/cewizontech/ce-service-bus/pkg/client"
	"github.com/compactedge/cewizontech/ce-service-bus/pkg/util"
	"github.com/labstack/echo/v4"
	appsv1 "k8s.io/api/apps/v1"
	autoscalingv1 "k8s.io/api/autoscaling/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
)

// CreateNamespacedControllerRevisions ...
func CreateNamespacedControllerRevisions(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*appsv1.ControllerRevision).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().AppsV1().ControllerRevisions(namespace).Create(context.TODO(), body.(*appsv1.ControllerRevision), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}

// CreateNamespacedDaemonSets ...
func CreateNamespacedDaemonSets(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*appsv1.DaemonSet).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().AppsV1().DaemonSets(namespace).Create(context.TODO(), body.(*appsv1.DaemonSet), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}

// CreateNamespacedDeployments ...
func CreateNamespacedDeployments(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*appsv1.Deployment).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().AppsV1().Deployments(namespace).Create(context.TODO(), body.(*appsv1.Deployment), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}

// CreateNamespacedReplicaSets ...
func CreateNamespacedReplicaSets(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*appsv1.ReplicaSet).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().AppsV1().ReplicaSets(namespace).Create(context.TODO(), body.(*appsv1.ReplicaSet), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}

// CreateNamespacedStatefulSets ...
func CreateNamespacedStatefulSets(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*appsv1.StatefulSet).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().AppsV1().StatefulSets(namespace).Create(context.TODO(), body.(*appsv1.StatefulSet), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}

// ListControllerRevisionsForAllNamespaces ...
func ListControllerRevisionsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().AppsV1().ControllerRevisions(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedControllerRevisions ...
func ListNamespacedControllerRevisions(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().AppsV1().ControllerRevisions(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListDaemonSetsForAllNamespaces ...
func ListDaemonSetsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().AppsV1().DaemonSets(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedDaemonSets ...
func ListNamespacedDaemonSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().AppsV1().DaemonSets(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListDeploymentsForAllNamespaces ...
func ListDeploymentsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().AppsV1().Deployments(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedDeployments ...
func ListNamespacedDeployments(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().AppsV1().Deployments(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListReplicaSetsForAllNamespaces ...
func ListReplicaSetsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().AppsV1().ReplicaSets(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedReplicaSets ...
func ListNamespacedReplicaSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().AppsV1().ReplicaSets(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListStatefulSetsForAllNamespaces ...
func ListStatefulSetsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().AppsV1().StatefulSets(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedStatefulSets ...
func ListNamespacedStatefulSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().AppsV1().StatefulSets(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedControllerRevisions ...
func GetNamespacedControllerRevisions(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().ControllerRevisions(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedDaemonSets ...
func GetNamespacedDaemonSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().DaemonSets(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedDeployments ...
func GetNamespacedDeployments(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().Deployments(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedDeploymentScale ...
func GetNamespacedDeploymentScale(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().Deployments(namespace).GetScale(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedReplicaSets ...
func GetNamespacedReplicaSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().ReplicaSets(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedReplicaSetScale ...
func GetNamespacedReplicaSetScale(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().ReplicaSets(namespace).GetScale(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedStatefulSets ...
func GetNamespacedStatefulSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().StatefulSets(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedStatefulSetScale ...
func GetNamespacedStatefulSetScale(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().StatefulSets(namespace).GetScale(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ReplaceNamespacedControllerRevisions ...
func ReplaceNamespacedControllerRevisions(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := ctx.Param(util.NamespaceString)
	if namespace == "" {
		namespace = body.(*appsv1.ControllerRevision).Namespace
	}
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	updated, err := client.GetKubeClient().AppsV1().ControllerRevisions(namespace).Update(context.TODO(), body.(*appsv1.ControllerRevision), metav1.UpdateOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedDaemonSets ...
func ReplaceNamespacedDaemonSets(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := ctx.Param(util.NamespaceString)
	if namespace == "" {
		namespace = body.(*appsv1.DaemonSet).Namespace
	}
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	updated, err := client.GetKubeClient().AppsV1().DaemonSets(namespace).Update(context.TODO(), body.(*appsv1.DaemonSet), metav1.UpdateOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedDaemonSetStatuses ...
func ReplaceNamespacedDaemonSetStatuses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := ctx.Param(util.NamespaceString)
	if namespace == "" {
		namespace = body.(*appsv1.DaemonSet).Namespace
	}
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	updated, err := client.GetKubeClient().AppsV1().DaemonSets(namespace).UpdateStatus(context.TODO(), body.(*appsv1.DaemonSet), metav1.UpdateOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedDeployments ...
func ReplaceNamespacedDeployments(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := ctx.Param(util.NamespaceString)
	if namespace == "" {
		namespace = body.(*appsv1.Deployment).Namespace
	}
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	updated, err := client.GetKubeClient().AppsV1().Deployments(namespace).Update(context.TODO(), body.(*appsv1.Deployment), metav1.UpdateOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedDeploymentScale ...
func ReplaceNamespacedDeploymentScale(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := ctx.Param(util.NamespaceString)
	if namespace == "" {
		namespace = body.(*autoscalingv1.Scale).Namespace
	}
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	updated, err := client.GetKubeClient().AppsV1().Deployments(namespace).UpdateScale(context.TODO(), body.(*autoscalingv1.Scale).Name, body.(*autoscalingv1.Scale), metav1.UpdateOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedDeploymentStatuses ...
func ReplaceNamespacedDeploymentStatuses(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := ctx.Param(util.NamespaceString)
	if namespace == "" {
		namespace = body.(*appsv1.Deployment).Namespace
	}
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	updated, err := client.GetKubeClient().AppsV1().Deployments(namespace).UpdateStatus(context.TODO(), body.(*appsv1.Deployment), metav1.UpdateOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// PatchNamespacedControllerRevisions ...
// TODO:
func PatchNamespacedControllerRevisions(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	if namespace == "" {
		namespace = body.(*appsv1.ControllerRevision).Namespace
	}
	if name == "" {
		name = body.(*appsv1.ControllerRevision).Name
	}

	var bodyBytes []byte
	if ctx.Request().Body != nil {
		bodyBytes, _ = ioutil.ReadAll(ctx.Request().Body)
	} else {
		return ctx.JSON(http.StatusBadRequest, nil)
	}
	updated, err := client.GetKubeClient().AppsV1().ControllerRevisions(namespace).Patch(context.TODO(), name, types.JSONPatchType, bodyBytes, metav1.PatchOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// PatchNamespacedDaemonSets ...
// TODO:
func PatchNamespacedDaemonSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	if namespace == "" {
		namespace = body.(*appsv1.DaemonSet).Namespace
	}
	if name == "" {
		name = body.(*appsv1.DaemonSet).Name
	}

	var bodyBytes []byte
	if ctx.Request().Body != nil {
		bodyBytes, _ = ioutil.ReadAll(ctx.Request().Body)
	} else {
		return ctx.JSON(http.StatusBadRequest, nil)
	}
	updated, err := client.GetKubeClient().AppsV1().DaemonSets(namespace).Patch(context.TODO(), name, types.JSONPatchType, bodyBytes, metav1.PatchOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// PatchNamespacedDeployments ...
// TODO:
func PatchNamespacedDeployments(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	if namespace == "" {
		namespace = body.(*appsv1.Deployment).Namespace
	}
	if name == "" {
		name = body.(*appsv1.Deployment).Name
	}

	var bodyBytes []byte
	if ctx.Request().Body != nil {
		bodyBytes, _ = ioutil.ReadAll(ctx.Request().Body)
	} else {
		return ctx.JSON(http.StatusBadRequest, nil)
	}
	updated, err := client.GetKubeClient().AppsV1().Deployments(namespace).Patch(context.TODO(), name, types.JSONPatchType, bodyBytes, metav1.PatchOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// DeleteCollectionNamespacedControllerRevisions ...
func DeleteCollectionNamespacedControllerRevisions(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().AppsV1().ControllerRevisions(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedDaemonSets ...
func DeleteCollectionNamespacedDaemonSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().AppsV1().DaemonSets(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedDeployments ...
func DeleteCollectionNamespacedDeployments(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().AppsV1().Deployments(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedReplicaSets ...
func DeleteCollectionNamespacedReplicaSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().AppsV1().ReplicaSets(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedStatefulSets ...
func DeleteCollectionNamespacedStatefulSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().AppsV1().StatefulSets(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedControllerRevisions ...
func DeleteNamespacedControllerRevisions(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*appsv1.ControllerRevision).Namespace
	name := body.(*appsv1.ControllerRevision).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().AppsV1().ControllerRevisions(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedDaemonsets ...
func DeleteNamespacedDaemonsets(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*appsv1.DaemonSet).Namespace
	name := body.(*appsv1.DaemonSet).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().AppsV1().DaemonSets(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedDeployments ...
func DeleteNamespacedDeployments(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*appsv1.Deployment).Namespace
	name := body.(*appsv1.Deployment).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().AppsV1().Deployments(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedReplicaSets ...
func DeleteNamespacedReplicaSets(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*appsv1.ReplicaSet).Namespace
	name := body.(*appsv1.ReplicaSet).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().AppsV1().ReplicaSets(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedStatefulSets ...
func DeleteNamespacedStatefulSets(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*appsv1.StatefulSet).Namespace
	name := body.(*appsv1.StatefulSet).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().AppsV1().StatefulSets(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}
