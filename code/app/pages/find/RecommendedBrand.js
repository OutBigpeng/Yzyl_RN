/*
 *
 * 分类页面
 *
 * */
'use strict';
import React, {PureComponent} from "react";
import {Image, ListView, Platform, StyleSheet, Text, View} from "react-native";
import {_, borderColor, Colors, connect, deviceWidth, PlatfIOS, px2dp, Sizes} from "../../common/CommonDevice";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {scaleSize} from "../../common/ScreenUtil";

let cols = 3;
//图片尺寸大小为90*215
let imgW = (deviceWidth - (cols - 1)) / cols;
let imgH = (imgW * 90) / 215;
let cellH = PlatfIOS ? 60 : imgH + 1;
let cellW = deviceWidth / cols;

class RecommendedBrand extends PureComponent {

// 构造
    constructor(props) {
        super(props);
        // 初始状态
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds
        };
    }

    render() {
        const {type} = this.props;
        let obj = type ? this.props.state.Home.homeRecommendData : this.props.state.Find.BrandData;
        return (
            <View style={[styles.container,{marginBottom: scaleSize(10),} ]}>
                {!_.isEmpty(obj) ?
                    <View style={{  }}>
                        <Text style={{
                            color: Colors.textColor,
                            fontSize: px2dp(Sizes.listSize),
                            padding: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: Colors.line
                        }}>{type ? '推荐品牌' : '品牌产品'}</Text>
                        <ListView
                            dataSource={this.state.dataSource.cloneWithRows(obj)}
                            renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, sectionId, rowId)}
                            contentContainerStyle={styles.ListViewStyle}
                            enableEmptySections={true}
                            removeClippedSubviews={false}
                        />
                    </View>
                    :
                    <View/>}
            </View>
        );
    };

    //单独的cell
    renderRow(rowData, sectionId, rowId) {
        return (
            <View style={[styles.imageDataStyle, {
                borderLeftWidth: (rowId * 1 % cols === 0) || rowId * 1 !== 0 ? 1 : 0,
                borderLeftColor: Colors.line,
            }]}>
                <ATouchableHighlight onPress={() => this.pushToSearch(rowData)}>
                    <Image source={{uri: rowData.imgurl}} style={styles.iconStyle}
                           resizeMode={Image.resizeMode.contain}/>
                </ATouchableHighlight>
            </View>
        )
    }

    /**
     *Home: { id: 1,
I/ReactNativeJS( 5546):   imgurl: 'http://qntest.images.youzhongyouliao.com/Fgp6gqVPQSBxrxiGyWEJC9QH9NTc',
I/ReactNativeJS( 5546):   userid: 11,
I/ReactNativeJS( 5546):   status: 1,
I/ReactNativeJS( 5546):   listorder: 1 }
     pro:
     { id: 4,
I/ReactNativeJS( 5546):   name: '大连金鼎祥',
I/ReactNativeJS( 5546):   imgurl: 'http://qntest.images.youzhongyouliao.com/FoD8ZUsyOe_h8km6uzUB46H4gEMs',
I/ReactNativeJS( 5546):   userid: 7 }

     * @param rowData
     */
    pushToSearch(rowData) {
        // if (this.props.type) {
        if (rowData.userid || rowData.id) {
            const {navigate} = this.props.navigation;
            let {type} = this.props;
            (rowData.userid && rowData.userid !== 0 ? navigate('HomeAbstractView', {
                page: type === 1 ? 'home' : 'proBrand',
                id: rowData.userid,
                brandid: type === 1 ? null : rowData.id,
                type: 1
            }) : "")
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },

    ListViewStyle: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        borderTopWidth: Platform.OS === 'ios' ? 1 : 0.2,
        borderTopColor: borderColor,
        width: deviceWidth,
        backgroundColor: 'transparent'
    },

    imageDataStyle: {
        width: cellW,
        height: ((deviceWidth - (cols - 1)) / cols * 90) / 215 + 1,
        // marginLeft: vMargin,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.line,
    },

    iconStyle: {
        width: (deviceWidth - (cols - 1)) / cols,// : cellW - vMargin * cols   90
        height: ((deviceWidth - (cols - 1)) / cols * 90) / 215,// : 43
        backgroundColor: 'white',
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(RecommendedBrand);