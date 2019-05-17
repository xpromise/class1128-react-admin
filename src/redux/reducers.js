/*
  根据之前的state和分发action来生成最新的状态
 */
import { combineReducers } from 'redux';
import { message } from 'antd';

import { GET_ROLE_LIST_ERROR, GET_ROLE_LIST_SUCCESS, ADD_ROLE_SUCCESS } from './action-types';
// 不同状态数据定义不同的reducers函数管理
function roleList(prevState = [], action) {
  switch (action.type) {
    case GET_ROLE_LIST_SUCCESS :
      return action.data;
    case ADD_ROLE_SUCCESS :
      return [...prevState, action.data];
    case GET_ROLE_LIST_ERROR :
      // 进行错误提示
      message.error(action.data);
      return prevState;
    default :
      return prevState;
  }
}

function user() {

}

export default combineReducers({
  roleList,

})