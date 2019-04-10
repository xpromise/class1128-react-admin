import React, { Component, Fragment } from 'react';
import { Card, Button, Table, Radio, Modal, message } from 'antd';
import dayjs from 'dayjs';

import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form';
import { reqRoleList, reqAddRole, reqUpdateRole } from '$api';
import memory from '$utils/memory-utils';

const RadioGroup = Radio.Group;

export default class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',  // 单选的默认值，也就是选中的某个角色的id值
      roles: [], // 权限数组
      isShowAddRoleModal: false, // 是否展示创建角色的标识
      isShowUpdateRoleModal: false, // 是否展示设置角色的标识
      isDisabled: true,  // 设置角色权限按钮是否禁止使用
      role: {}, // 被选中的角色数据
    }

    this.addRoleForm = React.createRef();
    this.updateRoleForm = React.createRef();
  }

  columns = [
    {
    dataIndex: '_id',
    render: id => <Radio value={id} />
  },
    {
    title: '角色名称',
    dataIndex: 'name',
  },
    {
    title: '创建时间',
    dataIndex: 'create_time',
    render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  },
    {
    title: '授权时间',
    dataIndex: 'auth_time',
    render: (time) => time && dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  },
    {
    title: '授权人',
    dataIndex: 'auth_name',
  }
  ];

  onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    const value = e.target.value;
    // 查找指定的role
    const role = this.state.roles.find((role) => role._id === value);
    this.setState({
      value,
      isDisabled: false,
      role
    });
  }

  changeModal = (name, flag) => {
    return () => {
      this.setState({[name]: flag})
    }
  }
  
  //创建角色的回调函数
  handleAddRole = () => {
    // 表单校验
    const { validateFields, resetFields } = this.addRoleForm.current;

    validateFields(async (err, values) => {
      if (!err) {
        const { name } = values;
        // 发送请求
        const result = await reqAddRole(name);
        if (result.status === 0) {
          this.setState({
            roles: [...this.state.roles, result.data],
            isShowAddRoleModal: false
          })
          // 重置表单项
          resetFields();
        } else {
          message.error(result.msg);
        }
      }
    })
  }
  //设置角色权限的回调函数
  handleUpdateRole = async () => {
    const { role } = this.state;
    role.auth_time = Date.now();
    role.auth_name = memory.user.username;
    // 发送请求
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      this.setState({
        roles: this.state.roles.map((item) => {
          if (item._id === role._id) {
            return role;
          }
          return item;
        }),
        isShowUpdateRoleModal: false
      })
    } else {
      message.error(result.msg);
    }
  }

  getRoleList = async () => {
    const result = await reqRoleList();
    if (result.status === 0) {
      this.setState({
        roles: result.data
      })
    } else {
      message.error(result.msg);
    }
  }

  updateRole = (menus) => {
    this.setState({
      role: {...this.state.role, menus}
    })
  }

  componentDidMount() {
    this.getRoleList();
  }
  
  render () {
    const { roles, value, isDisabled, isShowAddRoleModal, isShowUpdateRoleModal, role } = this.state;
    
    return (
      <Card
        title={
          <Fragment>
            <Button type='primary' onClick={this.changeModal('isShowAddRoleModal', true)}>创建角色</Button> &nbsp;&nbsp;
            <Button type='primary' disabled={isDisabled} onClick={this.changeModal('isShowUpdateRoleModal', true)}>设置角色权限</Button>
          </Fragment>
        }
      >
        <RadioGroup onChange={this.onRadioChange} value={value} style={{width: '100%'}}>
          <Table
            columns={this.columns}
            dataSource={roles}
            bordered
            rowKey='_id'
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              showQuickJumper: true,
            }}
          />
        </RadioGroup>
  
        <Modal
          title="创建角色"
          visible={isShowAddRoleModal}
          onOk={this.handleAddRole}
          onCancel={this.changeModal('isShowAddRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <AddRoleForm ref={this.addRoleForm}/>
        </Modal>
  
        <Modal
          title="设置角色权限"
          visible={isShowUpdateRoleModal}
          onOk={this.handleUpdateRole}
          onCancel={this.changeModal('isShowUpdateRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateRoleForm ref={this.updateRoleForm} role={role} updateRole={this.updateRole}/>
        </Modal>
        
      </Card>
    )
  }
}
