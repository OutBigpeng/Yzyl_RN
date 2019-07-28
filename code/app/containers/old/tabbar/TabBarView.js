// /**
//  * Created by Monika on 2017/8/16.
//  */
// import React, {Component} from 'react';
// import {View} from 'react-native';
// import TabBar from '../../../component/tab/TabBar';
// import TabBarRoute from './TabBarRoute.js';
// import {Images, StyleSheet} from '../../../themes/index';
// // import BackKey from "../../common/BackKey";
// import * as TabSwitchAction from "../../../actions/TabSwitchAction";
// import {bindActionCreators, connect,} from '../../../common/CommonDevice'
//
// class TabBarView extends Component {
//     // 构造
//     constructor(props) {
//         super(props);
//         // 初始状态
//         this.state = {selectedIndex: props.index || props.navigation.state && props.navigation.state.params && props.navigation.state.params.index || 0};
//         // console.log("TabBarView------constructor---this.state.selectedIndex---",this.state.selectedIndex);
//     }
//
//     switchTabOrPage(type, page) {
//         switch (type) {
//             case 'jump':
//                 this.props.navigation.navigate(page);
//                 break;
//             case 'switch':
//                 this.swichTab(page);
//                 break;
//             default:
//                 break;
//         }
//     }
//
//      componentWillReceiveProps(nextProps) {
//          const {index,isFromJpush} = nextProps.state.TabSwitch;
//          if(isFromJpush&&this.props.state.TabSwitch.index!=index){
//              this.swichTab(index);
//              this.props.actions.chageJpush(false);
//          }
//          if(this.props.state.TabSwitch.isTabSwitch){
//              this.swichTab(1);
//              this.props.actions.chageGoBack(false);
//          }
//      }
//     componentDidMount() {
//         // console.log("TabBarView--///--componentDidMount---this.state.selectedIndex---",this.state.selectedIndex);
//     }
//
//     swichTab(index) {
//         this.props.actions.switchTabIndex('switch',index);
//
//         this.tab.update(index)
//     }
//
//     selectedItem(index) {
//         this.props.actions.switchTabIndex('switch',index);
//
//         this.setState({
//             selectIndex: index
//         });
//     }
//
//     /**
//      * 子组件TabBarRoute的回调 在TabBarRoute 子页面中点击进行tab的切换
//      * @param index  切换到哪个tab
//      * @param callback  回调，用来对页面中的子组件作设置
//      */
//     onBaseChanged(index,callback){
//         this.swichTab(index);
//         callback();
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <TabBarRoute {...this.props}
//                              ref={(route) => (this.route = route)}
//                              callbackBase={this.onBaseChanged.bind(this)}
//                 />
//                 <TabBar defaultPage={this.state.selectedIndex}
//                         centerCircle={true}
//                         onItemSelected={(index) => this.selectedItem(index)}
//                         ref={(tab) => (this.tab = tab)}
//                 >
//                     <TabBar.Item
//                         icon={Images.home}
//                         selectedIcon={Images.homeSel}
//                         text="主页"
//                     />
//
//                     <TabBar.Item
//                         icon={Images.findProduct}
//                         selectedIcon={Images.findProductSel}
//                         text='产品'
//                     />
//
//                     <TabBar.Item
//                         circleImg = {Images.interlocutionCircle}
//                         text='问答'
//                         isCircleBg={true}
//                     />
//
//                     <TabBar.Item
//                         icon={Images.university}
//                         selectedIcon={Images.universitySel}
//                         text='大学'
//                     />
//
//                     <TabBar.Item
//                         icon={Images.mine}
//                         selectedIcon={Images.mineSel}
//                         text='我的'
//                     />
//                 </TabBar>
//             </View>
//         );
//     }
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     text: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     }
// });
// export default connect(state => ({
//         state: state,
//     }),
//     (dispatch) => ({
//         actions: bindActionCreators(TabSwitchAction, dispatch)
//     })
// )(TabBarView);