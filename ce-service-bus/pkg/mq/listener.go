package mq

import (
	"encoding/json"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
)

// MessageQueueCh ...
// var MessageQueueCh = make(chan string, 1)
var (
	MessageQueueCh chan string // = make(chan string, 1)
)

// SetConfigChannel ...
func SetConfigChannel(ec *echo.Echo) {
	MessageQueueCh = make(chan string, 1)
}

// messageListenerServiceBus ...
func messageListenerServiceBus() {
	rabbitMQConfig.replies, rabbitMQConfig.err = rabbitMQConfig.ch.Consume(
		viper.GetString("rabbitmq.queue.svcbus"), // queue
		viper.GetString("rabbitmq.consumer"),     // consumer
		true,                                     // auto-ack
		false,                                    // exclusive
		false,                                    // no-local
		false,                                    // no-wait
		nil,                                      // args
	)
	if rabbitMQConfig.err != nil {
		log.Fatal("Failed to register a consumer (rabbitmq.consumer)")
	}

	go func() {
		for msg := range rabbitMQConfig.replies {
			parseReceivedMsg(msg.Body)
		}
	}()
	// Waiting for messages. To exit press CTRL+C
	<-MessageQueueCh
}

func parseReceivedMsg(data []byte) {
	code, obj := k8sClientAPI(data)
	if code >= http.StatusOK && http.StatusMultipleChoices > code {
		if jsonData, err := json.Marshal(obj); err != nil {
			log.Error(err)
		} else {
			sendMessage(jsonData, echo.MIMEApplicationJSON)
		}
	}
}
