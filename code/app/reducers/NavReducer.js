/**
 * Created by coatu on 2017/8/22.
 */
import Routers from '../Routers';

const recentlyVisitedRoutes = new Set();//防止連點，多次navigate，增加此判斷
const navReducers = (state, action) => {
    switch (action.type){

        case 'Navigation/NAVIGATE':
            if (recentlyVisitedRoutes.has(action.routeName)) {
                return state;
            }
            recentlyVisitedRoutes.add(action.routeName);
            setTimeout(() => {
                recentlyVisitedRoutes.delete(action.routeName);
            }, 400);

        case 'Navigation/RESET':
            // const { routeName } = action.actions[action.index]
        // do something

        default:
            // do nothing
            // dispatch(action)
    }

    const newState = Routers.router.getStateForAction(action, state);
    return newState || state;
};


// const firstAction = Routers.router.getActionForPathAndParams('WelcomeView');
// const initialNavState = Routers.router.getStateForAction(
//     // firstAction
// );
//
//
// const recentlyVisitedRoutes = new Set();//防止连点，多次navigate,增加此判断
//
// const navReducers = (state = initialNavState, action) => {
//     switch (action.type) {
//         case 'Navigation/NAVIGATE':
//             // if (recentlyVisitedRoutes.has(action.routeName)) {
//             //     return state;
//             // }
//             // recentlyVisitedRoutes.add(action.routeName);
//             // setTimeout(() => {
//             //     recentlyVisitedRoutes.delete(action.routeName);
//             // }, 400);
//             break;
//         default:
//             break;
//     }
//     const newState = Routers.router.getStateForAction(action, state);
//     return newState || state;
// };
export default navReducers;