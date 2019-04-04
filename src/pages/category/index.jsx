import React, { Component } from 'react';
import { Card, Button, Icon, Table, message, Modal } from 'antd';

import AddCategoryForm from './add-category-form';
import MyButton from '$comp/my-button';
import { reqGetCategories } from '$api';
import './index.less';

export default class Category extends Component {
  constructor(props) {
    super(props);
    // 初始化状态
    this.state = {
      categories: [], // 一级分类数据
      isShowAddCategoryModal: false, // 添加分类对话框显示
    }

    this.createAddForm = React.createRef();
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

  // 添加分类
  addCategory = () => {
    // 获取的是普通的虚拟DOM对象，它的值就是Dom元素
    // 获取的是组件，它的值就是组件的实例对象
    // console.log(this.createAddForm.current)
    const { validateFields } = this.createAddForm.current.props.form;
    // 表单校验的方法
    validateFields((err, values) => {
      console.log(err, values);
      if (!err) {
        // 校验成功  --> 发送请求 添加分类数据 、隐藏对话框、提示添加分类成功

      } else {
        // 校验失败 -- 啥也不做
      }
    })
  }

  // 切换对话框显示/隐藏的方法
  changeModal = (isShow) => {
    return () => {
      this.setState({
        isShowAddCategoryModal: isShow
      })
    }
  }

  render() {

    const { categories, isShowAddCategoryModal } = this.state;

    return (
      <Card
        className="category"
        title="一级分类列表"
        extra={<Button type="primary" onClick={this.changeModal(true)}><Icon type="plus"/>添加品类</Button>}
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

        <Modal
          title="添加分类"
          visible={isShowAddCategoryModal}
          onOk={this.addCategory}
          onCancel={this.changeModal(false)}
          okText="确认"
          cancelText="取消"
        >
          <AddCategoryForm categories={categories} wrappedComponentRef={this.createAddForm}/>
        </Modal>
      </Card>
    );
  }
}
