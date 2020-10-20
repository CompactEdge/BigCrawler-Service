package mq

import (
	"encoding/json"

	"github.com/compactedge/cewizontech/ce-vim/pkg/util"
	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
)

// MessageQueueCh ...
var MessageQueueCh = make(chan string, 1)

// messageListenerVimDriver ...
func messageListenerVimDriver() {
	rabbitMQConfig.repliesVim, rabbitMQConfig.err = rabbitMQConfig.ch.Consume(
		viper.GetString("rabbitmq.queue.vim"), // queue
		viper.GetString("rabbitmq.consumer"),  // consumer
		true,                                  // auto-ack
		false,                                 // exclusive
		false,                                 // no-local
		false,                                 // no-wait
		nil,                                   // args
	)
	if rabbitMQConfig.err != nil {
		log.Error("Failed to register a consumer (rabbitmq.consumer)")
	}

	go func() {
		for msg := range rabbitMQConfig.repliesVim {
			parseReceivedMsg(msg.Body)
		}
	}()
	// Waiting for messages. To exit press CTRL+C
	<- MessageQueueCh
}

func parseReceivedMsg(data []byte) {
	log.Printf("Received a message: %s", string(data))
	body := new(util.BodyData)
	err := json.Unmarshal(data, body)
	if err != nil {
		log.Error(err)
	}
	log.Debug(body)
	statusCode, bodyString := util.RequestAPI(body)
	log.Debug(statusCode, bodyString)
}
