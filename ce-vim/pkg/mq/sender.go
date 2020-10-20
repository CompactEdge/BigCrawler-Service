package mq

import (
	"github.com/spf13/viper"

	"github.com/labstack/gommon/log"
	"github.com/streadway/amqp"
)

// SendMessageToBroker ...
func SendMessageToBroker(msg string) {
	if rabbitMQConfig.conn == nil || rabbitMQConfig.conn.IsClosed() == true {
		log.Warn("Failed to publish a message (to Broker). RabbitMQ connection is closed.")
		return
	}

	rabbitMQConfig.err = rabbitMQConfig.ch.Publish(
		viper.GetString("rabbitmq.broker.exchange"), //exchange
		viper.GetString("rabbitmq.route"),           //routing key
		false,                                       //mandatory
		false,                                       //immediate
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "application/json",
			Body:         []byte(msg),
		},
	)

	if rabbitMQConfig.err != nil {
		log.Error("Failed to publish a message (to Broker)")
	}
}
