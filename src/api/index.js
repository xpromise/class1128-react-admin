/**
 * 包含n个请求函数模块
 */
import ajax from './ajax';

/*
  服务器代理模式：
    1. 作用：解决开发环境下的跨域问题。生产环境不能使用
    2. 配置：
      在package.json中添加 "proxy": "目标服务器地址"
    3. 工作原理
      原因：客户端和服务端有跨域问题，而服务端和服务端之间是没有跨域问题的
      解决：
        让开发（代理）服务器运行当前项目。项目和开发服务器就不会有跨域问题（遵循了同源策略）
        在让开发（代理）服务器去访问目标服务器，（服务端和服务端之间是没有跨域问题的），
        所以开发（代理）服务器将请求目标服务器的资源返回当前页面
   
   什么时候需要重启服务器：
    修改了webpack配置就需要重启，才能生效
 */

// 区分开发环境和生产环境
const prefix = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://localhost:5000';

// 请求登录函数
export const reqLogin = (username, password) => ajax(prefix + '/login', {username, password}, 'POST');