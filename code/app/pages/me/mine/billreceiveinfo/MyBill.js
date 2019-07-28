/**
 * Created by Monika on 2016/9/13.
 */


'use strict';

import React, {Component} from "react";
import {
    Alert, AsyncStorage, Image, InteractionManager, Linking, ListView, Platform, StyleSheet, Text,
    View
} from "react-native";
import MyBillShow from "./MyBillShow";
import {getBillList, getBillSetDefault, getBillShow} from "../../../../dao/UserBillDao";
import {
    actionBar, BGColor, borderColor, deviceHeight, deviceWidth, isEmptyObject, Loading,
    px2dp
} from "../../../../common/CommonDevice";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import {CustomMobile, CustomPhone} from "../../../../common/CommonUtil";


// let GiftedListView = require('react-native-gifted-listview');

class MyBill extends Component {
    // 构造
    constructor(props) {
        super(props);
        let dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        // 初始状态
        this.state = {
            dataSource: dataSource,
            userId: 0,
            selectData: 0,
            callbackTest: null,
            DataArray: [],
        };
    }

    render() {
        return (
            <View style={styles.container}>
               {/* <GiftedListView
                    style={styles.listView}
                    rowView={(rowData) => this.renderRow(rowData)}
                    onFetch={this._onFetch.bind(this)}
                    firstLoader={true}
                    pagination={true}
                    refreshable={false}
                    withSections={false}
                    enableEmptySections={true}
                    contentContainerStyle={{marginTop: 8}}
                    emptyView={this._renderEmptyView.bind(this)}
                    customStyles={{
                        paginationView: {
                            backgroundColor: 'transparent',
                        },
                    }}
                    refreshableTintColor="gray"
                />*/}
                <Loading ref={'loading'}/>
            </View>
        );
    }

    _renderEmptyView(refreshCallback) {
        return (
            <View style={{
                alignItems: 'center', justifyContent: 'center', width: deviceWidth, height: deviceHeight - actionBar * 2
            }}>
                <Text style={{fontSize: px2dp(Platform.OS === 'ios' ? 18 : 16), color: 'gray'}}>暂无发票信息，请联系客服</Text>
            </View>
        );
    }

    _onFetch(page = 1, callback, options) {
        const {navigate} = this.props.navigation;
        this.setState({
            callbackTest: callback,
        });
        AsyncStorage.getItem(USERID, (error, id) => {
            let userId = JSON.parse(id);
            this.getLoading().show();
            getBillList(userId, this.props.navigation, (result) => {
                this.getLoading().dismiss();
                if (result && !isEmptyObject(result) && result.length > 0) {
                    let tempId = 0;
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].isdefault == 1) {
                            tempId = result[i].id;
                        }
                    }
                    this.setState({
                        userId: userId,
                        selectData: tempId,
                        DataArray: result,
                    });
                    callback(this.state.DataArray, {
                        allLoaded: true,
                    });
                } else {
                    callback(null, {});

                }
            }, (error) => {
                this.getLoading().dismiss();
                callback(null, {});
            });
        })
    }

    getLoading() {
        return this.refs['loading'];
    }

//            <TouchableHighlight onPress={() => this.showDetail(rowData)} underlayColor='transparent'> </TouchableHighlight>
    renderRow(rowData) {
        return (
            <View style={{flexDirection: 'column', marginBottom: 8, backgroundColor: 'white'}}>
                <View style={styles.titleView}>
                    <Text style={styles.titleText}>{rowData.title} </Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <ATouchableHighlight style={{padding: 5, alignSelf: 'center'}}
                                         onPress={() => this.setDefault(rowData)}>
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 2}}>
                            {this.state.selectData == rowData.id ?
                                <Image source={require('../../../../imgs/shop/select.png')}
                                       style={styles.iv}/> :
                                <Image source={require('../../../../imgs/shop/unselected.png')}
                                       style={styles.iv}/>}
                            {this.state.selectData == rowData.id ? <Text style={[styles.tv, {}]}> 默认发票</Text> :
                                <Text style={[styles.tv, {}]}> 设为默认</Text>}
                        </View>
                    </ATouchableHighlight>
                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 3}}>
                        {this.editView(require('../../../../imgs/me/eye.png'), "查看", () => this.showDetail(rowData))}
                        {this.editView(require('../../../../imgs/me/edit.png'), "编辑", () => this.editBill())}
                    </View>
                </View>
            </View>
        )
    }

    editView(img, name, onPress) {
        return (
            <ATouchableHighlight onPress={onPress}>
                <View style={styles.optionsStyle}>
                    <Image source={img}/>
                    <Text style={styles.tv}> {name}</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    editBill() {
        CustomPhone((res) => {
            Alert.alert("温馨提示",  ' 联系客服修改发票信息？      '.concat(res), [
                {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                {text: '确定', onPress: () => Linking.openURL("tel:" + res)},
            ])
        })
    }

    setDefault(rowData) {
        const {navigate} = this.props.navigation;
        this.getLoading().show();
        let data = {'userid': this.state.userId, 'id': rowData.id, 'isdefault': rowData.isdefault === 1 ? 0 : 1};
        getBillSetDefault(data, this.props.navigation, (result) => {
            this.getLoading().dismiss();
            this.setState({
                selectData: this.state.selectData === rowData.id ? 0 : rowData.id
            })
        }, () => {
            this.getLoading().dismiss();
        });
    }

    showDetail(rowData) {
        const {navigate} = this.props.navigation;
        this.getLoading().show();
        getBillShow(this.state.userId, rowData.id, this.props.navigation, (result) => {
            this.getLoading().dismiss();
            InteractionManager.runAfterInteractions(() => {
                navigate('MyBillShow', {
                    title: '我的发票详情',
                    name: 'MyBillShow',
                    showData: result,
                    userId: this.state.userId,
                    id: rowData.id,
                    callBack: this.editCallBack.bind(this)
                });
            });
        }, () => {
            this.getLoading().dismiss();
        });
    }

    editCallBack(data, isRefresh) {
        if (isRefresh) {
            let detail = [].concat(this.state.DataArray);
            //一件很奇怪的事：下面这个循环不要也是可以的。
            detail.map((item, index) => {
                if (item.id === data.id) {
                    detail[index] = data;
                } else {
                    item.isdefault = 0;
                    detail[index] = item;
                }
            });
            this.setState({
                DataArray: detail,
                selectData: this.state.selectData === data.id ? 0 : data.id
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },
    listView: {
        flexDirection: 'column',
        width: deviceWidth,
    },
    optionsStyle: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center'
    },
    titleView: {
        flexDirection: 'column',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: borderColor
    },
    titleText: {
        color: 'black',
        fontSize: px2dp(Platform.OS === 'ios' ? 16 : 14),
        paddingBottom: 2
    },
    tv: {
        color: 'gray',
        fontSize: px2dp(Platform.OS === 'ios' ? 14 : 12),
    },
    iv: {
        width: Platform.OS === 'ios' ? 18 : 16,
        height: Platform.OS === 'ios' ? 18 : 16,
    },
});
export default MyBill;