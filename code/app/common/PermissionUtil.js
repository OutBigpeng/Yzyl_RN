import Permissions from 'react-native-permissions';
import {Alert, Platform} from 'react-native';

class PermissionUtil {
    checkPermission = (success, fail, permission = []) => {
        let self = this;
        let flag = true;
        let per = [];
        if (permission.length <= 0) {
            return;
        }
        Permissions.checkMultiple(permission)
            .then(status => {//直接修改设置 检测不到授权结果
                console.log('status', status);
                Object.keys(status).map((k, v) => {
                    if (status[k] == "authorized") {
                    } else {
                        per.push(k);
                        flag = false;
                    }
                });
                if (flag) {
                    success();
                } else {
                    if (per.length > 0) {
                        self.request(success, fail, per, 0);
                    }
                }
            })
    };

    request = (success, fail, per, i) => {
        if (i < per.length) {
            console.log('per', per);
            this.requestPermission(success, fail, per, i);
        } else {
            success();
        }
    };
    openSetting = () => {
        return Permissions.canOpenSettings() && Permissions.openSettings()
    };
    requestPermission = (success, fail, per, i) => {
        let self = this;
        console.log('per[i]', per[i]);
        Permissions.request(per[i])
            .then(res => {
                if (res != 'authorized') {
                    if (fail) {
                        fail();
                        return;
                    }
                    switch (per[i]) {
                        case "camera":
                            Alert.alert(
                                '无法使用！',
                                '如需使用，请授予应用【相机】与【读写手机存储】权限',
                                [
                                    {text: '取消', style: 'cancel'},
                                    {text: '设置权限', onPress: this.openSetting()},
                                ], Platform.OS == 'android' ? {cancelable: false} : {}
                            );
                            break;
                        case "photo":
                            Alert.alert(
                                '无法访问!',
                                "请授予应用访问存储sd卡权限",
                                [
                                    {text: '取消', style: 'cancel'},
                                    {text: '设置权限', onPress: Permissions.openSettings},
                                ], Platform.OS == 'android' ? {cancelable: false} : {}
                            );
                            break;
                        case "location":
                            Alert.alert(
                                '无法访问!',
                                "请授予应用访问位置信息权限",
                                [
                                    {text: '取消', style: 'cancel'},
                                    {text: '设置权限', onPress: this.openSetting()},
                                ], Platform.OS == 'android' ? {cancelable: false} : {}
                            );
                            break;
                        case "microphone":
                            Alert.alert(
                                '无法访问!',
                                "请授予应用录音权限",
                                [
                                    {text: '取消', style: 'cancel'},
                                    {text: '设置权限', onPress: Permissions.openSettings},
                                ], Platform.OS == 'android' ? {cancelable: false} : {}
                            );
                            break;
                        case "contacts":
                            Alert.alert(
                                '无法访问!',
                                "请授予应用获取联系人权限",
                                [
                                    {text: '取消', style: 'cancel'},
                                    {text: '设置权限', onPress: Permissions.openSettings},
                                ], Platform.OS == 'android' ? {cancelable: false} : {}
                            );
                            break;
                        default:
                            Alert.alert(
                                '无法访问!',
                                "请授予应用权限",
                                [
                                    {text: '取消', style: 'cancel'},
                                    {text: '设置权限', onPress: Permissions.openSettings},
                                ], Platform.OS == 'android' ? {cancelable: false} : {}
                            );
                            break;
                    }
                } else {
                    self.request(success, fail, per, ++i);
                }
            }).catch(e => console.log(e))
    };
}

export default new PermissionUtil();