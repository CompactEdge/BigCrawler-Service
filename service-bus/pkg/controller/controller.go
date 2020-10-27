package controller

import (
	"github.com/labstack/echo/v4"
)

// Controller ...
type Controller struct{}

// New ...
func New() *Controller {
	return &Controller{}
}

// Register ...
func (c *Controller) Register(api *echo.Group) {
	v1 := api.Group("/v1")
	newAppsController(v1)
	newBatchController(v1)
	newCoreController(v1)
	newNetworkingController(v1)
	newStorageController(v1)

	// TODO
	// admissionregistrationV1
	// authenticationV1
	// authorizationV1
	// autoscalingV1
	// certificatesV1
	// coordinationV1
	// eventsV1
	// extensionsV1beta1
	// nodeV1beta1
	// policyV1beta1
	// rbacV1
	// schedulingV1
	// settingsV1alpha1
}
