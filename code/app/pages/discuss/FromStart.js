/**
 * Created by coatu on 2017/6/22.
 */
import React, {Component} from 'react';
import {Platform, AsyncStorage, DeviceEventEmitter, AppState, View} from 'react-native'
import {PlatfIOS} from "../../common/CommonDevice";
import {isUpdate, getUpdateData} from "../../common/UpdateVersion";

export default class FromStart extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        //设置一个标记，表示从后台进入前台的时候，处理其他逻辑<span style="white-space:pre">  </span>
        this.flage = false;
    }

    componentDidMount() {
        this.callback();
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    callback() {
        PlatfIOS && isUpdate({props: this.props, type: '', callback: this.callback.bind(this)})
    }

    update(){
        getUpdateData({props:this.props,callback:this.update.bind(this)})

    }
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState != null && nextAppState === 'active') {

            //如果是true ，表示从后台进入了前台 ，请求数据，刷新页面。或者做其他的逻辑
            if (this.flage) {
                //这里的逻辑表示 ，第一次进入前台的时候 ，不会进入这个判断语句中。
                // 因为初始化的时候是false ，当进入后台的时候 ，flag才是true ，
                // 当第二次进入前台的时候 ，这里就是true ，就走进来了。

                //测试通过
                // alert("从后台进入前台");
                console.log("从后台进入前台");
                this.update();

                // 这个地方进行网络请求等其他逻辑。
            }
            this.flage = false;
        } else if (nextAppState != null && nextAppState === 'background') {
            this.flage = true;
            console.log("从前台进入后台")

        }

    };

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    render() {
        // alert('不走这里么')
        return <View/>
    }
}
