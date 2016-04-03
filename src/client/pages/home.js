import React from 'react';
import {connect} from 'react-redux';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import Divider from 'material-ui/lib/divider';
import Avatar from 'material-ui/lib/avatar';
import * as Colors from 'material-ui/lib/styles/colors';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

import {groupBy} from 'lodash/collection';

import {requestTickets} from '../actions/tickets';


class Home extends React.Component {
    state = {
        filter: null,
        selectedTicket: null,
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(requestTickets());
    }

    onSelectTicket(ticket) {
        this.setState({selectedTicket: ticket});
    }

    filterTickets() {
        return this.props.tickets.data.filter(ticket => true);
    }
    
    buildTicketList() {
        const tickets = groupBy(this.filterTickets(), ticket => ticket.lastName.charAt(0).toUpperCase());

        const items = [];

        let firstGroup = true;
        Object.keys(tickets).map(group => {
            if (!firstGroup) {
                items.push(<Divider key={`divider-${group}`} inset={true} />);
            } else {
                firstGroup = false;
            }

            let firstItem = true;

            items.push(
                <List key={`group-${group}`}>
                {tickets[group].map(ticket => {
                    let leftAvatar = null;
                    if (firstItem) {
                        leftAvatar = (
                            <Avatar color={Colors.pinkA200}
                                    backgroundColor={Colors.transparent}
                                    style={{left: 8}}>
                                {group}
                            </Avatar>
                        );
                        firstItem = false;
                    }

                    return (
                        <ListItem key={ticket.id}
                                  primaryText={`${ticket.lastName}, ${ticket.firstName}`}
                                  secondaryText={ticket.id}
                                  insetChildren={!leftAvatar}
                                  leftAvatar={leftAvatar}
                                  onTouchTap={() => this.onSelectTicket(ticket)}
                               /* rightAvatar={<Avatar src="images/adhamdannaway-128.jpg" />} */ />
                    )
                })}
                </List>
            );

        });

        return items;
    }

    onCloseDialog = () => {
        this.setState({selectedTicket: null});
    };

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
                onTouchTap={this.onCloseDialog}
            />
        ];

        return (
            <Dialog title={`Check In ${ticket.firstName} ${ticket.lastName}`}
                    actions={actions}
                    modal={false}
                    open={!!this.state.selectedTicket}
                    onRequestClose={this.onCloseDialog} >
                The actions in this window were passed in as an array of React objects.
            </Dialog>
        );
    }

    render() {
        console.log(this.props.tickets);
        return (
            <div>
                {/*<Toolbar>
                    <ToolbarGroup firstChild={true} float="left">
                        <DropDownMenu value={1}>
                            <MenuItem value={1} primaryText="All Attendees" />
                            <MenuItem value={2} primaryText="Not Checked In" />
                            <MenuItem value={3} primaryText="Checked In" />
                        </DropDownMenu>
                    </ToolbarGroup>
                </Toolbar>*/}
                {this.buildTicketList()}
                {this.generateCheckInDialog()}
            </div>
        );
    }
}

const mapStateToProps = ({tickets}) => ({tickets});

export default connect(mapStateToProps)(Home);
