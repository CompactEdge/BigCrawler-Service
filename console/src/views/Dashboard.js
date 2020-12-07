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
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from 'reactstrap';
import PieChart from 'views/components/D3PieChart.js';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
      isLoading: false,
      error: null,
      redirect: null,
      delay: 5000,
    };
    this.handleCreateDashboard = this.handleCreateDashboard.bind(this);
    this.handleCountObjects = this.handleCountObjects.bind(this);
    this.handleRedirectToPieChartResource = this.handleRedirectToPieChartResource.bind(
      this,
    );
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.handleCreateDashboard();
    this.interval = setInterval(this.handleCreateDashboard, this.state.delay);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.delay !== this.state.delay) {
      clearInterval(this.interval);
      this.interval = setInterval(this.handleCreateDashboard, this.state.delay);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleCreateDashboard() {
    const API_GATEWAY_HOST = `${window.$host}:${window.$apigw}`;
    Promise.all([
      fetch(`http://${API_GATEWAY_HOST}/kube/core/nodes`),
      fetch(`http://${API_GATEWAY_HOST}/kube/core/pods`),
      fetch(`http://${API_GATEWAY_HOST}/kube/apps/deployments`),
      fetch(`http://${API_GATEWAY_HOST}/kube/apps/daemonsets`),
      fetch(`http://${API_GATEWAY_HOST}/kube/apps/replicasets`),
      fetch(`http://${API_GATEWAY_HOST}/kube/core/replicationcontrollers`),
      fetch(`http://${API_GATEWAY_HOST}/kube/apps/statefulsets`),
      fetch(`http://${API_GATEWAY_HOST}/kube/batch/jobs`),
    ])
      .then(
        ([
          resNodes,
          resPods,
          resDeployments,
          resDaemonSets,
          resReplicaSets,
          resReplicaControllers,
          resStatefulSets,
          resJobs,
        ]) =>
          Promise.all([
            resNodes.json(),
            resPods.json(),
            resDeployments.json(),
            resDaemonSets.json(),
            resReplicaSets.json(),
            resReplicaControllers.json(),
            resStatefulSets.json(),
            resJobs.json(),
          ]),
      )
      .then(
        ([
          nodes,
          pods,
          deployments,
          daemonsets,
          replicasets,
          replicationcontrollers,
          statefulsets,
          jobs,
        ]) => {
          this.setState({
            node: this.handleCountObjects('node', nodes),
            pod: this.handleCountObjects('pod', pods),
            deployment: this.handleCountObjects('deployment', deployments),
            daemonset: this.handleCountObjects('daemonset', daemonsets),
            replicaset: this.handleCountObjects('replicaset', replicasets),
            replicationcontroller: this.handleCountObjects(
              'replicationcontroller',
              replicationcontrollers,
            ),
            statefulset: this.handleCountObjects('statefulset', statefulsets),
            job: this.handleCountObjects('job', jobs),
            isLoading: false,
          });
        },
      )
      .catch(error => {
        console.log(error);
        this.setState({
          error,
          isLoading: false,
        });
      });

    if (this.state.init) {
      this.setState({ init: false });
    }
  }

  handleCountObjects(key, data) {
    if (!key) return;
    let ready = data.items.filter(d => {
      switch (key) {
        case 'node':
        case 'pod':
          return (
            d.status.conditions.find(v => v.type === 'Ready')['status'] ===
            'True'
          );
        case 'deployment':
          return (
            d.status.conditions.find(v => v.type === 'Available')['status'] ===
              'True' && d.status.readyReplicas > 0
          );
        case 'replicaset':
        case 'statefulset':
          return d.status.readyReplicas > 0;
        default:
          return d.status.numberReady > 0;
      }
    }).length;

    if (data.items.length === 0) {
      return [];
    }

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

    // TODO:
    if (error) {
      return <p>{error.message}</p>;
    }

    // TODO:
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
                    {this.state.node !== undefined &&
                      this.state.node.length > 0 &&
                      this.state.node.filter(
                        d => d.name !== 'object' && d.value > 0,
                      ).length !== 0 && (
                        <Col
                          md="3"
                          className="my-5"
                          onClick={() =>
                            this.handleRedirectToPieChartResource(
                              '/admin/kubernetes/nodes',
                            )
                          }>
                          <PieChart
                            init={this.state.init}
                            data={this.state.node}
                          />
                        </Col>
                      )}
                    {this.state.pod !== undefined &&
                      this.state.pod.length > 0 &&
                      this.state.pod.filter(
                        d => d.name !== 'object' && d.value > 0,
                      ).length !== 0 && (
                        <Col
                          md="3"
                          className="my-5"
                          onClick={() =>
                            // window.location.href='/admin/kubernetes/pods'
                            this.handleRedirectToPieChartResource(
                              '/admin/kubernetes/pods',
                            )
                          }>
                          <PieChart
                            init={this.state.init}
                            data={this.state.pod}
                          />
                        </Col>
                      )}
                    {this.state.deployment !== undefined &&
                      this.state.deployment.length > 0 &&
                      this.state.deployment.filter(
                        d => d.name !== 'object' && d.value > 0,
                      ).length !== 0 && (
                        <Col
                          md="3"
                          className="my-5"
                          onClick={() =>
                            this.handleRedirectToPieChartResource(
                              '/admin/kubernetes/deployments',
                            )
                          }>
                          <PieChart
                            init={this.state.init}
                            data={this.state.deployment}
                          />
                        </Col>
                      )}
                    {this.state.daemonset !== undefined &&
                      this.state.daemonset.length > 0 &&
                      this.state.daemonset.filter(
                        d => d.name !== 'object' && d.value > 0,
                      ).length !== 0 && (
                        <Col
                          md="3"
                          className="my-5"
                          onClick={() =>
                            this.handleRedirectToPieChartResource(
                              '/admin/kubernetes/daemonsets',
                            )
                          }>
                          <PieChart
                            init={this.state.init}
                            data={this.state.daemonset}
                          />
                        </Col>
                      )}
                    {this.state.replicaset !== undefined &&
                      this.state.replicaset.length > 0 &&
                      this.state.replicaset.filter(
                        d => d.name !== 'object' && d.value > 0,
                      ).length !== 0 && (
                        <Col
                          md="3"
                          className="my-5"
                          onClick={() =>
                            this.handleRedirectToPieChartResource(
                              '/admin/kubernetes/replicasets',
                            )
                          }>
                          <PieChart
                            init={this.state.init}
                            data={this.state.replicaset}
                          />
                        </Col>
                      )}
                    {this.state.replicationcontroller !== undefined &&
                      this.state.replicationcontroller.length > 0 &&
                      this.state.replicationcontroller.filter(
                        d => d.name !== 'object' && d.value > 0,
                      ).length !== 0 && (
                        <Col
                          md="3"
                          className="my-5"
                          onClick={() =>
                            this.handleRedirectToPieChartResource(
                              '/admin/kubernetes/replicationcontrollers',
                            )
                          }>
                          <PieChart
                            init={this.state.init}
                            data={this.state.replicationcontroller}
                          />
                        </Col>
                      )}
                    {this.state.statefulset !== undefined &&
                      this.state.statefulset.length > 0 &&
                      this.state.statefulset.filter(
                        d => d.name !== 'object' && d.value > 0,
                      ).length !== 0 && (
                        <Col
                          md="3"
                          className="my-5"
                          onClick={() =>
                            this.handleRedirectToPieChartResource(
                              '/admin/kubernetes/statefulsets',
                            )
                          }>
                          <PieChart
                            init={this.state.init}
                            data={this.state.statefulset}
                          />
                        </Col>
                      )}

                    {this.state.job !== undefined &&
                      this.state.job.length > 0 &&
                      this.state.job.filter(
                        d => d.name !== 'object' && d.value > 0,
                      ).length !== 0 && (
                        <Col
                          md="3"
                          className="my-5"
                          onClick={() =>
                            this.handleRedirectToPieChartResource(
                              '/admin/kubernetes/jobs',
                            )
                          }>
                          <PieChart
                            init={this.state.init}
                            data={this.state.job}
                          />
                        </Col>
                      )}
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
