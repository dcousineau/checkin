import React from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";

export default class Layout extends React.Component {
  state = {
    open: false
  };

  closeMenu = () => this.setState({ open: false });

  render() {
    return (
      <div id="app-container">
        <AppBar
          title="CheckIn"
          onLeftIconButtonTouchTap={() =>
            this.setState(prevState => ({ open: !prevState.open }))}
        />
        <Drawer
          className="nav-bar"
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <Link to="/" onClick={this.closeMenu}>
            <MenuItem>CheckIn</MenuItem>
          </Link>
          {/* <Link to="/print-queue" onClick={this.closeMenu}><MenuItem>Print Queue</MenuItem></Link> */}
          <Link to="/admin" onClick={this.closeMenu}>
            <MenuItem>Admin</MenuItem>
          </Link>
        </Drawer>
        <div id="app-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
