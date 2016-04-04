import React from 'react';
import {connect} from 'react-redux';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

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

    confirmCheckInTicket(ticket) {
        const {dispatch} = this.props;
        dispatch(checkInTicket(ticket.id));
    }

    generateCheckInDialog() {
        if (!this.state.selectedTicket) return null;

        const ticket = this.state.selectedTicket;

        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.onCloseDialog}
            />,
            <FlatButton
                label="Confirm"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => {
                    this.confirmCheckInTicket(ticket);
                    this.onCloseDialog();
                }}
            />
        ];

        return (
            <Dialog title={`Check In ${ticket.firstName} ${ticket.lastName}`}
                    actions={actions}
                    modal={false}
                    open={!!this.state.selectedTicket}
                    onRequestClose={this.onCloseDialog} >
                <dl>
                    <dt>Ticket ID:</dt>
                    <dd>{ticket.id}</dd>
                    <dt>Ticket Type:</dt>
                    <dd>{ticket.type}</dd>
                    <dt>Company:</dt>
                    <dd>{ticket.company}</dd>
                </dl>
            </Dialog>
        );
    }

    render() {
        return (
            <div>
                <Toolbar>
                    <ToolbarGroup firstChild={true} float="left">
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
