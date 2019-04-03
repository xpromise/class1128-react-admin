import React, { Component } from 'react';
import { Row, Col, Modal, message } from 'antd';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';

import MyButton from '../my-button';

import { reqWeather } from '$api'
import { removeItem } from '$utils/storage-utils';
import memory from '$utils/memory-utils';

import './index.less';

@withRouter
class HeaderMain extends Component {
  state = {
    sysTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    weatherImg: 'http://api.map.baidu.com/images/weather/day/qing.png',
    weather: '晴'
  }
  // 登出
  logout = () => {
    Modal.confirm({
      title: '您确认要退出登录吗？',
      onOk: () => {
        // 清空所有用户信息
        memory.user = {};
        removeItem();
        // 跳转到登陆页面
        this.props.history.replace('/login');
      },
      // onCancel: () => {
      //   console.log('cancel')
      // },
      okText: '确认',
      cancelText: '取消'
    })
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState({
        sysTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      })
    }, 1000);
    // 请求天气数据
    reqWeather('深圳')
      .then(res => {
        this.setState({
          weatherImg: res.weatherImg,
          weather: res.weather
        })
      })
      .catch(err => message.error(err, 2))
  }

  componentWillUnmount() {
    // 清楚定时器
    clearInterval(this.intervalId);
  }

  render() {
    const { sysTime, weatherImg, weather } = this.state;

    return <div className="header-main">
        <Row className="header-main-top">
          <span>欢迎，xxx</span>
          <MyButton onClick={this.logout}>退出</MyButton>
        </Row>
        <Row className="header-main-bottom">
          <Col className="header-main-left" span={6}>用户管理</Col>
          <Col className="header-main-right" span={18}>
            <span>{sysTime}</span>
            <img src={weatherImg} alt="天气"/>
            <span>{weather}</span>
          </Col>
        </Row>
    </div>;
  }
}

export default HeaderMain;