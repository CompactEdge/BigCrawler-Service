package main

import (
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/compactedge/cewizontech/service-bus/pkg/client"
	"github.com/compactedge/cewizontech/service-bus/pkg/controller"
	"github.com/compactedge/cewizontech/service-bus/pkg/mq"
	"github.com/compactedge/cewizontech/service-bus/pkg/util"

	_ "github.com/compactedge/cewizontech/service-bus/docs"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
	echoSwagger "github.com/swaggo/echo-swagger" // echo-swagger middleware
	// "github.com/spf13/cobra"
)

var flags util.Cli

func init() {
	log.SetPrefix("std")

	flags.Parse()

	if err := client.SetConfig(); err != nil {
		panic(err)
	}
}

// @title Swagger API
// @version 1.0
// @description This is a Service Bus server.

// @contact.name API Support
// @contact.url http://www.wizontech.com/
// @contact.email changsu.im@wizontech.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host 127.0.0.1:7000
// @BasePath /api/v1
// @schemes http
func main() {
	// Gracefully stop application
	var gracefulStop = make(chan os.Signal)
	// caught sig: urgent I/O condition
	// caught sig: interrupt
	signal.Notify(gracefulStop, syscall.SIGINT, syscall.SIGTERM)
	var timeunit time.Duration
	timeunit = 1
	go func() {
		sig := <-gracefulStop
		log.Printf("caught sig: %+v", sig)
		log.Printf("Wait for %d second to finish processing", timeunit)
		time.Sleep(timeunit * time.Second)
		os.Exit(1)
	}()

	e := echo.New()
	e.HideBanner = true

	e.GET("/swagger/*", echoSwagger.WrapHandler)
	
	if viper.GetBool("enable.rabbitmq") == true {
		log.Debug("message queue channel init")
		mq.SetConfigChannel(e)
		log.Debug("message queue init")
		mq.SetConfig()
	}

	logConfig := middleware.LoggerConfig{
		// Format: "method=${method}, uri=${uri}, status=${status}\n",
		Format: `
{
	"time":"${time_rfc3339_nano}",
	"method":"${method}",
	"uri":"${uri}",
	"status":${status},"error":"${error}",
	"latency":"${latency_human}",
	"bytes_in":${bytes_in},"bytes_out":${bytes_out}
}` + "\n",
		Output: os.Stdout,
	}
	e.Use(middleware.LoggerWithConfig(logConfig))
	// e.Use(mq.BusClientAPI)

	middleware.DefaultCORSConfig = middleware.CORSConfig{
		Skipper:      middleware.DefaultSkipper,
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"*"},
		// AllowMethods: []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},
	}
	e.Use(middleware.CORSWithConfig(middleware.DefaultCORSConfig))
	
	if flags.Debug == true {
		e.Logger.SetLevel(log.DEBUG)
	} else {
		e.Logger.SetLevel(log.INFO)
	}
	e.Logger.SetPrefix("echo")

	e.GET("/health", healthCheck)
	api := e.Group("/api")
	c := controller.New()
	c.Register(api)

	server := ":" + viper.GetString("svcbus.server.port")
	e.Logger.Info("Running Compact Edge Service Bus" + server)

	log.Fatal(e.Start(server))
	// select {}
}

// HealthCheck godoc
// @Summary 헬스 체크
// @Description 헬스 체크를 위한 API
// @Tags root
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /health [get]
func healthCheck(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, "OK")
}
