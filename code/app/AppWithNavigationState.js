/**
 * Created by coatu on 2017/8/22.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux';
import {addNavigationHelpers} from 'react-navigation';
import Routers from './Routers';
import {Platform, StatusBar,View} from 'react-native';
import {BGColor} from "./common/CommonDevice";

let BadgeAndroid = (Platform.OS === 'ios' ? '' : require('react-native-android-badge'));

class AppWithNavigationState extends Component {
    render() {
        const {dispatch, nav} = this.props;

        return (
            <View style={{flex: 1, backgroundColor: BGColor}}>
                <StatusBar
                    backgroundColor = 'black'
                    // barStyle = 'default'
                  //  hidden={false}
                   // translucent={false}
                    networkActivityIndicatorVisible={false} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                />
                <Routers
                    navigation={addNavigationHelpers({
                    dispatch: dispatch,
                    state: nav
                })}/>
            </View>
        )
    }
}

export default connect(state => ({nav: state.nav}))(AppWithNavigationState);