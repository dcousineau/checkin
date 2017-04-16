import React from 'react';
import { Route, Switch } from 'react-router';

import Layout from '../pages/layout';
import Home from '../pages/home';
import PageNotFound from '../pages/pagenotfound';
import Admin from '../pages/admin';

export default class AppContainer extends React.Component {
    render() {
        return (
            <Layout>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/admin" component={Admin} />
                    <Route component={PageNotFound} />
                </Switch>
            </Layout>
        );
    }
}
