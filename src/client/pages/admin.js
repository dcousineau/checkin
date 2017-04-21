import React from 'react';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardTitle, CardText, CardHeader, CardActions} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import * as Colors from 'material-ui/styles/colors';

import {uploadTickets, requestStats, manuallyPrintBadge} from '../actions/tickets';
import renderBadge from '../../common/badge';

class Admin extends React.Component {
    state = {
        firstName: "",
        lastName: "",
        type: "General Admission"
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(requestStats());
    }

    onChangeFiles = (e) => {
        if (this.props.ticketCount && !confirm("This will UPDATE all tickets in the system (without affecting checked in status) and remove old tickets that are not in this CSV.\n\nAre you sure you wish to continue?")) {
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
                        {this.props.ticketCount ? (
                            <span>
                                There are <span style={{color: Colors.green600}}>{this.props.totalCheckedIn}</span>/<strong>{this.props.ticketCount}</strong> tickets in the database.
                            </span>
                        ) : (
                            <span>
                                There are <strong>NO</strong> tickets in the database.
                            </span>
                        )}
                        
                        
                        <br/><br/>

                        <RaisedButton label="Upload Tickets"
                                      primary={true}
                                      style={{marginRight: 12}}
                                      onClick={() => this.csvFile.click()} />

                        <input ref={ref => this.csvFile = ref}
                               type="file"
                               style={{display: 'none'}}
                               multiple={false}
                               accept="text/csv"
                               onChange={this.onChangeFiles} />


                        <RaisedButton label="Download Checked In Report"
                                      secondary={true}
                                      onClick={() => window.open("/api/report/checked-in")} />
                    </CardText>
                </Card>
                <br />
                <Card>
                    <CardTitle
                        title="Statistics"
                        subtitle="Show checked in / total stats"
                        actAsExpander={true}
                        showExpandableButton={true} />
                    <CardText expandable={true}>
                        <dl style={{marginTop:0}}>
                            {Object.keys(this.props.ticketCountByType).map(type => {
                                const counts = this.props.ticketCountByType[type];
                                return [
                                    <dt>{type}</dt>,
                                    <dd style={{color: Colors.blueGrey600}}>
                                        <span style={{color: Colors.green600}}>{counts.checkedIn}</span>/<span>{counts.total}</span>
                                    </dd>
                                ]
                            })}
                        </dl>
                    </CardText>
                </Card>
                <br />
                <Card>
                    <CardTitle title="Manual Print" subtitle="Manually print a name badge" />
                    <CardText>
                        <div className="badge-preview" style={{float: "right", width: "100%", maxWidth: "400px"}}>
                            <canvas ref={ref => this.canvas = ref}
                                    key={"badge-preview"} 
                                    width="400" 
                                    height="200" 
                                    style={{border: "2px solid black", width: "100%"}} />
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
    ticketCountByType: tickets.byType || {},
    totalCheckedIn: tickets.totalCheckedIn,
    ticketUploadError: tickets.ticketUploadError
});

export default connect(mapStateToProps)(Admin);
