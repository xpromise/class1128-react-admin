/**
 * 应用主组件
 */
import React, {Component} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Login from './pages/login';
import Admin from './pages/admin';

import './assets/less/reset.less';

export default class App extends Component {
  render () {
    return (
      <Switch>
        <Route path="/login" component={Login}/>
        {/* 为了开发login组件设计的 */}
        <Redirect to="/login"/>
        <Route path="/" component={Admin}/>
      </Switch>
    )
  }
}
