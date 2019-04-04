import React, { Component } from 'react';
import { Card, Button, Icon, Table, message, Modal } from 'antd';

import AddCategoryForm from './add-category-form';
import UpdateCategoryNameForm from './update-category-name-form';
import MyButton from '$comp/my-button';
import { reqGetCategories, reqAddCategory, reqUpdateCategoryName } from '$api';
import './index.less';

export default class Category extends Component {
  constructor(props) {
    super(props);
    // 初始化状态
    this.state = {
      categories: [], // 一级分类数据
      isShowAddCategoryModal: false, // 添加分类对话框显示
      isShowUpdateCategoryNameModal: false, // 修改分类名称对话框显示
      category: {}, // 要操作分类数据
    }

    this.createAddForm = React.createRef();
    this.createUpdateForm = React.createRef();
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
      // dataIndex: 'operator', // render 方法不能和 dataIndex 属性共存。这样会导致 render 方法中没有值
      render: category => {
        // console.log(category);
        return <div>
          <MyButton onClick={this.showUpdateCategoryNameModal(category)}>修改名称</MyButton>
          <MyButton>查看其子品类</MyButton>
        </div>
      },
    }
  ];

  showUpdateCategoryNameModal = (category) => {
    return () => {
      this.setState({
        category
      })
      this.changeModal('isShowUpdateCategoryNameModal', true)();
    }
  }

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
    validateFields(async (err, values) => {
      console.log(err, values);
      if (!err) {
        // 校验成功  --> 发送请求 添加分类数据 、隐藏对话框、提示添加分类成功
        const { parentId, categoryName } = values;
        const result = await reqAddCategory(parentId, categoryName);
        if (result.status === 0) {
          message.success('添加分类成功~');
          // 在table中显示添加的分类数据
          // 方式一：重新请求所有数据然后更新
          // 方式二：将返回值插入到数据更新 --> 减少请求
          // 隐藏对话框、提示添加分类成功
          this.setState({
            isShowAddCategoryModal: false,
            categories: [...this.state.categories, result.data]
          })

        } else {
          message.error(result.msg);
        }
      } else {
        // 校验失败 -- 啥也不做
      }
    })
  }

  // 修改分类名称
  updateCategoryName = () => {
    const { validateFields } = this.createUpdateForm.current.props.form;
    validateFields(async (err, values) => {
      if (!err) {
        const { categoryName } = values;
        const categoryId = this.state.category._id;
        const result = await reqUpdateCategoryName(categoryId, categoryName);
        if (result.status === 0) {
          // 隐藏对话框、提示成功、修改显示的分类名称
          message.success('更新分类名称成功~');
          this.setState({
            isShowUpdateCategoryNameModal: false,
            categories: this.state.categories.map((category) => {
              if (category._id === categoryId) return {...category, name: categoryName};
              return category;
            })
          })
        } else {
          message.error(result.msg);
        }
      }
    })
  }

  // 切换对话框显示/隐藏的方法
  changeModal = (name, isShow) => {
    return () => {
      this.setState({
        [name]: isShow
      })
    }
  }

  render() {

    const { categories, isShowAddCategoryModal, isShowUpdateCategoryNameModal, category } = this.state;

    return (
      <Card
        className="category"
        title="一级分类列表"
        extra={<Button type="primary" onClick={this.changeModal('isShowAddCategoryModal', true)}><Icon type="plus"/>添加品类</Button>}
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
          onCancel={this.changeModal('isShowAddCategoryModal', false)}
          okText="确认"
          cancelText="取消"
        >
          <AddCategoryForm categories={categories} wrappedComponentRef={this.createAddForm}/>
        </Modal>

        <Modal
          title="修改分类名称"
          visible={isShowUpdateCategoryNameModal}
          onOk={this.updateCategoryName}
          onCancel={this.changeModal('isShowUpdateCategoryNameModal', false)}
          okText="确认"
          cancelText="取消"
          width={300}
        >
          <UpdateCategoryNameForm categoryName={category.name} wrappedComponentRef={this.createUpdateForm}/>
        </Modal>

      </Card>
    );
  }
}
