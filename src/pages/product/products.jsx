import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Index from './index';
import Detail from './detail';
import SaveUpdate from './save-update';

export default class Products extends Component {
  render() {
    return <Switch>
      <Route path="/product/index" component={Index}/>
      <Route path="/product/saveupdate" component={SaveUpdate}/>
      <Route path="/product/detail" component={Detail}/>
      <Redirect to="/product/index"/>
    </Switch>;
  }
}