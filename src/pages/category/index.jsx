import React, { Component } from 'react';
import { Card, Button, Icon, Table, message } from 'antd';

import MyButton from '$comp/my-button';
import { reqGetCategories } from '$api';
import './index.less';

export default class Category extends Component {
  state = {
    categories: [], // 一级分类数据
  }

  // 定义表格列
  columns = [
    {
      title: '品类名称', // 表头的名称
      // className: 'column-money',
      dataIndex: 'name', // 显示data数据中的某个属性的值
    },
    {
      title: '操作',
      className: 'operator',
      dataIndex: 'operator',
      render: text => <div>
        <MyButton>修改名称</MyButton>
        <MyButton>查看其子品类</MyButton>
      </div>,
    }
  ];

  // 请求分类数据的方法
  getCategories = async (parentId) => {
    const result = await reqGetCategories(parentId);
    if (result.status === 0) {
      this.setState({
        categories: result.data
      })
    } else {
      message.error(result.msg);
    }
  }

  // 发送请求获取数据
  componentDidMount() {
    this.getCategories('0');
  }

  render() {

    const { categories } = this.state;

    return (
      <Card
        className="category"
        title="一级分类列表"
        extra={<Button type="primary"><Icon type="plus"/>添加品类</Button>}
      >
        <Table
          columns={this.columns}
          dataSource={categories}
          bordered
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['3', '6', '9', '12'],
            defaultPageSize: 3,
            showQuickJumper: true,
          }}
          rowKey="_id"
        />
      </Card>
    );
  }
}
