import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';


export default class Layout extends React.Component {
    state = {
        open: false
    };

    render() {
        return (
            <div id="app-container">
                <AppBar title="CheckIn"
                        onLeftIconButtonTouchTap={() => this.setState(prevState => ({open: !prevState.open}))} />
                <LeftNav docked={false}
                         width={200}
                         open={this.state.open}
                         onRequestChange={open => this.setState({open})}>
                    <MenuItem>Menu Item</MenuItem>
                    <MenuItem>Menu Item 2</MenuItem>
                </LeftNav>
                <div id="app-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
