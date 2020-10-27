package controller

import (
	"net/http"
	"os"
	"os/signal"
	"strings"
	"time"

	"github.com/compactedge/cewizontech/ce-api-gateway/pkg/service"
	"github.com/compactedge/cewizontech/ce-api-gateway/pkg/util"
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
	api.POST("/auth", c.login)

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

	svc := v1.Group("/svc")
	svc.GET("", c.sendToBus)
	svc.GET("/:group/:api", c.sendToBus)
	svc.POST("/:group/:api", c.sendToBus)
	svc.PUT("/:group/:api", c.sendToBus)
	svc.PATCH("/:group/:api", c.sendToBus)
	svc.DELETE("/:group/:api", c.sendToBus)
}

func (c *Controller) login(ctx echo.Context) error {
	return service.Login(ctx)
}

func (c *Controller) sendToBus(ctx echo.Context) error {
	statusCode, msg := service.SendToBus(ctx)
	if statusCode == http.StatusInternalServerError {
		return ctx.JSON(http.StatusInternalServerError, msg)
	}
	return ctx.JSON(http.StatusOK, msg)
}

// SetConfig ...
func SetConfig() {
	if viper.GetBool("enable.ping") == true {
		host := viper.GetString("svcbus.server.ip")
		if strings.Compare(host, "127.0.0.1") != 0 {
			checkServiceBusServer(host)
		}
	}
}

// checkServiceBusServer ...
func checkServiceBusServer(addr string) {
	for {
		if pingServiceBusServer(addr) == true {
			return
		}
		log.Info("Trying reconnect to Service Bus Server")
		time.Sleep(PingerTimeout + 10*time.Second) // pinger.Timeout + 10 secs
	}
}

// pingServiceBusServer ...
func pingServiceBusServer(addr string) bool {
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
