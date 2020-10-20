package mq

import (
	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
)

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
		log.Error("Error consuming the Queue (rabbitmq.queue_vim)")
	}
}
