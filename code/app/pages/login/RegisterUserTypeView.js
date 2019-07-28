/**
 * Created by Monika on 2018/7/9.
 */


'use strict';
import React, {Component} from "react";
import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import {_, BGColor, BGTextColor, connect, Loading} from "../../common/CommonDevice";
import {getSysDictionaryData} from "../../dao/SysDao";
import {scaleSize} from "../../common/ScreenUtil";
import Images from "../../themes/Images";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {CommonButton} from "../../component/CommonAssembly";
import {cloneObj} from "../../common/CommonUtil";
import {toastShort} from "../../common/ToastUtils";

class ItemView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        let {type, keyName, keyValue, onPress = {}, isSelected, index} = this.props;
        return (
            <ATouchableHighlight onPress={onPress}>
                <View style={{
                    padding: scaleSize(30), marginBottom: scaleSize(10),
                    backgroundColor: 'white', flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <Text>{keyValue}</Text>
                    <Image style={{width: scaleSize(50), height: scaleSize(50)}}
                           source={isSelected ? Images.checkSel : Images.checkUnSel}/>
                </View>
            </ATouchableHighlight>
        )
    }
}

class RegisterUserTypeView extends Component {

    renderRow = ({item, index}) => {
        let {property, keyName, keyValue} = item;
        property = JSON.parse(property);
        let {isSelectObj} = this.state;
        return (
            <ItemView
                key={keyName}
                {...this.props}
                {...item}
                index={index}
                isSelected={isSelectObj[keyName]}
                onPress={() => {
                    for (let key in isSelectObj) {
                        isSelectObj[key] = false;
                    }
                    isSelectObj[keyName] = !isSelectObj[keyName];
                    this.setState({
                        selectObj: Object.assign(item, property),
                        isSelectObj
                    });
                }}
            />
        )
    };
    _header = () => {
        return (
            <View style={{padding: scaleSize(20)}}>
                <Text>请选择您所属用户类型：</Text>
            </View>
        )
    };
    _footer = () => {
        let {selectObj} = this.state;
        return (
            <CommonButton
                title={'下一步'}
                buttonViewWidth={100}
                buttonOnPress={() => {
                    const {navigate, state} = this.props.navigation;
                    if(selectObj.keyName) {
                        let temp = cloneObj(state.params) || {};
                        navigate('RegisterView', Object.assign(temp, {
                            name: 'RegisterView',
                            title: '注册',
                            rightTitle: '',
                            userTypeObj: selectObj
                        }))
                    }else {
                        toastShort('请选择您所属用户类型')
                    }

                }}
                buttonStyle={[{
                    marginTop: scaleSize(40),
                    backgroundColor: BGTextColor,
                }]}
            />
        )
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isSelectObj: {},
            selectObj: {}
        };
        this._isMounted;

    };


    componentWillUnmount() {
        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getLoading() && this.getLoading().show();
            getSysDictionaryData({parentKey: 'uUserType'}, (res) => {
                this.getLoading() && this.getLoading().dismiss();
                this.setState({
                    uUserTypeData: res,
                })
            }, (error) => {
                this.getLoading() && this.getLoading().dismiss();
            });
        }

    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {uUserTypeData} = this.state;
        return (
            <View style={styles.container}>
                {!_.isEmpty(uUserTypeData) ?
                    <FlatList
                        ListHeaderComponent={this._header}
                        ListFooterComponent={this._footer}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => item.keyName}
                        getItemLayout={(data, index) => ({length: 100, offset: (100 + 2) * index, index})}
                        data={uUserTypeData}/> : <View/>}

                <Loading ref={'loading'}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(RegisterUserTypeView);