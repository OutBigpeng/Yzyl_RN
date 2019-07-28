/**
 * Created by coatu on 2017/8/22.
 */
import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native'

import {
    _,
    bindActionCreators,
    borderRadius,
    Colors,
    connect,
    deviceWidth,
    PlatfIOS,
    px2dp,
    Sizes
} from '../../common/CommonDevice'
import *as HomeAction from '../../actions/HomeAction'
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {StyleSheet} from "../../themes";
import {scaleSize} from "../../common/ScreenUtil";
import {toastShort} from "../../common/ToastUtils";

let isClick = 1;

class CommonArticleTypeView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            listData: this.props.listData || [],
            selectedLabel: '',
        };
        this.selectedView;
    }

    render() {
        const {listData,} = this.state;
        const {homeSelectedLabel, technicalSelectedLabel, newSelectedLabel, newSelectedLabelName} = this.props.state.Home;
        const {selectCoatingLabelList, selectCoatingLabel, selectCoatingChildLabel, isClickRefreshing} = this.props.state.CoatingUniversity;
        if (this.props.viewType === 'Home') {
            this.selectedView = homeSelectedLabel
        } else if (this.props.viewType === 'Coating') {
            this.selectedView = selectCoatingLabel.value;
            this.childLabel = selectCoatingChildLabel.value
        } else {
            this.selectedView = newSelectedLabel
        }
        let isCoating = this.props.viewType === 'Coating';

        return (
            <View style={styles.container}>
                {!_.isEmpty(listData) ?
                    <View
                        style={[styles.bottomLine, {width: '100%', height: scaleSize(90),}, !isCoating && {
                            marginTop: scaleSize(10),
                            backgroundColor: 'white'
                        }]}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            horizontal={true}
                            minWidth={deviceWidth}
                            contentContainerStyle={[styles.scrollViewStyle]}>
                            <View style={[styles.ViewStyle, isCoating && {backgroundColor: '#F6F6F6'}]}>
                                {
                                    listData.map((item, i) => {
                                        let keyValue = item.value;
                                        return (
                                            <ATouchableHighlight key={i}
                                                                 onPress={/*isClickRefreshing?null:*/() => this.switchType(isCoating, item)}>
                                                <View style={[styles.boxViewStyle, isCoating ? {
                                                    borderBottomWidth: scaleSize(4),
                                                    paddingVertical: scaleSize(PlatfIOS?10:8),
                                                    borderBottomColor: this.selectedView === keyValue ? Colors.redColor : Colors.transparent,
                                                } : {
                                                    paddingVertical: scaleSize(PlatfIOS?10:5),
                                                    borderRadius: borderRadius,
                                                    borderWidth: 1,
                                                    borderColor: this.selectedView === keyValue ? Colors.transparent : Colors.inputColor,
                                                    backgroundColor: this.selectedView === keyValue ? Colors.redColor : Colors.transparent
                                                }]}>
                                                    <Text numberOfLines={1}
                                                          style={[isCoating ? {fontSize: px2dp(PlatfIOS ? 16 : 15)} : styles.textStyle, {color: this.selectedView === keyValue ? (isCoating ? '#353535' : 'white') : isCoating ? '#999999' : Colors.contactColor,}]}>{keyValue}</Text>
                                                </View>
                                            </ATouchableHighlight>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View> : <View/>}
                {isCoating && selectCoatingLabel.subList && !_.isEmpty(selectCoatingLabel.subList) &&
                <View style={[styles.viewbg, styles.bottomLine, {
                    marginBottom: scaleSize(10),
                    paddingVertical: scaleSize(6)
                }]}>
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        horizontal={true}
                        minWidth={deviceWidth}
                        contentContainerStyle={[styles.scrollViewStyle]}
                    >
                        <View style={[styles.ViewStyle, {}]}>
                            {selectCoatingLabel.subList.map((item, j) => {
                                let keyValue = item.value;
                                return (
                                    <ATouchableHighlight key={j}
                                                         onPress={/*isClickRefreshing?null:*/() => this.switchType(isCoating, selectCoatingLabel, item)}>
                                        <View style={[styles.boxViewStyle, {
                                            paddingVertical: scaleSize(15),

                                        }]}>
                                            <Text numberOfLines={1}
                                                  style={[{
                                                      textAlign: 'center',
                                                      fontSize: px2dp(Sizes.listSize),
                                                      color: this.childLabel === keyValue ? Colors.redColor : Colors.titleColor,
                                                  }]}>{keyValue}</Text>
                                        </View>
                                    </ATouchableHighlight>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>}
            </View>
        )
    }

    /**
     *
     * @param item 大对象
     * @param selectObj 小对象
     */
    switchType(isCoating, item, selectObj) {
        if (isCoating) {
            if (!item.subList && _.isEmpty(item.subList)) {
                this.compareObject(item, selectObj, selectObj && selectObj.value);
            } else {
                if (item.subList && !_.isEmpty(item.subList)) {
                    this.compareObject(item, selectObj, this.childLabel);
                } else {
                    this.props.callBacks(item, selectObj);
                }
            }
            // this.props.callBacks(item, selectObj);
        } else {
            this.props.callBacks(item, this.props.viewType, selectObj);
        }
    }

    compareObject(item, selectObj, tValue) {
        const {coatingKey} = this.props.state.CoatingUniversity;
        let key = `${item.value}-${selectObj && selectObj.value ? selectObj.value : tValue}`;
        if (key !== coatingKey) {
            this.props.callBacks(item, selectObj);
        } else {
            // toastShort('点了相同的呢。。')
        }
    }
}

const styles = StyleSheet.create({
    container: {},
    bottomLine: {
        borderBottomWidth: scaleSize(1),
        borderBottomColor: Colors.line,
    },
    viewbg: {
        width: deviceWidth,
        backgroundColor: 'white',
    },
    scrollViewStyle: {},

    ViewStyle: {
        flexDirection: "row",
        alignItems: "center",
    },

    textStyle: {
        textAlign: 'center',
        fontSize: PlatfIOS ? px2dp(Sizes.listSize) : px2dp(Sizes.searchSize),
    },

    boxViewStyle: {
        marginHorizontal: scaleSize(8),
        // ios: {
        paddingHorizontal: scaleSize(15),
        // },
        alignItems: 'center',
        justifyContent: 'center',
        // android: {paddingHorizontal: scaleSize(12), paddingVertical: scaleSize(10)},
    }
});


export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        // findAction: bindActionCreators(FindAction, dispatch),
        HomeAction: bindActionCreators(HomeAction, dispatch),

    })
)(CommonArticleTypeView);