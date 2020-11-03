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
// import { Component, Fragment } from "react";
// react plugin used to create charts
// import { Line, Bar, Doughnut } from "react-chartjs-2";
// react plugin for creating vector maps
// import { VectorMap } from "react-jvectormap";
// import ReactTable from 'components/ReactTable/ReactTable.js';

// reactstrap components
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

// import {
//   chartExample1,
//   chartExample2,
//   chartExample3,
//   chartExample4,
//   chartExample5,
//   chartExample6,
//   chartExample7,
//   chartExample8,
// } from "variables/charts.js";

// var mapData = {
//   AU: 760,
//   BR: 550,
//   CA: 120,
//   DE: 1300,
//   FR: 540,
//   GB: 690,
//   GE: 200,
//   IN: 200,
//   RO: 600,
//   RU: 300,
//   US: 2920,
// };

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // not null
      isLoading: false,
      error: null,
    };
  }

  // shouldComponentUpdate() { // infinite loop?
  componentDidMount() {
    this.setState({ isLoading: true });
    fetch('http://127.0.0.1:8083/kube/core/nodes')
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({ data: json.items, isLoading: false });
      })
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
                  <CardTitle tag="h4">Workload Status</CardTitle>
                  <p className="card-category">Objects</p>
                </CardHeader>
                <CardBody>
                  d3.js Pie chart
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
