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

const MetricPod = props => {
  const [data, setData] = useState({
    cpuUsage: [],
    memoryUsage: [],
    init: true,
  });
  const [namespace, setNamespace] = useState('');
  const [namespaceList, setNamespaceList] = useState([]);
  const [pod, setPod] = useState({
    name: '',
    namespace: '',
  });
  const [podList, setPodList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [delay, setDelay] = useState(5);
  const [range, setRange] = useState(60 * 60 * 1); // s * m * h
  const savedCallback = useRef();

  useEffect(() => {
    const API_GATEWAY_HOST = `${window.$host}:${window.$apigw}`;
    Promise.all([fetch(`http://${API_GATEWAY_HOST}/kube/core/pods`)]).then(
      ([res]) =>
        Promise.all([res.json()]).then(result => {
          const nsList = [];
          const polist = [];
          result[0].items.forEach(({ metadata }) => {
            if (nsList.indexOf(metadata.namespace) === -1) {
              nsList.push(metadata.namespace);
            }
            polist.push({ name: metadata.name, namespace: metadata.namespace });
          });
          setNamespaceList(nsList);
          setNamespace(nsList[0]);
          setPodList(polist);
          setPod(polist[0]);
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
  }, [namespace, pod]);

  const handleCreateMetricChart = () => {
    const API_GATEWAY_HOST = `${window.$host}:${window.$apigw}`;
    let cluster = '';
    const exclude = '';
    const date = new Date();
    const sec = date.getSeconds();
    date.setSeconds(sec < 30 ? 0 : 30);
    const now = date.getTime() / 1000;
    const step = 30;
    Promise.all([
      fetch(
        `http://${API_GATEWAY_HOST}/promr/${encodeURIComponent(
          `sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{namespace="${namespace}", pod="${pod.name}", container!="POD", cluster="${cluster}"}) by (container)`,
        )}&start=${now - range}&end=${now}&step=${step}`,
      ),
      fetch(
        `http://${API_GATEWAY_HOST}/promr/${encodeURIComponent(
          `sum(container_memory_working_set_bytes{cluster="${cluster}", namespace="${namespace}", pod="${pod.name}", container!="POD", container!="${exclude}"}) by (container)`,
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
          if (cpuUsage.data.result.length) {
            setData({
              cpuUsage: cpuUsage.data.result,
              memoryUsage: memoryUsage.data.result,
              init: false,
            });
          }
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
      const poIdx = podList.findIndex(v => v.namespace === ns);
      setPod(podList[poIdx]);
    }
  };
  const handleChangePod = value => {
    const idx = podList.findIndex(e => e.name === value);
    if (idx > -1) {
      setPod(podList[idx]);
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
          <CustomDropdown
            title="Pod"
            value={pod.name}
            items={podList
              .filter(v => v.namespace === namespace)
              .map(v => v.name)}
            onChange={handleChangePod}
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
                    metric="container"
                    data={data.cpuUsage}
                    init={data.init}
                    range={range}
                    delay={delay}
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
                    data={data.memoryUsage}
                    init={data.init}
                    range={range}
                    delay={delay}
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

export default MetricPod;
