import React, { Component } from 'react';
import { Card, Icon, Form, Input, Cascader, InputNumber, Button } from 'antd';

import './save-update.less';

const Item = Form.Item;

export default class SaveUpdate extends Component {
  // 回退到上一个路由
  goBack = () => {
    this.props.history.goBack();
  }
  // 级联选择器的change事件
  onChange = (value) => {
    console.log(value);
  }
  // 提交表单的事件
  submit = () => {

  }

  render() {
    const formItemLayout = {
      // 调整Item中label占据多少列
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      // 调整Item的内容占据多少列
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    const options = [{
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
          value: 'xihu',
          label: 'West Lake',
        }],
      }],
    }, {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
          value: 'zhonghuamen',
          label: 'Zhong Hua Men',
        }],
      }],
    }];

    return (
      <Card
        title={<div className="save-update-title" onClick={this.goBack}><Icon className="save-update-icon" type="arrow-left"/>&nbsp;&nbsp;<span>添加商品</span></div>}
      >
        <Form {...formItemLayout} onSubmit={this.submit}>
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