import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import { Menu, Icon } from "antd";

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

// 装饰器 --> 向外暴露  withRouter(LeftNav) 生成新组建
// withRouter作用：给非路由组件传递路由组件三个属性（history、location、match）
@withRouter
class LeftNav extends Component {
  render() {
    // 获取当前的路径
    const { pathname } = this.props.location;

    return (
      <Menu theme="dark" defaultSelectedKeys={[pathname]} mode="inline" defaultOpenKeys={['sub1']}>
        <Item key="/home">
          <Link to="/home">
            <Icon type="home" />
            <span>首页</span>
          </Link>
        </Item>
        <SubMenu
          key="sub1"
          title={<span><Icon type="appstore" /><span>商品</span></span>}
        >
          <Item key="/category">
            <Link to="/category">
              <Icon type="bars" />
              <span>品类管理</span>
            </Link>
          </Item>
          <Item key="/product">
            <Link to="/product">
              <Icon type="tool" />
              <span>商品管理</span>
            </Link>
          </Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={<span><Icon type="team" /><span>Team</span></span>}
        >
          <Item key="6">Team 1</Item>
          <Item key="8">Team 2</Item>
        </SubMenu>
        <Item key="9">
          <Icon type="file" />
          <span>File</span>
        </Item>
      </Menu>
    );
  }
}

export default LeftNav;