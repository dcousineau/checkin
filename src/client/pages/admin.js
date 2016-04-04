import React from 'react';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/lib/raised-button';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

import {uploadTickets, requestStats} from '../actions/tickets';

class Admin extends React.Component {
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(requestStats());
    }

    onChangeFiles = (e) => {
        if (this.props.ticketCount && !confirm("There are tickets in the system, do you wish to replace them (including checked in/out status)?")) {
            return;
        }

        const {dispatch} = this.props;
        const files = e.target.files;

        dispatch(uploadTickets(files));
    };

    render() {
        return (
            <div className="page admin">
                <h1>Admin</h1>

                <Card>
                    <CardTitle title="Update Tickets" subtitle="Upload CSV from ti.to" />
                    <CardText>
                        There are <strong>{this.props.ticketCount || "NO"}</strong> tickets in the database.
                        <br/><br/>
                        <RaisedButton label="Upload Tickets"
                                      primary={true}
                                      onClick={() => this.csvFile.click()} />
                        <input ref={ref => this.csvFile = ref}
                               type="file"
                               style={{display: 'none'}}
                               multiple={false}
                               accept="text/csv"
                               onChange={this.onChangeFiles} />
                    </CardText>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = ({tickets}) => ({
    isUploading: tickets.isUploading,
    ticketCount: tickets.ticketCount,
    ticketUploadError: tickets.ticketUploadError
});

export default connect(mapStateToProps)(Admin);
