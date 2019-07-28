// /**
//  * Created by Monika on 2017/4/6.
//  */
// import * as types from "../actions/ActionTypes";
//
// const initState = {
//     username: null,
//     password: null,
//     error: null,
//     fetching: false,
//     registerError: null,
//     registerCall: null,
//     loginCall: null
// };
//
// let login = (state = initState, action) => {
//     switch (action.type) {
//         case types.LOGIN_REQUEST:
//             return Object.assign({}, state, {username: action.username, password: action.password, fetching: true});
//             break;
//         case types.LOGIN_FAILURE:
//             return Object.assign({}, state, {fetching: false, error: action.error});
//             break;
//         case types.LOGIN_SUCCESS:
//             // console.log("token", action.json.accessToken);
//             return Object.assign({}, state, {fetching: false, loginCall: action.json});
//             break;
//         case types.REGISTER_REQUEST:
//             return Object.assign({}, state, {username: action.username, password: action.password, fetching: true});
//             break;
//         case types.REGISTER_FAILURE:
//             return Object.assign({}, state, {fetching: false, registerError: action.registerError});
//             break;
//         case types.REGISTER_SUCCESS:
//             return Object.assign({}, state, {fetching: false, registerCall: action.json});
//             break;
//         default:
//             return state;
//     }
// };
// export default login;