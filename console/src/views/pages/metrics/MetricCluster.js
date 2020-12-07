import React, { useState, useEffect, useRef } from 'react';

// reactstrap components
import {
  // Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import StackedAreaChart from 'views/components/D3StackedAreaChart.js';
import HeadlineCard from 'views/components/HeadlineCard.js';
import { conditionallyUpdateScrollbar } from 'reactstrap/lib/utils';

const MetricCluster = props => {
  const [data, setData] = useState({
    cpuUtilisation: [],
    cpuRequests: [],
    cpuLimits: [],
    memoryUtilisation: [],
    memoryRequests: [],
    memoryLimits: [],
    cpuUsage: [],
    memoryUsage: [],
  }); // not null
  const [init, setInit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [delay, setDelay] = useState(5);
  const savedCallback = useRef();

  useEffect(() => {
    setIsLoading(true);
    handleCreateMetricChart();
  }, []);

  const callback = () => handleCreateMetricChart();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    callback();
    const tick = () => {
      savedCallback.current();
    };
    let id = setInterval(tick, delay * 1000);
    return () => clearInterval(id);
  }, []);

  const handleCreateMetricChart = () => {
    const API_GATEWAY_HOST = `${window.$host}:${window.$apigw}`;
    const mode = 'idle';
    const cluster = '';
    const exclude = '';
    const now = Date.now() / 1000;
    const range = 60 * 60 * 6; // s * m * h
    const step = delay;
    Promise.all([
      fetch(
        `http://${API_GATEWAY_HOST}/prom/${encodeURIComponent(
          `1 - avg(rate(node_cpu_seconds_total{mode="${mode}", cluster="${cluster}"}[1m]))`,
        )}`,
      ),
      fetch(
        `http://${API_GATEWAY_HOST}/prom/${encodeURIComponent(
          `sum(kube_pod_container_resource_requests_cpu_cores{cluster="${cluster}"}) / sum(kube_node_status_allocatable_cpu_cores{cluster="${cluster}"})`,
        )}`,
      ),
      fetch(
        `http://${API_GATEWAY_HOST}/prom/${encodeURIComponent(
          `sum(kube_pod_container_resource_limits_cpu_cores{cluster="${cluster}"}) / sum(kube_node_status_allocatable_cpu_cores{cluster="${cluster}"})`,
        )}`,
      ),
      fetch(
        `http://${API_GATEWAY_HOST}/prom/${encodeURIComponent(
          `1 - sum(:node_memory_MemAvailable_bytes:sum{cluster="${cluster}"}) / sum(kube_node_status_allocatable_memory_bytes{cluster="${cluster}"})`,
        )}`,
      ),
      fetch(
        `http://${API_GATEWAY_HOST}/prom/${encodeURIComponent(
          `sum(kube_pod_container_resource_requests_memory_bytes{cluster="${cluster}"}) / sum(kube_node_status_allocatable_memory_bytes{cluster="${cluster}"})`,
        )}`,
      ),
      fetch(
        `http://${API_GATEWAY_HOST}/prom/${encodeURIComponent(
          `sum(kube_pod_container_resource_limits_memory_bytes{cluster="${cluster}"}) / sum(kube_node_status_allocatable_memory_bytes{cluster="${cluster}"})`,
        )}`,
      ),
      fetch(
        `http://${API_GATEWAY_HOST}/promr/${encodeURIComponent(
          `sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster="${cluster}"}) by (namespace)`,
        )}&start=${now - range}&end=${now}&step=${step}`,
      ),
      fetch(
        `http://${API_GATEWAY_HOST}/promr/${encodeURIComponent(
          `sum(container_memory_rss{cluster="${cluster}", container!="${exclude}"}) by (namespace)`,
        )}&start=${now - range}&end=${now}&step=${step}`,
      ),
    ])
      .then(([res1, res2, res3, res4, res5, res6, res7, res8]) =>
        Promise.all([
          res1.json(),
          res2.json(),
          res3.json(),
          res4.json(),
          res5.json(),
          res6.json(),
          res7.json(),
          res8.json(),
        ]),
      )
      .then(
        ([
          cpu1,
          cpu2,
          cpu3,
          memory1,
          memory2,
          memory3,
          cpuUsage,
          // cpuQuota,
          memoryUsage,
          // memoryRequests,
        ]) => {
          //   console.log(cpu1);
          //   console.log(cpu2);
          //   console.log(cpu3);
          //   console.log(memory1);
          //   console.log(memory2);
          //   console.log(memory3);
          //   console.log(cpuUsage);
          //   console.log(memoryUsage);
          setData({
            cpuUtilisation: cpu1.data.result[0].value,
            cpuRequests: cpu2.data.result[0].value,
            cpuLimits: cpu3.data.result[0].value,
            memoryUtilisation: memory1.data.result[0].value,
            memoryRequests: memory2.data.result[0].value,
            memoryLimits: memory3.data.result[0].value,
            cpuUsage: cpuUsage.data.result,
            memoryUsage: memoryUsage.data.result,
          });
          setIsLoading(false);
          setInit(false);

          // console.log(this.state.cpuUsage);
        },
      )
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  };

  const makePercent = arg => {
    if (arg) {
      const rate = parseFloat(arg) * 100;
      return `${rate.toFixed(2)}%`;
    } else {
      return `-`;
    }
  };

  if (error) {
    return <p>{error.message}</p>;
  }

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <>
      <div className="content">
        {/*
            CPU Utilisation
            CPU Requests Commitment
            CPU Limits Commitment
           */}
        <Row>
          <Col xs="6" md="2">
            <HeadlineCard
              id="cpuUtil"
              title="CPU Utilisation"
              value={makePercent(data.cpuUtilisation[1])}
              tooltip="시스템 평균 CPU 부하 정보입니다."
            />
          </Col>
          <Col xs="6" md="2">
            <HeadlineCard
              id="cpuRC"
              title="CPU Requests Commitment"
              value={makePercent(data.cpuRequests[1])}
              tooltip="쿠버네티스 클러스터 CPU Request 평균 정보입니다.

              CPU Request는 컨테이너가 생성될 때 요청하는 리소스 양입니다."
            />
          </Col>
          <Col xs="6" md="2">
            <HeadlineCard
              id="cpuLC"
              title="CPU Limits Commitment"
              value={makePercent(data.cpuLimits[1])}
              tooltip="	
              쿠버네티스 클러스터 CPU 제약 조건 평균 정보입니다.
              
              CPU Limit은 컨테이너가 생성된 다음 실행 중 CPU를 추가로 사용할 수 있는 정보입니다."
            />
          </Col>
          <Col xs="6" md="2">
            <HeadlineCard
              id="memoryUtil"
              title="Memory Utilisation"
              value={makePercent(data.memoryUtilisation[1])}
              tooltip="시스템 평균 메모리 사용량입니다."
            />
          </Col>
          <Col xs="6" md="2">
            <HeadlineCard
              id="memoryRC"
              title="Memory Requests Commitment"
              value={makePercent(data.memoryRequests[1])}
              tooltip="쿠버네티스 Memory Request 평균 정보입니다.

              Memory Request는 컨테이너가 생성될 때 요청하는 리소스 양입니다."
            />
          </Col>
          <Col xs="6" md="2">
            <HeadlineCard
              id="memoryLC"
              title="Memory Limits Commitment"
              value={makePercent(data.memoryLimits[1])}
              tooltip="	
              쿠버네티스 Memory 제약 평균 정보입니다.
              
              Memory Limit은 컨테이너가 생성된 다음 실행 중 Memory를 추가로 사용할 수 있는 정보입니다."
            />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">CPU Usage</CardTitle>
                <p className="card-category"></p>
              </CardHeader>
              <CardBody>
                <Row>
                  <StackedAreaChart
                    id="cpu"
                    unit="Rate"
                    metric="namespace"
                    data={data.cpuUsage}
                    init={init}
                  />
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Memory Usage</CardTitle>
                <p className="card-category"></p>
              </CardHeader>
              <CardBody>
                <Row>
                  <StackedAreaChart
                    id="memory"
                    unit="Byte"
                    metric="namespace"
                    data={data.memoryUsage}
                    init={init}
                  />
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MetricCluster;
