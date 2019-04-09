import React, { Component } from 'react';
import { Card, Icon, List, message } from 'antd';

import { reqGetCategoryName } from '$api';

const Item = List.Item;

export default class Detail extends Component {
  state = {
    categoriesName: '商品分类: '
  }

  renderItem = (item, index) => {
    switch (index) {
      case 4:
        return <Item>商品图片: {item.map((item, index) => <img key={index} src={'http://localhost:5000/upload/' + item} alt={item}/>)}</Item>;
      case 5:
        return <Item>商品详情: <div dangerouslySetInnerHTML={{__html: item}} /></Item>
      default:
        return <Item>{item}</Item>;
    }
  }

  getCategoryName = async (pCategoryId, categoryId) => {
    let categoriesName = '';
    if (pCategoryId === '0') {
      const result = await reqGetCategoryName(categoryId);
      categoriesName = <span>商品分类: {result.data.name}</span>;
    } else {
      const pCategory = await reqGetCategoryName(pCategoryId);
      const category = await reqGetCategoryName(categoryId);
      categoriesName = <span>商品分类: {pCategory.data.name} <Icon type="arrow-right"/> {category.data.name}</span>
    }
    this.setState({categoriesName});
  }

  componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state;
    this.getCategoryName(pCategoryId, categoryId);
  }

  render() {
    const { name, desc, price, imgs, detail } = this.props.location.state;
    const { categoriesName } = this.state;

    const data = [
      '商品名称: ' + name,
      '商品描述: ' + desc,
      '商品价格: ' + price + '元',
      categoriesName,
      imgs,
      detail
    ];

    return (
      <Card
        title={
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Icon onClick={() => this.props.history.goBack()} type='arrow-left' style={{fontSize: 25, marginRight: 10}}/>
            <span>商品详情</span>
          </div>
        }
      >
        <List
          bordered
          size="large"
          dataSource={data}
          renderItem={this.renderItem}
        />
      </Card>
    )
  }
}
