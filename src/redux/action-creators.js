/*
  用来生产action对象的工厂函数模块：
    同步：返回值是action对象  {type: xxx, data: xxx}
    异步：返回值是一个函数
 */

import { reqRoleList, reqAddRole, reqUpdateRole } from '$api';

import { GET_ROLE_LIST_ERROR, GET_ROLE_LIST_SUCCESS, ADD_ROLE_SUCCESS } from './action-types';

// 同步action creator ：生成action对象
const getRoleListSuccess = (roleList) => ({type: GET_ROLE_LIST_SUCCESS, data: roleList});
const makeRoleError = (error) => ({type: GET_ROLE_LIST_ERROR, data: error});
const addRoleSuccess = (role) => ({type: ADD_ROLE_SUCCESS, data: role});


// 异步action creator ：获取roleList数据
export const getRoleListAsync = () => {
  return async (dispatch) => {
    // 必须调用dispatch方法，只有触发dispatch方法，才会触发reducers函数
    const result = await reqRoleList();
    if (result.status === 0) {
      // 请求成功，分发成功的action对象
      dispatch(getRoleListSuccess(result.data));
    } else {
      // 请求失败，分发失败的action对象
      dispatch(makeRoleError(result.msg));
    }
  }
}

// 异步action creator ：创建role数据
export const addRoleAsync = (name) => {
  return async (dispatch) => {
    // 必须调用dispatch方法，只有触发dispatch方法，才会触发reducers函数
    const result = await reqAddRole(name);
    if (result.status === 0) {
      // 请求成功，分发成功的action对象
      // 如果对数据的操作是不一样的，那就不能复用，如果一样就可以
      dispatch(addRoleSuccess(result.data));
    } else {
      // 请求失败，分发失败的action对象
      dispatch(makeRoleError(result.msg));
    }
  }
}