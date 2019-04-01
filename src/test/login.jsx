/**
 * created by xiongjian on 2019/4/1
 */
import React, {Component} from 'react';
import withHoc from './01.hoc';
// 装饰器：@function --> 会调用当前function函数，将装饰器下面的内容作为参数传入，并且将返回值覆盖掉下面的内容
// 之前暴露的方式： withHoc(Login)
@withHoc('登录')
class Login extends Component {
  
  render () {
    const { username, password, handleSubmit, composeChange } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit}>
          用户名: <input type="text" name="username" value={username} onChange={composeChange('username')}/> <br/>
          密码: <input type="password" name="password" value={password} onChange={composeChange('password')}/> <br/>
          <input type="submit" value="登录"/>
        </form>
      </div>
    )
  }
}
// withHoc('登录')(Login)
export default Login;