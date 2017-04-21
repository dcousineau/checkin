import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import io from "socket.io-client";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import initializeStore from "./store";

import App from "./containers/app";

injectTapEventPlugin();

const store = initializeStore();
const socket = io.connect();

socket.on("connect", () => {
  const dispatch = store.dispatch.bind(store);
  // dispatch('SOCKET_CONNECTED');
  socket.on("action", data => {
    dispatch(data);
  });
});

const render = AppContainer => {
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider>
        <Router>
          <AppContainer />
        </Router>
      </MuiThemeProvider>
    </Provider>,
    document.getElementById("content")
  );
};

render(App);

if (module.hot) {
  module.hot.accept("./containers/app", () => render(App));
}
