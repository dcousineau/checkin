import React from 'react';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/lib/raised-button';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';

import {uploadTickets, requestStats, manuallyPrintBadge} from '../actions/tickets';
import renderBadge from '../../common/badge';

class Admin extends React.Component {
    state = {
        firstName: null,
        lastName: null,
        type: "General Admission"
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.ticketCount !== nextProps.ticketCount ||
            this.state.firstName !== nextState.firstName ||
            this.state.lastName !== nextState.lastName ||
            this.state.type !== nextState.type
        );
    }

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

    onRequestPrint = () => {
        const {dispatch} = this.props;
        const {firstName, lastName, type} = this.state;
        
        dispatch(manuallyPrintBadge({
            firstName,
            lastName,
            type
        }));
    };

    render() {
        if (this.canvas) {
            const {firstName, lastName, type} = this.state;

            this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);

            renderBadge({
                firstName,
                lastName,
                type,
                badge: {
                    width: 400,
                    height: 200
                }
            }, this.canvas);
            // this.canvasContainer.replaceChild(badge, this.canvasContainer.childNodes[0]);
        }

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
                <br />
                <Card>
                    <CardTitle title="Manual Print" subtitle="Manually print a name badge" />
                    <CardText>
                        <div className="badge-preview" style={{float: 'right'}}>
                            <canvas ref={ref => this.canvas = ref} width="400" height="200" style={{border: "2px solid black"}} />
                        </div>
                        <TextField
                            name="firstName"
                            floatingLabelText="First Name"
                            value={this.state.firstName}
                            onChange={e => this.setState({firstName: e.target.value})}
                        /><br/>
                        <TextField
                            name="lastName"
                            floatingLabelText="Last Name"
                            value={this.state.lastName}
                            onChange={e => this.setState({lastName: e.target.value})}
                        /><br/>
                        <TextField
                            name="type"
                            floatingLabelText="Ticket Type"
                            value={this.state.type}
                            onChange={e => this.setState({type: e.target.value})}
                        /><br/>
                        <RaisedButton label="Print"
                                      primary={true}
                                      onClick={this.onRequestPrint} />
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
