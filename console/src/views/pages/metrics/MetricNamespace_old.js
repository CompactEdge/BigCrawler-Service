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

class MetricNamespace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // not null
      cpuUsage: [],
      memoryUsage: [],
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

  handleCreateMetricChart() {
    const API_GATEWAY_HOST = `${window.$host}:${window.$apigw}`;
    let cluster = '';
    let namespace = 'kube-system';
    let type = 'deployment';
    const exclude = '';
    const now = Date.now() / 1000;
    const range = 60 * 60 * 3; // s * m * h
    const step = 30;
    Promise.all([
      fetch(
        `http://${API_GATEWAY_HOST}/promr/${encodeURIComponent(
          `
            sum(
              node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster="${cluster}", namespace="${namespace}"}
              * on(namespace,pod)
              group_left(workload, workload_type) mixin_pod_workload{cluster="${cluster}", namespace="${namespace}", workload_type="${type}"}
            ) by (workload, workload_type)
          `,
        )}&start=${now - range}&end=${now}&step=${step}`,
      ),
      fetch(
        `http://${API_GATEWAY_HOST}/promr/${encodeURIComponent(
          `
            sum(
              container_memory_working_set_bytes{cluster="${cluster}", namespace="${namespace}", container!="${exclude}"}
              * on(namespace,pod)
              group_left(workload, workload_type) mixin_pod_workload{cluster="${cluster}", namespace="${namespace}", workload_type="${type}"}
            ) by (workload, workload_type)
          `,
        )}&start=${now - range}&end=${now}&step=${step}`,
      ),
    ])
      .then(([res1, res2]) =>
        Promise.all([res1.json(), res2.json()]),
      )
      .then(
        ([
          cpuUsage,
          // cpuQuota,
          memoryUsage,
          // memoryRequests,
        ]) => {
          console.log(cpuUsage);
          // console.log(memoryUsage);
          this.setState({
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
                      metric="workload"
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
                      metric="workload"
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

export default MetricNamespace;
