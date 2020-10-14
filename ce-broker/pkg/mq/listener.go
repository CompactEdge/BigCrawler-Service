package mq

import (
	"github.com/compactedge/cewizontech/ce-broker/pkg/util"
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
	rbmqConfig.repliesBroker, rbmqConfig.rbmqErr = rbmqConfig.ch.Consume(
		viper.GetString("rabbitmq.queue_broker"), // queue
		"consumer-broker",                        // Consumer tag
		true,                                     // auto-ack
		false,                                    // exclusive
		false,                                    // no-local
		false,                                    // no-wait
		nil,                                      // args
	)
	util.RabbitMqError("Error consuming the Queue (rabbitmq.queue_broker)", rbmqConfig.rbmqErr)

	for msg := range rbmqConfig.repliesBroker {
		log.Debug("Received from queue Broker")
		if viper.GetBool("enable.resourceManager") == false {
			log.Debug("Received Msg :", string(msg.Body))
			MQCh <- string(msg.Body)
		}
	}
	log.Info("test messageListenerBroker")
}
