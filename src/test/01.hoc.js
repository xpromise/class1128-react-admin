/**
 * created by xiongjian on 2019/4/1
 */
import React, {Component} from 'react';
// https://juejin.im/post/5c972f985188252d7f2a3eb0#heading-6
// 高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件
// 目的: 能让其他组件复用相同的逻辑
// 两个函数： 第一个函数调用返回值是函数 --> 高阶组件   调用第二个函数（高阶组件）---> 新的组件

export default function withHoc(name) {
  return (WrappedComponent) => class extends Component {
    static displayName = `Form(${getDisplayName(WrappedComponent)})`
    
    state = {
      username: '',
      password: '',
      rePassword: ''
    }
    // 高阶函数 --> 这样后面就能一直复用当前函数，而不用重新创建了~
    composeChange = (name) => {
      return (e) => {
        this.setState({
          [name]: e.target.value
        });
      }
    }
    // 统一所有提交表单函数名
    handleSubmit = (e) => {
      e.preventDefault();
      const { username, password, rePassword } = this.state;
      alert(`用户名: ${username}, 密码: ${password}, 确认密码: ${rePassword}`);
    }
  
    render() {
      const mapMethodToProp = {
        composeChange: this.composeChange,
        handleSubmit: this.handleSubmit
      }
    
      return <div>
        <h2>{name}</h2>
        <WrappedComponent {...mapMethodToProp} {...this.state}/>
      </div>
    }
    
  }
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}