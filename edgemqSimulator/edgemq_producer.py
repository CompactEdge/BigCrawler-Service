import sys
import pika

queue = sys.argv[1]

# test message
message = 'test performance message'
 
# Connection 생성
connection = pika.BlockingConnection(pika.ConnectionParameters(
                host='192.168.7.151'
                , port=5672
                , virtual_host='/'
                , credentials=pika.PlainCredentials('OQ6FfOKSlJShi9nnO1zwcVtR_Bp8kR_E', '9kPcFteLMwKBkd2apubBBuzntdp296Tk')   # username, password
            ))
 
# Server와 통신하기 위한 channel 생성
channel = connection.channel()
 
# Message Queue 생성
channel.queue_declare(queue=queue)
 
# Message 전송
count = 0 
while True:
    channel.basic_publish(
        exchange=''             # 다른 Queue로 Routing하는 역할
        , routing_key=queue     # Message를 적재할 Queue
        , body=message          # 전송할 Message
    )
    count += 1
    if count % 1000 == 0: 
        print(str(count) + " Sent ")
 
# Connection 종료
connection.close()
