import React, { Component, Fragment } from 'react';
import { Card, Table, Select, Button, Input, Icon, message } from 'antd';
import { Link } from 'react-router-dom';

import MyButton from '$comp/my-button';
import { reqGetProducts, reqSearch } from '$api';
import './index.less';

const Option = Select.Option;

export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],  // 单页产品数据数组
      total: 0,   // 产品总数量
      searchType: 'productName',
      pageNum: 1,
      pageSize: 3
    }

    this.searchContentInput = React.createRef();
  }
  // 可复用
  columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '商品描述',
      dataIndex: 'desc',
      key: 'desc',
    }, {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '状态',
      // dataIndex: 'address',
      key: 'status',
      render: () => {
        return <Fragment>
          <Button type="primary">下架</Button>
          &nbsp; &nbsp;在售
        </Fragment>
      }
    },
    {
      title: '操作',
      // dataIndex: 'address',
      key: 'operator',
      render: (product) => {

        return <Fragment>
          <MyButton onClick={this.pushPath('/product/detail', product)}>详情</MyButton>
          <MyButton onClick={this.pushPath('/product/saveupdate', product)}>修改</MyButton>
        </Fragment>
      }
    }
  ]

  pushPath = (path, product) => {
    return () => {
      this.props.history.push(path, product);
    }
  }

  getProducts = async (pageNum, pageSize = 3) => {

    const { searchType } = this.state;
    const searchContent = this.searchContent;
    // console.log(searchContent);

    let result = null;

    if (searchContent) {
      // 搜索请求
      result = await reqSearch({
        [searchType]: searchContent,
        pageNum,
        pageSize
      });
    } else {
      result = await reqGetProducts(pageNum, pageSize);
    }

    if (result.status === 0) {
      this.setState({
        products: result.data.list,
        total: result.data.total,
        pageNum,
        pageSize
      })
    } else {
      message.error(result.msg);
    }

  }

  handleSelect = (value) => {
    this.setState({
      searchType: value
    })
  }

  search = () => {
    this.searchContent = this.searchContentInput.current.state.value;
    this.getProducts(1);
  }

  componentDidMount() {
    this.getProducts(1);
  }

  render() {
    const { products, total } = this.state;

    return (
      <Card
        title={
          <Fragment>
            <Select defaultValue="productName" onChange={this.handleSelect}>
              <Option key={0} value="productName">根据商品名称</Option>
              <Option key={1} value="productDesc">根据商品描述</Option>
            </Select>
            <Input placeholder="关键字" className="search-input" ref={this.searchContentInput}/>
            <Button type="primary" onClick={this.search}>搜索</Button>
          </Fragment>
        }
        extra={<Link to="/product/saveupdate"><Button type="primary"><Icon type="plus"/>添加产品</Button></Link>}
        // style={{width: '100%'}}
        className="product"
      >
        <Table
          dataSource={products}
          columns={this.columns}
          bordered
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['3', '6', '9', '12'],
            defaultPageSize: 3,
            showQuickJumper: true,
            total,
            onChange: this.getProducts,
            onShowSizeChange: this.getProducts
          }}
          loading={false}
          rowKey="_id"
        />
      </Card>
    );
  }
}