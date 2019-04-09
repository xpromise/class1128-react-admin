import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import { Menu, Icon } from "antd";

import menuList from '../../config/menu-config';
import logo from '../../assets/images/logo.png';
import './index.less';

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

// 装饰器 --> 向外暴露  withRouter(LeftNav) 生成新组建
// withRouter作用：给非路由组件传递路由组件三个属性（history、location、match）
@withRouter
class LeftNav extends Component {
  static propTypes = {
    opacity: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    // 创建菜单
    const openKeys = [];
    this.menus = this.createMenu(menuList, openKeys);
    // 初始化状态
    this.state = {
      openKeys
    }
  }

  createItem(item) {
    return <Item key={item.key}>
      <Link to={item.key}>
        <Icon type={item.icon} />
        <span>{item.title}</span>
      </Link>
    </Item>
  }

  /**
   * 创建菜单项的函数
   * @param menuList
   */
  createMenu(menuList, openKeys) {
    // 获取当前的路径
    const { pathname } = this.props.location;
    // 判断是一级菜单、二级菜单
    return menuList.map((menu) => {
      const children = menu.children;
      if (children) {
        // 二级菜单
        return <SubMenu
          key={menu.key}
          title={<span><Icon type={menu.icon} /><span>{menu.title}</span></span>}
        >
          {
            children.map((item) => {
              if (pathname.startsWith(item.key)) {
                openKeys.push(menu.key);
              }
              return this.createItem(item)
            })
          }
        </SubMenu>

      } else {
        // 一级菜单
        return this.createItem(menu);
      }

    })
  }

  handleOpenChange = (openKeys) => {
    this.setState({openKeys})
  }

  handleClick = () => {
    // 收起所有的二级菜单
    this.setState({openKeys: []})
  }

  /*
  // 性能优化 - 减少无效的重新渲染
  shouldComponentUpdate(newProps, newState) {
    for (let key in newProps) {
      if (newProps[key] !== this.props[key]) {
        return true;
      }
    }

    if (this.state.openKeys !== newState.openKeys) {
      return true;
    }

    return false;
  }*/

  render() {
    // 提取props
    let { location : { pathname } , opacity } = this.props;

    if (pathname.startsWith('/product')) {
      pathname = '/product';
    }

    return (
      <Fragment>
        <Link to="/home" className="logo" onClick={this.handleClick}>
          <img src={logo} alt="logo"/>
          <h1 style={{opacity}}>硅谷后台</h1>
        </Link>
        <Menu theme="dark" selectedKeys={[pathname]} mode="inline" openKeys={this.state.openKeys} onOpenChange={this.handleOpenChange}>
          {
            this.menus
          }
        </Menu>
      </Fragment>
    );
  }
}

export default LeftNav;