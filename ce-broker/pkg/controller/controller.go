package controller

import (
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/compactedge/cewizontech/ce-broker/pkg/service"
	"github.com/compactedge/cewizontech/ce-broker/pkg/util"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
)

const (
	PingerCount    = 30
	PingerInterval = time.Second * 1
	PingerTimeout  = time.Second * 30
)

// Controller ...
type Controller struct{}

// New ...
func New() *Controller {
	return &Controller{}
}

// Register ...
func (c *Controller) Register(api *echo.Group) {
	api.POST("/auth", c.Login)

	// Restricted group
	v1 := api.Group("/v1")
	// 1. simple
	// v1.Use(middleware.JWT([]byte(viper.GetString("jwt.secret"))))

	// 2. custom
	// jwtConfig := middleware.JWTConfig{
	// 	Claims:     &model.ResponseToken{},
	// 	SigningKey: []byte(viper.GetString("jwt.secret")),
	// }
	// v1.Use(middleware.JWTWithConfig(jwtConfig))

	vim := v1.Group("/vim")
	vim.GET("", c.VimDriver)
	vim.GET("/:group/:api", c.VimDriver)
	vim.POST("/:group/:api", c.VimDriver)
	vim.PUT("/:group/:api", c.VimDriver)
	vim.PATCH("/:group/:api", c.VimDriver)
	vim.DELETE("/:group/:api", c.VimDriver)
}

// Login ...
func (c *Controller) Login(ctx echo.Context) error {
	return service.Login(ctx)
}

// VimDriver ...
func (c *Controller) VimDriver(ctx echo.Context) error {
	statusCode, msg := service.ToVimDriver(ctx)
	if statusCode == http.StatusInternalServerError {
		return ctx.String(http.StatusInternalServerError, msg)
	}
	return ctx.JSON(200, nil)
}

// SetConfig ...
func SetConfig() {
	if viper.GetBool("enable.ping") == true {
		vimHost := viper.GetString("vim.server.ip")
		if strings.Compare(vimHost, "127.0.0.1") != 0 {
			checkVimServer(vimHost)
		}
	}

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

// checkVimServer ...
func checkVimServer(addr string) {
	for {
		if pingVimServer(addr) == true {
			return
		}

		log.Info("Trying reconnect to K8S Server")
		time.Sleep(PingerTimeout + 10*time.Second) // pinger.Timeout + 10 secs
	}
}

// pingVimServer is member of controller package
func pingVimServer(addr string) bool {
	var retVal bool
	var validCount int

	pinger, err := util.NewPinger(addr)
	if err != nil {
		log.Info(err)
	}
	//defer pinger.Close()

	// listen for ctrl-C signal
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	go func() {
		for sig := range c {
			log.Info(sig)
			pinger.Stop()
		}
	}()

	pinger.OnRecv = func(pkt *util.Packet) {
		if pkt.Nbytes > 0 {
			validCount++

			if validCount > 4 {
				pinger.Stop()
			}
		} else {
			validCount = 0
		}
	}

	pinger.OnFinish = func(stats *util.Statistics) {
		/*
			fmt.Printf("\n--- %s ping statistics ---\n", stats.Addr)
			fmt.Printf("%d packets transmitted, %d packets received, %v%% packet loss\n", stats.PacketsSent, stats.PacketsRecv, stats.PacketLoss)
			fmt.Printf("round-trip min/avg/max/stddev = %v/%v/%v/%v\n", stats.MinRtt, stats.AvgRtt, stats.MaxRtt, stats.StdDevRtt)
		*/

		if stats.Timedout == true {
			retVal = false
		} else {
			retVal = true
		}
	}

	pinger.Count = PingerCount
	pinger.Interval = PingerInterval
	pinger.Timeout = PingerTimeout
	pinger.SetPrivileged(true)

	pinger.Run()

	return retVal
}
