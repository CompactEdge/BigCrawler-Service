package mq

import (
	"github.com/compactedge/cewizontech/ce-broker/pkg/util"

	"github.com/labstack/gommon/log"

	"github.com/spf13/viper"
	"github.com/streadway/amqp"
)

// SendMessageToVimDriver is member of messagequeue package
func SendMessageToVimDriver(msg string) bool {
	// ------------------------------------------------------------------------
	// Queue : CE-VIM
	// ------------------------------------------------------------------------
	if rbmqConfig.conn == nil || rbmqConfig.conn.IsClosed() == true {
		log.Debug("Failed to publish a message (to VIM Driver). RabbitMQ connection is closed.")
		return false
	}
	log.Debug("test1")

	rbmqConfig.rbmqErr = rbmqConfig.ch.Publish(
		viper.GetString("rabbitmq.exchange_vim"), //exchange
		viper.GetString("rabbitmq.route"),        //routing key
		false,                                    //mandatory
		false,                                    //immediate
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "text/plain",
			Body:         []byte(msg),
		},
	)
	log.Debug("test2")
	log.Debug(rbmqConfig.rbmqErr)
	if rbmqConfig.rbmqErr != nil {
		util.RabbitMqError("Failed to publish a message (to VIM Driver)", rbmqConfig.rbmqErr)
		return false
	}

	// not use mq
	// addr := "http://" + viper.GetString("vim.server.ip") + ":" + viper.GetString("vim.server.port") + "/" + msg
	// log.Info("address :", addr)
	// resp, err := http.Get(addr)
	// if err != nil {
	// 	log.Info(err)
	// 	return false
	// }
	// data, _ := ioutil.ReadAll(resp.Body)
	// resp.Body.Close()

	// log.Info(string(data))
	return true
}

// SendMessageToRscManager is member of messagequeue package
func SendMessageToRscManager(msg string) bool {
	// ------------------------------------------------------------------------
	// Queue : CE-RSC_MGR
	// ------------------------------------------------------------------------
	if rbmqConfig.conn == nil || rbmqConfig.conn.IsClosed() == true {
		log.Info("Failed to publish a message (to Resource Manager). RabbitMQ connection is closed.")
		return false
	}

	rbmqConfig.rbmqErr = rbmqConfig.ch.Publish(
		viper.GetString("rabbitmq.exchange_rscmgr"), //exchange
		viper.GetString("rabbitmq.route"),           //routing key
		false,                                       //mandatory
		false,                                       //immediate
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "text/plain",
			Body:         []byte(msg),
		},
	)

	util.RabbitMqError("Failed to publish a message (to Resource Manager)", rbmqConfig.rbmqErr)
	return true
}
