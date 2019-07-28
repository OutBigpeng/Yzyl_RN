/**分类——类型二
 * Created by coatu on 2016/12/28.
 */
import React, {Component} from 'react';
import {InteractionManager, ListView, Platform, ScrollView, StyleSheet, Text, View} from 'react-native'

import {
    BGColor,
    BGTextColor,
    bindActionCreators,
    borderColor,
    connect,
    deviceHeight,
    deviceWidth,
    MobclickAgent,
    px2dp,
    Sizes
} from '../../../common/CommonDevice';
import * as TypeDetailAction from '../../../actions/TypeAction';
import LoadingView from '../../../common/ActionLoading';
import ATouchableHighlight from "../../../component/ATouchableHighlight";

const ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2
});
const ds1 = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2
});

class TypeDetailView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds
        };
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.state.Type.isLoading ? <LoadingView/> :
                    <View style={{flexDirection: 'row', height: deviceHeight, width: deviceWidth}}>
                        <ScrollView style={{width: 130}}>
                            <ListView
                                dataSource={ds.cloneWithRows(this.props.state.Type.typeDetailData)}
                                renderRow={(rowData) => this.renderRow(rowData)}
                                contentContainerStyle={styles.listViewStyle}
                                enableEmptySections={true}
                            />
                        </ScrollView>

                        <ScrollView style={{width: deviceWidth - 130}}>
                            <ListView
                                dataSource={ds.cloneWithRows(this.props.state.Type.rightData)}
                                renderRow={(rowData) => this.renderRow1(rowData)}
                                contentContainerStyle={styles.listTwoViewStyle}
                                enableEmptySections={true}
                            />
                        </ScrollView>
                    </View>}
            </View>
        )
    }

    renderRow(rowData) {
        let isSelected = rowData.pname === this.props.state.Type.pname;
        return (
            <ATouchableHighlight onPress={() => this.getRightData(rowData)}>
                <View style={[styles.leftViewStyle, {backgroundColor:isSelected? '#rgba(214,214,214,1)': 'white'}]}>
                    {isSelected&&<View style={styles.leftBgView}/>}
                    <Text style={[{ fontSize: px2dp(Sizes.searchSize)},isSelected&&{color: BGTextColor}]}>{rowData.pname}</Text>
                </View>
            </ATouchableHighlight>
        )
}

    renderRow1(rowData) {
        return (
            <ATouchableHighlight onPress={() => this.pushToSearch(rowData)}>
                <View style={styles.RightViewStyle}>
                    <Text style={{fontSize: px2dp(Sizes.searchSize)}}>{rowData.name}</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    pushToSearch(rowData) {
        const {navigate} = this.props.navigation;
        let data = {'name': rowData.name};
        MobclickAgent.onEvent("yz_rightTypeDetail", data);
        InteractionManager.runAfterInteractions(() => {
            navigate('SearchFirstView', {
                name: "SearchFirstView",
                paged: 5,
                selectItem: "Pro",
                categoryid: rowData.id,
                bname: rowData.name,
                rightImageSource: true,
                isAutoFocus:false
            });
            // navigate('ProductListView', {
            //     name: 'ProductListView',
            //     paged: 5,
            //     rightImageSource: true
            // })
        })
    }

    // 获取右边的数据  
    getRightData(rowData) {
        let data = {'name': rowData.name};
        MobclickAgent.onEvent("yz_leftTypeDetail", data);
        this.props.actions.fetchTypeRightDetailInfo(rowData, this.props.state.Type.typeDetailData)
    }

    componentDidMount() {
        this.props.navigation.setParams({
            rightOnPress: this.navigatePress,
        });
        const {navigate, state} = this.props.navigation;
        this.props.actions.fetchTypeDetailInfo(state.params.id, this.props.navigation, true)
    }

    navigatePress = () => {
        const {navigate} = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            navigate('SearchFirstView', {
                name: "SearchFirstView",
                paged: 5,
                selectItem: "Pro",
                rightImageSource: true
            });
            // navigate('ProductListView', {
            //     name: 'ProductListView',
            //     paged: 1,
            //     rightImageSource: true
            // })
        });
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: BGColor,
        // flex: 1,
        height: deviceHeight,
        width: deviceWidth
    },

    listViewStyle: {
        backgroundColor: 'white',
        width: 130,
        marginBottom: 80
    },

    leftViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        flexDirection: 'row'
    },
    RightViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
    },
    leftBgView: {
        position: 'absolute',
        left: 0,
        height: 50,
        width: Platform.OS === 'ios' ? 6 : 3,
        backgroundColor: BGTextColor
    }

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(TypeDetailAction, dispatch)
    })
)(TypeDetailView);