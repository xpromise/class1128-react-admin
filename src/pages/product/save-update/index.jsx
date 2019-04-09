import React, { Component } from 'react';
import { Card, Icon, Form, Input, Cascader, InputNumber, Button, message } from 'antd';

import './index.less';
import { reqGetCategories, reqAddProduct, reqUpdateProduct } from '$api';
import RichTextEditor from './rich-text-editor';
import PicturesWall from './pictures-wall';

const Item = Form.Item;

@Form.create()
class SaveUpdate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [], // 级联选择器的数据数组
    }

    this.richTextEditor = React.createRef();
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

  // 提交表单的事件
  submit = (e) => {
    e.preventDefault();
    // 校验表单
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // console.log(values);
        // console.log(this.richTextEditor.current.state.editorState.toHTML());
        const { name, desc, price, category } = values;
        const detail = this.richTextEditor.current.state.editorState.toHTML();
        let pCategoryId, categoryId;
        if (category.length === 1) {
          // 说明只有1级分类
          pCategoryId = '0';
          categoryId = category[0];
        } else {
          // 说明两级分类
          pCategoryId = category[0];
          categoryId = category[1];
        }
        // 判断是添加商品还是修改商品
        const { location : { state }} = this.props;

        let result = null;
        let msg = '';

        if (state) {
          result = await reqUpdateProduct({name, desc, price, pCategoryId, categoryId, detail, _id: state._id});
          msg = '修改商品成功~';
        } else {
          result = await reqAddProduct({name, desc, price, pCategoryId, categoryId, detail});
          msg = '添加商品成功~';
        }

        if (result.status === 0) {
          message.success(msg);
          // 回到INDEX页面
          this.props.history.goBack();
        } else {
          message.error(result.msg);
        }

      }
    })
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
        // console.log(result.data);
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
    const { state } = this.props.location;
    // 有值说明是修改商品
    if (state) {
      const { pCategoryId, categoryId } = state;
      if (pCategoryId === '0') {
        this.category = [categoryId];
      } else {
        // 请求二级分类数据
        this.getCategories(pCategoryId);
        this.category = [pCategoryId, categoryId];
      }
    }
  }

  render() {
    const { options } = this.state;
    const { form : { getFieldDecorator }, location : { state } } = this.props;

    return (
      <Card
        title={<div className="save-update-title" onClick={this.goBack}><Icon className="save-update-icon" type="arrow-left"/>&nbsp;&nbsp;<span>{state ? '修改商品' : '添加商品'}</span></div>}
      >
        <Form {...this.formItemLayout} onSubmit={this.submit}>
          <Item label="商品名称">
            {
              getFieldDecorator(
                'name',
                {
                  rules: [{required: true, whiteSpace: true, message: '商品名称不能为空'}],
                  initialValue: state ? state.name : ''
                }
              )(<Input placeholder="请输入商品名称"/>)
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator(
                'desc',
                {
                  rules: [{required: true, whiteSpace: true, message: '商品描述不能为空'}],
                  initialValue: state ? state.desc : ''
                }
              )(<Input placeholder="请输入商品描述"/>)
            }
          </Item>
          <Item
            label="选择分类"
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 5 },
            }}
          >
            {
              getFieldDecorator(
                'category',
                {
                  rules: [{required: true, message: '请选择商品分类'}],
                  initialValue: state ? this.category : []
                }
              )(
                <Cascader
                  options={options}
                  // onChange={this.onChange}
                  placeholder="请选择分类"
                  changeOnSelect
                  loadData={this.loadData}
                />
              )
            }

          </Item>
          <Item
            label="商品价格"
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 5 },
            }}
          >
            {
              getFieldDecorator(
                'price',
                {
                  rules: [{required: true, message: '请输入商品价格'}],
                  initialValue: state ? state.price : ''
                }
              )(
                <InputNumber
                  className="save-update-input-number"
                  // 每3位数字就有一个，并且开头￥
                  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  // 去除非数字的内容
                  parser={value => value.replace(/￥\s?|(,*)/g, '')}
                  // onChange={this.onChange}
                />
              )
            }
          </Item>
          {
            state ? <Item label="商品图片">
              <PicturesWall _id={state._id} imgs={state.imgs}/>
            </Item> : null
          }
          <Item
            label="商品详情"
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 21 },
            }}
          >
            <RichTextEditor ref={this.richTextEditor} detail={state ? state.detail : ''}/>
          </Item>
          <Item>
            <Button type="primary" className="save-update-button" htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card>
    );
  }
}

export default SaveUpdate;