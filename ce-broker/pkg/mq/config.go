package mq

import (
	"fmt"
	"time"

	"github.com/compactedge/cewizontech/ce-broker/pkg/util"
	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
	"github.com/streadway/amqp"
)

// RbmqConfigST is member of messagequeue package
type RbmqConfigST struct {
	vimQueue      amqp.Queue
	brokerQueue   amqp.Queue
	rscmgrQueue   amqp.Queue
	conn          *amqp.Connection
	ch            *amqp.Channel
	repliesVim    <-chan amqp.Delivery
	repliesBroker <-chan amqp.Delivery
	repliesRscMgr <-chan amqp.Delivery
	connNotify    <-chan *amqp.Error
	rbmqErr       error
}

var rbmqConfig RbmqConfigST

// SetConfig is member of messagequeue package
func SetConfig() {
	// if viper.GetBool("enable.rabbitmq") == false {
	// 	return
	// }

	go initMQ()
}

func initMQ() {
	addr := fmt.Sprintf("amqp://%s:%s@%s:%s/", viper.GetString("rabbitmq.username"), viper.GetString("rabbitmq.password"), viper.GetString("rabbitmq.host"), viper.GetString("rabbitmq.port"))
	// rbmqConfig = RbmqConfigST{} // deleted for keep check the connection.
	log.Debug("address :", addr)

	rbmqConfig.conn, rbmqConfig.rbmqErr = connectToRabbitMQ(addr)
	util.RabbitMqError("Failed to connect to RabbitMQ", rbmqConfig.rbmqErr)
	// defer rbmqConfig.conn.Close()
	log.Debug("Connected to RabbitMQ : " + viper.GetString("rabbitmq.host") + ":" + viper.GetString("rabbitmq.port"))
	rbmqConfig.connNotify = rbmqConfig.conn.NotifyClose(make(chan *amqp.Error))

	go func() {
		for {
			select {
			case rbmqConfig.rbmqErr = <-rbmqConfig.connNotify:
				log.Info("Connction closed. Trying to reconnect to RabbitMQ")
				time.Sleep(10 * time.Second)
				SetConfig()
				return
			}
		}
	}()

	rbmqConfig.ch, rbmqConfig.rbmqErr = rbmqConfig.conn.Channel()
	util.RabbitMqError("Failed to open a channel", rbmqConfig.rbmqErr)
	// defer rbmqConfig.ch.Close() // channel/connection is not open

	// ------------------------------------------------------------------------
	// Queue : CE-VIM
	// ------------------------------------------------------------------------
	rbmqConfig.rbmqErr = rbmqConfig.ch.ExchangeDeclare(
		viper.GetString("rabbitmq.exchange_vim"), // name of the exchange
		"direct",                                 // type
		true,                                     // durable
		false,                                    // delete when complete
		false,                                    // internal
		false,                                    // noWait
		nil,                                      // arguments
	)
	util.RabbitMqError("Failed to declare the Exchange", rbmqConfig.rbmqErr)

	rbmqConfig.vimQueue, rbmqConfig.rbmqErr = rbmqConfig.ch.QueueDeclare(
		viper.GetString("rabbitmq.queue_vim"), // name
		false,                                 // durable
		false,                                 // delete when unused
		false,                                 // exclusive
		false,                                 // no-wait
		nil,                                   // arguments
	)
	util.RabbitMqError("Failed to declare a queue", rbmqConfig.rbmqErr)

	/*
		rbmqConfig.rbmqErr = rbmqConfig.ch.Qos(
			1,     // prefetch count
			0,     // prefetch size
			false, // global
		)
		util.RabbitMqError("Failed to set QoS", rbmqConfig.rbmqErr)
	*/

	rbmqConfig.rbmqErr = rbmqConfig.ch.QueueBind(
		rbmqConfig.vimQueue.Name,                 // name of the queue
		viper.GetString("rabbitmq.route"),        // bindingKey
		viper.GetString("rabbitmq.exchange_vim"), // sourceExchange
		false,                                    // noWait
		nil,                                      // arguments
	)
	util.RabbitMqError("Error binding to the Queue", rbmqConfig.rbmqErr)

	// ------------------------------------------------------------------------
	// Queue : CE-BROKER
	// ------------------------------------------------------------------------
	rbmqConfig.rbmqErr = rbmqConfig.ch.ExchangeDeclare(
		viper.GetString("rabbitmq.exchange_broker"), // name of the exchange
		"direct", // type
		true,     // durable
		false,    // delete when complete
		false,    // internal
		false,    // noWait
		nil,      // arguments
	)
	util.RabbitMqError("Failed to declare the Exchange", rbmqConfig.rbmqErr)

	rbmqConfig.brokerQueue, rbmqConfig.rbmqErr = rbmqConfig.ch.QueueDeclare(
		viper.GetString("rabbitmq.queue_broker"), // name
		false,                                    // durable
		false,                                    // delete when unused
		false,                                    // exclusive
		false,                                    // no-wait
		nil,                                      // arguments
	)
	util.RabbitMqError("Failed to declare a queue", rbmqConfig.rbmqErr)

	/*
		rbmqConfig.rbmqErr = rbmqConfig.ch.Qos(
			1,     // prefetch count
			0,     // prefetch size
			false, // global
		)
		util.RabbitMqError(rbmqConfig.rbmqErr, "Failed to set QoS")
	*/

	rbmqConfig.rbmqErr = rbmqConfig.ch.QueueBind(
		rbmqConfig.brokerQueue.Name,                 // name of the queue
		viper.GetString("rabbitmq.route"),           // bindingKey
		viper.GetString("rabbitmq.exchange_broker"), // sourceExchange
		false, // noWait
		nil,   // arguments
	)
	util.RabbitMqError("Error binding to the Queue", rbmqConfig.rbmqErr)

	// ------------------------------------------------------------------------
	// Queue : CE-RSC_MGR
	// ------------------------------------------------------------------------
	rbmqConfig.rbmqErr = rbmqConfig.ch.ExchangeDeclare(
		viper.GetString("rabbitmq.exchange_rscmgr"), // name of the exchange
		"direct", // type
		true,     // durable
		false,    // delete when complete
		false,    // internal
		false,    // noWait
		nil,      // arguments
	)
	util.RabbitMqError("Failed to declare the Exchange", rbmqConfig.rbmqErr)

	rbmqConfig.rscmgrQueue, rbmqConfig.rbmqErr = rbmqConfig.ch.QueueDeclare(
		viper.GetString("rabbitmq.queue_rscmgr"), // name
		false,                                    // durable
		false,                                    // delete when unused
		false,                                    // exclusive
		false,                                    // no-wait
		nil,                                      // arguments
	)
	util.RabbitMqError("Failed to declare a queue", rbmqConfig.rbmqErr)

	/*
		rbmqConfig.rbmqErr = rbmqConfig.ch.Qos(
			1,     // prefetch count
			0,     // prefetch size
			false, // global
		)
		util.RabbitMqError("Failed to set QoS", rbmqConfig.rbmqErr)
	*/

	rbmqConfig.rbmqErr = rbmqConfig.ch.QueueBind(
		rbmqConfig.rscmgrQueue.Name,                 // name of the queue
		viper.GetString("rabbitmq.route"),           // bindingKey
		viper.GetString("rabbitmq.exchange_rscmgr"), // sourceExchange
		false, // noWait
		nil,   // arguments
	)
	util.RabbitMqError("Error binding to the Queue", rbmqConfig.rbmqErr)

	// log.Info("test mq config")
	// bottleneck
	// messageListenerBroker()
}

// Try to connect to the RabbitMQ server as
// long as it takes to establish a connection
func connectToRabbitMQ(uri string) (*amqp.Connection, error) {
	for {
		conn, err := amqp.Dial(uri)
		if err == nil {
			return conn, err
		}

		url := fmt.Sprintf("amqp://%s:%s/", viper.GetString("rabbitmq.host"), viper.GetString("rabbitmq.port"))
		log.Info("Trying reconnect to RabbitMQ :", url)
		time.Sleep(10 * time.Second)
	}
}

// GetConnectState is member of messagequeue package
func GetConnectState() bool {
	if rbmqConfig.conn != nil && rbmqConfig.conn.IsClosed() == false {
		log.Info("Connction State TRUE")
		return true
	}

	log.Info("Connction State FALSE")
	return false
}
