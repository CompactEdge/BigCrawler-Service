package mq

import (
	"fmt"
	"time"

	"github.com/compactedge/cewizontech/ce-vim/pkg/util"
	"github.com/labstack/gommon/log"
	"github.com/streadway/amqp"
)

// BodyData is member of messagequeue package.
type BodyData struct {
	Accept         string `json:"accept"`
	CacheControl   string `json:"cache-control"`
	PostmanToken   string `json:"postman-token"`
	AcceptEncoding string `json:"accept-encoding"`
	ContentLength  string `json:"content-length"`
	Connection     string `json:"connection"`
	UserAgent      string `json:"user-agent"`
	Namespace      string `json:"namespace"`
	Name           string `json:"name"`
}

// RbmqConfig is member of messagequeue package
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

// Try to connect to the RabbitMQ server as
// long as it takes to establish a connection
func connectToRabbitMQ(uri string) (*amqp.Connection, error) {
	for {
		conn, err := amqp.Dial(uri)
		if err == nil {
			return conn, err
		} else {
			log.Warn("RabbitMQ connection retry : ", err, uri)
		}

		time.Sleep(30 * time.Second)
	}
}

func Init() {
	addr := fmt.Sprintf("amqp://%s:%s@%s:%s/", util.EnvMap["rabbitmq.username"], util.EnvMap["rabbitmq.password"], util.EnvMap["rabbitmq.host"], util.EnvMap["rabbitmq.port"])

	rbmqConfig.conn, rbmqConfig.rbmqErr = connectToRabbitMQ(addr)

	defer rbmqConfig.conn.Close()

	log.Info("Connected to RabbitMQ : " + util.EnvMap["rabbitmq.host"] + ":" + util.EnvMap["rabbitmq.port"])

	rbmqConfig.connNotify = rbmqConfig.conn.NotifyClose(make(chan *amqp.Error))

	go func() {
		for {
			select {
			case rbmqConfig.rbmqErr = <-rbmqConfig.connNotify:
				log.Warn("Connection Closed. Trying to reconnect to RabbitMQ")
				time.Sleep(30 * time.Second)
				Init()
				return
			}
		}
	}()

	rbmqConfig.ch, rbmqConfig.rbmqErr = rbmqConfig.conn.Channel()
	if rbmqConfig.rbmqErr != nil {
		log.Error("Failed to open a channel")
	}
	defer rbmqConfig.ch.Close()

	// ------------------------------------------------------------------------
	// Queue : MEC-VIM
	// ------------------------------------------------------------------------
	rbmqConfig.rbmqErr = rbmqConfig.ch.ExchangeDeclare(
		util.EnvMap["rabbitmq.exchange_vim"], // name of the exchange
		"direct",                             // type
		true,                                 // durable
		false,                                // delete when complete
		false,                                // internal
		false,                                // noWait
		nil,                                  // arguments
	)
	if rbmqConfig.rbmqErr != nil {
		log.Error("MEC-VIM Failed to declare the Exchange")
	}

	rbmqConfig.vimQueue, rbmqConfig.rbmqErr = rbmqConfig.ch.QueueDeclare(
		util.EnvMap["rabbitmq.queue_vim"], // name
		false,                             // durable
		false,                             // delete when unused
		false,                             // exclusive
		false,                             // no-wait
		nil,                               // arguments
	)
	if rbmqConfig.rbmqErr != nil {
		log.Error("MEC-VIM Failed to declare a queue")
	}

	rbmqConfig.rbmqErr = rbmqConfig.ch.QueueBind(
		rbmqConfig.vimQueue.Name,             // name of the queue
		util.EnvMap["rabbitmq.route"],        // bindingKey
		util.EnvMap["rabbitmq.exchange_vim"], // sourceExchange
		false,                                // noWait
		nil,                                  // arguments
	)
	if rbmqConfig.rbmqErr != nil {
		log.Error("MEC-VIM Error binding to the Queue")
	}

	// ------------------------------------------------------------------------
	// Queue : MEC-BROKER
	// ------------------------------------------------------------------------
	rbmqConfig.rbmqErr = rbmqConfig.ch.ExchangeDeclare(
		util.EnvMap["rabbitmq.exchange_broker"], // name of the exchange
		"direct",                                // type
		true,                                    // durable
		false,                                   // delete when complete
		false,                                   // internal
		false,                                   // noWait
		nil,                                     // arguments
	)
	if rbmqConfig.rbmqErr != nil {
		log.Error("MEC-BROKER Failed to declare the Exchange")
	}

	rbmqConfig.brokerQueue, rbmqConfig.rbmqErr = rbmqConfig.ch.QueueDeclare(
		util.EnvMap["rabbitmq.queue_broker"], // name
		false,                                // durable
		false,                                // delete when unused
		false,                                // exclusive
		false,                                // no-wait
		nil,                                  // arguments
	)
	if rbmqConfig.rbmqErr != nil {
		log.Error("MEC-BROKER Failed to declare a queue")
	}

	rbmqConfig.rbmqErr = rbmqConfig.ch.QueueBind(
		rbmqConfig.brokerQueue.Name,             // name of the queue
		util.EnvMap["rabbitmq.route"],           // bindingKey
		util.EnvMap["rabbitmq.exchange_broker"], // sourceExchange
		false,                                   // noWait
		nil,                                     // arguments
	)
	if rbmqConfig.rbmqErr != nil {
		log.Error("MEC-BROKER Error binding to the Queue")
	}

	// ------------------------------------------------------------------------
	// Queue : MEC-RSC_MGR
	// ------------------------------------------------------------------------
	rbmqConfig.rbmqErr = rbmqConfig.ch.ExchangeDeclare(
		util.EnvMap["rabbitmq.exchange_rscmgr"], // name of the exchange
		"direct",                                // type
		true,                                    // durable
		false,                                   // delete when complete
		false,                                   // internal
		false,                                   // noWait
		nil,                                     // arguments
	)
	if rbmqConfig.rbmqErr != nil {
		log.Error("MEC-RSC_MGR Failed to declare the Exchange")
	}

	rbmqConfig.rscmgrQueue, rbmqConfig.rbmqErr = rbmqConfig.ch.QueueDeclare(
		util.EnvMap["rabbitmq.queue_rscmgr"], // name
		false,                                // durable
		false,                                // delete when unused
		false,                                // exclusive
		false,                                // no-wait
		nil,                                  // arguments
	)
	if rbmqConfig.rbmqErr != nil {
		log.Error("MEC-RSC_MGR Failed to declare a queue")
	}

	rbmqConfig.rbmqErr = rbmqConfig.ch.QueueBind(
		rbmqConfig.rscmgrQueue.Name,             // name of the queue
		util.EnvMap["rabbitmq.route"],           // bindingKey
		util.EnvMap["rabbitmq.exchange_rscmgr"], // sourceExchange
		false,                                   // noWait
		nil,                                     // arguments
	)
	if rbmqConfig.rbmqErr != nil {
		log.Error("MEC-RSC_MGR Error binding to the Queue")
	}

	messageListenerVimDriver()
}

func GetConnectState() bool {
	if rbmqConfig.conn != nil && rbmqConfig.conn.IsClosed() == false {
		log.Info("Connction State TRUE")
		return true
	}

	log.Info("Connction State FALSE")
	return false
}
