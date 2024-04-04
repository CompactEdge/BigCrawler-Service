# BigCrawler-Service

X86 서버와 ARM 서버를 동시에 지원IoT 센서 연동을 통해 센싱 데이터 수집 및 분석 기능을 제공하는 빅크롤러 기능을 제공합니다. 

<img width="612" alt="image" src="https://github.com/CompactEdge/BigCrawler-Service/assets/86282316/c1319e90-1a65-40ac-a17e-40b4324b60e4">

## Contents

- 빅데이터 수집 기능 
- EdgeMQ
- 관리 및 모니터링 

# Features
## 빅데이터 수집기능 

빅데이터 수집기는 REST 기반 데이터 수집 및 저장하는 기능을 제공합니다. 수집되는 데이터는 센서 데이터인 JSON 포멧의 텍스트 데이터를 수집하며 항후 이미지 센서 데이터 수집으로 확장할 계획입니다. 
수집된 빅데이터는 EdgeMQ 서비스를 통해 빅데이터 저장소인 ElasticSearch에 저장되며, 저장된 데이터에 대한 시각화 기능을 제공합니다. 

![그림1](https://github.com/CompactEdge/BigCrawler-Service/assets/86282316/c2949c2d-88a8-49c6-adb6-c9da734aa494)

빅데이터 수집기는 에너지 AI Solution 개발을 목적으로 한 데이터로, 10종의 산업 설비에 대한 450대의 설비에 대해 1달치 측정 데이터와 이에 대한 5개의 라벨링 데이터, AI 검증을 위한 Validation 데이터를 수집합니다. 
* __산업 설비 종류:__ 10종의 산업 설비로 되어 있으며 설비명은 다르나, 실제 10종의 측정 값은 같음 (누적전력량, 온도, 상전압평균, 전압고조파평균, 전류 평균 등)
* __라벨링:__ 5가지의 라벨링을 수행하였으며, “에너지 사용 패턴 분석” 및 “설비 SOH 스코어 산출” 두 AI 서비스 적용
* __측정 설비:__ 총 450대의 설비에 대한 측정값을 저장함, 설비 한건의 데이터는 1달치이며, 설비별로 다르며 200만건 이상이 저장됨

## EdgeMQ

EdgeMQ는 고속 데이터 처리를 수행하며 다음의 기능을 지원합니다. 
* __Publisher Consumer 모델:__ 데이터를 전송 및 수신을 Key 기반의 Publisher/Consumer 모델 기반으로 지원
* __Message Queue 방식:__ FIFO 형태의 메시지 큐 방식으로 데이터를 전송
* __Clustering 지원:__ 멀티 노드 환경에서 클러스터 기능을 지원하며 k8s 환경에서 worker 노드에 분산되어 설치됨
* __고속 데이터 전송 지원:__ 20만 TPS 이상의 고속데이터 처리 지원

![스크린샷 2024-04-04 오후 12 25 42](https://github.com/CompactEdge/BigCrawler-Service/assets/86282316/38dac9ad-0781-41e8-85da-9f0da3f73a81)

## 관리 및 모니터링

BigCrawler-Service는 빅데이터 수집 현황 및 결과에 대한 관리 및 모니터링 기능을 제공합니다. 
* __BigCrawler Monitoring__: 빅크롤러를 통해 수집되는 데이터에 대한 실시간 모니터링 기능 제공 
* __EdgeMQ Monitoring:__ EdgeMQ에서 처리되는 데이터에 대한 모니터링 기능 제공 
* __Cluster Management:__ 빅크롤러 시스템이 수행되는 엣지 컴퓨팅 클러스터에 대한 관리 기능 제공

![스크린샷 2024-04-04 오후 12 48 39](https://github.com/CompactEdge/BigCrawler-Service/assets/86282316/b0a9f2c2-74ae-44ec-8408-6380bdd067db)

# Contributors
- YeonJoong Kim (yeonjoong.kim@wizontech.com)
- Joojin Son (joosin.son@wizontech.com)

