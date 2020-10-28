package controller

import (
	"github.com/compactedge/cewizontech/service-bus/pkg/service"
	"github.com/labstack/echo/v4"
)

func newNetworkingController(v1 *echo.Group) {
	networking := v1.Group("/networking")

	// CREATE
	networking.POST("/networkpolicies", service.CreateNamespacedNetworkPolicies)
	networking.POST("/ingresses", service.CreateNamespacedIngresses)
	networking.POST("/ingressclasses", service.CreateIngressClasses)

	// LIST
	networking.GET("/networkpolicies", service.ListNetworkPoliciesForAllNamespaces)
	networking.GET("/networkpolicies/:namespace", service.ListNamespacedNetworkPolicies)
	networking.GET("/ingresses", service.ListIngressesForAllNamespaces)
	networking.GET("/ingresses/:namespace", service.ListNamespacedIngresses)
	networking.GET("/ingressclasses", service.ListIngressClasses)

	// GET
	networking.GET("/networkpolicies/:namespace/:name", service.GetNamespacedNetworkPolicies)
	networking.GET("/ingresses/:namespace/:name", service.GetNamespacedIngresses)
	networking.GET("/ingressclasses/:name", service.GetIngressClasses)

	// REPLACE
	networking.PUT("/networkpolicies/:namespace", service.ReplaceNamespacedNetworkPolicies)
	networking.PUT("/ingresses/:namespace", service.ReplaceNamespacedIngresses)
	networking.PUT("/ingressclasses", service.ReplaceIngressClasses)

	// PATCH
	// TODO:
	// networking.PATCH("/networkpolicies", service.PatchNamespaced)

	// DELETE COLLECTION
	collection := networking.Group("/collection")
	collection.DELETE("/networkpolicies/:namespace", service.DeleteCollectionNamespacedNetworkPolicies)
	collection.DELETE("/ingresses/:namespace", service.DeleteCollectionNamespacedIngresses)
	collection.DELETE("/ingressclasses", service.DeleteCollectionNamespacedIngressClasses)

	// DELETE
	networking.DELETE("/networkpolicies/:namespace/:name", service.DeleteNamespacedNetworkPolicies)
	networking.DELETE("/ingresses/:namespace/:name", service.DeleteNamespacedIngresses)
	networking.DELETE("/ingressclasses/:name", service.DeleteIngressClasses)
}
