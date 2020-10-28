package main

import (
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/compactedge/cewizontech/api-gateway/pkg/controller"
	"github.com/compactedge/cewizontech/api-gateway/pkg/mq"
	"github.com/compactedge/cewizontech/api-gateway/pkg/util"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
)

var flags util.Cli

func init() {
	log.SetPrefix("std")

	// flags := util.Cli{}
	flags.Parse()

	log.Debug("controller init")
	controller.SetConfig()

	if viper.GetBool("enable.rabbitmq") == true {
		log.Debug("message queue init")
		mq.SetConfig()
	}

}

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

	server := ":" + viper.GetString("apigw.server.port")
	e.Logger.Info("Running Compact Edge API Gateway" + server)

	log.Fatal(e.Start(server))
	// select {}
}

// healthCheck ...
func healthCheck(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, "OK")
}