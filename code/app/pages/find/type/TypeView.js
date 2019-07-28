/**分类——类型一
 * Created by coatu on 2016/12/28.
 */
import React, {Component} from "react";
import {Image, InteractionManager, ListView, StyleSheet, Text, View} from "react-native";
import {
    BGColor,
    borderColor,
    Colors,
    deviceHeight,
    deviceWidth,
    Loading,
    MobclickAgent,
    px2dp,
    Sizes
} from "../../../common/CommonDevice";
import {typeById} from "../../../dao/FindDao";
import TypeDetail from "./TypeDetailView";
import ATouchableHighlight from "../../../component/ATouchableHighlight";

export default class TypeView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds
        };
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => this.renderRow(rowData)}
                    contentContainerStyle={styles.ListViewStyle}
                    enableEmptySections={true}
                    style={{marginTop: 10}}
                />
                <Loading ref={'loading'}/>
            </View>
        )
    }

    renderRow(rowData) {
        return (
            <ATouchableHighlight onPress={() => this.pushToTypeDetail(rowData)}>
                <View style={styles.allViewStyle}>
                    <View style={styles.leftViewStyle}>
                        <Text style={{fontSize: px2dp(Sizes.listSize), color: Colors.titleColor}}>{rowData.name}</Text>
                        <Text numberOfLines={1}
                              style={{
                                  marginTop: 5,
                                  fontSize: px2dp(Sizes.searchSize),
                                  color: 'gray',
                              }}>{rowData.secondStr}</Text>
                    </View>

                    <View>
                        <Image source={require('../../../imgs/other/right_arrow.png')}
                               style={{width: 10, height: 15, marginLeft: 8}}/>
                    </View>
                </View>
            </ATouchableHighlight>
        )
    }

    pushToTypeDetail(rowData) {
        //获取数据
        const {navigate} = this.props.navigation;
        let data = {'name': rowData.name};
        MobclickAgent.onEvent("uz_Type", data);
        InteractionManager.runAfterInteractions(() => {
            navigate('TypeDetail', {
                name: 'TypeDetail',
                title: rowData.name,
                id: rowData.id,
                rightImageSource: true
            })
        });
    }

    componentDidMount() {
        this.props.navigation.setParams({
            rightOnPress: this.navigatePress,
        });
        const {navigate} = this.props.navigation;
        let data = {};
        this.getLoading().show();
        typeById(data, this.props.navigation, (res) => {
            this.getLoading().dismiss();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(res)
            })
        }, (error) => {
            this.getLoading().dismiss();
        })
    }

    navigatePress = () => {
        const {navigate} = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            navigate('SearchFirstView', {
                name: "SearchFirstView",
                paged: 5,
                selectItem: "Pro",
                rightImageSource: true
            })
        });
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: BGColor,
        height: deviceHeight,
        width: deviceWidth
    },

    allViewStyle: {
        width: deviceWidth,
        backgroundColor: 'white',
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    leftViewStyle: {
        width: deviceWidth - 70
    }
});