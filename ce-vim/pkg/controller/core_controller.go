package controller

import (
	"github.com/compactedge/cewizontech/ce-vim/pkg/service"
	"github.com/labstack/echo/v4"
)

func newCoreController(v1 *echo.Group) {
	core := v1.Group("/core")

	// CREATE
	core.POST("/bindings", service.CreateNamespacedPodBindings)
	core.POST("/configmaps", service.CreateNamespacedConfigMaps)
	core.POST("/endpoints", service.CreateNamespacedEndPoints)
	core.POST("/events", service.CreateNamespacedEvents)
	core.POST("/evictions", service.CreateNamespacedEvictions)
	core.POST("/limitranges", service.CreateNamespacedLimitRanges)
	core.POST("/namespaces", service.CreateNamespaces)
	core.POST("/nodes", service.CreateNodes)
	core.POST("/persistentvolumes", service.CreatePersistentVolumes)
	core.POST("/persistentvolumeclaims", service.CreateNamespacedPersistentVolumeClaims)
	core.POST("/pods", service.CreateNamespacedPods)
	core.POST("/podtemplates", service.CreateNamespacedPodTemplates)
	core.POST("/replicationcontrollers", service.CreateNamespacedReplicationControllers)
	core.POST("/resourcequotas", service.CreateNamespacedResourceQuotas)
	core.POST("/secrets", service.CreateNamespacedSecrets)
	core.POST("/services", service.CreateNamespacedServices)
	core.POST("/serviceaccounts", service.CreateNamespacedServiceAccounts)

	// LIST
	core.GET("/componentstatuses", service.ListComponentStatuses)
	core.GET("/configmaps", service.ListConfigMapsForAllNamespaces)
	core.GET("/configmaps/:namespace", service.ListNamespacedConfigMaps)
	core.GET("/endpoints", service.ListEndpointsForAllNamespaces)
	core.GET("/endpoints/:namespace", service.ListNamespacedEndpoints)
	core.GET("/events", service.ListEventsForAllNamespaces)
	core.GET("/events/:namespace", service.ListNamespacedEvents)
	core.GET("/limitranges", service.ListLimitRangesForAllNamespaces)
	core.GET("/limitranges/:namespace", service.ListNamespacedLimitRanges)
	core.GET("/namespaces", service.ListNamespaces)
	core.GET("/node", service.ListNode)
	core.GET("/persistentvolumes", service.ListNamespacedPersistentVolumes)
	core.GET("/persistentvolumeclaims", service.ListPersistentVolumeClaimsForAllNamespaces)
	core.GET("/persistentvolumeclaims/:namespace", service.ListNamespacedPersistentVolumeClaims)
	core.GET("/pods", service.ListPodsForAllNamespaces)
	core.GET("/pods/:namespace", service.ListNamespacedPods)
	core.GET("/podtemplates", service.ListPodTemplatesForAllNamespaces)
	core.GET("/podtemplates/:namespace", service.ListNamespacedPodTemplates)
	core.GET("/replicationcontrollers", service.ListReplicationControllersForAllNamespaces)
	core.GET("/replicationcontrollers/:namespace", service.ListNamespacedReplicationControllers)
	core.GET("/resourcequota", service.ListResourceQuotasForAllNamespaces)
	core.GET("/resourcequota/:namespace", service.ListNamespacedResourceQuotas)
	core.GET("/secrets", service.ListSecretsForAllNamespaces)
	core.GET("/secrets/:namespace", service.ListNamespacedSecret)
	core.GET("/services", service.ListServicesForAllNamespaces)
	core.GET("/services/:namespace", service.ListNamespacedServices)
	core.GET("/serviceaccounts", service.ListServiceAccountsForAllNamespaces)
	core.GET("/serviceaccounts/:namespace", service.ListNamespacedServiceAccounts)

	// GET
	core.GET("/componentStatuses/:name", service.GetComponentStatuses)
	core.GET("/configmaps/:namespace/:name", service.GetNamespacedConfigMaps)
	core.GET("/endpoints/:namespace/:name", service.GetNamespacedEndpoints)
	core.GET("/events/:namespace/:name", service.GetNamespacedEvents)
	core.GET("/limitranges/:namespace/:name", service.GetNamespacedLimitRanges)
	core.GET("/namespaces/:name", service.GetNamespaces)
	// -- core.GET("/namespaces/:name", service.GetNamespaces) // >> echo framework
	core.GET("/nodes/:name", service.GetNodes)
	core.GET("/persistentvolumes/:name", service.GetPersistentVolumes)
	core.GET("/persistentvolumeclaims/:namespace/:name", service.GetNamespacedPersistentVolumeClaims)
	core.GET("/pods/:namespace/:name", service.GetNamespacedPods)
	core.GET("/podlogs/:namespace/:name", service.GetNamespacedPodLogs)
	core.GET("/podtemplates/:namespace/:name", service.GetNamespacedPodTemplates)
	core.GET("/replicationcontrollers/:namespace/:name", service.GetNamespacedReplicationControllers)
	core.GET("/replicationcontrollerscales/:namespace/:name", service.GetNamespacedReplicationControllerScales)
	core.GET("/resourcequotas/:namespace/:name", service.GetNamespacedResourceQuotas)
	core.GET("/secrets/:namespace:name", service.GetNamespacedSecrets)
	core.GET("/services/:namespace/:name", service.GetNamespacedServices)
	core.GET("/serviceaccounts/:namespace/:name", service.GetNamespacedServiceAccounts)

	// REPLACE
	// TODO:
	core.PUT("/pods/:namespace", service.ReplaceNamespacedPods)
	core.PUT("/podstatuses/:namespace", service.ReplaceNamespacedPodStatuses)
	core.PUT("/services/:namespace", service.ReplaceNamespacedServices)
	core.PUT("/servicestatuses/:namespace", service.ReplaceNamespacedServiceStatuses)

	// PATCH
	// TODO:
	core.PATCH("/pods/:namespace", service.PatchNamespacedPods)
	core.PATCH("/services/:namespace", service.PatchNamespacedServices)

	// DELETE COLLECTION
	collection := core.Group("/collection")
	collection.DELETE("/configmaps/:namespace", service.DeleteCollectionNamespacedConfigMaps)
	collection.DELETE("/endpoints/:namespace", service.DeleteCollectionNamespacedEndpoints)
	collection.DELETE("/events/:namespace", service.DeleteCollectionNamespacedEvents)
	collection.DELETE("/limitranges/:namespace", service.DeleteCollectionNamespacedLimitRanges)
	collection.DELETE("/nodes", service.DeleteCollectionNodes)
	collection.DELETE("/persistentvolumes", service.DeleteCollectionPersistentVolumes)
	collection.DELETE("/persistentvolumeclaims/:namespace", service.DeleteCollectionNamespacedPersistentVolumeClaims)
	collection.DELETE("/pods/:namespace", service.DeleteCollectionNamespacedPods)
	collection.DELETE("/podtemplates/:namespace", service.DeleteCollectionNamespacedPodTemplates)
	collection.DELETE("/replicationcontrollers/:namespace", service.DeleteCollectionNamespacedReplicationControllers)
	collection.DELETE("/resourcequotas/:namespace", service.DeleteCollectionNamespacedResourceQuotas)
	collection.DELETE("/secrets/:namespace", service.DeleteCollectionNamespacedSecrets)
	collection.DELETE("/serviceaccounts/:namespace", service.DeleteCollectionNamespacedServiceAccounts)

	// DELETE
	core.DELETE("/configmaps", service.DeleteNamespacedConfigMaps)
	core.DELETE("/endpoints", service.DeleteNamespacedEndpoints)
	core.DELETE("/events", service.DeleteNamespacedEvents)
	core.DELETE("/limitranges", service.DeleteNamespacedLimitRanges)
	core.DELETE("/namespaces/:namespace", service.DeleteNamespaces)
	core.DELETE("/nodes", service.DeleteNodes)
	core.DELETE("/persistentvolumes", service.DeletePersistentVolumes)
	core.DELETE("/persistentvolumeclaims", service.DeleteNamespacedPersistentVolumeClaims)
	core.DELETE("/pods", service.DeleteNamespacedPods)
	core.DELETE("/podtemplates", service.DeleteNamespacedPodTemplates)
	core.DELETE("/replicationcontrollers", service.DeleteNamespacedReplicationControllers)
	core.DELETE("/resourcequota", service.DeleteNamespacedResourceQuotas)
	core.DELETE("/secrets", service.DeleteNamespacedSecrets)
	core.DELETE("/services", service.DeleteNamespacedServices)
	core.DELETE("/serviceaccounts", service.DeleteNamespacedServiceAccounts)
}
