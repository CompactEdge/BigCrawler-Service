import React, { useState, useEffect, useRef } from 'react';

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
import CustomDropdown from 'views/components/CustomDropdown.js';
import StackedAreaChart from 'views/components/D3StackedAreaChart.js';

const MetricNamespace = props => {
  const [data, setData] = useState({
    cpuUsage: [],
    memoryUsage: [],
    init: true,
  });
  const [namespace, setNamespace] = useState('');
  const [namespaceList, setNamespaceList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [delay, setDelay] = useState(5);
  const savedCallback = useRef();

  useEffect(() => {
    const API_GATEWAY_HOST = `${window.$host}:${window.$apigw}`;
    Promise.all([
      fetch(`http://${API_GATEWAY_HOST}/kube/core/namespaces`),
    ]).then(([res]) =>
      Promise.all([res.json()]).then(result => {
        const nsList = [];
        result[0].items.map(({ metadata }) => {
          if (nsList.indexOf(metadata.name) === -1) {
            nsList.push(metadata.name);
          }
        });
        setNamespaceList(nsList);
        setNamespace(nsList[0]);
      }),
    );
  }, []);

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
  }, [namespace]);

  const handleCreateMetricChart = () => {
    const API_GATEWAY_HOST = `${window.$host}:${window.$apigw}`;
    let cluster = '';
    let type = 'deployment'; // deployment, statefulset, daemonset
    const exclude = '';
    const now = Date.now() / 1000;
    const range = 60 * 60 * 1; // s * m * h
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
      .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
      .then(
        ([
          cpuUsage,
          // cpuQuota,
          memoryUsage,
          // memoryRequests,
        ]) => {
          console.log(cpuUsage);
          // console.log(memoryUsage);
          setData({
            cpuUsage: cpuUsage.data.result,
            memoryUsage: memoryUsage.data.result,
            init: false,
          });
          setIsLoading(false);
          // console.log(this.state.cpuUsage);
        },
      )
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  };

  const handleChangeNamespace = value => {
    const idx = namespaceList.indexOf(value);
    if (idx > -1) {
      const ns = namespaceList[idx];
      setNamespace(ns);
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
        <div
          style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
          <CustomDropdown
            title="Namespace"
            value={namespace}
            items={namespaceList}
            onChange={handleChangeNamespace}
          />
        </div>
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
                    data={data.cpuUsage}
                    init={data.init}
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
                    data={data.memoryUsage}
                    init={data.init}
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

export default MetricNamespace;
