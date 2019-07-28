// /**
//  * Created by coatu on 2017/6/19.
//  */
// import {StackNavigator} from 'react-navigation';
// import {StackOptions} from '../component/StackOptions'
// import LoginView from '../pages/login/LoginView';
// import ForgetView from '../pages/login/ForgetView';
// import RegisterView from '../pages/login/RegisterView';
// import ResetView from '../pages/login/ResetPwd';
// import ReviewedView from '../pages/login/Reviewed';
// import AgreementView from '../pages/login/Agreement'
// import ResetPwdView from "../pages/login/ResetPwd";
//
// const LoginScreenStackNavigator = StackNavigator({
//     LoginView:{
//         screen:LoginView,
//         navigationOptions: (navigation) => StackOptions(navigation,'登录')
//     },
//
//     RegisterView:{
//         screen:RegisterView,
//         navigationOptions: (navigation) => StackOptions(navigation)
//     },
//
//     ForgetView:{
//         screen:ForgetView,
//         navigationOptions: (navigation) => StackOptions(navigation)
//     },
//
//     ResetView:{
//         screen:ResetView,
//         navigationOptions: (navigation) => StackOptions(navigation)
//     },
//
//     ReviewedView:{
//         screen:ReviewedView,
//         navigationOptions: (navigation) => StackOptions(navigation)
//     },
//
//     AgreementView:{
//         screen:AgreementView,
//         navigationOptions: (navigation) => StackOptions(navigation)
//     },
//
//     ResetPwdView:{
//         screen:ResetPwdView,
//         navigationOptions: (navigation) => StackOptions(navigation)
//     }
//
// },{
//     // initialRouteName:'LoginView',
//     headerMode:'screen',//返回上级的效果
//     mode:'none'//跳转的效果
// });
//
// export default LoginScreenStackNavigator;