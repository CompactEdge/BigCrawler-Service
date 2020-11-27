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

// core components
import ReactTable from 'components/ReactTable/ReactTable.js';

class KubernetesJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // not null
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    const API_GATEWAY_HOST = `${window.$host}:${window.$apigw}`;
    this.setState({ isLoading: true });
    fetch(`http://${API_GATEWAY_HOST}/kube/batch/jobs`)
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
                  <CardTitle tag="h4">Job</CardTitle>
                  <p className="card-category">잡</p>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={this.state.data}
                    columns={[
                      {
                        Header: 'Name',
                        accessor: 'metadata.name',
                      },
                      {
                        Header: 'Namespace',
                        accessor: 'metadata.namespace',
                      },
                      {
                        Header: 'Actions',
                        accessor: 'actions',
                        sortable: false,
                        filterable: false,
                      },
                    ]}
                    /*
                      You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                    */
                    className="-striped -highlight primary-pagination"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default KubernetesJob;
