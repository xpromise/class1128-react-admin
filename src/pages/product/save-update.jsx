import React, { Component } from 'react';
import { Card, Icon, Form, Input, Cascader, InputNumber, Button, message } from 'antd';

import './save-update.less';
import { reqGetCategories } from '$api';

const Item = Form.Item;

export default class SaveUpdate extends Component {
  state = {
    options: [], // 级联选择器的数据数组
  }

  formItemLayout = {
    // 调整Item中label占据多少列
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    // 调整Item的内容占据多少列
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  };

  // 回退到上一个路由
  goBack = () => {
    this.props.history.goBack();
  }
  // 级联选择器的change事件
  onChange = (value) => {
    // console.log(value);
  }
  // 提交表单的事件
  submit = () => {

  }

  // 加载二级分类数据
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // 会显示loading状态
    targetOption.loading = true;
    // 请求二级分类数据
    this.getCategories(targetOption.value);
  }

  getCategories = async (parentId) => {

    const result = await reqGetCategories(parentId);

    if (result.status === 0) {
      // 判断是一级/二级分类
      if (parentId === '0') {
        this.setState({
          options: result.data.map((item) => {
            return {
              label: item.name,
              value: item._id,
              isLeaf: false,
            }
          })
        })
      } else {
        console.log(result.data);
        this.setState({
          options: this.state.options.map((option) => {
            if (option.value === parentId) {
              // 说明找到了要修改分类
              option.children = result.data.map((item) => {
                return {
                  label: item.name,
                  value: item._id
                }
              });
              // 去掉loading状态
              option.loading = false;
              option.isLeaf = true;
            }
            return option;
          })
        })
      }
    } else {
      message.error(result.msg);
    }

  }

  componentDidMount() {
    this.getCategories('0');
  }

  render() {
    const { options } = this.state;

    return (
      <Card
        title={<div className="save-update-title" onClick={this.goBack}><Icon className="save-update-icon" type="arrow-left"/>&nbsp;&nbsp;<span>添加商品</span></div>}
      >
        <Form {...this.formItemLayout} onSubmit={this.submit}>
          <Item label="商品名称">
            <Input placeholder="请输入商品名称"/>
          </Item>
          <Item label="商品描述">
            <Input placeholder="请输入商品描述"/>
          </Item>
          <Item
            label="选择分类"
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 5 },
            }}
          >
            <Cascader
              options={options}
              onChange={this.onChange}
              placeholder="请选择分类"
              changeOnSelect
              loadData={this.loadData}
            />
          </Item>
          <Item
            label="商品价格"
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 5 },
            }}
          >
            <InputNumber
              className="save-update-input-number"
              defaultValue={1000}
              // 每3位数字就有一个，并且开头￥
              formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              // 去除非数字的内容
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              // onChange={this.onChange}
            />
          </Item>
          <Item label="商品详情">

          </Item>
          <Item>
            <Button type="primary" className="save-update-button" htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card>
    );
  }
}