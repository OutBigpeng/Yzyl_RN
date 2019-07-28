// /**
//  * @flow
//  */
//
// import React ,{Component,PureComponent}from 'react';
// import {
//   Button,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,Dimensions
// } from 'react-native';
// import {
//   createNavigator,
//   createNavigationContainer,
//   TabRouter,
//   addNavigationHelpers,
// } from 'react-navigation';
// import Images from "../pstyle/Images";
// let {width, height}  = Dimensions.get('window');
//
// import HomeView from "../pages/home/Home";
// import FindView from "../pages/find/FindView";
// import MeView from "../pages/me/MeView";
// import ChatView from "../pages/support/FindSupport";
// import InterlocutionView from "../pages/interlocution/InterlocutionView";
// import BadgeView from "./BadgeView";
// import {BGTextColor, px2dp} from "../common/CommonDevice";
//
// const HOME = '首页';
// const HOME_NORMAL = Images.iconHome;
// const HOME_SELECT = Images.iconHomeSelected;
//
// // const CART = 'CART';
// // const CART_NORMAL = Images.iconShop;
// // const CART_SELECT = Images.iconShopActive;
//
// const INTERLOCUTION = '问答';
// const INTERLOCUTION_NORMAL = Images.iconInterlocution;
// const INTERLOCUTION_SELECT = Images.iconInterlocutionActive;
//
// const PRODUCT = '产品';
// const PRODUCT_NORMAL = Images.iconProduct;
// const PRODUCT_SELECT = Images.iconProductActive;
//
// const MINE = '我的';
// const MINE_NORMAL = Images.iconMine;
// const MINE_SELECT = Images.iconMineActive;
//
// const FINDSUPPORT = '技术';
// const FINDSUPPORT_NORMAL = Images.iconSupport;
// const FINDSUPPORT_SELECT = Images.iconSupportActive;
// let PlatfIOS = Platform.OS == 'ios';
// let tabArr = [{name:HOME,img:HOME_NORMAL,imgSel:HOME_SELECT,routeName:'HomeView'},
//     {name:PRODUCT,img:PRODUCT_NORMAL,imgSel:PRODUCT_SELECT,routeName:'FindView'},
//     {name:INTERLOCUTION,img:INTERLOCUTION_NORMAL,imgSel:INTERLOCUTION_SELECT,routeName:'InterlocutionView'},
//     {name:FINDSUPPORT,img:FINDSUPPORT_NORMAL,imgSel:FINDSUPPORT_SELECT,routeName:'ChatView'},
//     {name:MINE,img:MINE_NORMAL,imgSel:MINE_SELECT,routeName:'MeView'}]
//
//
//  class CustomTabBar extends PureComponent {
// // 构造
//   constructor(props) {
//     super(props);
//     // 初始状态
//     this.state = {
//       selectArr :tabArr.fill(false),
//         selected:true
//     };
//   }
//  render(){
//       let {navigation}  = this.props;
//      const { routes } = navigation.state;
//      return (
//          <View style={styles.tabContainer}>
//              {tabArr.map((tab , position)=> (
//                  <TouchableOpacity
//                      onPress={() =>{
//                          let tempArr = this.state.selectArr;
//                          for (let i =tempArr.length - 1; i >= 0; i--) {
//                              if (i == position) {
//                                  continue;
//                              }
//                              if (tempArr[i] == true) {
//                                 tempArr[i] = false;
//                                  break;
//                              }
//                          }
//                         tempArr[position] = !tempArr[position];
//
//                          this.setState({
//                              selectArr: [].concat(tempArr)
//                          })
//                          navigation.navigate(tab.routeName)}}
//                      style={styles.tab}
//                      key={routes[position].routeName}
//                  >
//                      <BadgeView
//                          Images={this.state.selectArr[position] ? tab.imgSel : tab.img}
//                          tabBarTitle={tab.name}
//                          style={[{
//                              width: 24, height: 24
//                          }]}
//                      />
//
//                    <Text>{tab.name}</Text>
//                  </TouchableOpacity>
//              ))}
//          </View>
//      )
//  }
// }
//
//  class CustomTabView extends PureComponent {
//  // 构造
//    constructor(props) {
//      super(props);
//      // 初始状态
//      this.state = {};
//        }
//    render(){
//        const  { router, navigation } = this.props;
//        const { routes, index } = navigation.state;
//        const ActiveScreen = router.getComponentForState(navigation.state);
//
//        return (
//            <View style={styles.container}>
//
//              <ActiveScreen
//                  navigation={addNavigationHelpers({
//                      ...navigation,
//                      state: routes[index],
//                  })}
//              />
//              <CustomTabBar navigation={navigation} />
//            </View>
//        )
//    }
// };
// //封装tabbar
// const TabOptions = (tabBarTitle, normalImage, selectedImage, navTitle) => {
//     const tabBarLabel = tabBarTitle !=='问答'?tabBarTitle:'  ';
//     const tabBarIcon = ({tintColor, focused}) => {
//         return (
//             <BadgeView
//                 Images={focused ? selectedImage : normalImage}
//                 tabBarTitle={tabBarTitle}
//                 style={[{
//                     tintColor: tintColor, width: 24, height: 24
//                 }]}
//             />
//         )
//     };
//     let header;
//     if (tabBarTitle == '产品' || tabBarTitle == '首页' || tabBarTitle == INTERLOCUTION) {
//         header = null;
//     }
//     const headerTitle = navTitle;
//     const headerTitleStyle = {
//         alignItems: 'center',
//         fontSize:  px2dp(PlatfIOS ?20: 18 ),
//         color: 'white',
//         alignSelf: 'center',
//         fontWeight: 'normal',
//     };
//     const headerStyle = {
//         backgroundColor: BGTextColor,
//         elevation: 0,//android阴影
//         shadowOpacity: 0
//     };//ios 阴影
//     return {
//         tabBarLabel, tabBarIcon, headerTitle,
//         headerTitleStyle, headerStyle, header
//     }
// };
// const CustomTabRouter = TabRouter(
//   {
//       HomeView: {
//           screen: HomeView,
//           path: 'app/HomeView',
//           navigationOptions: () => TabOptions('首页', HOME_NORMAL, HOME_SELECT, '首页')
//       },
//
//       FindView: {
//           screen: FindView,
//           path:'app/FindView',
//           // navigationOptions: () => TabOptions( '产品', PRODUCT_NORMAL, PRODUCT_SELECT, '产品')
//       },
//
//       InterlocutionView: {
//           screen: InterlocutionView,
//           path: 'app/InterlocutionView',
//           // navigationOptions: () => TabOptions(INTERLOCUTION, INTERLOCUTION_NORMAL, INTERLOCUTION_SELECT, INTERLOCUTION)
//       },
//
//
//       ChatView: {
//           screen: ChatView,
//           path:'app/ChatView',
//           // navigationOptions: () => TabOptions( '技术', FINDSUPPORT_NORMAL, FINDSUPPORT_SELECT, '技术')
//       },
//
//       MeView: {
//           screen: MeView,
//           path: 'app/MeView',
//           // navigationOptions: () => TabOptions('我的', MINE_NORMAL, MINE_SELECT, '我的')
//       }
//   },
//   {
//     // Change this to start on a different tab
//     initialRouteName: 'MeView',
//   }
// );
//
// const CustomTabs = createNavigationContainer(
//   createNavigator(CustomTabRouter)(CustomTabView)
// );
//
// const styles = StyleSheet.create({
//   container: {
//     // marginTop: Platform.OS === 'ios' ? 20 : 0,
//       flex:1,
//       width:width,
//       // height:height
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     height: 45,
//     position: 'absolute',
//     bottom:0,
//     width:width
//   },
//   tab: {
//     flex: 1, width:width/5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     // margin: 4,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 4,
//   },
// });
//
// export default CustomTabs;
