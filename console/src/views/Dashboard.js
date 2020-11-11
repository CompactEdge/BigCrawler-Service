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
    this.interval = setInterval(this.handleCreateDashboard, this.state.delay);
    // this.interval = setInterval(() => this.handleCreateDashboard(), this.state.delay);
    // this.handleCreateDashboard();
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
    Promise.all([
      fetch('http://127.0.0.1:8083/kube/core/nodes'),
      fetch('http://127.0.0.1:8083/kube/core/pods'),
      fetch('http://127.0.0.1:8083/kube/apps/deployments'),
      fetch('http://127.0.0.1:8083/kube/apps/daemonsets'),
      fetch('http://127.0.0.1:8083/kube/apps/replicasets'),
      fetch('http://127.0.0.1:8083/kube/core/replicationcontrollers'),
      fetch('http://127.0.0.1:8083/kube/apps/statefulsets'),
      fetch('http://127.0.0.1:8083/kube/batch/jobs'),
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
          console.log(deployments);
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
      .catch(error =>
        this.setState({
          error,
          isLoading: false,
        }),
      );

    if (this.state.init) {
      this.setState({ init: false });
    }
  }

  handleCountObjects(key, data) {
    if (!key) return;
    let ready = data.items.filter(d => {
      if (key === 'node' || key === 'pod') {
        return (
          d.status.conditions.find(v => v.type === 'Ready')['status'] === 'True'
        );
      }
      if (key === 'deployment') {
        return (
          d.status.conditions.find(v => v.type === 'Available')['status'] ===
            'True' && d.status.readyReplicas > 0
        );
      }
      return d.status.numberReady;
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
                        data={this.state.daemonset}
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
                        data={this.state.replicaset}
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
                        data={this.state.replicationcontroller}
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
                      <PieChart init={this.state.init} data={this.state.job} />
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
