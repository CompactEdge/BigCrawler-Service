package mq

import (
	"fmt"
	"time"

	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
	"github.com/streadway/amqp"
)

// RabbitMQConfig ...
type RabbitMQConfig struct {
	vimQueue      amqp.Queue
	brokerQueue   amqp.Queue
	conn          *amqp.Connection
	ch            *amqp.Channel
	repliesVim    <-chan amqp.Delivery
	repliesBroker <-chan amqp.Delivery
	connNotify    <-chan *amqp.Error
	err           error
}

var rabbitMQConfig RabbitMQConfig

// SetConfig ...
func SetConfig() {
	if viper.GetBool("enable.rabbitmq") == false {
		return
	}

	go initMQ()
}

func connectToRabbitMQ(uri string) *amqp.Connection {
	for {
		conn, err := amqp.Dial(uri)
		if err == nil {
			return conn
		}

		url := fmt.Sprintf("amqp://%s:%s/", viper.GetString("rabbitmq.host"), viper.GetString("rabbitmq.port"))
		log.Errorf("Trying reconnect to '%s'", url)
		time.Sleep(10 * time.Second)
	}
}

func initMQ() {
	addr := fmt.Sprintf("amqp://%s:%s@%s:%s/", viper.GetString("rabbitmq.username"), viper.GetString("rabbitmq.password"), viper.GetString("rabbitmq.host"), viper.GetString("rabbitmq.port"))
	log.Debugf("address : %s", addr)

	rabbitMQConfig.conn = connectToRabbitMQ(addr)
	// defer rabbitMQConfig.conn.Close()
	log.Debug("Connected to RabbitMQ : " + viper.GetString("rabbitmq.host") + ":" + viper.GetString("rabbitmq.port"))

	rabbitMQConfig.connNotify = rabbitMQConfig.conn.NotifyClose(make(chan *amqp.Error))
	go func() {
		for {
			select {
			case rabbitMQConfig.err = <-rabbitMQConfig.connNotify:
				log.Error("Connction closed. Trying to reconnect to RabbitMQ")
				time.Sleep(20 * time.Second)
				SetConfig()
				return
			}
		}
	}()

	rabbitMQConfig.ch, rabbitMQConfig.err = rabbitMQConfig.conn.Channel()
	if rabbitMQConfig.err != nil {
		log.Error("Failed to open a channel", rabbitMQConfig.err)
	}
	// defer rabbitMQConfig.ch.Close() // channel/connection is not open

	rabbitMQConfig.err = rabbitMQConfig.ch.ExchangeDeclare(
		viper.GetString("rabbitmq.exchange.vim"), // name of the exchange
		"direct",                                 // type
		true,                                     // durable
		false,                                    // delete when complete
		false,                                    // internal
		false,                                    // noWait
		nil,                                      // arguments
	)
	if rabbitMQConfig.err != nil {
		log.Error("Failed to declare the Exchange", rabbitMQConfig.err)
	}

	rabbitMQConfig.vimQueue, rabbitMQConfig.err = rabbitMQConfig.ch.QueueDeclare(
		viper.GetString("rabbitmq.queue.vim"), // name
		false,                                 // durable
		false,                                 // delete when unused
		false,                                 // exclusive
		false,                                 // no-wait
		nil,                                   // arguments
	)
	if rabbitMQConfig.err != nil {
		log.Error("Failed to declare a queue", rabbitMQConfig.err)
	}

	/*
		rabbitMQConfig.err = rabbitMQConfig.ch.Qos(
			1,     // prefetch count
			0,     // prefetch size
			false, // global
		)
		log.Error("Failed to set QoS", rabbitMQConfig.err)
	*/

	rabbitMQConfig.err = rabbitMQConfig.ch.QueueBind(
		rabbitMQConfig.vimQueue.Name,             // name of the queue
		viper.GetString("rabbitmq.route"),        // bindingKey
		viper.GetString("rabbitmq.exchange.vim"), // sourceExchange
		false,                                    // noWait
		nil,                                      // arguments
	)
	if rabbitMQConfig.err != nil {
		log.Error("Error binding to the Queue", rabbitMQConfig.err)
	}

	rabbitMQConfig.err = rabbitMQConfig.ch.ExchangeDeclare(
		viper.GetString("rabbitmq.exchange.broker"), // name of the exchange
		"direct", // type
		true,     // durable
		false,    // delete when complete
		false,    // internal
		false,    // noWait
		nil,      // arguments
	)
	if rabbitMQConfig.err != nil {
		log.Error("Failed to declare the Exchange", rabbitMQConfig.err)
	}

	rabbitMQConfig.brokerQueue, rabbitMQConfig.err = rabbitMQConfig.ch.QueueDeclare(
		viper.GetString("rabbitmq.queue.broker"), // name
		false,                                    // durable
		false,                                    // delete when unused
		false,                                    // exclusive
		false,                                    // no-wait
		nil,                                      // arguments
	)
	if rabbitMQConfig.err != nil {
		log.Error("Failed to declare a queue", rabbitMQConfig.err)
	}

	/*
		rabbitMQConfig.err = rabbitMQConfig.ch.Qos(
			1,     // prefetch count
			0,     // prefetch size
			false, // global
		)
		log.Error(rabbitMQConfig.err, "Failed to set QoS")
	*/

	rabbitMQConfig.err = rabbitMQConfig.ch.QueueBind(
		rabbitMQConfig.brokerQueue.Name,             // name of the queue
		viper.GetString("rabbitmq.route"),           // bindingKey
		viper.GetString("rabbitmq.exchange.broker"), // sourceExchange
		false, // noWait
		nil,   // arguments
	)
	if rabbitMQConfig.err != nil {
		log.Error("Error binding to the Queue", rabbitMQConfig.err)
	}

	// bottleneck
	// messageListenerBroker()
}

// GetConnectState ...
func GetConnectState() bool {
	if rabbitMQConfig.conn != nil && rabbitMQConfig.conn.IsClosed() == false {
		log.Info("Connction State TRUE")
		return true
	}

	log.Info("Connction State FALSE")
	return false
}
