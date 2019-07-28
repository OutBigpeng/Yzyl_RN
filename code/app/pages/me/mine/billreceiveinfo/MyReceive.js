/**我的收货人、发票收货人
 * Created by Monika on 2016/12/27.
 */
'use strict';
import React, {Component} from "react";
import {
    Alert,
    AsyncStorage,
    Image,
    InteractionManager,
    ListView,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from "react-native";
import EditReceiveAddress from "./EditReceiveAddress";
import * as ShowAddressAction from "../../../../actions/ShowAddressAction";
import ActionLoading from "../../../../common/ActionLoading";
import {
    _,
    BGColor,
    BGTextColor,
    bindActionCreators,
    borderColor,
    borderRadius,
    Colors,
    connect,
    deviceWidth, PlatfIOS,
    px2dp,
    Sizes,
    textHeight,
    Loading
} from "../../../../common/CommonDevice";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";
import {NoDataView} from '../../../../component/CommonAssembly'

class MyReceive extends Component {

    // 构造
    constructor(props) {
        super(props);
        let dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        // 初始状态
        this.state = {
            dataSource: dataSource,
            itemData: {},
            userId: 0,
            type: this.props.navigation.state.params.type,
        };
    }

    componentDidMount() {
       this.NetWork()
    }

    NetWork(){
        const {navigate} = this.props.navigation;
        AsyncStorage.getItem(USERID, (error, id) => {
            let userId = JSON.parse(id);
            this.props.actions.fetchAddressListIfNeeded(this.state.type, userId, this.props.navigation,true);
            this.setState({
                userId: userId,
            });
        })
    }

    componentWillUnmount() {
        this.props.state.ShowAddress.isLoading = true;
        this.props.state.ShowAddress.listData = [];
    }

    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let title = '收货人管理';
        let addBtn = '新增收货人地址';
        if (this.state.type == 2) {
            title = '发票收件人管理';
            addBtn = '新增发票收件地址';
        }
        return (
            <View style={styles.container}>
                {this.props.state.ShowAddress.isLoading ?
                    <ActionLoading/> :
                    !_.isEmpty(this.props.state.ShowAddress.listData) ?
                        <ListView
                            dataSource={this.state.dataSource.cloneWithRows(this.props.state.ShowAddress.listData)}
                            renderRow={(rowData) => this.renderRow(rowData)}
                            contentContainerStyle={styles.listView}
                            enableEmptySections={true}
                        /> :
                        <View style={{flex:1}}>
                            <NoDataView title = '收货地址' onPress={()=>this.NetWork}/>
                        </View>

                }
                <ATouchableHighlight  onPress={() => this.addAddress(addBtn)}>
                    <View
                        style={styles.addView}>
                        <Text style={{color: 'white', fontSize:px2dp(Sizes.titleSize)}}>{addBtn}</Text>
                    </View></ATouchableHighlight>
                <Loading ref={'loading'} />
            </View>
        )
    }

    renderRow(rowData) {
        return (
            <ATouchableHighlight  onPress={() => this.editAddress(rowData)}>
                <View style={styles.itemView}>
                    <View style={styles.itemTitle}>
                        <Text style={styles.itemTitleText}>{rowData.name} {rowData.mobile} </Text>
                        <Text
                            style={[styles.tv, {marginTop: 5}]}>{rowData.province}{rowData.pcc}{rowData.county}{rowData.address}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <ATouchableHighlight  style={{padding: 5, alignSelf: 'center'}}
                                            onPress={() => this.setDefault(rowData)}>
                            <View style={{flexDirection: 'row', alignItems: 'center', padding: 2}}>
                                {rowData.id == this.props.state.ShowAddress.selectData ?
                                    <Image source={require('../../../../imgs/shop/select.png') }
                                           style={styles.imageStyle}
                                           resizeMode={Image.resizeMode.stretch}
                                    /> :
                                    <Image source={require('../../../../imgs/shop/unselected.png') }
                                           style={styles.imageStyle}
                                           resizeMode={Image.resizeMode.stretch}/>}
                                { this.props.state.ShowAddress.selectData == rowData.id ?
                                    <Text style={[styles.tv, {}]}> 默认地址</Text> :
                                    <Text style={[styles.tv, {}]}> 设为默认</Text>}
                            </View>
                        </ATouchableHighlight>
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
                            {this.editView(require('../../../../imgs/me/edit.png'), "编辑", () => this.editAddress(rowData))}
                            {this.editView(require('../../../../imgs/me/delete.png'), "删除", () => this.delAddress(rowData))}
                        </View>
                    </View>
                </View>
            </ATouchableHighlight>
        )
    }

    editView(img, name, onPress) {
        return (
            <ATouchableHighlight onPress={onPress}>
                <View style={{flexDirection: 'row', padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={img} style={{width: 18, height: 18}}
                           resizeMode={Image.resizeMode.stretch}/>
                    <Text style={styles.tv}> {name}</Text>
                </View>

            </ATouchableHighlight>
        )
    }

    setDefault(rowData) {
        const {navigate} = this.props.navigation;
        this.props.actions.fetchSetDefaultIfNeeded(this.state.type, this.state.userId, rowData.id, this.state.isSelect, this.props.navigation);
    }

    delAddress(rowData) {
        const {navigate} = this.props.navigation;
        Alert.alert("温馨提示", "确定要删除当前地址？", [
            {text: '取消', onPress: () => console.log('Cancel Pressed!')},
            {
                text: '确定', onPress: () => {
                this.setState({
                    // modalVisible: true,
                    itemData: rowData,
                });
                this.props.actions.fetchDelAddressIfNeeded(this.state.type, this.state.userId, this.state.itemData.id, true, this.props.navigation);
            }
            },
        ])
    }

    editAddress(rowData) {
        const {navigate} = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            navigate('EditReceiveAddress', {
                name: 'EditReceiveAddress',
                title: this.state.type == 2 ? '编辑发票收件人' : '编辑收货人',
                headerRight: '删除',
                type: this.state.type,
                page: 'edit',
                itemRow: rowData,
                userId: this.state.userId,
                isSelect: (rowData.id == this.props.state.ShowAddress.selectData) || false,
            });
        })
    }

    addAddress() {
        const {navigate} = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            navigate('EditReceiveAddress', {
                name: 'EditReceiveAddress',
                title: this.state.type == 2 ? '新增发票收件人' : '新增收货人',
                type: this.state.type,
                page: 'add',
                userId: this.state.userId,
            });
        })
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
        marginBottom: 150,
        marginTop: 5
    },
    itemView: {
        flexDirection: 'column',
        marginBottom: 10,
        backgroundColor: 'white'
    },
    itemTitle: {
        flexDirection: 'column',
        padding: 8,
        borderBottomColor: borderColor,
        borderBottomWidth: 1
    },

    itemTitleText: {
        color: 'black',
        fontSize: px2dp(Sizes.listSize),
        paddingBottom: 2
    },
    addView: {
        margin: 8,
        borderRadius: borderRadius,
        borderColor: borderColor,
        alignItems: 'center',
        backgroundColor: BGTextColor,
        height: textHeight,
        justifyContent: 'center',
    },
    tv: {
        color: Colors.contactColor,
        fontSize: px2dp(Sizes.searchSize),
        paddingLeft: 2
    },

    imageStyle: {
        width: 19,
        height:  19,
    }

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(ShowAddressAction, dispatch)
    })
)(MyReceive);