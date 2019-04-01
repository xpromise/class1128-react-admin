/**
 * 登录路由组件
 */
import React, {Component} from 'react';
import {
  Form, Icon, Input, Button, Checkbox,
} from 'antd';

import logo from './logo.png';
import './index.less';

const Item = Form.Item;

export default class Login extends Component {
  
  login = (e) => {
    e.preventDefault();
  }
  
  render () {
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h3>用户登录</h3>
          <Form onSubmit={this.login} className="login-form">
            <Item>
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
            </Item>
            <Item>
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}
