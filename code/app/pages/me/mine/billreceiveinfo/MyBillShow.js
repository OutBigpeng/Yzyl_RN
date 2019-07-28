/**发票信息详情查看
 * Created by Monika on 2016/12/27.
 */
'use strict';
import React, {Component} from "react";
import {Text, View, StyleSheet, Image, TouchableHighlight, Platform} from "react-native";
import {getBillSetDefault} from "../../../../dao/UserBillDao";
import BackKey from "../../../../common/BackKey";
import NavigatorView from "../../../../component/NavigatorView";
import {borderColor, BGColor, Loading} from "../../../../common/CommonDevice";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";

export default class MyBillShow extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        const {userId,id,showData} = this.props.navigation.state.params;
        this.state = {
            userId: userId,
            id: id,
            showData: showData,
            isRefresh:false
        };
    }
    componentWillUnmount() {
        this. isBack();
    }

    componentDidMount() {
        this.props.navigation.setParams({
            navigatePress:this.isBack,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <View style={styles.inputbg}>
                        {this.itemRow("单位名称", this.state.showData.title)}
                        {this.itemRow("纳税人识别号", this.state.showData.taxid)}
                        {this.itemRow("注册地址", this.state.showData.regaddress)}
                        {this.itemRow("注册电话", this.state.showData.regtelephone)}
                        {this.itemRow("开户银行", this.state.showData.bank)}
                        {this.itemRow("银行账号", this.state.showData.account)}

                        <View style={styles.setDefault_sty}>
                            <Text style={styles.tv}>设为默认</Text>
                            <ATouchableHighlight  onPress={() => this.setDefault()}>
                                {this.state.showData.isdefault == 1 ?
                                    <Image style={styles.switch_style}
                                           source={require('../../../../imgs/me/on.png')}/> :
                                    <Image style={styles.switch_style}
                                           source={require('../../../../imgs/me/off.png')}/>}
                            </ATouchableHighlight>
                        </View>
                    </View>
                </View>

                <Loading ref={'loading'}/>
            </View>
        );
    }

    getLoading() {
        return this.refs['loading'];
    }

    itemRow(hint, content) {
        return (
            <View style={styles.item_sty}>
                <Text style={styles.tv}>{hint}</Text>
                <Text style={styles.tv_content}>{content}</Text>
            </View>
        )
    }

    /**
     * 设置默认
     */
    setDefault() {
        let detail = this.state.showData;
        detail.isdefault = this.state.showData.isdefault == 1 ? 0 : 1;
        this.setState({
            showData: detail,
            isRefresh:true
        });
        this.getLoading().show();
        const {navigate} = this.props.navigation;
        let data = {'userid': this.state.userId, 'id': this.state.id, 'isdefault': this.state.showData.isdefault};
        getBillSetDefault(data, this.props.navigation, (result) => {
            this.getLoading().dismiss();
        }, () => {
            this.getLoading().dismiss();
        });
    }

    /**
     * 返回时把值传回去
     */
    isBack=()=> {
        const {state,goBack} = this.props.navigation;
        let call = this.state.showData;
        state.params.callBack(call,this.state.isRefresh);
        goBack();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },
    setDefault_sty: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 15,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        padding: Platform.OS === 'ios' ? 3 : 0,
    },
    switch_style: {
        width: 50,
        height: 25,
        alignSelf: 'center',
    },
    inputbg: {
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 20,
    },
    item_sty: {
        flexDirection: 'row',
        paddingRight: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        padding: Platform.OS === 'ios' ? 3 : 0
    },
    tv: {
        color: 'gray',
        alignSelf: 'center',
        padding: 10,
        marginLeft: 5,
        alignItems: 'center'
    },
    tv_content: {
        color: 'black',
        alignItems: 'center',
        paddingLeft: 10,
    }
});
