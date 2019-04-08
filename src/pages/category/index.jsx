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
      subCategories: [], // 二级分类数据
      isShowAddCategoryModal: false, // 添加分类对话框显示
      isShowUpdateCategoryNameModal: false, // 修改分类名称对话框显示
      category: {}, // 要操作分类数据
      parentCategory: {},
      isShowSubCategories: false, // 是否展示二级分类数据
    }

    this.createAddForm = React.createRef();
    this.createUpdateForm = React.createRef();
  }

  // 当请求数据为空时，不要loading
  isLoading = true;

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
          {
            this.state.isShowSubCategories ? null : <MyButton onClick={this.showSubCategory(category)}>查看其子品类</MyButton>
          }
        </div>
      },
    }
  ];

  showSubCategory = (parentCategory) => {
    return () => {
      // 切换显示
      this.setState({
        parentCategory,
        isShowSubCategories: true
      })
      // 请求二级分类数据
      this.getCategories(parentCategory._id);
    }
  }

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
      // 判断是一级/二级分类
      const options = {};

      if (result.data.length === 0) {
        this.isLoading = false;
        // 等当前更新完成后在调用，目的：让下一次生效
        setTimeout(() => {
          // 不会导致组件重新渲染
          this.isLoading = true;
        }, 0)
      }

      if (parentId === '0') {
        options.categories = result.data;
      } else {
        options. subCategories = result.data;
      }

      this.setState(options);

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
          // 如果当前在一级分类，添加的是一级分类数据，要显示。添加的是二级分类数据，不显示
          // 如果当前在二级分类，添加的是一级分类数据，要插入原数据中，添加的是二级分类数据，并且与当前一级分类相同的，才显示
          const options = {isShowAddCategoryModal: false};
          if (parentId === '0') {
            options.categories = [...this.state.categories, result.data];
          } else if (parentId === this.state.parentCategory._id) {
            options.subCategories = [...this.state.subCategories, result.data];
          }
          this.setState(options);
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
    const { validateFields, resetFields } = this.createUpdateForm.current.props.form;
    validateFields(async (err, values) => {
      if (!err) {
        const { categoryName } = values;
        const { category : { _id }, isShowSubCategories } = this.state;
        const result = await reqUpdateCategoryName(_id, categoryName);
        if (result.status === 0) {
          // 隐藏对话框、提示成功、修改显示的分类名称
          message.success('更新分类名称成功~');
          // 如果在一级分类，点击修改一级分类数据
          // 如果在二级分类，点击修改二级分类数据
          let name = 'categories';
          if (isShowSubCategories) {
            name = 'subCategories'
          }
          this.setState({
            isShowUpdateCategoryNameModal: false,
            [name]: this.state[name].map((category) => {
              if (category._id === _id) return {...category, name: categoryName};
              return category;
            })
          })
          // 重置表单项
          resetFields();
        } else {
          message.error(result.msg);
        }
      }
    })
  }

  // 切换对话框显示/隐藏的方法
  changeModal = (name, isShow) => {
    return () => {
      // 解决没有点击确认修改分类名称时，清空用户输入的数据，防止下次不能使用默认值
      if (name === 'isShowUpdateCategoryNameModal' && isShow === false) this.createUpdateForm.current.props.form.resetFields()
      this.setState({
        [name]: isShow
      })
    }
  }

  // 回退到一级菜单
  goBack = () => {
    this.setState({
      isShowSubCategories: false
    })
  }

  render() {

    const {
      categories,
      subCategories,
      isShowAddCategoryModal,
      isShowUpdateCategoryNameModal,
      category : { name } ,
      parentCategory,
      isShowSubCategories
    } = this.state;

    return (
      <Card
        className="category"
        title={isShowSubCategories ? <div><MyButton onClick={this.goBack}>一级分类</MyButton> <Icon type="arrow-right" /> <span>{parentCategory.name}</span> </div> : '一级分类列表'}
        extra={<Button type="primary" onClick={this.changeModal('isShowAddCategoryModal', true)}><Icon type="plus"/>添加品类</Button>}
      >
        <Table
          columns={this.columns}
          dataSource={isShowSubCategories ? subCategories : categories}
          bordered
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['3', '6', '9', '12'],
            defaultPageSize: 3,
            showQuickJumper: true,
          }}
          rowKey="_id"
          loading={
            isShowSubCategories
              ? this.isLoading && !subCategories.length
              : this.isLoading && !categories.length
          }
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
          <UpdateCategoryNameForm categoryName={name} wrappedComponentRef={this.createUpdateForm}/>
        </Modal>

      </Card>
    );
  }
}
