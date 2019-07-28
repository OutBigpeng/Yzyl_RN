/**
 * Created by coatu on 2017/7/12.
 */
import React, {Component} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import {BGColor, bindActionCreators, connect, deviceWidth, Loading, toastShort} from '../../common/CommonDevice'
import {getQiuNiuImageData} from '../../dao/QiniuDao'
import * as LoginAction from "../../actions/LoginAction";
import Toast from "react-native-root-toast";

const dismissKeyboard = require('dismissKeyboard');

class ModifyMeHeaderView extends Component {
    navigatePress = () => {
        let str = '.*[1]\\d{10}.*';
        dismissKeyboard();
        const {state, goBack} = this.props.navigation;
        if (!this.state.textName||!this.state.textName.trim()) {
            return
        }
        if (state.params.name === this.state.textName) {
            toastShort('两次修改一致，请重新修改');
        } else if (this.state.textName.length > 11) {
            toastShort('昵称长度不能大于10');
        } else if (this.state.textName.match(str)) {
            toastShort('昵称不能为(包含)手机号');
        } else {
            const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
            if (this.getLoading())
                this.getLoading().show();
            let data = {
                'id': userObj.userid,
                'nickname': this.state.textName
            };
            getQiuNiuImageData(data, (res) => {
                if (this.getLoading())
                    this.getLoading().dismiss();
                this.props.loginAction.updateUserInfo(data);
                state.params.callback(data.nickname);
                toastShort("昵称修改成功",Toast.positions.CENTER);
                goBack();
            }, (err) => {
                if (this.getLoading())
                    this.getLoading().dismiss();
            })
        }
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            textName: this.props.navigation.state.params.name
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            rightOnPress: this.navigatePress,
        })
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        const {name} = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <TextInput
                    defaultValue={name}
                    style={styles.inputViewStyle}
                    clearButtonMode='always'
                    autoFocus={true}
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => this.onChangeText(text)}
                />
                <Loading ref={'loading'}/>

            </View>
        )
    }

    onChangeText(text) {
        this.setState({
            textName: text
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },

    inputViewStyle: {
        width: deviceWidth,
        height: 40,
        backgroundColor: 'white',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        paddingLeft: 15
    }
});
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        loginAction: bindActionCreators(LoginAction, dispatch)
    })
)(ModifyMeHeaderView);