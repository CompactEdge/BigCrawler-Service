import React from 'react';

// reactstrap components
import {
  // Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from 'reactstrap';
import StackedAreaChart from 'views/components/D3StackedAreaChart.js';

class MetricCluster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // not null
      cpuUtilisation: [],
      cpuRequests: [],
      cpuLimits: [],
      memoryUtilisation: [],
      memoryRequests: [],
      memoryLimits: [],
      cpuUsage: [],
      init: true,
      isLoading: false,
      error: null,
      delay: 5,
    };
    // this.encodeRFC5987ValueChars = this.encodeRFC5987ValueChars.bind(this);
    this.makePercent = this.makePercent.bind(this);
    this.handleCreateMetricChart = this.handleCreateMetricChart.bind(this);
  }

  makePercent(args) {
    const [arg] = arguments;
    if (arg) {
      const rate = parseFloat(arg) * 100;
      return `${rate.toFixed(2)}%`;
    } else {
      return `-`;
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.handleCreateMetricChart();
    this.interval = setInterval(this.handleCreateMetricChart, this.state.delay * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleCreateMetricChart() {
    const API_GATEWAY_HOST = `${window.$host}:${window.$apigw}`;
    const mode = 'idle';
    const cluster = '';
    const exclude = '';
    const now = Date.now() / 1000;
    const range = 60 * 60 * 3; // s * m * h
    const step = this.state.delay;
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
          console.log(cpu1);
          // console.log(cpu2);
          // console.log(cpu3);
          // console.log(memory1);
          // console.log(memory2);
          // console.log(memory3);
          // console.log(cpuUsage);
          // console.log(memoryUsage);
          this.setState({
            cpuUtilisation: cpu1.data.result[0].value,
            cpuRequests: cpu2.data.result[0].value,
            cpuLimits: cpu3.data.result[0].value,
            memoryUtilisation: memory1.data.result[0].value,
            memoryRequests: memory2.data.result[0].value,
            memoryLimits: memory3.data.result[0].value,
            cpuUsage: cpuUsage.data.result,
            memoryUsage: memoryUsage.data.result,
            isLoading: false,
            init: false,
          });
          // console.log(this.state.cpuUsage);
        },
      )
      .catch(error => this.setState({ error, isLoading: false }));
  }

  render() {
    const { isLoading, error } = this.state;

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
            <Col md="2">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    {this.makePercent(this.state.cpuUtilisation[1])}
                  </CardTitle>
                  <p className="card-category">CPU Utilisation</p>
                </CardHeader>
                {/* <CardBody></CardBody> */}
              </Card>
            </Col>
            <Col md="2">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    {this.makePercent(this.state.cpuRequests[1])}
                  </CardTitle>
                  <p className="card-category">CPU Requests Commitment</p>
                </CardHeader>
                {/* <CardBody></CardBody> */}
              </Card>
            </Col>
            <Col md="2">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    {this.makePercent(this.state.cpuLimits[1])}
                  </CardTitle>
                  <p className="card-category">CPU Limits Commitment</p>
                </CardHeader>
                {/* <CardBody></CardBody> */}
              </Card>
            </Col>
            {/*
              Memory Utilisation
              Memory Requests Commitment
              Memory Limits Commitment
             */}
            <Col md="2">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    {this.makePercent(this.state.memoryUtilisation[1])}
                  </CardTitle>
                  <p className="card-category">Memory Utilisation</p>
                </CardHeader>
                {/* <CardBody></CardBody> */}
              </Card>
            </Col>
            <Col md="2">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    {this.makePercent(this.state.memoryRequests[1])}
                  </CardTitle>
                  <p className="card-category">Memory Requests Commitment</p>
                </CardHeader>
                {/* <CardBody></CardBody> */}
              </Card>
            </Col>
            <Col md="2">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    {this.makePercent(this.state.memoryLimits[1])}
                  </CardTitle>
                  <p className="card-category">Memory Limits Commitment</p>
                </CardHeader>
                {/* <CardBody></CardBody> */}
              </Card>
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
                      data={this.state.cpuUsage}
                      init={this.state.init}
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
                      data={this.state.memoryUsage}
                      init={this.state.init}
                    />
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default MetricCluster;
