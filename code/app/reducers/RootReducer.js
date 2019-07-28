/**
 * Created by coatu on 2016/12/21.
 */
import {combineReducers} from "redux";
import Login from "./LoginReducer";
// import ShowAddress from "./ShowAddressReducer";
// import Coupon from "./CartCouponReducer";
// import ShopCart from "./ShopReducer";
//暂时保留
// import {ChatLogin,ChatRoster, ChatSubscribe} from "../chat/reduces";// ChatMessage,
// ShopCart,
// ShowAddress,
// ChatLogin, ChatRoster,
// ChatSubscribe,
// Coupon,
import Type from "./TypeReducer";
import Find from "./FindReducer";
import Question from './QuestionReducer';
import TabSwitch from './TabSwitchReducer';
import Me from './MeReducer';
import Register from './RegisterReducer'

import nav from './NavReducer';
import Home from './HomeReducers'
import ChatCustom from "./ChatCustomReducer";
import ChatMsg from "./ChatMsgReducer";
import StratifiedLevel from "./StratifiedLevelReducer";
import Discuss from "./DiscussReducer";
import CoatingUniversity from "./CoatingUniversityReducer";

const RootReducer = combineReducers({
    nav,
    Login,
    TabSwitch,
    Type,
    Find,
    Home,
    Me,
    Question,
    Register,
    StratifiedLevel,
    Discuss,
    CoatingUniversity,
    ChatCustom,
    ChatMsg
});
export default RootReducer;