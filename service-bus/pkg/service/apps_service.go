package service

import (
	"context"
	"io/ioutil"
	"net/http"

	"github.com/compactedge/cewizontech/service-bus/pkg/client"
	"github.com/compactedge/cewizontech/service-bus/pkg/util"
	"github.com/labstack/echo/v4"
	appsv1 "k8s.io/api/apps/v1"
	autoscalingv1 "k8s.io/api/autoscaling/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
)

// CreateNamespacedControllerRevisions godoc
// @Summary 새로운 ControllerRevision 생성
// @Description JSON 형식의 body와 함께 생성할 ControllerRevision을 지정한다.
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param ControllerRevision body string true "생성할 ControllerRevision 매니페스트"
// @Router /apps/controllerrevisions [post]
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

// CreateNamespacedDaemonSets godoc
// @Summary 새로운 DaemonSet 생성
// @Description JSON 형식의 body와 함께 생성할 DaemonSet을 지정한다.
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param DaemonSet body string true "생성할 DaemonSet 매니페스트"
// @Router /apps/daemonsets [post]
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

// CreateNamespacedDeployments godoc
// @Summary 새로운 Deployment 생성
// @Description JSON 형식의 body와 함께 생성할 Deployment을 지정한다.
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param Deployment body string true "생성할 Deployment 매니페스트"
// @Router /apps/deployments [post]
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

// CreateNamespacedReplicaSets godoc
// @Summary 새로운 ReplicaSet 생성
// @Description JSON 형식의 body와 함께 생성할 ReplicaSet을 지정한다.
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param ReplicaSet body string true "생성할 ReplicaSet 매니페스트"
// @Router /apps/replicasets [post]
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

// CreateNamespacedStatefulSets godoc
// @Summary 새로운 StatefulSet 생성
// @Description JSON 형식의 body와 함께 생성할 StatefulSet을 지정한다.
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param StatefulSet body string true "생성할 StatefulSet 매니페스트"
// @Router /apps/statefulsets [post]
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

// ListControllerRevisionsForAllNamespaces godoc
// @Summary 모든 ControllerRevision 조회
// @Description 모든 ControllerRevision를 조회한다.
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /apps/controllerrevisions [get]
func ListControllerRevisionsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().AppsV1().ControllerRevisions(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedControllerRevisions godoc
// @Summary 특정 네임스페이스의 ControllerRevision 조회
// @Description 특정 네임스페이스의 ControllerRevision 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ControllerRevision namespace"
// @Router /apps/controllerrevisions/{namespace} [get]
func ListNamespacedControllerRevisions(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().AppsV1().ControllerRevisions(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListDaemonSetsForAllNamespaces godoc
// @Summary 모든 DaemonSet 조회
// @Description 모든 DaemonSet을 조회한다.
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /apps/daemonsets [get]
func ListDaemonSetsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().AppsV1().DaemonSets(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedDaemonSets godoc
// @Summary 특정 네임스페이스의 DaemonSet 조회
// @Description 특정 네임스페이스의 DaemonSet 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "DaemonSet namespace"
// @Router /apps/daemonsets/{namespace} [get]
func ListNamespacedDaemonSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().AppsV1().DaemonSets(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListDeploymentsForAllNamespaces godoc
// @Summary 모든 Deployment 조회
// @Description 모든 Deployment를 조회한다.
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /apps/deployments [get]
func ListDeploymentsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().AppsV1().Deployments(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedDeployments godoc
// @Summary 특정 네임스페이스의 Deployment 조회
// @Description 특정 네임스페이스의 Deployment 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Deployment namespace"
// @Router /apps/deployments/{namespace} [get]
func ListNamespacedDeployments(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().AppsV1().Deployments(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListReplicaSetsForAllNamespaces godoc
// @Summary 모든 ReplicaSet 조회
// @Description 모든 ReplicaSet를 조회한다.
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /apps/replicasets [get]
func ListReplicaSetsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().AppsV1().ReplicaSets(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedReplicaSets godoc
// @Summary 특정 네임스페이스의 ReplicaSet 조회
// @Description 특정 네임스페이스의 ReplicaSet 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ReplicaSet namespace"
// @Router /apps/replicasets/{namespace} [get]
func ListNamespacedReplicaSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().AppsV1().ReplicaSets(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListStatefulSetsForAllNamespaces godoc
// @Summary 모든 StatefulSet 조회
// @Description 모든 StatefulSet를 조회한다.
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /apps/statefulsets [get]
func ListStatefulSetsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().AppsV1().StatefulSets(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedStatefulSets godoc
// @Summary 특정 네임스페이스의 StatefulSet 조회
// @Description 특정 네임스페이스의 StatefulSet 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "StatefulSet namespace"
// @Router /apps/statefulsets/{namespace} [get]
func ListNamespacedStatefulSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().AppsV1().StatefulSets(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedControllerRevisions godoc
// @Summary 특정 네임스페이스의 ControllerRevision 조회
// @Description 특정 네임스페이스의 ControllerRevision 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ControllerRevision namespace"
// @Param name path string true "ControllerRevision name"
// @Router /apps/controllerrevisions/{namespace}/{name} [get]
func GetNamespacedControllerRevisions(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().ControllerRevisions(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedDaemonSets godoc
// @Summary 특정 네임스페이스의 DaemonSet 조회
// @Description 특정 네임스페이스의 DaemonSet 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "DaemonSet namespace"
// @Param name path string true "DaemonSet name"
// @Router /apps/daemonsets/{namespace}/{name} [get]
func GetNamespacedDaemonSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().DaemonSets(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedDeployments godoc
// @Summary 특정 네임스페이스의 Deployment 조회
// @Description 특정 네임스페이스의 Deployment 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Deployment namespace"
// @Param name path string true "Deployment name"
// @Router /apps/deployments/{namespace}/{name} [get]
func GetNamespacedDeployments(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().Deployments(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedDeploymentScale godoc
// @Summary 특정 네임스페이스의 DeploymentScale 조회
// @Description 특정 네임스페이스의 DeploymentScale 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "DeploymentScale namespace"
// @Param name path string true "DeploymentScale name"
// @Router /apps/deploymentscale/{namespace}/{name} [get]
func GetNamespacedDeploymentScale(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().Deployments(namespace).GetScale(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedReplicaSets godoc
// @Summary 특정 네임스페이스의 ReplicaSet 조회
// @Description 특정 네임스페이스의 ReplicaSet 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ReplicaSet namespace"
// @Param name path string true "ReplicaSet name"
// @Router /apps/replicasets/{namespace}/{name} [get]
func GetNamespacedReplicaSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().ReplicaSets(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedReplicaSetScale godoc
// @Summary 특정 네임스페이스의 ReplicaSetScale 조회
// @Description 특정 네임스페이스의 ReplicaSetScale 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ReplicaSetScale namespace"
// @Param name path string true "ReplicaSetScale name"
// @Router /apps/replicasetscale/{namespace}/{name} [get]
func GetNamespacedReplicaSetScale(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().ReplicaSets(namespace).GetScale(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedStatefulSets godoc
// @Summary 특정 네임스페이스의 StatefulSet 조회
// @Description 특정 네임스페이스의 StatefulSet 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "StatefulSet namespace"
// @Param name path string true "StatefulSet name"
// @Router /apps/statefulsets/{namespace}/{name} [get]
func GetNamespacedStatefulSets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().StatefulSets(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedStatefulSetScale godoc
// @Summary 특정 네임스페이스의 StatefulSetScale 조회
// @Description 특정 네임스페이스의 StatefulSetScale 조회
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "StatefulSetScale namespace"
// @Param name path string true "StatefulSetScale name"
// @Router /apps/statefulsetscale/{namespace}/{name} [get]
func GetNamespacedStatefulSetScale(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().AppsV1().StatefulSets(namespace).GetScale(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
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

// DeleteNamespacedControllerRevisions godoc
// @Summary 특정 네임스페이스의 ControllerRevision 삭제
// @Description 특정 네임스페이스의 ControllerRevision 삭제
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ControllerRevision namespace"
// @Param name path string true "ControllerRevision name"
// @Router /apps/controllerrevisions/{namespace}/{name} [delete]
func DeleteNamespacedControllerRevisions(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*appsv1.ControllerRevision).Namespace
	// name := body.(*appsv1.ControllerRevision).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().AppsV1().ControllerRevisions(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedDaemonsets godoc
// @Summary 특정 네임스페이스의 Daemonset 삭제
// @Description 특정 네임스페이스의 Daemonset 삭제
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Daemonset namespace"
// @Param name path string true "Daemonset name"
// @Router /apps/daemonsets/{namespace}/{name} [delete]
func DeleteNamespacedDaemonsets(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*appsv1.DaemonSet).Namespace
	// name := body.(*appsv1.DaemonSet).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().AppsV1().DaemonSets(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedDeployments godoc
// @Summary 특정 네임스페이스의 Deployment 삭제
// @Description 특정 네임스페이스의 Deployment 삭제
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Deployment namespace"
// @Param name path string true "Deployment name"
// @Router /apps/deployments/{namespace}/{name} [delete]
func DeleteNamespacedDeployments(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*appsv1.Deployment).Namespace
	// name := body.(*appsv1.Deployment).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().AppsV1().Deployments(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedReplicaSets godoc
// @Summary 특정 네임스페이스의 ReplicaSet 삭제
// @Description 특정 네임스페이스의 ReplicaSet 삭제
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ReplicaSet namespace"
// @Param name path string true "ReplicaSet name"
// @Router /apps/replicasets/{namespace}/{name} [delete]
func DeleteNamespacedReplicaSets(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*appsv1.ReplicaSet).Namespace
	// name := body.(*appsv1.ReplicaSet).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().AppsV1().ReplicaSets(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedStatefulSets godoc
// @Summary 특정 네임스페이스의 StatefulSet 삭제
// @Description 특정 네임스페이스의 StatefulSet 삭제
// @Tags apps
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "StatefulSet namespace"
// @Param name path string true "StatefulSet name"
// @Router /apps/statefulsets/{namespace}/{name} [delete]
func DeleteNamespacedStatefulSets(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*appsv1.StatefulSet).Namespace
	// name := body.(*appsv1.StatefulSet).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().AppsV1().StatefulSets(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}
