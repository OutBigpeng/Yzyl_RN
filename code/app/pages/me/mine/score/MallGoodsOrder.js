/**
 *
 * Created by Monika on 2018/5/22.
 */
import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {_, Alerts, BGColor, Loading, toastShort, PlatfIOS} from "../../../../common/CommonDevice";
import {MallGoodsItemView, OrderBottomBtView, ReceiveInfoView} from "./MallGoodsChildrenView";
import {getExchangeGoods} from "../../../../dao/MeDao";
import KeyboardSpacer from 'react-native-keyboard-spacer'

export default class MallGoodsOrder extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let {params = {}} = this.props.navigation.state;
        let {item, type} = params;
        let tempObj = {};

        let inputList = [
            {name: "收货人姓名", isMust: true, params: 'linkMan'},
            {name: "手机号码", isMust: true, params: 'contact', keyboardType: 'numeric'},
            {name: "收货地址", isMust: true, params: 'address'},
            {name: "备注", params: 'remark'}];

        if (type == "detail" && !_.isEmpty(inputList)) {
            inputList.push({name: "积分合计", params: 'score'});
            for (let i = 0; i < inputList.length; i++) {
                let obj = inputList[i];
                obj.isMust = false;
                tempObj[obj.params] = obj.params === "score" ? `商品合计：${item[obj.params]}积分` + "" : item[obj.params];
            }
        }
        this.state = {
            returnData: tempObj || {},
            inputList: inputList
        }
    }


    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {params = {}} = this.props.navigation.state;
        let {item: {score, id}, type = ""} = params;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <MallGoodsItemView
                        {...this.props}
                        goodsItem={params.item}
                        type={type || "detail"}
                        style={{marginTop: 10}}
                    />
                    <ReceiveInfoView
                        {...this.props}
                        infoList={this.state.inputList}
                        returnData={this.state.returnData}
                        type = {type }
                    />
                </ScrollView>
                {type != "detail" && <OrderBottomBtView
                    {...this.props}
                    totalScore={score}
                    onPress={() => this.commitOrder(id)}
                />}
                {PlatfIOS ? <KeyboardSpacer/> : <View/>}
                <Loading ref={'loading'}/>
            </View>

        );
    }

    commitOrder(id) {
        let {returnData} = this.state;
        let {navigate, goBack, state: {params: {callback}}} = this.props.navigation;

        returnData.goodsId = id;
        for (let i = 0; i < this.state.inputList.length; i++) {
            let item = this.state.inputList[i];
            if (item.isMust && !returnData[item.params]) {
                toastShort(`${item.name}不能为空`);
                return;
            }
        }
        this.getLoading().show();
        getExchangeGoods(returnData, this.props.navigation, (res) => {
            this.getLoading().dismiss();
            if (res && res.code) {
                if (res.code === "200") {
                    Alerts("订单已提交，我们会尽快为您发货！", '', () => {
                        callback && callback();
                        goBack();
                    })
                } else {
                    toastShort(res.msg);
                }
            }
        }, () => {
            this.getLoading().dismiss();
        });
    }

    componentWillUnmount() {
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
        // height:deviceHeight
    },
});