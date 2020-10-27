package mq

import (
	"errors"

	"github.com/labstack/gommon/log"

	"github.com/spf13/viper"
	"github.com/streadway/amqp"
)

// SendMessage ...
func SendMessage(msg, contentType string) ([]byte, error) {
	if rabbitMQConfig.conn == nil || rabbitMQConfig.conn.IsClosed() == true {
		return nil, errors.New("Failed to publish a message. RabbitMQ connection is closed.")
	}

	rabbitMQConfig.err = rabbitMQConfig.ch.Publish(
		viper.GetString("rabbitmq.exchange.svcbus"), // exchange
		viper.GetString("rabbitmq.route"),           // routing key
		false,                                       // mandatory
		false,                                       // immediate
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  contentType,
			Body:         []byte(msg),
		},
	)

	if rabbitMQConfig.err != nil {
		log.Errorf("Failed to publish a message\n%v", rabbitMQConfig.err)
		return nil, rabbitMQConfig.err
	}

	data, err := syncReceiver()
	if err != nil {
		return nil, err
	}
	return data, nil
}
