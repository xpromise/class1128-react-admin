import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

const Item = Form.Item;

@Form.create()
class UpdateCategoryNameForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired
  }

  validator = (rule, value, callback) => {
    const { categoryName } = this.props;

    if (!value) {
      callback('请输入要修改的分类名称，不能为空');
    } else if (value === categoryName) {
      callback('不能与之前分类名称相同');
    } else {
      callback();
    }
  }

  render() {
    const { form : { getFieldDecorator }, categoryName } = this.props;

    return (
      <Form>
        <Item>
          {
            getFieldDecorator(
              'categoryName',
              {
                initialValue: categoryName,
                rules: [
                  {validator: this.validator}
                ]
              }
            )(
              <Input placeholder="请输入要修改的分类名称~"/>
            )
          }
        </Item>
      </Form>
    );
  }
}

export default UpdateCategoryNameForm;