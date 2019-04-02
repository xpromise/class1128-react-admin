import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import { Menu, Icon } from "antd";

import menuList from '../../config/menu-config';

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

// 装饰器 --> 向外暴露  withRouter(LeftNav) 生成新组建
// withRouter作用：给非路由组件传递路由组件三个属性（history、location、match）
@withRouter
class LeftNav extends Component {
  constructor(props) {
    super(props);
    // 创建菜单
    const openKeys = [];
    this.menus = this.createMenu(menuList, openKeys);
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
    const { pathname } = this.props.location;

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
              if (item.key === pathname) {
                // 说明当前路径选中二级菜单，需要展开一级菜单
                // this.openKey = menu.key;
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

  render() {
    // 获取当前的路径
    const { pathname } = this.props.location;

    return (
      <Menu theme="dark" selectedKeys={[pathname]} mode="inline" openKeys={this.state.openKeys} onOpenChange={this.handleOpenChange}>
        {
          this.menus
        }
      </Menu>
    );
  }
}

export default LeftNav;