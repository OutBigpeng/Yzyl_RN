/**
 * Created by coatu on 2017/8/22.
 */
import React, {Component} from 'react';
import {Platform} from 'react-native';
import {Provider} from 'react-redux';
// import {} from 'react-navigation';

import createStore from './store/Store';
import AppWithNavigationState from "./AppWithNavigationState";
import JPushModule from "jpush-react-native";

let BadgeAndroid = (Platform.OS === 'ios' ? '' : require('react-native-android-badge'));
export default class AppRoots extends Component {
    componentDidMount() {
        if (Platform.OS === 'ios') {
            JPushModule.setBadge(0, (cb) => {
            })
        } else {
            BadgeAndroid.setBadge(0);
        }
    }

    render() {
        const prefix = Platform.OS === 'android' ? 'youzhong://youzhongyouliao/' : 'youzhong://';

        return (
            <Provider store={createStore}>
                <AppWithNavigationState
                    uriPrefix={prefix}/>
            </Provider>
        );
    }
}


// AppRegistry.registerComponent('YzylRN', () => YzylRN);
