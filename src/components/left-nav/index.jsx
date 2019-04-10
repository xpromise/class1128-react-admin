import React, { Component, Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import { Menu, Icon } from "antd";

import memory from '$utils/memory-utils';
import menuList from '../../config/menu-config';
import logo from '../../assets/images/logo.png';
import './index.less';

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

// 装饰器 --> 向外暴露  withRouter(LeftNav) 生成新组建
// withRouter作用：给非路由组件传递路由组件三个属性（history、location、match）
@withRouter
class LeftNav extends PureComponent {
  static propTypes = {
    opacity: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    // 创建菜单
    const openKeys = [];
    // const menus = this.getMenu(menuList);
    // console.log(menus);
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
  /*createMenu(menuList, openKeys) {
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
              if (pathname.startsWith(item.key) || item.key.startsWith(pathname)) {
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

  getMenu(menuList) {
    // 获取当前用户权限数组
    const { menus } = memory.user.role;
    // 生成权限数组对应的菜单项
    return menuList.reduce((prev, curr) => {
      if (menus.find((menu) => menu === curr.key)) {
        // 说明当前遍历的curr在权限数组中
        const children = curr.children;
        if (children) {
          // 如果有children，还要判断里面的children是否在权限数组中
          curr.children = children.filter((item) => menus.find((menu) => menu === item.key));
        }
        return [...prev, curr];
      } else {
        // 不在
        return prev;
      }
    }, []);
  }*/

  createMenu(menuList, openKeys) {
    // 获取当前用户权限数组
    const { menus } = memory.user.role;
    const { pathname } = this.props.location;

    // 生成权限数组对应的菜单项
    return menuList.reduce((prev, curr) => {
      if (menus.find((menu) => menu === curr.key)) {
        // 说明当前遍历的curr在权限数组中
        let children = curr.children;
        if (children) {
          // 如果有children，还要判断里面的children是否在权限数组中
          return [...prev, <SubMenu
            key={curr.key}
            title={<span><Icon type={curr.icon} /><span>{curr.title}</span></span>}
          >
            {
              children.reduce((previous, current) => {
                if (menus.find((menu) => menu === current.key)) {
                  // 是否展开菜单项
                  if (pathname.startsWith(current.key) || current.key.startsWith(pathname)) {
                    openKeys.push(curr.key);
                  }
                  return [...previous, this.createItem(current)];
                } else {
                  return previous;
                }
              }, [])
            }
          </SubMenu>]
        } else {
          return [...prev, this.createItem(curr)];
        }
      } else {
        // 不在
        return prev;
      }
    }, []);
  }

  handleOpenChange = (openKeys) => {
    this.setState({openKeys})
  }

  handleClick = () => {
    // 收起所有的二级菜单
    this.setState({openKeys: []})
  }

  // 减少react重新渲染的次数
  /*shouldComponentUpdate(newProps, newState) {
    for (let key in newProps) {
      // 判断旧的属性和新的属性值是否一致
      if (this.props[key] !== newProps[key]) {
        // 如果有一个不一致，就要重新渲染
        return true;
      }
    }
    // 判断新旧状态值是否一致
    if (this.state.openKeys !== newState.openKeys) {
      return true;
    }

    // 说明属性和状态都相等，不需要重新渲染
    return false;
  }*/

  render() {
    console.log(66666);
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