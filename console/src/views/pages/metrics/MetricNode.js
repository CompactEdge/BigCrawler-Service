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

const MetricNode = props => {
  const [data, setData] = useState({
    cpuUsage: [],
    memoryUsage: [],
    init: true,
  });
  const [node, setNode] = useState('');
  const [nodeList, setNodeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [delay, setDelay] = useState(5);
  const savedCallback = useRef();

  useEffect(() => {
    const API_GATEWAY_HOST = `${window.$host}:${window.$apigw}`;
    Promise.all([fetch(`http://${API_GATEWAY_HOST}/kube/core/nodes`)]).then(
      ([res]) =>
        Promise.all([res.json()]).then(result => {
          const list = [];
          result[0].items.map(({ metadata }) => {
            list.push(metadata.name);
          });
          setNodeList(list);
          setNode(list[0]);
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
  }, [node]);

  const handleCreateMetricChart = () => {
    const API_GATEWAY_HOST = `${window.$host}:${window.$apigw}`;
    let cluster = '';
    const exclude = '';
    const now = Date.now() / 1000;
    const range = 60 * 60 * 1; // s * m * h
    const step = 30;
    Promise.all([
      fetch(
        `http://${API_GATEWAY_HOST}/promr/${encodeURIComponent(
          `sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster="${cluster}", node="${node}"}) by (pod)`,
        )}&start=${now - range}&end=${now}&step=${step}`,
      ),
      fetch(
        `http://${API_GATEWAY_HOST}/promr/${encodeURIComponent(
          `sum(node_namespace_pod_container:container_memory_working_set_bytes{cluster="${cluster}", node="${node}", container!="${exclude}"}) by (pod)`,
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
          setIsLoading(false);
          if (cpuUsage.data.result.length) {
            setData({
              cpuUsage: cpuUsage.data.result,
              memoryUsage: memoryUsage.data.result,
              init: false,
            });
          }
          // console.log(this.state.cpuUsage);
        },
      )
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  };

  const handleChangeNode = value => {
    const idx = nodeList.findIndex(e => e === value);
    if (idx > -1) {
      setNode(nodeList[idx]);
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
        <div>
          <CustomDropdown
            title="Node"
            value={node}
            items={nodeList}
            onChange={handleChangeNode}
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
                    metric="pod"
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
                    metric="pod"
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

export default MetricNode;
