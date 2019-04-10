import React, { Component, Fragment } from 'react';
import { Card, Button, Table, Modal } from 'antd';
import dayjs from "dayjs";

import AddUserForm from './add-user-form';
import UpdateUserForm from './update-user-form';
import MyButton from '$comp/my-button';

export default class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [{
        __v: 0,
        _id: "5c7dafe855fb843490b93a49",
        create_time: 1551740904866,
        email: "aaa@aaa.com",
        phone: "123456789",
        role_id: "5c7d222c12d5e51908cc0380",
        username: "aaa"
      }], //用户数组
      isShowAddUserModal: false, //是否展示创建用户的标识
      isShowUpdateUserModal: false, //是否展示更新用户的标识
    }

    this.addUserForm = React.createRef();
    this.updateUserForm = React.createRef();
  }

  
  columns = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      render: time => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '所属角色',
      dataIndex: 'role_id',
    },
    {
      title: '操作',
      render: user => {
        return <Fragment>
          <MyButton onClick={() => {}}>修改</MyButton>
          <MyButton onClick={() => {}}>删除</MyButton>
        </Fragment>
      }
    }
  ];

  changeModal = (name, value) => {
    return () => {
      this.setState({[name]: value})
    }
  }

  //创建用户的回调函数
  handleAddUser = () => {}
  
  handleUpdateUser = () => {}
  
  render () {
    const { users, isShowAddUserModal, isShowUpdateUserModal } = this.state;
    
    return (
      <Card
        title={
          <Button type='primary' onClick={this.changeModal('isShowAddUserModal', true)}>创建用户</Button>
        }
      >
        <Table
          columns={this.columns}
          dataSource={users}
          bordered
          rowKey='_id'
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            showQuickJumper: true,
          }}
        />
  
        <Modal
          title="创建用户"
          visible={isShowAddUserModal}
          onOk={this.handleAddUser}
          onCancel={this.changeModal('isShowAddUserModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <AddUserForm ref={this.addUserForm}/>
        </Modal>
  
        <Modal
          title="更新用户"
          visible={isShowUpdateUserModal}
          onOk={this.handleUpdateUser}
          onCancel={this.changeModal('isShowUpdateUserModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateUserForm ref={this.updateUserForm} />
        </Modal>
        
      </Card>
    )
  }
}
