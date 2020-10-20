package controller

import (
	"github.com/compactedge/cewizontech/ce-vim/pkg/service"
	"github.com/labstack/echo/v4"
)

func newNetworkingController(v1 *echo.Group) {
	networking := v1.Group("/networking")

	// CREATE
	networking.POST("/networkpolicies", service.CreateNamespacedNetworkPolicies)

	// LIST
	// networking.GET("/networkpolicies", service.ListNetworkPoliciesForAllNamespaces)
	// networking.GET("/networkpolicies/:namespace", service.ListNamespacedNetworkPolicies)

	// GET
	// networking.GET("/networkpolicies/:namespace/:name", service.GetNamespacedNetworkPolicies)

	// REPLACE
	// networking.PUT("/networkpolicies", service.ReplaceNamespaced)
	
	// PATCH
	// networking.PATCH("/networkpolicies", service.PatchNamespaced)

	// DELETE COLLECTION
	// collection := networking.Group("/collection")
	// collection.DELETE("/networkpolicies/:namespace", service.DeleteCollectionNamespacedNetworkPolicies)

	// DELETE
	// networking.DELETE("/networkpolicies", service.DeleteNamespacedNetworkPolicies)

}
