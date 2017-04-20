import React from 'react';
import {connect} from 'react-redux';

import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import {MenuItem} from 'material-ui/Menu';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {requestTickets, checkInTicket} from '../actions/tickets';

import TicketList from '../components/ticket-list';


class Home extends React.Component {
    state = {
        filter: 'missing',
        selectedTicket: null
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(requestTickets());
    }

    onSelectTicket = (ticket) => {
        this.setState({selectedTicket: ticket});
    };

    onCloseDialog = () => {
        this.setState({selectedTicket: null});
    };

    filterTickets() {
        let filterFunc = ticket => true;
        switch (this.state.filter) {
            case 'missing':
                filterFunc = ticket => ticket.checkedIn == false;
                break;
            case 'checkedin':
                filterFunc = ticket => ticket.checkedIn == true;
                break;
            case 'all':
            default:
                break;

        }

        return this.props.tickets.data.filter(filterFunc);
    }

    confirmCheckInTicket(ticket, print) {
        const {dispatch} = this.props;
        dispatch(checkInTicket(ticket.id, print));
    }

    generateCheckInDialog() {
        if (!this.state.selectedTicket) return null;

        const ticket = this.state.selectedTicket;

        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                style={{margin: 12}}
                onTouchTap={this.onCloseDialog}
            />,
            <RaisedButton
                label="Confirm"
                style={{margin: 12}}
                onTouchTap={() => {
                    this.confirmCheckInTicket(ticket, false);
                    this.onCloseDialog();
                }}
            />,
            <RaisedButton
                label="Confirm & Print"
                primary={true}
                keyboardFocused={true}
                style={{margin: 12}}
                onTouchTap={() => {
                    this.confirmCheckInTicket(ticket);
                    this.onCloseDialog();
                }}
            />,
        ];

        return (
            <Dialog title={`Check In ${ticket.firstName} ${ticket.lastName}`}
                    actions={actions}
                    modal={false}
                    open={!!this.state.selectedTicket}
                    onRequestClose={this.onCloseDialog} >
                <dl style={{float:"left"}}>
                    <dt>Ticket ID:</dt>
                    <dd>{ticket.id}</dd>
                    <dt>Ticket Type:</dt>
                    <dd>{ticket.type}</dd>
                </dl>
                <dl style={{float:"right"}}>
                    <dt>Company:</dt>
                    <dd>{ticket.company}</dd>
                    <dt>Shirt Size:</dt>
                    <dd>{ticket.shirtSize}</dd>
                </dl>
            </Dialog>
        );
    }

    render() {
        return (
            <div>
                <Toolbar>
                    <ToolbarGroup firstChild={true} style={{float: "left"}}>
                        <DropDownMenu onChange={(event, index, filter) => this.setState({filter})} value={this.state.filter}>
                            <MenuItem value={'all'} primaryText="All Attendees" />
                            <MenuItem value={'missing'} primaryText="Not Checked In" />
                            <MenuItem value={'checkedin'} primaryText="Checked In" />
                        </DropDownMenu>
                    </ToolbarGroup>
                </Toolbar>
                <TicketList tickets={this.filterTickets()}
                            onSelectTicket={this.onSelectTicket} />
                {this.generateCheckInDialog()}
            </div>
        );
    }
}

const mapStateToProps = ({tickets}) => ({tickets});

export default connect(mapStateToProps)(Home);
