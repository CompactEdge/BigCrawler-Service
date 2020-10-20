package mq

import (
	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
)

// MQCh ...
var MQCh chan string // = make(chan string, 1)

// SetConfigCh ...
func SetConfigCh() {
	MQCh = make(chan string, 1)
}

// messageListenerBroker ...
func messageListenerBroker() {
	rabbitMQConfig.repliesBroker, rabbitMQConfig.err = rabbitMQConfig.ch.Consume(
		viper.GetString("rabbitmq.queue_broker"), // queue
		"consumer-broker",                        // Consumer tag
		true,                                     // auto-ack
		false,                                    // exclusive
		false,                                    // no-local
		false,                                    // no-wait
		nil,                                      // args
	)
	log.Error("Error consuming the Queue (rabbitmq.queue_broker)", rabbitMQConfig.err)
}
