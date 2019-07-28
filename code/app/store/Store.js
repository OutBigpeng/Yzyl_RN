/**全局store
 * Created by coatu on 2016/12/21.
 */
import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import RootReducer from "../reducers/RootReducer";

let createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
let Store = createStoreWithMiddleware(RootReducer);

export default Store;


// import {createStore, applyMiddleware, combineReducers} from 'redux';
// import thunk from 'redux-thunk';
// import reduces from '../reducers/RootReducer';
// import logger from 'redux-logger';
// //定义中间件数组，默认包括thunk middleware
// const middlewares = [thunk.withExtraArgument()];
//
// if(__DEV__) {
//     middlewares.push(logger);
// }
//
// //将中间件柯里化（所谓柯里化，浅显的说，证明函数只需要一个参数而已）
// const middleware = applyMiddleware(...middlewares);
//
// export default (preloadedState = {}) =>{
//     const rootReducer = combineReducers({
//         ...reduces
//     });
//     return createStore(rootReducer, preloadedState, middleware);
// }