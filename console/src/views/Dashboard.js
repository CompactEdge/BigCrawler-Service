/*!

=========================================================
* Paper Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from 'reactstrap';
import PieChart from 'views/components/D3PieChart.js';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      node: [],
      pod: [],
      deployment: [],
      isLoading: false,
      error: null,
      redirect: null,
      init: true,
    };
    this.handleCountObjects = this.handleCountObjects.bind(this);
    this.handleRedirectToPieChartResource = this.handleRedirectToPieChartResource.bind(
      this,
    );
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    if (this.state.init) {
      Promise.all([
        fetch('http://127.0.0.1:8083/kube/core/nodes'),
        fetch('http://127.0.0.1:8083/kube/core/pods'),
        fetch('http://127.0.0.1:8083/kube/apps/deployments'),
        fetch('http://127.0.0.1:8083/kube/apps/statefulsets'),
        fetch('http://127.0.0.1:8083/kube/apps/daemonsets'),
      ])
        .then(
          ([
            resNodes,
            resPods,
            resDeployments,
            resStatefulSets,
            resDaemonSets,
          ]) =>
            Promise.all([
              resNodes.json(),
              resPods.json(),
              resDeployments.json(),
              resStatefulSets.json(),
              resDaemonSets.json(),
            ]),
        )
        .then(([nodes, pods, deployments, statefulsets, daemonsets]) => {
          this.setState({
            node: this.handleCountObjects('node', nodes),
            pod: this.handleCountObjects('pod', pods),
            deployment: this.handleCountObjects('deployment', deployments),
            statefulset: this.handleCountObjects('statefulset', statefulsets),
            daemonset: this.handleCountObjects('daemonset', daemonsets),
            isLoading: false,
            init: false,
          });
        })
        .catch(error =>
          this.setState({
            error,
            isLoading: false,
          }),
        );
    }
  }

  handleCountObjects(key, data) {
    if (!key) return;
    let ready = data.items.filter(d => {
      // console.log(d);
      return (
        d.status.readyReplicas > 0 ||
        d.status.numberReady ||
        d.status.conditions.find(v => v.type === 'Ready')['status'] === 'True'
      );
    }).length;

    return [
      { name: 'object', value: key },
      { name: 'running', value: ready },
      { name: 'fail', value: data.items.length - ready },
    ];
  }

  handleRedirectToPieChartResource(url) {
    this.setState({
      redirect: url,
    });
  }

  render() {
    const { isLoading, error } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return <p>Loading ...</p>;
    }

    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: this.state.redirect,
          }}
        />
      );
    }

    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Workload Status</CardTitle>
                  <p className="card-category">Kubernetes Objects</p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col
                      md="3"
                      className="my-5"
                      onClick={() =>
                        // window.location.href='/admin/kubernetes/pods'
                        this.handleRedirectToPieChartResource(
                          '/admin/kubernetes/pods',
                        )
                      }>
                      <PieChart init={this.state.init} data={this.state.pod} />
                    </Col>
                    <Col
                      md="3"
                      className="my-5"
                      onClick={() =>
                        this.handleRedirectToPieChartResource(
                          '/admin/kubernetes/nodes',
                        )
                      }>
                      <PieChart init={this.state.init} data={this.state.node} />
                    </Col>
                    <Col
                      md="3"
                      className="my-5"
                      onClick={() =>
                        this.handleRedirectToPieChartResource(
                          '/admin/kubernetes/pods',
                        )
                      }>
                      <PieChart
                        init={this.state.init}
                        data={this.state.deployment}
                      />
                    </Col>
                    <Col
                      md="3"
                      className="my-5"
                      onClick={() =>
                        this.handleRedirectToPieChartResource(
                          '/admin/kubernetes/pods',
                        )
                      }>
                      <PieChart
                        init={this.state.init}
                        data={this.state.statefulset}
                      />
                    </Col>
                    <Col
                      md="3"
                      className="my-5"
                      onClick={() =>
                        this.handleRedirectToPieChartResource(
                          '/admin/kubernetes/pods',
                        )
                      }>
                      <PieChart
                        init={this.state.init}
                        data={this.state.daemonset}
                      />
                    </Col>
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

export default Dashboard;
