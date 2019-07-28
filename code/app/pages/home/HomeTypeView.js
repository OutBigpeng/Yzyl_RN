/**
 * 主页分类  tab
 * Created by coatu on 2017/8/22.
 */

import React, {PropTypes, PureComponent} from 'react';
import {Image, InteractionManager, Platform, StyleSheet, Text, View} from 'react-native'

import {Colors, deviceWidth, PlatfIOS, Sizes} from '../../common/CommonDevice'
import {px2dp} from "../../common/CommonUtil";
import MobclickAgent from "rn-umeng";
import ATouchableHighlight from "../../component/ATouchableHighlight";

let cols = 4;
let cellH = Platform.OS === 'ios' ? 75 : 50;
let cellW = Platform.OS === 'ios' ? deviceWidth / 4 : deviceWidth / 4 - 2;
let vMargin = (deviceWidth - cellW * cols) / (cols + 1) - 1;

export default class HomeTypeView extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        AllHeight: PropTypes.number,
        BGColor: PropTypes.string,
        isImage: PropTypes.bool,
        itemArray: PropTypes.array,
        boxHeight: PropTypes.number,
        titleColor: PropTypes.string,
        Margins: PropTypes.number
    };
    static defaultProps = {
        itemArray: []
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const {title, AllHeight, BGColor, isImage, itemArray, boxHeight, titleColor, MarginTop, MarginBottom} = this.props;
        let data = itemArray.slice(1);
        let firstItem = itemArray[0];
        return (
            <View style={[styles.container, {
                backgroundColor: BGColor,
                height: AllHeight,
                marginTop: MarginTop,
                marginBottom: MarginBottom,
            }]}>
                {/*左边*/}
                <ATouchableHighlight style={{
                    flex: 1,
                }} onPress={() => {
                    if (this.props.newOnPress) {
                        this.props.newOnPress();
                    } else {
                        this.jumpPage(firstItem);
                    }
                }}>
                    <View style={styles.leftViewStyle}>
                        {isImage ? <Image
                            source={firstItem.imgUrl ? {uri: firstItem.imgUrl} : require('../../imgs/other/chongxinjiazai.png')}
                            style={styles.leftImageStyle}/> : <View/>}
                        <Text numberOfLines={2}
                              style={[styles.leftTextStyle, {color: titleColor}]}>{firstItem.name || firstItem.keyword}</Text>
                    </View>
                </ATouchableHighlight>

                {/*右边*/}
                <View style={styles.rightViewStyle}>
                    {data.map((item, i) => {
                        return (
                            <ATouchableHighlight key={i} onPress={() => this.jumpPage(item)}>
                                <View style={[styles.rightBoxViewStyle, {height: boxHeight}]}>
                                    {isImage ? <Image
                                        source={item.imgUrl ? {uri: item.imgUrl} : require('../../imgs/other/chongxinjiazai.png')}
                                        style={styles.leftImageStyle} resizeMode={Image.resizeMode.contain}/> : null}
                                    <Text numberOfLines={2}
                                          style={[styles.leftTextStyle, {color: titleColor}]}>{item.name || item.keyword}</Text>
                                </View>
                            </ATouchableHighlight>
                        )
                    })}
                </View>
            </View>
        )
    }

    jumpPage(item = {}) {
        const {navigate} = this.props.navigation;
        if (this.props.viewType && this.props.viewType === 'Home') {
            let data = JSON.parse(item.linkParam);
            switch (item.type) {
                case "switch":
                    switch (item.index) {
                        // case 5:
                        //     this.props.callback(2, item);
                        //     break;
                        default:
                            // data.value = item.name || ""; //参数{"index":3,"id": 11};pIndex:4,pChildIndex:0
                            this.props.callback(data.index, data);//data:{ index: 3, id: 11, name: '配方' }
                            break;
                    }
                    break;
                case "localPage":
                    // let data = {"name":"NewsView","params":{"title":"新闻"}};
                    //新修改params 为 添加一个label  label 后台可以自己配  {"title":"新闻",'label':'js'}
                    navigate(data.name, data.params);
                    break;
                case "webLink"://跳转链接
                    navigate('TopScrollWebView', {
                        title: item.name,
                        name: 'TopScrollWebView',
                        linkurl: item.linkParam
                    });
                    break;
                case "webContent"://富文本
                    navigate('AgreementView',
                        {
                            name: 'AgreementView',
                            title: item.name,
                            agreementName: item.linkParam,
                        });
                    break;
                default:
                    break;
            }
        } else {
            item.keyword && this.jumpSeach(item);
        }
    }

    jumpSeach(temp) {
        let item = temp;
        const {navigate} = this.props.navigation;
        let data = {'name': item.keyword};
        MobclickAgent.onEvent("yz_resou", data);
        InteractionManager.runAfterInteractions(() => {
            navigate('SearchFirstView', {
                name: "SearchFirstView",
                paged: 5,
                selectItem: "Pro",
                bname: item.keyword,
                rightImageSource: true,
                isAutoFocus: false
            });
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 150,
        borderBottomWidth: 1,
        borderBottomColor: Colors.line
    },

    leftViewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    leftImageStyle: {
        width: PlatfIOS ? 45 : 30,
        height: PlatfIOS ? 45 : 30,
        marginBottom: 5,
        // backgroundColor:'red'
        // borderRadius: borderRadius,
        // resizeMode: 'contain'
    },

    leftTextStyle: {
        fontSize: px2dp(Sizes.searchSize),
        alignSelf: 'center',
        marginLeft: 8,
        marginRight: 8
    },

    rightViewStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        flex: Platform.OS == 'ios' ? 3 : 2.88,
    },

    rightBoxViewStyle: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.line,
        width: cellW,
        height: cellH,
        // marginLeft: vMargin,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: Colors.line
    }
});