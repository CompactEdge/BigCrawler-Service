package controller

import (
	"github.com/compactedge/cewizontech/service-bus/pkg/service"
	"github.com/labstack/echo/v4"
)

func newAppsController(v1 *echo.Group) {
	apps := v1.Group("/apps")

	// CREATE
	apps.POST("/controllerrevisions", service.CreateNamespacedControllerRevisions)
	apps.POST("/daemonsets", service.CreateNamespacedDaemonSets)
	apps.POST("/deployments", service.CreateNamespacedDeployments)
	apps.POST("/replicasets", service.CreateNamespacedReplicaSets)
	apps.POST("/statefulsets", service.CreateNamespacedStatefulSets)

	// LIST
	apps.GET("/controllerrevisions", service.ListControllerRevisionsForAllNamespaces)
	apps.GET("/controllerrevisions/:namespace", service.ListNamespacedControllerRevisions)
	apps.GET("/daemonsets", service.ListDaemonSetsForAllNamespaces)
	apps.GET("/daemonsets/:namespace", service.ListNamespacedDaemonSets)
	apps.GET("/deployments", service.ListDeploymentsForAllNamespaces)
	apps.GET("/deployments/:namespace", service.ListNamespacedDeployments)
	apps.GET("/replicasets", service.ListReplicaSetsForAllNamespaces)
	apps.GET("/replicasets/:namespace", service.ListNamespacedReplicaSets)
	apps.GET("/statefulsets", service.ListStatefulSetsForAllNamespaces)
	apps.GET("/statefulsets/:namespace", service.ListNamespacedStatefulSets)

	// GET
	apps.GET("/controllerrevisions/:namespace/:name", service.GetNamespacedControllerRevisions)
	apps.GET("/daemonsets/:namespace/:name", service.GetNamespacedDaemonSets)
	apps.GET("/deployments/:namespace/:name", service.GetNamespacedDeployments)
	apps.GET("/deploymentscale/:namespace/:name", service.GetNamespacedDeploymentScale)
	apps.GET("/replicasets/:namespace/:name", service.GetNamespacedReplicaSets)
	apps.GET("/replicasetscale/:namespace/:name", service.GetNamespacedReplicaSetScale)
	apps.GET("/statefulsets/:namespace/:name", service.GetNamespacedStatefulSets)
	apps.GET("/statefulsetscale/:namespace/:name", service.GetNamespacedStatefulSetScale)

	// REPLACE
	// TODO: statefulsets, replicasets
	apps.PUT("/controllerrevisions", service.ReplaceNamespacedControllerRevisions)
	apps.PUT("/daemonsets", service.ReplaceNamespacedDaemonSets)
	apps.PUT("/daemonsetstatuses", service.ReplaceNamespacedDaemonSetStatuses)
	apps.PUT("/deployments", service.ReplaceNamespacedDeployments)
	apps.PUT("/deploymentscale", service.ReplaceNamespacedDeploymentScale)
	apps.PUT("/deploymentstatuses", service.ReplaceNamespacedDeploymentStatuses)

	// PATCH
	// TODO:
	apps.PATCH("/controllerrevisions", service.PatchNamespacedControllerRevisions)
	apps.PATCH("/daemonsets", service.PatchNamespacedDaemonSets)
	apps.PATCH("/deployments", service.PatchNamespacedDeployments)

	// DELETE COLLECTION
	collection := apps.Group("/collection")
	collection.DELETE("/controllerrevisions/:namespace", service.DeleteCollectionNamespacedControllerRevisions)
	collection.DELETE("/daemonsets/:namespace", service.DeleteCollectionNamespacedDaemonSets)
	collection.DELETE("/deployments/:namespace", service.DeleteCollectionNamespacedDeployments)
	collection.DELETE("/replicasets/:namespace", service.DeleteCollectionNamespacedReplicaSets)
	collection.DELETE("/statefulsets/:namespace", service.DeleteCollectionNamespacedStatefulSets)

	// DELETE
	apps.DELETE("/controllerrevisions", service.DeleteNamespacedControllerRevisions)
	apps.DELETE("/daemonsets", service.DeleteNamespacedDaemonsets)
	apps.DELETE("/deployments", service.DeleteNamespacedDeployments)
	apps.DELETE("/replicasets", service.DeleteNamespacedReplicaSets)
	apps.DELETE("/statefulsets", service.DeleteNamespacedStatefulSets)
}
