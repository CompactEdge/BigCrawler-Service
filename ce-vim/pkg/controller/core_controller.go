package controller

import (
	"github.com/compactedge/cewizontech/ce-vim/pkg/service"
	"github.com/labstack/echo/v4"
)

// Core ...
type Core struct{}

// NewCoreController ...
func NewCoreController(v1 *echo.Group) *Core {
	core := v1.Group("/core")
	core.POST("/createNamespace", service.CreateNamespace)
	core.GET("/listNode", service.ListNode)
	return &Core{}
}

// Register ...
// func (c *Core) Register(v1 *echo.Group) {
// 	core := v1.Group("/core")
// 	core.POST("/createNamespace", service.CreateNamespace)
// 	core.GET("/listNode", service.ListNode)
// }
