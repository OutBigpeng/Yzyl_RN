import {Alert, AsyncStorage, InteractionManager, Platform, Linking} from "react-native";
import {iosDownLoadUrl} from "./CommonDevice";
import {getUpdate} from "../dao/SysDao";
let isUpdataObj = {};
let isClick = -1;
export function isUpdate({
    props, type = '', callback = () => {
}
}) {
    const {navigate} = props.navigation;
    getUpdate(props.navigation, (result) => {
        // console.log("数据。。。。", result);
        getUpdateData({result, props, callback})
    }, (err) => {
    }, type)
}

let AlertHint = function (type, description, downloadurl, navigate, callback) {
    isClick = 1;
    let onPress = () => {
        {
            isClick = -1;
            Platform.OS === 'ios' ? link() :
                InteractionManager.runAfterInteractions(() => {
                    navigate('WebViews', {
                        name: 'WebViews',
                        title: '版本更新',
                        downloadurl: Platform.OS === 'ios' ? iosDownLoadUrl : downloadurl,
                        callback: callback
                    })
                })
        }
    };
    Alert.alert(
        '温馨提示',
        description,
        type == 1 ?
            [//是强制无取消。
                {text: '确定', onPress: onPress}
            ]
            :
            [
                {
                    text: '取消', onPress: () => {
                    isClick = -1;
                }
                },
                {text: '确定', onPress: onPress}
            ], Platform.OS === 'android' ? {cancelable: false} : {}
    );

};

export function getUpdateData({result = isUpdataObj, props, callback}) {
    const {navigate} = props.navigation;
    let {downloadurl = "", description = "", isforceupdate = -1} = result;
    if (isforceupdate !== -1 && isClick < 0) {
        // console.log("我走了要更新。。。。", isforceupdate);
        if (isforceupdate === 0) {
            AlertHint(0, description, downloadurl, navigate, null);
        } else {//强制更新
            props.loginAction && props.loginAction.requestLoginOut();
            isUpdataObj = result;
            AlertHint(1, description, downloadurl, navigate, callback);
        }
    }
}

function link() {
    Linking.openURL(iosDownLoadUrl)
}