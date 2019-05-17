/*
  用来存储状态数据的仓库
 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

// 默认暴露创建的store
export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));