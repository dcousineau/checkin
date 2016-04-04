import React from 'react';
import {groupBy} from 'lodash/collection';
import {isEqual} from 'lodash/lang';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Avatar from 'material-ui/lib/avatar';
import * as Colors from 'material-ui/lib/styles/colors';

export default class TicketList extends React.Component {
    static propTypes = {
        tickets: React.PropTypes.array.isRequired,
        onSelectTicket: React.PropTypes.func
    };

    static defaultProps = {
        onSelectTicket: (ticket) => {}
    };

    shouldComponentUpdate(nextProps) {
        return !isEqual(this.props.tickets, nextProps.tickets);
    }

    render() {
        console.log(this.tickets);
        const tickets = groupBy(this.props.tickets, ticket => ticket.lastName.charAt(0).toUpperCase());

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
                                      onTouchTap={() => this.props.onSelectTicket(ticket)}
                                   /* rightAvatar={<Avatar src="images/adhamdannaway-128.jpg" />} */ />
                        )
                    })}
                </List>
            );

        });

        return (
            <div className="tickets">
                {items}
            </div>
        );
    }
}
