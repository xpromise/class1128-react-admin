/**
 * 包含n个请求函数模块
 */
import jsonp from 'jsonp';
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
const prefix = process.env.NODE_ENV === 'development' ? '' : 'http://localhost:5000';

// 请求登录函数
export const reqLogin = (username, password) => ajax(prefix + '/login', {username, password}, 'POST');

// 请求天气函数
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    jsonp(
      `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
      (err, data) => {
        if (!err) {
          const { dayPictureUrl, weather } = data.results[0].weather_data[0];
          resolve({weather, weatherImg: dayPictureUrl});
        } else {
          // 提示错误
          reject('请求失败，网络不稳定~');
        }
      }
    )
  })
}

// 请求分类列表数据函数
export const reqGetCategories = (parentId) => ajax(prefix + '/manage/category/list', {parentId});

// 请求添加分类函数
export const reqAddCategory = (parentId, categoryName) => ajax(prefix + '/manage/category/add', {parentId, categoryName}, 'POST');

// 请求修改分类名称函数
export const reqUpdateCategoryName = (categoryId, categoryName) => ajax(prefix + '/manage/category/update', {categoryId, categoryName}, 'POST');

// 请求获取产品数据函数
export const reqGetProducts = (pageNum, pageSize) => ajax(prefix + '/manage/product/list', {pageNum, pageSize});

// 请求添加产品数据函数
export const reqAddProduct = (product) => ajax(prefix + '/manage/product/add', product, 'POST');

// 请求删除图片函数
export const reqDelImage = (name, id) => ajax(prefix + '/manage/img/delete', {name, id}, 'POST');

// 请求修改产品数据函数
export const reqUpdateProduct = (product) => ajax(prefix + '/manage/product/update', product, 'POST');