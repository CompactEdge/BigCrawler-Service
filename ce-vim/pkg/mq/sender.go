package mq

import (
	"github.com/compactedge/cewizontech/ce-vim/pkg/util"

	"github.com/labstack/gommon/log"
	"github.com/streadway/amqp"
)

// SendMessageToBroker is member of messagequeue package
func SendMessageToBroker(msg string) {
	if util.EnvMap["common.UseRscMgr"] == "true" {
		SendMessageToRscManager(msg)
		return
	}

	//////////////////////////////////////////////////////////////////////////
	// Queue : MEC-BROKER
	//////////////////////////////////////////////////////////////////////////
	if rbmqConfig.conn == nil || rbmqConfig.conn.IsClosed() == true {
		log.Warn("Failed to publish a message (to Broker). RabbitMQ connection is closed.")
		return
	}

	rbmqConfig.rbmqErr = rbmqConfig.ch.Publish(
		util.EnvMap["rabbitmq.exchange_broker"], //exchange
		util.EnvMap["rabbitmq.route"],           //routing key
		false,                                      //mandatory
		false,                                      //immediate
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "text/plain",
			Body:         []byte(msg),
		},
	)

	if rbmqConfig.rbmqErr != nil {
		log.Error("Failed to publish a message (to Broker)")
	}
}

// SendMessageToRscManager is member of messagequeue package
func SendMessageToRscManager(msg string) bool {
	//////////////////////////////////////////////////////////////////////////
	// Queue : MEC-RSCMGR
	//////////////////////////////////////////////////////////////////////////
	if rbmqConfig.conn == nil || rbmqConfig.conn.IsClosed() == true {
		log.Warn("Failed to publish a message (to Resource Manager). RabbitMQ connection is closed.")
		return false
	}

	rbmqConfig.rbmqErr = rbmqConfig.ch.Publish(
		util.EnvMap["rabbitmq.exchange_rscmgr"], //exchange
		util.EnvMap["rabbitmq.route"],           //routing key
		false,                                      //mandatory
		false,                                      //immediate
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "text/plain",
			Body:         []byte(msg),
		},
	)

	if rbmqConfig.rbmqErr != nil {
		log.Error("Failed to publish a message (to Resource Manager)")
	}
	return true
}
