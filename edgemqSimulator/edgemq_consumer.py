import pika
import sys

queue = sys.argv[1]
 
# RabbitMQ Server Connection 생성
connection  = pika.BlockingConnection(pika.URLParameters('amqp://OQ6FfOKSlJShi9nnO1zwcVtR_Bp8kR_E:9kPcFteLMwKBkd2apubBBuzntdp296Tk@192.168.7.151:5672/'))
 
# RabbitMQ Server와 통신하기 위한 channel 생성
channel = connection.channel()

# Message Queue 생성
# Consumer가 먼저 실행될 경우 접근할 Queue가 없기 때문에 생성
channel.queue_declare(queue=queue)
 
# 메시지를 받으면 실행할 task(함수)를 정의
count = 0
def callback(ch, method, properties, body):
    global count
    count += 1
    if count % 1000 == 0: 
        print(str(count) + " Received")
    ch.basic_ack( delivery_tag=method.delivery_tag )
 
# consumer로 설정하여 queue로 부터 메시지를 받아 task를 수행
# channel.basic_qos(prefetch_count=1)
channel.basic_consume( queue, callback )
 
print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
