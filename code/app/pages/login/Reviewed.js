/**
*注册完成引导入主页页面
 */
import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
//引入外部组件
import {
    BGColor, BGTextColor, bindActionCreators, borderRadius, connect, deviceHeight, Loading, px2dp,
    Sizes
} from "../../common/CommonDevice";
import CommonLoginButton from "../../component/CommonLoginButton";
import * as LoginAction from "../../actions/LoginAction";
import * as TabSwitchAction from "../../actions/TabSwitchAction";

 class Reviewed extends Component {

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        const {state} = this.props.navigation;
        let description = state.params.result&&state.params.result.replace('\\n', '\n');
        return (
            <View style={styles.container}>
                <View style={styles.contentViewStyle}>
                    <Text style={{
                        marginTop: 20,
                        color: '#rgba(80,80,80,1)',
                        fontSize: px2dp(Sizes.navSize)
                    }}>{description}</Text>
                </View>

                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <CommonLoginButton
                        {...this.props}
                        name='立即进入主页'
                        userName={state.params.userName}
                        passWord={state.params.passWord}
                        num={3}
                        compent={this}
                    />
                </View>
                <Loading ref={'loading'}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
        height: deviceHeight
    },

    contentViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        marginBottom: 25
    },

    textViewStyle: {
        borderRadius: borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        width: 150,
        height: 45,
        backgroundColor: BGTextColor
    }

});
export default connect(state => ({
    nav: state.nav
}), dispatch => ({
    loginAction: bindActionCreators(LoginAction, dispatch),
    tabSwitchAction: bindActionCreators(TabSwitchAction, dispatch)
}))(Reviewed);
