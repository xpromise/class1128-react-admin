/**
 * 应用主组件
 */
import React, {Component} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Login from './pages/login';
import Admin from './pages/admin';

// 测试高阶组件
// import A from './test/login';
// import B from './test/register';

import './assets/less/reset.less';

export default class App extends Component {
  render () {
    return (
      <div>
        {/*<A />*/}
        {/*<B />*/}
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/" component={Admin}/>
          {/* 为了开发login组件设计的 */}
          <Redirect to="/login"/>
        </Switch>
      </div>
    )
  }
}
