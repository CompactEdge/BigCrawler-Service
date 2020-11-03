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
import {
  // Badge,
  // Button,
  Card,
  CardHeader,
  CardBody,
  // CardFooter,
  CardTitle,
  // Label,
  // FormGroup,
  // Input,
  // Table,
  Row,
  Col,
  // UncontrolledTooltip,
} from 'reactstrap';
import PieChart from 'views/components/PieChart.js';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      node: [],
      pod: [],
      deployment: [],
      isLoading: false,
      error: null,
    };
    this.countObjects = this.countObjects.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    Promise.all([
      fetch('http://127.0.0.1:8083/kube/core/nodes'),
      fetch('http://127.0.0.1:8083/kube/core/pods'),
      fetch('http://127.0.0.1:8083/kube/apps/deployments'),
      fetch('http://127.0.0.1:8083/kube/apps/statefulsets'),
      fetch('http://127.0.0.1:8083/kube/apps/daemonsets'),
    ])
      .then(([
        resNodes,
        resPods,
        resDeployments,
        resStatefulSets,
        resDaemonSets,
      ]) => Promise.all([
        resNodes.json(),
        resPods.json(),
        resDeployments.json(),
        resStatefulSets.json(),
        resDaemonSets.json(),
      ]))
      .then(([
        nodes,
        pods,
        deployments,
        statefulsets,
        daemonsets,
      ]) => {
        this.setState({
          node: this.countObjects('node', nodes),
          pod: this.countObjects('pod', pods),
          deployment: this.countObjects('deployment', deployments),
          statefulset: this.countObjects('statefulset', statefulsets),
          daemonset: this.countObjects('daemonset', daemonsets),
          isLoading: false,
        });
      })
      .catch(error =>
        this.setState({
          error,
          isLoading: false,
        }),
      );
  }

  countObjects(key, data) {
    if (!key) return;
    // this.setState({ isLoading: true });
    return [
      { name: 'object', value: key },
      { name: 'running', value: data.items.length },
      { name: 'fail', value: 1 },
    ];
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
                  <CardTitle tag="h4">Workload Status</CardTitle>
                  <p className="card-category">Objects</p>
                </CardHeader>
                <CardBody>
                  <div className="row">
                    <PieChart data={this.state.pod} />
                    <PieChart data={this.state.node} />
                    <PieChart data={this.state.deployment} />
                    <PieChart data={this.state.statefulset} />
                    <PieChart data={this.state.daemonset} />
                  </div>
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
