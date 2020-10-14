package controller

import (
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

// Handler is member of controller package
type Handler struct{}

// NewHandler ...
func NewHandler() *Handler {
	return &Handler{}
}

// Register ...
func (h *Handler) Register(api *echo.Group) {
	v1 := api.Group("/v1")
	NewCoreController(v1)
	// NewCoreController().Register(v1)
}

// SetConfig ...
func SetConfig() {
	// Gracefully stop application
	var gracefulStop = make(chan os.Signal)
	signal.Notify(gracefulStop, syscall.SIGTERM)
	signal.Notify(gracefulStop, syscall.SIGINT)
	var timeunit time.Duration
	timeunit = 1
	go func() {
		sig := <-gracefulStop
		log.Printf("caught sig: %+v", sig)
		log.Printf("Wait for %d second to finish processing", timeunit)
		time.Sleep(timeunit * time.Second)
		os.Exit(1)
	}()
}
