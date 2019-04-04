import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Input } from 'antd';

const Item = Form.Item;
const Option = Select.Option;

@Form.create()
class AddCategoryForm extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired
  }

  validator = (rule, value, callback) => {
    const { categories } = this.props;

    const category = categories.find((category) => category.name === value);

    if (!value) {
      callback('请输入要修改的分类名称，不能为空');
    } else if (category) {
      callback('不能与之前分类名称相同');
    } else {
      callback();
    }
  }

  render() {
    const { form : { getFieldDecorator }, categories } = this.props;
    console.log(this);

    return (
      <Form>
        <Item label="所属分类">
          {
            getFieldDecorator(
              'parentId',
              {
                initialValue: '0'
              }
            )(
              <Select>
                <Option key="0" value="0">一级分类</Option>
                {
                  categories.map((category) => <Option key={category._id} value={category._id}>{category.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item label="分类名称">
          {
            getFieldDecorator(
              'categoryName',
              {
                rules: [
                  {validator: this.validator}
                ]
              }
            )(
              <Input placeholder="请输入分类名称~"/>
            )
          }
        </Item>
      </Form>
    );
  }
}

export default AddCategoryForm;