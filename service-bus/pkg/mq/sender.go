package mq

import (
	"errors"

	"github.com/spf13/viper"

	"github.com/labstack/gommon/log"
	"github.com/streadway/amqp"
)

// SendMessage ...
func sendMessage(msg []byte, contentType string) error {
	if rabbitMQConfig.conn == nil || rabbitMQConfig.conn.IsClosed() == true {
		return errors.New("Failed to publish a message. RabbitMQ connection is closed.")
	}

	rabbitMQConfig.err = rabbitMQConfig.ch.Publish(
		viper.GetString("rabbitmq.exchange.apigw"), // exchange
		viper.GetString("rabbitmq.route"),          // routing key
		false,                                      // mandatory
		false,                                      // immediate
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  contentType,
			// Body:         []byte(msg),
			Body: msg,
		},
	)

	if rabbitMQConfig.err != nil {
		log.Errorf("Failed to publish a message\n%v", rabbitMQConfig.err)
		return rabbitMQConfig.err
	}
	return nil
}
