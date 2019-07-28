/**
 * Created by Monika on 2018/8/30.
 */


'use strict';
import {
    _,
    BGColor,
    BGTextColor,
    bindActionCreators,
    Colors,
    connect,
    deviceHeight,
    deviceWidth,
    Loading,
    MobclickAgent,
    px2dp,
    Sizes
} from "../../../common/CommonDevice";
import React, {Component} from "react";
import {FlatList, ListView, Platform, StyleSheet, Text, View} from "react-native";
import ATouchableHighlight from "../../../component/ATouchableHighlight";
import {scaleSize} from "../../../common/ScreenUtil";
import {toastShort} from "../../../common/ToastUtils";
import * as TypeDetailAction from "../../../actions/TypeAction";
import {_renderActivityIndicator} from "../../../component/CommonRefresh";
import {NoDataView} from "../../../component/CommonAssembly";

class AllTypeView extends Component {

    renderHeadRow = ({item}) => {
        let {secondStr, name} = item;
        let {selectHeadName} = this.props.state.Type;
        let isSelected = selectHeadName === name;
        return (
            <View style={{
                backgroundColor: 'white',
                marginBottom: scaleSize(10),
            }}>
                <ATouchableHighlight onPress={() => this.pushToTypeDetail(item)}
                                     onLongPress={() => {
                                         toastShort(secondStr)
                                     }}>
                    <View style={styles.allViewStyle}>
                        <Text numberOfLines={1}
                              style={{
                                  lineHeight: scaleSize(45),
                                  fontSize: px2dp(Sizes.listSize),
                                  color: isSelected ? Colors.titleColor : '#5A5A5A',
                              }}>{name}</Text>
                        <View style={{
                            marginTop: scaleSize(10),
                            height: scaleSize(5),
                            backgroundColor: isSelected ? BGTextColor : 'transparent',
                            width: '100%'
                        }}/>
                    </View>
                </ATouchableHighlight>
            </View>
        )
    };
    renderLeftRow = ({item}) => {
        let {pname, categories, pid} = item;
        let isSelected = pname === this.props.state.Type.pname;
        return (
            <ATouchableHighlight style={{width: scaleSize(260)}}
                                 onPress={() => {
                                     isSelected ? this.callback({
                                         item: {
                                             id: pid,
                                             name: pname
                                         }, index: 0
                                     }) : this.getRightData(item)
                                 }}>
                <View style={[styles.leftViewStyle, {backgroundColor: isSelected ? '#FFFFFF' : '#F8F8F8'}]}>
                    <Text
                        style={[{fontSize: px2dp(Sizes.searchSize)}, {color: isSelected ? '#212121' : '#646464'}]}>{pname}</Text>
                </View>
            </ATouchableHighlight>
        )
    };
    renderRightRow = ({item, index}) => {
        return (
            <ATouchableHighlight onPress={() => {
                this.callback({item, index})
            }}>
                <View style={styles.RightViewStyle}>
                    <Text style={{fontSize: px2dp(Sizes.searchSize), color: '#212121'}}>{item.name}</Text>
                </View>
            </ATouchableHighlight>
        )
    };
    noData = () => {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        return (
            <NoDataView title="数据" height={{marginTop: 100, height: deviceHeight}}
                        onPress={() => this.getData(userObj)}/>
        )
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            headData: []
        };
    }

    callback(obj) {
        let {state: {params: {callback}}, goBack} = this.props.navigation;
        callback && callback(obj);
        goBack();
    }

    _header() {
        let {typeHeadData, selectHeadName} = this.props.state.Type;
        let initPos = 0;
        typeHeadData.map(({name}, pos) => {
            if (name === selectHeadName) {
                initPos = pos;
            }
        });
        return (
            <View>
                <FlatList
                    key={'topHeadList'}
                    renderItem={this.renderHeadRow}
                    horizontal={true}
                    initialScrollIndex={initPos}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => item.id}
                    getItemLayout={(data, index) => ({length: 100, offset: (100 + 2) * index, index})}
                    data={typeHeadData}/>
            </View>
        )
    }

    /**
     *
     * @returns {*}
     */
    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {typeDetailData = [], rightData = [], isDLoading} = this.props.state.Type;
        return (
            <View style={styles.container}>
                {this._header()}
                {!_.isEmpty(typeDetailData) ?
                    <View style={{flex: 1, flexDirection: 'row',}}>
                        <FlatList
                            key={'leftList'}
                            style={{width:deviceWidth/3, marginRight: scaleSize(5)}}
                            renderItem={this.renderLeftRow}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}-${item.id}`}
                            getItemLayout={(data, index) => ({length: 100, offset: (100 + 2) * index, index})}
                            data={typeDetailData}/>

                        <FlatList
                            key={'rightList'}
                            renderItem={this.renderRightRow}
                            showsVerticalScrollIndicator={false}
                            style={{width: deviceWidth/3*2}}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                            getItemLayout={(data, index) => ({length: 100, offset: (100 + 2) * index, index})}
                            data={rightData}/>
                    </View> : !isDLoading ? _renderActivityIndicator() : this.noData()}
                <Loading ref={'loading'}/>
            </View>
        );
    }

    // 获取右边的数据  
    getRightData(rowData) {
        let data = {'name': rowData.name};
        MobclickAgent.onEvent("yz_leftTypeDetail", data);
        this.props.actions.fetchTypeRightData(rowData)
    }

    pushToTypeDetail(rowData) {
        //获取数据
        let {id, name} = rowData;
        const {navigate} = this.props.navigation;
        let data = {'name': name};
        MobclickAgent.onEvent("uz_Type", data);
        let {typeDetailDataObj = {}} = this.props.state.Type;
        this.props.actions.fetchTypeLeftData(rowData, this.props.navigation, true)
    }

    navigationParams() {
        const {state, navigate} = this.props.navigation;
        this.props.navigation.setParams({
            rightOnPress: () => {
                this.callback({item: {}, index: -1});
                //不限时数据初始化
                setTimeout(() => {
                    this.props.actions.fetchTypeClearData();
                }, 1000)
            },
        });
    }

    componentDidMount() {
        this.navigationParams();
        const {navigate} = this.props.navigation;
        let {typeDetailData = [], rightData = [], isDLoading} = this.props.state.Type;
        if (_.isEmpty(typeDetailData)) {
            this.getLoading().show();
            let that = this;
            this.props.actions.fetchTypeHeadData(this.props.navigation, (id, rowData) => {
                if (id) {
                    this.props.actions.fetchTypeLeftData(rowData, this.props.navigation, true)
                }
                that.getLoading().dismiss();
            })
        }

    }
}

let itemHeight = scaleSize(80);

const styles = StyleSheet.create({
    container: {
        backgroundColor: BGColor,
        flex: 1
    },

    allViewStyle: {
        paddingHorizontal: scaleSize(20),
        paddingTop: scaleSize(40),
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },

    leftViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: itemHeight,
        borderBottomWidth: scaleSize(5),
        borderBottomColor: 'transparent',
        flexDirection: 'row'
    },
    RightViewStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        height: itemHeight,
        marginBottom: scaleSize(5)
    },
    leftBgView: {
        position: 'absolute',
        left: 0,
        height: itemHeight,
        width: Platform.OS === 'ios' ? scaleSize(12) : scaleSize(6),
        backgroundColor: BGTextColor
    }

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(TypeDetailAction, dispatch)
    })
)(AllTypeView);