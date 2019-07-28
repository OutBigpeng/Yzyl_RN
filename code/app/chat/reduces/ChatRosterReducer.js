//
// import *as types from "../actions/ActionTypes";
//
// const initialListSize = {
//     roster: [],
//     isLoading: false
// };
//
// export default function roster(state = initialListSize, action = {}) {
//     switch (action.type) {
//         case types.RECEIVE_ROSTER:
//             return Object.assign({}, state, {roster: action.roster, isLoading: false});
//             break;
//         case types.REQUEST_ROSTER:
//             return Object.assign({}, state, {isLoading: action.isLoading});
//             break;
//
//         case types.RECEIVE_DELETEFRIEND:
//             state.roster.map((item, index) => {
//                 if (item.name === action.id) {
//                     state.roster.splice(index, 1)
//                 }
//             });
//             return Object.assign({}, state, {roster: state.roster});
//             break;
//
//         case types.RECEIVE_ADDFRIEND:
//             return Object.assign({}, state, {});
//             break;
//
//         default:
//             return state;
//     }
// }