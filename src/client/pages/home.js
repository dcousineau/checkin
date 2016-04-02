import React from 'react';

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

export default class Home extends React.Component {
    render() {
        return (
            <div>
                <Toolbar>
                    <ToolbarGroup firstChild={true} float="left">
                        <DropDownMenu value={1}>
                            <MenuItem value={1} primaryText="All Attendees" />
                            <MenuItem value={2} primaryText="Not Checked In" />
                            <MenuItem value={3} primaryText="Checked In" />
                        </DropDownMenu>
                    </ToolbarGroup>
                </Toolbar>
                <List>
                    <ListItem
                        primaryText="Chelsea Otakan"
                        leftIcon={<ActionGrade color={Colors.pinkA200} />}
                        rightAvatar={<Avatar src="images/chexee-128.jpg" />}
                    />
                    <ListItem
                        primaryText="Eric Hoffman"
                        insetChildren={true}
                        rightAvatar={<Avatar src="images/kolage-128.jpg" />}
                    />
                    <ListItem
                        primaryText="James Anderson"
                        insetChildren={true}
                        rightAvatar={<Avatar src="images/jsa-128.jpg" />}
                    />
                    <ListItem
                        primaryText="Kerem Suer"
                        insetChildren={true}
                        rightAvatar={<Avatar src="images/kerem-128.jpg" />}
                    />
                </List>
                <Divider inset={true} />
                <List>
                    <ListItem
                        primaryText="Adelle Charles"
                        leftAvatar={
                          <Avatar
                            color={Colors.pinkA200} backgroundColor={Colors.transparent}
                            style={{left: 8}}
                          >
                            A
                          </Avatar>
                        }
                        rightAvatar={<Avatar src="images/adellecharles-128.jpg" />}
                    />
                    <ListItem
                        primaryText="Adham Dannaway"
                        insetChildren={true}
                        rightAvatar={<Avatar src="images/adhamdannaway-128.jpg" />}
                    />
                    <ListItem
                        primaryText="Allison Grayce"
                        insetChildren={true}
                        rightAvatar={<Avatar src="images/allisongrayce-128.jpg" />}
                    />
                    <ListItem
                        primaryText="Angel Ceballos"
                        insetChildren={true}
                        rightAvatar={<Avatar src="images/angelceballos-128.jpg" />}
                    />
                </List>
            </div>
        );
    }
}
