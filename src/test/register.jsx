/**
 * created by xiongjian on 2019/4/1
 */
import React, {Component} from 'react';
import withHoc from './01.hoc';

@withHoc('注册')
class Register extends Component {
  
  render () {
    const { username, password, rePassword, composeChange, handleSubmit } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit}>
          用户名: <input type="text" name="username" value={username} onChange={composeChange('username')}/> <br/>
          密码: <input type="password" name="password" value={password} onChange={composeChange('password')}/> <br/>
          确认密码: <input type="password" name="rePassword" value={rePassword} onChange={composeChange('rePassword')}/> <br/>
          <input type="submit" value="注册"/>
        </form>
      </div>
    )
  }
}
// withHoc('注册')(Register)
export default Register;