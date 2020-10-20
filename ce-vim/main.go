package main

import (
	"net/http"
	"os"

	"github.com/compactedge/cewizontech/ce-vim/pkg/client"
	"github.com/compactedge/cewizontech/ce-vim/pkg/controller"
	"github.com/compactedge/cewizontech/ce-vim/pkg/mq"
	"github.com/compactedge/cewizontech/ce-vim/pkg/util"

	// "github.com/compactedge/cewizontech/ce-vim/pkg/controller"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
	// "github.com/spf13/cobra"
)

func init() {
	log.SetLevel(log.DEBUG)
	log.SetPrefix("std")

	// util.FlagInit()

	flags := util.Cli{}
	flags.Parse()

	if err := client.SetConfig(); err != nil {
		panic(err)
	}
	// service.Init()
	// controller.Init()

	if viper.GetBool("enable.rabbitmq") == true {
		log.Debug("message queue channel init")
		mq.Init()
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
	handler := controller.NewHandler()
	handler.Register(api)

	server := ":" + viper.GetString("vim.server.port")
	e.Logger.Info("Running CE-VIM" + server)

	log.Fatal(e.Start(server))
	// select {}
}

func healthCheck(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, "OK")
}
