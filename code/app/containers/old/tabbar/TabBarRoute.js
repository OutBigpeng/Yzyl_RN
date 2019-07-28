// /**
//  * Created by Monika on 2017/8/16.
//  */
// import React, {Component} from 'react';
// import Swiper from "../../component/Swiper";
// import Product from '../../pages/find/FindView';
// import Question from '../../pages/interlocution/InterlocutionView';
// import Mine from '../../pages/me/MeView';
// import Technical from '../../pages/technical/Technical';
// import Home from '../../pages/home/Home1';
// import {bindActionCreators, connect,} from '../../common/CommonDevice'
//
// import * as HomeAction from "../../actions/HomeAction";
//
// let swiper;
//
// class TabBarRoute extends Component {
//
//     // route(index) {
//     //     this.swiper.setPage(index);
//     // }
//
// // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {};
//     }
//
//     componentWillReceiveProps(nextProps) {
//         const {index} = nextProps.state.TabSwitch;
//         if (this.props.state.TabSwitch.index != index) {
//             this.swiper.setPage(index);
//         } else if (this.props.state.TabSwitch.index == index) {
//             if (index) {
//                 this.swiper.setPage(index);
//             }
//         }
//     }
//
// //  this.props.callbackParent(1);
//     render() {
//         return (
//             <Swiper scrollEnabled={false}
//                     removeClippedSubviews={false}
//                     ref={(swiper) => {
//                         this.swiper = swiper
//                     }}
//                     loop={false}
//                     pagingEnabled={false}
//                     style={{backgroundColor: 'white'}}>
//                 <Home ref={(swiper) => {
//                     this.Home = swiper
//                 }} navigation={this.props.navigation} callbackParent={this.onChildChanged.bind(this)}/>
//                 <Product ref={(swiper) => {
//                     this.Product = swiper
//                 }} navigation={this.props.navigation} callbackParent={this.onChildChanged.bind(this)}/>
//                 <Question ref={(swiper) => {
//                     this.Question = swiper
//                 }} navigation={this.props.navigation} callbackParent={this.onChildChanged.bind(this)}/>
//                 <Technical ref={(swiper) => {
//                     this.Technical = swiper
//                 }} navigation={this.props.navigation} callbackParent={this.onChildChanged.bind(this)}/>
//                 <Mine ref={(swiper) => {
//                     this.Mine = swiper
//                 }} navigation={this.props.navigation} callbackParent={this.onChildChanged.bind(this)}/>
//             </Swiper>
//         );
//     }
//
//     /**
//      * 子组件的回调
//      * @param index  当前要跳转的tab 的index
//      * @param data  当前对该tab页的子组件 点击传送的数据
//      */
//     onChildChanged(index, data) {
//         this.props.callbackBase(index, () => {
//             switch (index) {
//                 case 0:
//                     // this.Home;
//                     break;
//                 case 1:
//                     // this.Product
//                     break;
//                 case 2:
//                     // this.Question
//                     break;
//                 case 3:
//                     // this.Technical && this.Technical.switchType(data);
//                     this.props.actions.selectedLabelInfo(data, 'coating', true);
//                     break;
//                 case 4:
//                     // this.Mine
//                     break;
//                 default:
//                     break;
//             }
//         })
//     }
// }
//
// export default connect(state => ({
//         state: state
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(HomeAction, dispatch)
//     })
// )(TabBarRoute);
//
