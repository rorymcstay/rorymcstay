import React, {Component} from "react";
import ReactTable from "react-table"

class FeedStatus extends Component {

    constructor() {
        super();
    }
    render() {
        const { feed } = this.props.feed;
        return (
          <div>
            <ReactTable
              data={data}
              columns={[
                {
                  Header: "Name",
                  columns: [
                    {
                      Header: "First Name",
                      accessor: "firstName"
                    },
                    {
                      Header: "Last Name",
                      id: "lastName",
                      accessor: d => d.lastName
                    }
                  ]
                },
                {
                  Header: "Info",
                  columns: [
                    {
                      Header: "Age",
                      accessor: "age"
                    },
                    {
                      Header: "Status",
                      accessor: "status"
                    }
                  ]
                },
                {
                  Header: 'Stats',
                  columns: [
                    {
                      Header: "Visits",
                      accessor: "visits"
                    }
                  ]
                }
              ]}
              defaultPageSize={10}
              className="-striped -highlight"
            />
            <br />
            <Tips />
            <Logo />
          </div>
        );
    }
}
export default FeedStatus