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

class ResourceNode extends React.Component {
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
    fetch('http://127.0.0.1:8083/bus/pods')
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
                  <ReactTable
                    data={this.state.data}
                    columns={[
                      {
                        Header: 'Name',
                        accessor: 'metadata.name',
                      },
                      {
                        Header: 'Image',
                        // accessor: '',
                        accessor: (item)=> item.spec.containers[0].image
                      },
                      {
                        Header: 'Namespace',
                        accessor: 'metadata.namespace',
                      },
                      {
                        Header: 'Containers',
                        accessor: '',
                      },
                      {
                        Header: 'Status',
                        accessor: 'status.phase',
                      },
                      {
                        Header: 'Pod-IP',
                        accessor: 'status.podIp',
                      },
                      // {
                      //   Header: "Actions",
                      //   accessor: "actions",
                      //   sortable: false,
                      //   filterable: false,
                      // },
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

export default ResourceNode;
