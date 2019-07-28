/**
 * 配方详情 页面
 * Created by coatu on 2017/8/24.
 */
import React, {Component} from 'react'
import {View} from 'react-native'

import {deviceWidth} from '../../common/CommonDevice'
import {TransfromImgWebView} from "../../component/TransfromImgWebView";
import {StyleSheet,} from '../../themes';
import {CommonButton} from "../../component/CommonAssembly";

export default class FormulaView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        this._isMounted;
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        let {state} = this.props.navigation;//imageThumb   <ScrollView style={{flex:1}}>
        let {imageUrl, isMaterial = 0, formulaId} = state.params;
        return (
            <View style={styles.container}>
                <TransfromImgWebView
                    dataUrl={imageUrl}
                />
                {isMaterial == 1 && <CommonButton
                    title='获取原料'
                    buttonOnPress={() => this.pushToMaterial(formulaId)}
                    buttonStyle={[styles.getFormulaStyle]}
                    buttonFlex={1}
                />}
            </View>
        );
    }

    pushToMaterial(formulaId) {
        const {navigate, state} = this.props.navigation;
        navigate('MaterialList', {
            title: '配方原料',
            formulaId
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    getFormulaStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
        width: deviceWidth
    },
});