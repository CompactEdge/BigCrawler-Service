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
      isLoading: false,
      error: null,
      init: true,
    };
    // this.encodeRFC5987ValueChars = this.encodeRFC5987ValueChars.bind(this);
    this.makePercent = this.makePercent.bind(this);
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
    if (this.state.init) {
      let cluster = '';
      let namespace = 'gigamec-mano';
      let pod = 'mariadb-0';
      const exclude = '';
      const now = Date.now() / 1000;
      const range = 60 * 60 * 3; // s * m * h
      const step = 30;
      Promise.all([
        fetch(
          `http://192.168.213.243:18083/promr/${encodeURIComponent(
            `sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{namespace="${namespace}", pod="${pod}", container!="POD", cluster="${cluster}"}) by (container)`,
          )}&start=${now - range}&end=${now}&step=${step}`,
        ),
        fetch(
          `http://192.168.213.243:18083/promr/${encodeURIComponent(
            `sum(container_memory_working_set_bytes{cluster="${cluster}", namespace="${namespace}", pod="${pod}", container!="POD", container!="${exclude}"}) by (container)`,
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
                      metric="container"
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
                      metric="container"
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
