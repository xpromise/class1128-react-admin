/**
 * 操作storage的模块
 */
const USER_KEY = 'user';

// 保存用户信息的方法
export function setItem(value) {
  if (!value || typeof value === 'function') {
    console.log('保存用户数据失败', value);
    return ;
  }
  
  localStorage.setItem(USER_KEY, JSON.stringify(value));
}

// 读取用户信息的方法
export function getItem() {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return '';
  return JSON.parse(user);
}

// 删除用户信息的方法
export function removeItem() {
  localStorage.removeItem(USER_KEY);
}