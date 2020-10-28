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

// CreateNamespacedConfigMaps ...
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

// CreateNamespacedEndPoints ...
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

// CreateNamespacedEvents ...
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

// CreateNamespacedEvictions ...
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

// CreateNamespacedLimitRanges ...
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

// CreateNamespaces ...
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

// CreateNodes ...
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

// CreatePersistentVolumes ...
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

// CreateNamespacedPersistentVolumeClaims ...
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

// CreateNamespacedPods ...
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

// CreateNamespacedPodBindings ...
func CreateNamespacedPodBindings(ctx echo.Context) error {
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

// CreateNamespacedPodTemplates ...
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

// CreateNamespacedReplicationControllers ...
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

// CreateNamespacedResourceQuotas ...
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

// CreateNamespacedSecrets ...
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

// CreateNamespacedServices ...
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

// CreateNamespacedServiceAccounts ...
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

// ListComponentStatuses ...
func ListComponentStatuses(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().ComponentStatuses().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListConfigMapsForAllNamespaces ...
func ListConfigMapsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().ConfigMaps(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedConfigMaps ...
func ListNamespacedConfigMaps(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().ConfigMaps(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListEndpointsForAllNamespaces ...
func ListEndpointsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Endpoints(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedEndpoints ...
func ListNamespacedEndpoints(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().Endpoints(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListEventsForAllNamespaces ...
func ListEventsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Events(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedEvents ...
func ListNamespacedEvents(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().Events(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListLimitRangesForAllNamespaces ...
func ListLimitRangesForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().LimitRanges(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedLimitRanges ...
func ListNamespacedLimitRanges(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().LimitRanges(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespaces ...
func ListNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNode ...
func ListNode(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Nodes().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedPersistentVolumes ...
func ListNamespacedPersistentVolumes(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().PersistentVolumes().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListPersistentVolumeClaimsForAllNamespaces ...
func ListPersistentVolumeClaimsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().PersistentVolumeClaims(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedPersistentVolumeClaims ...
func ListNamespacedPersistentVolumeClaims(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().PersistentVolumeClaims(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListPodsForAllNamespaces ...
func ListPodsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Pods(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedPods ...
func ListNamespacedPods(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().Pods(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListPodTemplatesForAllNamespaces ...
func ListPodTemplatesForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().PodTemplates(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedPodTemplates ...
func ListNamespacedPodTemplates(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().PodTemplates(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListReplicationControllersForAllNamespaces ...
func ListReplicationControllersForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().ReplicationControllers(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedReplicationControllers ...
func ListNamespacedReplicationControllers(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().ReplicationControllers(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListResourceQuotasForAllNamespaces ...
func ListResourceQuotasForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().ResourceQuotas(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedResourceQuotas ...
func ListNamespacedResourceQuotas(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().ResourceQuotas(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListSecretsForAllNamespaces ...
func ListSecretsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Secrets(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedSecret ...
func ListNamespacedSecret(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().Secrets(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListServicesForAllNamespaces ...
func ListServicesForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().Services(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedServices ...
func ListNamespacedServices(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().Services(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListServiceAccountsForAllNamespaces ...
func ListServiceAccountsForAllNamespaces(ctx echo.Context) error {
	list, err := client.GetKubeClient().CoreV1().ServiceAccounts(metav1.NamespaceAll).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ListNamespacedServiceAccounts ...
func ListNamespacedServiceAccounts(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	list, err := client.GetKubeClient().CoreV1().ServiceAccounts(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetComponentStatuses ...
func GetComponentStatuses(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ComponentStatuses().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedConfigMaps ...
func GetNamespacedConfigMaps(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ConfigMaps(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedEndpoints ...
func GetNamespacedEndpoints(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Endpoints(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedEvents ...
func GetNamespacedEvents(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Events(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedLimitRanges ...
func GetNamespacedLimitRanges(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().LimitRanges(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespaces ...
func GetNamespaces(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Namespaces().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNodes ...
func GetNodes(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Nodes().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetPersistentVolumes ...
func GetPersistentVolumes(ctx echo.Context) error {
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().PersistentVolumes().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedPersistentVolumeClaims ...
func GetNamespacedPersistentVolumeClaims(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().PersistentVolumeClaims(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedPods ...
func GetNamespacedPods(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Pods(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedPodLogs ...
// TODO
func GetNamespacedPodLogs(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	rest := client.GetKubeClient().CoreV1().Pods(namespace).GetLogs(name, &corev1.PodLogOptions{})
	return ctx.JSON(http.StatusOK, rest)
}

// GetNamespacedPodTemplates ...
func GetNamespacedPodTemplates(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().PodTemplates(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedReplicationControllers ...
func GetNamespacedReplicationControllers(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ReplicationControllers(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedReplicationControllerScales ...
func GetNamespacedReplicationControllerScales(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ReplicationControllers(namespace).GetScale(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedResourceQuotas ...
func GetNamespacedResourceQuotas(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ResourceQuotas(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedSecrets ...
func GetNamespacedSecrets(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Secrets(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedServices ...
func GetNamespacedServices(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().Services(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// GetNamespacedServiceAccounts ...
func GetNamespacedServiceAccounts(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	name := ctx.Param(util.NameString)
	list, err := client.GetKubeClient().CoreV1().ServiceAccounts(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}

// ReplaceNamespacedPods ...
func ReplaceNamespacedPods(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	updated, err := client.GetKubeClient().CoreV1().Pods(namespace).Update(context.TODO(), body.(*corev1.Pod), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedPodStatuses ...
// TODO: Status?
func ReplaceNamespacedPodStatuses(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	updated, err := client.GetKubeClient().CoreV1().Pods(namespace).UpdateStatus(context.TODO(), body.(*corev1.Pod), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedServices ...
func ReplaceNamespacedServices(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	updated, err := client.GetKubeClient().CoreV1().Services(namespace).Update(context.TODO(), body.(*corev1.Service), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// ReplaceNamespacedServiceStatuses ...
// TODO:
func ReplaceNamespacedServiceStatuses(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	updated, err := client.GetKubeClient().CoreV1().Services(namespace).UpdateStatus(context.TODO(), body.(*corev1.Service), metav1.UpdateOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, updated)
}

// PatchNamespacedPods ...
// TODO:
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
	updated, err := client.GetKubeClient().CoreV1().Services(namespace).Patch(context.TODO(), name, types.JSONPatchType, bodyBytes, metav1.PatchOptions{})
	return ctx.JSON(http.StatusOK, updated)
}

// DeleteCollectionNamespacedConfigMaps ...
// TODO: given labelSelector
func DeleteCollectionNamespacedConfigMaps(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().ConfigMaps(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteCollectionNamespacedEndpoints ...
func DeleteCollectionNamespacedEndpoints(ctx echo.Context) error {
	namespace := ctx.Param(util.NamespaceString)
	err := client.GetKubeClient().CoreV1().Endpoints(namespace).DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{})
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

// DeleteNamespacedConfigMaps ...
func DeleteNamespacedConfigMaps(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.ConfigMap).Namespace
	name := body.(*corev1.ConfigMap).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().ConfigMaps(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedEndpoints ...
func DeleteNamespacedEndpoints(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Endpoints).Namespace
	name := body.(*corev1.Endpoints).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().Endpoints(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedEvents ...
func DeleteNamespacedEvents(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Event).Namespace
	name := body.(*corev1.Event).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().Events(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedLimitRanges ...
func DeleteNamespacedLimitRanges(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.LimitRange).Namespace
	name := body.(*corev1.LimitRange).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().LimitRanges(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespaces ...
func DeleteNamespaces(ctx echo.Context) error {
	var namespace string
	body, code, err := util.ParseBody(ctx)
	if code == http.StatusOK && body == nil {
		namespace, _, _ = util.Namer(ctx)
	} else {
		namespace = body.(*corev1.Namespace).Name
	}
	err = client.GetKubeClient().CoreV1().Namespaces().Delete(context.TODO(), namespace, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNodes ...
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

// DeletePersistentVolumes ...
func DeletePersistentVolumes(ctx echo.Context) error {
	var name string
	body, code, err := util.ParseBody(ctx)
	if code == http.StatusOK && body == nil {
		_, name, _ = util.Namer(ctx)
	} else {
		name = body.(*corev1.PersistentVolume).Name
	}
	err = client.GetKubeClient().CoreV1().PersistentVolumes().Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedPersistentVolumeClaims ...
func DeleteNamespacedPersistentVolumeClaims(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.PersistentVolumeClaim).Namespace
	name := body.(*corev1.PersistentVolumeClaim).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().PersistentVolumeClaims(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedPods ...
func DeleteNamespacedPods(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Pod).Namespace
	name := body.(*corev1.Pod).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().Pods(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedPodTemplates ...
func DeleteNamespacedPodTemplates(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.PodTemplate).Namespace
	name := body.(*corev1.PodTemplate).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().PodTemplates(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedReplicationControllers ...
func DeleteNamespacedReplicationControllers(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.ReplicationController).Namespace
	name := body.(*corev1.ReplicationController).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().ReplicationControllers(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedResourceQuotas ...
func DeleteNamespacedResourceQuotas(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.ResourceQuota).Namespace
	name := body.(*corev1.ResourceQuota).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().ResourceQuotas(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedSecrets ...
func DeleteNamespacedSecrets(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Secret).Namespace
	name := body.(*corev1.Secret).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().Secrets(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedServices ...
func DeleteNamespacedServices(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.Service).Namespace
	name := body.(*corev1.Service).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().Services(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}

// DeleteNamespacedServiceAccounts ...
func DeleteNamespacedServiceAccounts(ctx echo.Context) error {
	body, code, err := util.ParseBody(ctx)
	if err != nil {
		return ctx.JSON(code, err)
	}
	namespace := body.(*corev1.ServiceAccount).Namespace
	name := body.(*corev1.ServiceAccount).Name
	if namespace == "" {
		namespace = metav1.NamespaceDefault
	}
	err = client.GetKubeClient().CoreV1().ServiceAccounts(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err)
	}
	return ctx.JSON(http.StatusOK, nil)
}
