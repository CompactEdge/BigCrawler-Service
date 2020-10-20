package main

import (
	"net/http"
	"os"

	"github.com/compactedge/cewizontech/ce-broker/pkg/controller"
	"github.com/compactedge/cewizontech/ce-broker/pkg/mq"
	"github.com/compactedge/cewizontech/ce-broker/pkg/util"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
)

func init() {
	log.SetLevel(log.DEBUG)
	log.SetPrefix("std")

	flags := util.Cli{}
	flags.Parse()
	// c := flags.Parse()

	// if c.Debug == true {
	// 	log.SetupLog(true)
	// } else {
	// 	log.SetupLog(false)
	// }

	log.Debug("controller init")
	controller.SetConfig()

	if viper.GetBool("enable.rabbitmq") == true {
		log.Debug("message queue channel init")
		mq.SetConfigCh()
	}

	// if viper.GetBool("enable.resourceManager") == false {
	// 	log.Debug("db init")
	// 	db.SetConfig()
	// }

	if viper.GetBool("enable.rabbitmq") == true {
		log.Debug("message queue init")
		mq.SetConfig()
	}

}

func main() {
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
	// e.Logger.SetLevel(log.INFO)
	e.Logger.SetLevel(log.DEBUG)
	e.Logger.SetPrefix("echo")

	e.GET("/health", healthCheck)
	api := e.Group("/api")

	c := controller.New()
	c.Register(api)

	server := ":" + viper.GetString("broker.server.port")
	e.Logger.Info("Running CE-Broker" + server)

	log.Fatal(e.Start(server))
	// select {}
}

// healthCheck ...
func healthCheck(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, "OK")
}
