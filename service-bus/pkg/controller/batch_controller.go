package controller

import (
	"github.com/compactedge/cewizontech/ce-service-bus/pkg/service"
	"github.com/labstack/echo/v4"
)

func newBatchController(v1 *echo.Group) {
	batch := v1.Group("/batch")

	// CREATE
	batch.POST("/jobs", service.CreateNamespacedJobs)

	// LIST
	batch.GET("/jobs", service.ListJobs)

	// GET
	batch.GET("/jobs/:name", service.GetJobs)

	// REPLACE
	batch.PUT("/jobs/:namespace", service.ReplaceJobs)
	batch.PUT("/jobstatuses/:namespace", service.ReplaceJobStatuses)

	// PATCH
	// TODO:
	// batch.PATCH("/jobs", service.PatchNamespacedJobs)

	// DELETE COLLECTION
	collection := batch.Group("/collection")
	collection.DELETE("/jobs/:namespace", service.DeleteCollectionJobs)

	// DELETE
	batch.DELETE("/jobs/:namespace/:name", service.DeleteJobs)
}
