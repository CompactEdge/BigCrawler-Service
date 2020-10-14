package service

import (
	"github.com/labstack/gommon/log"
)

// patchStr ...
type patchStr struct {
	Operation string `json:"operation"`
	Path      string `json:"path"`
	Patchval  string `json:"patchval"`
}

// Init ...
func Init() {
	log.Debug("service pkg Init()")
	// initCore()
	// initApps()
	// initAutoscaling()
	// initBatch()
	// initExt()
	// initNetworking()
	// initStorage()
}
