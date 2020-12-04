package service

import (
	"context"
	"io/ioutil"
	"net/http"

	"github.com/compactedge/cewizontech/service-bus/pkg/client"
	"github.com/compactedge/cewizontech/service-bus/pkg/util"
	"github.com/labstack/echo/v4"
	corev1 "k8s.io/api/core/v1"
	policy "k8s.io/api/policy/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
)

// CreateNamespacedBindings godoc
// @deprecated
// @Summary 새로운 Binding 생성
// @Description JSON 형식의 body와 함께 생성할 Binding을 지정한다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param Binding body string true "생성할 Binding 매니페스트"
// @Router /core/bindings [post]
func CreateNamespacedBindings(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Binding).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().Pods(namespace).Bind(context.TODO(), body.(*corev1.Binding), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, body.(*corev1.Binding))
}

// CreateNamespacedConfigMaps godoc
// @Summary 특정 네임스페이스에 새로운 ConfigMap 생성
// @Description JSON 형식의 body와 함께 생성할 ConfigMap을 지정합니다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param ConfigMap body string true "생성할 ConfigMap 매니페스트"
// @Router /core/configmaps [post]
func CreateNamespacedConfigMaps(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.ConfigMap).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().ConfigMaps(namespace).Create(context.TODO(), body.(*corev1.ConfigMap), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, obj)
}

// CreateNamespacedEndPoints godoc
// @Summary 특정 네임스페이스에 새로운 EndPoints 생성
// @Description JSON 형식의 body와 함께 생성할 EndPoints를 요청합니다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param EndPoints body string true "생성할 EndPoints 매니페스트"
// @Router /core/endpoints [post]
func CreateNamespacedEndPoints(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Endpoints).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().Endpoints(namespace).Create(context.TODO(), body.(*corev1.Endpoints), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNamespacedEvents godoc
// @Summary 특정 네임스페이스에 새로운 Event 생성
// @Description JSON 형식의 body와 함께 생성할 Event를 요청합니다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param Event body string true "생성할 Event 매니페스트"
// @Router /core/events [post]
func CreateNamespacedEvents(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Event).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().Events(namespace).Create(context.TODO(), body.(*corev1.Event), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNamespacedEvictions godoc
// @deprecated
// @Summary 특정 네임스페이스에 새로운 Eviction 생성
// @Description JSON 형식의 body와 함께 생성할 Eviction을 요청합니다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param Eviction body string true "생성할 Eviction 매니페스트"
// @Router /core/evictions [post]
// TODO
func CreateNamespacedEvictions(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*policy.Eviction).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().PolicyV1beta1().Evictions(namespace).Evict(context.TODO(), body.(*policy.Eviction))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// CreateNamespacedLimitRanges godoc
// @Summary 특정 네임스페이스에 새로운 LimitRange 생성
// @Description JSON 형식의 body와 함께 생성할 LimitRange을 요청합니다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param LimitRange body string true "생성할 LimitRange 매니페스트"
// @Router /core/limitranges [post]
func CreateNamespacedLimitRanges(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.LimitRange).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().LimitRanges(namespace).Create(context.TODO(), body.(*corev1.LimitRange), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNamespaces godoc
// @Summary 새로운 Namespace 생성
// @Description JSON 형식의 body와 함께 생성할 Namespace를 지정합니다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param Namespace body string true "생성할 Namespace 매니페스트"
// @Router /core/namespaces [post]
func CreateNamespaces(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	obj, err := client.GetKubeClient().CoreV1().Namespaces().Create(context.TODO(), body.(*corev1.Namespace), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNodes godoc
// @Summary 새로운 Node 생성
// @Description JSON 형식의 body와 함께 생성할 Node를 지정합니다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param Node body string true "생성할 Node 매니페스트"
// @Router /core/nodes [post]
func CreateNodes(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	obj, err := client.GetKubeClient().CoreV1().Nodes().Create(context.TODO(), body.(*corev1.Node), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreatePersistentVolumes godoc
// @Summary 새로운 PersistentVolume 생성
// @Description JSON 형식의 body와 함께 생성할 PersistentVolume을 지정합니다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param PersistentVolume body string true "생성할 PersistentVolume 매니페스트"
// @Router /core/persistentvolumes [post]
func CreatePersistentVolumes(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	obj, err := client.GetKubeClient().CoreV1().PersistentVolumes().Create(context.TODO(), body.(*corev1.PersistentVolume), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNamespacedPersistentVolumeClaims godoc
// @Summary 새로운 PersistentVolumeClaim 생성
// @Description JSON 형식의 body와 함께 생성할 PersistentVolumeClaim을 지정합니다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param PersistentVolumeClaim body string true "생성할 PersistentVolumeClaim 매니페스트"
// @Router /core/persistentvolumeclaims [post]
func CreateNamespacedPersistentVolumeClaims(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.PersistentVolumeClaim).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().PersistentVolumeClaims(namespace).Create(context.TODO(), body.(*corev1.PersistentVolumeClaim), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNamespacedPods godoc
// @Summary 새로운 Pod 생성
// @Description JSON 형식의 body와 함께 생성할 Pod를 지정한다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param Pod body string true "생성할 Pod 매니페스트"
// @Router /core/pods [post]
func CreateNamespacedPods(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Pod).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().Pods(namespace).Create(context.TODO(), body.(*corev1.Pod), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNamespacedPodTemplates godoc
// @deprecated
// @Summary 새로운 PodTemplate 생성
// @Description JSON 형식의 body와 함께 생성할 PodTemplate를 지정한다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param PodTemplate body string true "생성할 PodTemplate 매니페스트"
// @Router /core/podtemplates [post]
func CreateNamespacedPodTemplates(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.PodTemplate).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().PodTemplates(namespace).Create(context.TODO(), body.(*corev1.PodTemplate), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNamespacedReplicationControllers godoc
// @Summary 새로운 ReplicationController 생성
// @Description JSON 형식의 body와 함께 생성할 ReplicationController를 지정한다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param ReplicationController body string true "생성할 ReplicationController 매니페스트"
// @Router /core/replicationcontrollers [post]
func CreateNamespacedReplicationControllers(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.ReplicationController).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().ReplicationControllers(namespace).Create(context.TODO(), body.(*corev1.ReplicationController), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNamespacedResourceQuotas godoc
// @Summary ResourceQuota 생성
// @Description JSON 형식의 body와 함께 생성할 ResourceQuota를 지정한다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param ResourceQuota body string true "생성할 ResourceQuota 매니페스트"
// @Router /core/resourcequotas [post]
func CreateNamespacedResourceQuotas(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.ResourceQuota).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().ResourceQuotas(namespace).Create(context.TODO(), body.(*corev1.ResourceQuota), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNamespacedSecrets godoc
// @Summary Secret 생성
// @Description JSON 형식의 body와 함께 생성할 Secret를 지정한다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param Secret body string true "생성할 Secret 매니페스트"
// @Router /core/secrets [post]
func CreateNamespacedSecrets(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Secret).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().Secrets(namespace).Create(context.TODO(), body.(*corev1.Secret), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNamespacedServices godoc
// @Summary Service 생성
// @Description JSON 형식의 body와 함께 생성할 Service를 지정한다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param Service body string true "생성할 Service 매니페스트"
// @Router /core/services [post]
func CreateNamespacedServices(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Service).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().Services(namespace).Create(context.TODO(), body.(*corev1.Service), metav1.CreateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusCreated, obj)
}

// CreateNamespacedServiceAccounts godoc
// @Summary ServiceAccount 생성
// @Description JSON 형식의 body와 함께 생성할 ServiceAccount를 지정한다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param ServiceAccount body string true "생성할 ServiceAccount 매니페스트"
// @Router /core/serviceaccounts [post]
func CreateNamespacedServiceAccounts(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.ServiceAccount).Namespace
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	obj, err := client.GetKubeClient().CoreV1().ServiceAccounts(namespace).Create(context.TODO(), body.(*corev1.ServiceAccount), metav1.CreateOptions{})
	if err != nil {
		ctx.Logger().Debug(err)
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	ctx.Logger().Debug(obj)
	return ctx.JSON(http.StatusCreated, obj)
}

// ListComponentStatuses godoc
// @Summary 모든 ComponentStatuses 조회
// @Description 모든 ComponentStatuses 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/componentstatuses [get]
func ListComponentStatuses(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().ComponentStatuses().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListConfigMapsForAllNamespaces godoc
// @Summary 모든 ConfigMap 조회
// @Description 모든 ConfigMap 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/configmaps [get]
func ListConfigMapsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().ConfigMaps(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedConfigMaps godoc
// @Summary 특정 네임스페이스의 ConfigMap 조회
// @Description 특정 네임스페이스의 ConfigMap 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "ConfigMap namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/configmaps/{namespace} [get]
func ListNamespacedConfigMaps(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().ConfigMaps(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListEndpointsForAllNamespaces godoc
// @Summary 모든 EndPoints 조회
// @Description 모든 EndPoints 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/endpoints [get]
func ListEndpointsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Endpoints(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedEndpoints godoc
// @Summary 특정 네임스페이스의 EndPoints 조회
// @Description 특정 네임스페이스의 EndPoints 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "EndPoints namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/endpoints/{namespace} [get]
func ListNamespacedEndpoints(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().Endpoints(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListEventsForAllNamespaces godoc
// @Summary 모든 Event 조회
// @Description 모든 Event 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/events [get]
func ListEventsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Events(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedEvents godoc
// @Summary 특정 네임스페이스의 Event 조회
// @Description 특정 네임스페이스의 Event 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "Events namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/events/{namespace} [get]
func ListNamespacedEvents(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().Events(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListLimitRangesForAllNamespaces godoc
// @Summary 모든 LimitRange 조회
// @Description 모든 LimitRange 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/limitranges [get]
func ListLimitRangesForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().LimitRanges(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedLimitRanges godoc
// @Summary 특정 네임스페이스의 LimitRange 조회
// @Description 특정 네임스페이스의 LimitRange 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "LimitRange namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/limitranges/{namespace} [get]
func ListNamespacedLimitRanges(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().LimitRanges(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespaces godoc
// @Summary 모든 Namespace 조회
// @Description 모든 Namespace 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/namespaces [get]
func ListNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNode godoc
// @Summary 모든 Node 조회
// @Description 모든 Node 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/nodes [get]
func ListNode(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Nodes().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListPersistentVolumesForAllNamespaces godoc
// @Summary 모든 PersistentVolume 조회
// @Description 모든 PersistentVolume 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/persistentvolumes [get]
func ListPersistentVolumesForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().PersistentVolumes().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListPersistentVolumeClaimsForAllNamespaces godoc
// @Summary 모든 PersistentVolumeClaim 조회
// @Description 모든 PersistentVolumeClaim 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/persistentvolumeclaims [get]
func ListPersistentVolumeClaimsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().PersistentVolumeClaims(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedPersistentVolumeClaims godoc
// @Summary 특정 네임스페이스의 PersistentVolumeClaim 조회
// @Description 특정 네임스페이스의 PersistentVolumeClaim 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "PersistentVolumeClaim namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/persistentvolumeclaims/{namespace} [get]
func ListNamespacedPersistentVolumeClaims(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().PersistentVolumeClaims(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListPodsForAllNamespaces godoc
// @Summary 모든 Pod 조회
// @Description 모든 Pod 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/pods [get]
func ListPodsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Pods(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedPods godoc
// @Summary 특정 네임스페이스의 Pod 조회
// @Description 특정 네임스페이스의 Pod 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "Pod namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/pods/{namespace} [get]
func ListNamespacedPods(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().Pods(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListPodTemplatesForAllNamespaces godoc
// @Summary 모든 PodTemplates 조회
// @Description 모든 PodTemplates 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/podtemplates [get]
func ListPodTemplatesForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().PodTemplates(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedPodTemplates godoc
// @Summary 특정 네임스페이스의 PodTemplate 조회
// @Description 특정 네임스페이스의 PodTemplate 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "PodTemplate namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/podtemplates/{namespace} [get]
func ListNamespacedPodTemplates(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().PodTemplates(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListReplicationControllersForAllNamespaces godoc
// @Summary 모든 ReplicationController 조회
// @Description 모든 ReplicationController 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/replicationcontrollers [get]
func ListReplicationControllersForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().ReplicationControllers(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedReplicationControllers godoc
// @Summary 특정 네임스페이스의 ReplicationController 조회
// @Description 특정 네임스페이스의 ReplicationController 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "ReplicationController namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/replicationcontrollers/{namespace} [get]
func ListNamespacedReplicationControllers(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().ReplicationControllers(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListResourceQuotasForAllNamespaces godoc
// @Summary 모든 ResourceQuota 조회
// @Description 모든 ResourceQuota 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/resourcequota [get]
func ListResourceQuotasForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().ResourceQuotas(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedResourceQuotas godoc
// @Summary 특정 네임스페이스의 ResourceQuota 조회
// @Description 특정 네임스페이스의 ResourceQuota 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "ResourceQuota namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/resourcequota/{namespace} [get]
func ListNamespacedResourceQuotas(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().ResourceQuotas(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListSecretsForAllNamespaces godoc
// @Summary 모든 Secret 조회
// @Description 모든 Secret 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/secrets [get]
func ListSecretsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Secrets(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedSecret godoc
// @Summary 특정 네임스페이스의 Secret 조회
// @Description 특정 네임스페이스의 Secret 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "Secret namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/secrets/{namespace} [get]
func ListNamespacedSecret(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().Secrets(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListServicesForAllNamespaces godoc
// @Summary 모든 Service 조회
// @Description 모든 Service 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/services [get]
func ListServicesForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Services(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedServices godoc
// @Summary 특정 네임스페이스의 Service 조회
// @Description 특정 네임스페이스의 Service 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "Service namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/services/{namespace} [get]
func ListNamespacedServices(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().Services(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListServiceAccountsForAllNamespaces godoc
// @Summary 모든 ServiceAccount 조회
// @Description 모든 ServiceAccount 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/serviceaccounts [get]
func ListServiceAccountsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().ServiceAccounts(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedServiceAccounts godoc
// @Summary 특정 네임스페이스의 ServiceAccount 조회
// @Description 특정 네임스페이스의 ServiceAccount 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "ServiceAccount namespace"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/serviceaccounts/{namespace} [get]
func ListNamespacedServiceAccounts(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().ServiceAccounts(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetComponentStatuses godoc
// @Summary 특정 ComponentStatus 조회
// @Description 특정 ComponentStatus 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param name path string true "ComponentStatus name"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/componentStatuses/{name} [get]
func GetComponentStatuses(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ComponentStatuses().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedConfigMaps godoc
// @Summary 특정 네임스페이스의 ConfigMap 조회
// @Description 특정 네임스페이스의 ConfigMap 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ConfigMap namespace"
// @Param name path string true "ConfigMap name"
// @Router /core/configmaps/{namespace}/{name} [get]
func GetNamespacedConfigMaps(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ConfigMaps(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedEndpoints godoc
// @Summary 특정 네임스페이스의 EndPoints 조회
// @Description 특정 네임스페이스의 EndPoints 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "EndPoints namespace"
// @Param name path string true "EndPoints name"
// @Router /core/endpoints/{namespace}/{name} [get]
func GetNamespacedEndpoints(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Endpoints(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedEvents godoc
// @Summary 특정 네임스페이스의 Event 조회
// @Description 특정 네임스페이스의 Event 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Event namespace"
// @Param name path string true "Event name"
// @Router /core/events/{namespace}/{name} [get]
func GetNamespacedEvents(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Events(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedLimitRanges godoc
// @Summary 특정 네임스페이스의 LimitRange 조회
// @Description 특정 네임스페이스의 LimitRange 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "LimitRange namespace"
// @Param name path string true "LimitRange name"
// @Router /core/limitranges/{namespace}/{name} [get]
func GetNamespacedLimitRanges(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().LimitRanges(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespaces godoc
// @Summary 특정 Namespace 조회
// @Description 특정 Namespace 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param name path string true "Namespace name"
// @Router /core/namespaces/{name} [get]
func GetNamespaces(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Namespaces().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNodes godoc
// @Summary 특정 Node 조회
// @Description 특정 Node 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param name path string true "Node name"
// @Router /core/nodes/{name} [get]
func GetNodes(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Nodes().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetPersistentVolumes godoc
// @Summary 특정 PersistentVolume 조회
// @Description 특정 PersistentVolume 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param name path string true "PersistentVolume name"
// @Router /core/persistentvolumes/{name} [get]
func GetPersistentVolumes(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().PersistentVolumes().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedPersistentVolumeClaims godoc
// @Summary 특정 네임스페이스의 특정 PersistentVolumeClaims 조회
// @Description 특정 네임스페이스의 특정 PersistentVolumeClaims 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "PersistentVolumeClaims namespace"
// @Param name path string true "PersistentVolumeClaims name"
// @Router /core/persistentvolumeclaims/{namespace}/{name} [get]
func GetNamespacedPersistentVolumeClaims(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().PersistentVolumeClaims(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedPods godoc
// @Summary 특정 네임스페이스의 특정 Pod 조회
// @Description 특정 네임스페이스의 특정 Pod 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Pod namespace"
// @Param name path string true "Pod name"
// @Router /core/pods/{namespace}/{name} [get]
func GetNamespacedPods(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Pods(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedPodLogs godoc
// @Summary 특정 네임스페이스의 특정 PodLog 조회
// @Description 특정 네임스페이스의 특정 PodLog 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "PodLog namespace"
// @Param name path string true "PodLog name"
// @Router /core/podlogs/{namespace}/{name} [get]
// TODO:
func GetNamespacedPodLogs(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	rest := client.GetKubeClient().CoreV1().Pods(namespace).GetLogs(name, &corev1.PodLogOptions{})
	return ctx.JSON(http.StatusOK, rest)
}

// GetNamespacedPodTemplates godoc
// @Summary 특정 네임스페이스의 특정 PodTemplate 조회
// @Description 특정 네임스페이스의 특정 PodTemplate 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "PodTemplate namespace"
// @Param name path string true "PodTemplate name"
// @Router /core/podtemplates/{namespace}/{name} [get]
func GetNamespacedPodTemplates(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().PodTemplates(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedReplicationControllers godoc
// @Summary 특정 네임스페이스의 특정 ReplicationController 조회
// @Description 특정 네임스페이스의 특정 ReplicationController 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ReplicationController namespace"
// @Param name path string true "ReplicationController name"
// @Router /core/replicationcontrollers/{namespace}/{name} [get]
func GetNamespacedReplicationControllers(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ReplicationControllers(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedReplicationControllerScales godoc
// @Summary 특정 네임스페이스의 특정 ReplicationControllerScale 조회
// @Description 특정 네임스페이스의 특정 ReplicationControllerScale 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ReplicationControllerScale namespace"
// @Param name path string true "ReplicationControllerScale name"
// @Router /core/replicationcontrollerscales/{namespace}/{name} [get]
func GetNamespacedReplicationControllerScales(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ReplicationControllers(namespace).GetScale(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedResourceQuotas godoc
// @Summary 특정 네임스페이스의 특정 ResourceQuota 조회
// @Description 특정 네임스페이스의 특정 ResourceQuota 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ResourceQuota namespace"
// @Param name path string true "ResourceQuota name"
// @Router /core/resourcequotas/{namespace}/{name} [get]
func GetNamespacedResourceQuotas(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ResourceQuotas(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedSecrets godoc
// @Summary 특정 네임스페이스의 특정 Secret 조회
// @Description 특정 네임스페이스의 특정 Secret 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Secret namespace"
// @Param name path string true "Secret name"
// @Router /core/secrets/{namespace}/{name} [get]
func GetNamespacedSecrets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Secrets(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedServices godoc
// @Summary 특정 네임스페이스의 특정 Service 조회
// @Description 특정 네임스페이스의 특정 Service 조회
// @Tags core
// @Accept */*
// @Produce json
// @Param namespace path string true "Service namespace"
// @Param name path string true "Service name"
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Router /core/services/{namespace}/{name} [get]
func GetNamespacedServices(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Services(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedServiceAccounts godoc
// @Summary 특정 네임스페이스의 특정 ServiceAccount 조회
// @Description 특정 네임스페이스의 특정 ServiceAccount 조회
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ServiceAccount namespace"
// @Param name path string true "ServiceAccount name"
// @Router /core/serviceaccounts/{namespace}/{name} [get]
func GetNamespacedServiceAccounts(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ServiceAccounts(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, list)
}

/*
	TODO: Test Replace method
*/

// ReplaceNamespacedPods godoc
// @Summary 특정 Pod 수정
// @Description 특정 Pod 수정
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param pod body string true "Pod manifest"
// @Router /core/pods [put]
func ReplaceNamespacedPods(ctx echo.Context) error {
	// namespace := ctx.Param(util.NamespaceString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Pod).Namespace
	updated, err := client.GetKubeClient().CoreV1().Pods(namespace).Update(context.TODO(), body.(*corev1.Pod), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedPodStatuses godoc
// @Summary 특정 PodStatus 수정
// @Description 특정 PodStatus 수정
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param pod body string true "PodStatus manifest"
// @Router /core/podstatuses [put]
// TODO: Status?
func ReplaceNamespacedPodStatuses(ctx echo.Context) error {
	// namespace := ctx.Param(util.NamespaceString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Pod).Namespace
	updated, err := client.GetKubeClient().CoreV1().Pods(namespace).UpdateStatus(context.TODO(), body.(*corev1.Pod), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedServices godoc
// @Summary 특정 Service 수정
// @Description 특정 Service 수정
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param pod body string true "Service manifest"
// @Router /core/services [put]
func ReplaceNamespacedServices(ctx echo.Context) error {
	// namespace := ctx.Param(util.NamespaceString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Service).Namespace
	updated, err := client.GetKubeClient().CoreV1().Services(namespace).Update(context.TODO(), body.(*corev1.Service), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedServiceStatuses godoc
// @Summary 특정 ServiceStatus 수정
// @Description 특정 ServiceStatus 수정
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param pod body string true "ServiceStatus manifest"
// @Router /core/servicestatuses [put]
// TODO:
func ReplaceNamespacedServiceStatuses(ctx echo.Context) error {
	// namespace := ctx.Param(util.NamespaceString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Service).Namespace
	updated, err := client.GetKubeClient().CoreV1().Services(namespace).UpdateStatus(context.TODO(), body.(*corev1.Service), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

/*
	TODO: Test Patch method
*/

// PatchNamespacedPods ...
func PatchNamespacedPods(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	if namespace == "" {
		namespace = body.(*corev1.Pod).Namespace
	}
	if name == "" {
		name = body.(*corev1.Pod).Name
	}

	var bodyBytes []byte
	if ctx.Request().Body != nil {
		bodyBytes, _ = ioutil.ReadAll(ctx.Request().Body)
	} else {
		return ctx.JSON(http.StatusBadRequest, nil)
	}
	updated, err := client.GetKubeClient().CoreV1().Pods(namespace).Patch(context.TODO(), name, types.JSONPatchType, bodyBytes, metav1.PatchOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// PatchNamespacedServices ...
func PatchNamespacedServices(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	if namespace == "" {
		namespace = body.(*corev1.Service).Namespace
	}
	if name == "" {
		name = body.(*corev1.Service).Name
	}

	var bodyBytes []byte
	if ctx.Request().Body != nil {
		bodyBytes, _ = ioutil.ReadAll(ctx.Request().Body)
	} else {
		return ctx.JSON(http.StatusBadRequest, nil)
	}
	updated, err := client.GetKubeClient().CoreV1().Services(namespace).Patch(
		context.TODO(),
		name,
		types.JSONPatchType,
		bodyBytes,
		metav1.PatchOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

/*
	DeleteCollection: delete with given labelSelector
	TODO: implement
*/

// DeleteCollectionNamespacedConfigMaps godoc
// @deprecated
// @Summary 특정 네임스페이스에서 지정된 레이블에 맞는 ConfigMap 삭제
// @Description 특정 네임스페이스에서 지정된 레이블에 맞는 ConfigMap을 삭제한다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ConfigMap namespace"
// @Router /core/configmaps/{namespace} [delete]
func DeleteCollectionNamespacedConfigMaps(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	label := "" // TODO
	err := client.GetKubeClient().CoreV1().ConfigMaps(namespace).DeleteCollection(
		context.TODO(),
		metav1.DeleteOptions{},
		metav1.ListOptions{
			LabelSelector: label,
		})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedEndpoints ...
func DeleteCollectionNamespacedEndpoints(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().Endpoints(namespace).DeleteCollection(
		context.TODO(),
		metav1.DeleteOptions{},
		metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedEvents ...
func DeleteCollectionNamespacedEvents(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().Events(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedLimitRanges ...
func DeleteCollectionNamespacedLimitRanges(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().LimitRanges(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNodes ...
func DeleteCollectionNodes(ctx echo.Context) error {
	err := client.GetKubeClient().CoreV1().Nodes().DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionPersistentVolumes ...
func DeleteCollectionPersistentVolumes(ctx echo.Context) error {
	err := client.GetKubeClient().CoreV1().PersistentVolumes().DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedPersistentVolumeClaims ...
func DeleteCollectionNamespacedPersistentVolumeClaims(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().PersistentVolumeClaims(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedPods ...
func DeleteCollectionNamespacedPods(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().Pods(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedPodTemplates ...
func DeleteCollectionNamespacedPodTemplates(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().PodTemplates(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedReplicationControllers ...
func DeleteCollectionNamespacedReplicationControllers(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().ReplicationControllers(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedResourceQuotas ...
func DeleteCollectionNamespacedResourceQuotas(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().ResourceQuotas(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedSecrets ...
func DeleteCollectionNamespacedSecrets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().Secrets(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedServiceAccounts ...
func DeleteCollectionNamespacedServiceAccounts(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().ServiceAccounts(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

/*
	TODO: delete with manifest
*/

// DeleteNamespacedConfigMaps godoc
// @Summary 특정 네임스페이스의 특정 ConfigMap 삭제
// @Description 특정 네임스페이스의 특정 ConfigMap 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ConfigMap namespace"
// @Param name path string true "ConfigMap name"
// @Router /core/configmaps/{namespace}/{name} [delete]
func DeleteNamespacedConfigMaps(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.ConfigMap).Namespace
	// name := body.(*corev1.ConfigMap).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().ConfigMaps(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedEndpoints godoc
// @Summary 특정 네임스페이스의 Endpoints 삭제
// @Description 특정 네임스페이스의 Endpoints 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Endpoints namespace"
// @Param name path string true "Endpoints name"
// @Router /core/endpoints/{namespace}/{name} [delete]
func DeleteNamespacedEndpoints(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.Endpoints).Namespace
	// name := body.(*corev1.Endpoints).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().Endpoints(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedEvents godoc
// @Summary 특정 네임스페이스의 특정 Event 삭제
// @Description 특정 네임스페이스의 특정 Event 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Event namespace"
// @Param name path string true "Event name"
// @Router /core/events/{namespace}/{name} [delete]
func DeleteNamespacedEvents(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.Event).Namespace
	// name := body.(*corev1.Event).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().Events(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedLimitRanges godoc
// @Summary 특정 네임스페이스의 특정 LimitRange 삭제
// @Description 특정 네임스페이스의 특정 LimitRange 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "LimitRange namespace"
// @Param name path string true "LimitRange name"
// @Router /core/limitranges/{namespace}/{name} [delete]
func DeleteNamespacedLimitRanges(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.LimitRange).Namespace
	// name := body.(*corev1.LimitRange).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().LimitRanges(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespaces godoc
// @Summary 특정 Namespace 삭제
// @Description 지정된 Namespace를 삭제한다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param name path string true "Namespace name"
// @Router /core/namespaces/{name} [delete]
func DeleteNamespaces(ctx echo.Context) error {
	// var namespace string
	// test := ctx.ParamNames()
	// ctx.Logger().Debug(test)
	name := ctx.Param(util.NameString)
	// body, code, err := util.ParseBody(ctx)
	// if code == http.StatusOK && body == nil {
	// 	namespace, _, _ = util.Namer(ctx)
	// } else {
	// 	namespace = body.(*corev1.Namespace).Name
	// }
	err := client.GetKubeClient().CoreV1().Namespaces().Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNodes godoc
// @Summary 특정 Node 삭제
// @Description 지정된 Node를 삭제한다.
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param name path string true "Node name"
// @Router /core/nodes/{name} [delete]
func DeleteNodes(ctx echo.Context) error {
	var name string
	body, code, err := util.ParseBody(ctx)
	if code == http.StatusOK && body == nil {
		_, name, _ = util.Namer(ctx)
	} else {
		name = body.(*corev1.Node).Name
	}
	err = client.GetKubeClient().CoreV1().Nodes().Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeletePersistentVolumes godoc
// @Summary 특정 PersistentVolume 삭제
// @Description 특정 PersistentVolume 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param name path string true "PersistentVolume name"
// @Router /core/persistentvolumes/{name} [delete]
func DeletePersistentVolumes(ctx echo.Context) error {
	// var name string
	// body, code, err := util.ParseBody(ctx)
	// if code == http.StatusOK && body == nil {
	// 	_, name, _ = util.Namer(ctx)
	// } else {
	// 	name = body.(*corev1.PersistentVolume).Name
	// }
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().PersistentVolumes().Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedPersistentVolumeClaims godoc
// @Summary 특정 네임스페이스의 특정 PersistentVolumeClaim 삭제
// @Description 특정 네임스페이스의 특정 PersistentVolumeClaim 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "PersistentVolumeClaim namespace"
// @Param name path string true "PersistentVolumeClaim name"
// @Router /core/persistentvolumeclaims/{namespace}/{name} [delete]
func DeleteNamespacedPersistentVolumeClaims(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.PersistentVolumeClaim).Namespace
	// name := body.(*corev1.PersistentVolumeClaim).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().PersistentVolumeClaims(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedPods godoc
// @Summary 특정 네임스페이스의 특정 Pod 삭제
// @Description 특정 네임스페이스의 특정 Pod 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Pod namespace"
// @Param name path string true "Pod name"
// @Router /core/pods/{namespace}/{name} [delete]
func DeleteNamespacedPods(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.Pod).Namespace
	// name := body.(*corev1.Pod).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().Pods(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedPodTemplates godoc
// @Summary 특정 네임스페이스의 특정 PodTemplate 삭제
// @Description 특정 네임스페이스의 특정 PodTemplate 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "PodTemplate namespace"
// @Param name path string true "PodTemplate name"
// @Router /core/podtemplates/{namespace}/{name} [delete]
func DeleteNamespacedPodTemplates(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.PodTemplate).Namespace
	// name := body.(*corev1.PodTemplate).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().PodTemplates(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedReplicationControllers godoc
// @Summary 특정 네임스페이스의 특정 ReplicationController 삭제
// @Description 특정 네임스페이스의 특정 ReplicationController 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ReplicationController namespace"
// @Param name path string true "ReplicationController name"
// @Router /core/replicationcontrollers/{namespace}/{name} [delete]
func DeleteNamespacedReplicationControllers(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.ReplicationController).Namespace
	// name := body.(*corev1.ReplicationController).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().ReplicationControllers(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedResourceQuotas godoc
// @Summary 특정 네임스페이스의 특정 ResourceQuota 삭제
// @Description 특정 네임스페이스의 특정 ResourceQuota 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ResourceQuota namespace"
// @Param name path string true "ResourceQuota name"
// @Router /core/resourcequota/{namespace}/{name} [delete]
func DeleteNamespacedResourceQuotas(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.ResourceQuota).Namespace
	// name := body.(*corev1.ResourceQuota).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().ResourceQuotas(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedSecrets godoc
// @Summary 특정 네임스페이스의 특정 Secret 삭제
// @Description 특정 네임스페이스의 특정 Secret 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Secret namespace"
// @Param name path string true "Secret name"
// @Router /core/secrets/{namespace}/{name} [delete]
func DeleteNamespacedSecrets(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.Secret).Namespace
	// name := body.(*corev1.Secret).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().Secrets(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedServices godoc
// @Summary 특정 네임스페이스의 특정 Service 삭제
// @Description 특정 네임스페이스의 특정 Service 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "Service namespace"
// @Param name path string true "Service name"
// @Router /core/services/{namespace}/{name} [delete]
func DeleteNamespacedServices(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.Service).Namespace
	// name := body.(*corev1.Service).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().Services(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedServiceAccounts godoc
// @Summary 특정 네임스페이스의 특정 ServiceAccount 삭제
// @Description 특정 네임스페이스의 특정 ServiceAccount 삭제
// @Tags core
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 400,404,500 {object} map[string]interface{}
// @Param namespace path string true "ServiceAccount namespace"
// @Param name path string true "ServiceAccount name"
// @Router /core/serviceaccounts/{namespace}/{name} [delete]
func DeleteNamespacedServiceAccounts(ctx echo.Context) error {
	// body, code, err := util.ParseBody(ctx)
	// if err != nil {
	// 	return ctx.JSON(code, err)
	// }
	// namespace := body.(*corev1.ServiceAccount).Namespace
	// name := body.(*corev1.ServiceAccount).Name
	// if namespace == "" {
	// 	namespace = metav1.NamespaceDefault
	// }
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	err := client.GetKubeClient().CoreV1().ServiceAccounts(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}
