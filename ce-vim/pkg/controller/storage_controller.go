package controller

import (
	"github.com/compactedge/cewizontech/ce-vim/pkg/service"
	"github.com/labstack/echo/v4"
)

func newStorageController(v1 *echo.Group) {
	storage := v1.Group("/storage")

	// CREATE
	storage.POST("/storageclasses", service.CreateStorageClasses)
	storage.POST("/volumeattachments", service.CreateVolumeAttachments)

	// LIST
	storage.GET("/storageclasses", service.ListStorageClasses)
	storage.GET("/volumeattachments", service.ListVolumeAttachments)

	// GET
	storage.GET("/storageclasses/:name", service.GetStorageClasses)
	storage.GET("/volumeattachments/:name", service.GetVolumeAttachments)

	// REPLACE
	storage.PUT("/storageclasses/:namespace", service.ReplaceStorageClasses)
	storage.PUT("/volumeattachments/:namespace", service.ReplaceVolumeAttachments)
	storage.PUT("/volumeattachmentstatuses/:namespace", service.ReplaceVolumeAttachmentStatuses)

	// PATCH
	// TODO:
	// storage.PATCH("/storageclasses", service.PatchNamespaced)

	// DELETE COLLECTION
	collection := storage.Group("/collection")
	collection.DELETE("/storageclasses/:namespace", service.DeleteCollectionStorageClasses)
	collection.DELETE("/volumeattachments/:namespace", service.DeleteCollectionVolumeAttachments)

	// DELETE
	storage.DELETE("/storageclasses/:namespace/:name", service.DeleteStorageClasses)
	storage.DELETE("/volumeattachments/:namespace/:name", service.DeleteVolumeAttachments)

}
