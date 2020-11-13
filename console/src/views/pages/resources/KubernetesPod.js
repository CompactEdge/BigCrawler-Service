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

class ResourcePod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // not null
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch('http://192.168.213.243:18083/kube/core/pods')
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
                  <CardTitle tag="h4">Pod</CardTitle>
                  <p className="card-category">파드</p>
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
                        Header: 'Containers',
                        accessor: item => {
                          const num = item.spec.containers.length;
                          // const running = item.status.containerStatuses.reduce((counter, obj) => {
                          //   if (obj.ready === true) {
                          //     counter++;
                          //   }
                          //   return counter;
                          // }, 0);
                          const running = item.status.containerStatuses.reduce(
                            (counter, obj) =>
                              obj.ready === true ? counter += 1 : counter,
                            0,
                          );
                          return `${running}/${num}`;
                        },
                      },
                      {
                        Header: 'Status',
                        accessor: 'status.phase',
                      },
                      {
                        Header: 'Pod-IP',
                        accessor: 'status.podIP',
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

export default ResourcePod;
