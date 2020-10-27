package mq

import (
	"errors"
)

func syncReceiver() ([]byte, error) {
	for msg := range rabbitMQConfig.replies {
		// log.Debug(msg.Body)
		return msg.Body, nil
	}
	return nil, errors.New("Internal Error")
}
