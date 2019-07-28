import React, {Component} from 'react';
import {PixelRatio, Text, TextInput, View} from 'react-native';
import {deviceWidth, PlatfIOS} from "../common/CommonDevice";
import {cloneObj, px2dp} from "../common/CommonUtil";
import ATouchableHighlight from "../component/ATouchableHighlight";
import FotAwesome from "react-native-vector-icons/FontAwesome";
import {scaleSize} from "../common/ScreenUtil";
import {StyleSheet} from '../themes/index'

let data = [];
export default class CustomCustomerInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            focused: false,
            height: 34,
        }
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    onContentSizeChange(event) {
        let height = event.nativeEvent.contentSize.height;
        height <= scaleSize(180) && this.setState({height: height});

    }

    render() {
        let {value = ''} = this.state;
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.inputRow}>
                {/*{this.clickInputType(1, "@")}*/}
                {/*{this.clickInputType(2, "chain")}*/}
                <View style={styles.searchRow}>
                    <TextInput
                        ref="input"
                        style={[styles.searchInput, {
                            height: Math.min(Math.max(this.state.height, 34), 100),
                            // width: deviceWidth - deviceWidth / 5.5
                        }]}
                        value={value}
                        editable={true}
                        multiline={true}
                        onFocus={this.handleFocusSearch.bind(this)}
                        onBlur={this.handleBlurSearch.bind(this)}
                        onContentSizeChange={this.onContentSizeChange.bind(this)}
                        onChangeText={this.handleChangeText.bind(this)}
                        underlineColorAndroid='transparent'
                        onSubmitEditing={() => this.refs.input.focus()}
                        placeholder={'发送消息'}
                    />
                </View>
                {this._renderSendButton()}
            </View>

        );
    }


    handleFocusSearch() {
        this.setState({
            focused: true,
        });
        this.props.handleFocusSearch();
    }

    handleBlurSearch() {
        this.setState({focused: false})
    }

    handleChangeText(v) {
        this.setState({value: v});
    }

    // aa(data) {
    //     let arr = data.map((item) => {
    //         return item.content;
    //     })
    //     this.setState({
    //         value: arr.join('')
    //     });
    // }

    _renderSendButton() {
        const {focused} = this.state;

        return focused ? (
            <ATouchableHighlight style={styles.searchExtra} onPress={() => {

                this.props.handleSend(this.state.value, cloneObj(data), () => {
                    data = [];
                    this.handleChangeText("")
                });
            }}>
                <Text style={styles.sendText}>发送</Text>
            </ATouchableHighlight>
        ) : null;
    }

    handleSend() {
        this.setState({
            // textContent: this.refs['CustomViews'].matchContentString(this.state.value),
            value: ''
        })
    }


    onClick(type, str) {
        let arrayFilter = data.filter(function (item) {
            return item.content.trim() == str.trim();
        });
        alert(type + JSON.stringify(arrayFilter));
    }

    clickInputType(type, s) {
        return (
            <ATouchableHighlight style={styles.button} onPress={() => {
                switch (type) {
                    case 1://"@"
                        //[ { name: '华志宾嘿嘿嘿', id: 2 }, { name: '13699551210', id: 108 } ]
                        this.jumpFollow((res) => this.callback(res, type));
                        break;
                    case 2://#
                        /**
                         * [ { name: '我在测试链接文章',
    sn: 'f601b9943f26d6ed66975c163fa4d184',
    type: 3 },{ name: '测试图片', sn: '0c68ccec53061e93323c48b3fd16a636', type: 4 },
                         { name: '世界之问的中国答案', sn: 3, type: 10 } ]
                         * */
                        this.jumpList((res) => this.callback(res, type));
                        break;
                    case 3:
                        break;
                    default:
                        break;
                }
            }}>
                <FotAwesome name={s} size={20} style={[{padding: 10}]}/>
            </ATouchableHighlight>)
    }

    callback(res, type) {
        let temp = "";
        data = data.concat(res);
        res.forEach((item) => {
            if (item && item.name) {
                item.content = type == 1 ? `@${item.name.trim()};` : `#${item.name.trim()}#`;
                temp += item.content || "";
            }
        });
        this.setState({
            value: `${this.state.value}${temp}`
        });
        this.refs['input'].focus();
    }

    jumpList(callback) {
        const {navigate} = this.props.navigation;
        navigate('SearchPdAndArticleListView', {
                title: '搜索',
                callback: (res) => callback(res)
            }
        );
    }

    jumpFollow(callback) {
        const {navigate} = this.props.navigation;
        navigate('MyFollowView', {
                title: '@ 谁',
                rightTitle: '完成',
                leftTitle: '取消',
                callback: (res) => callback(res)
            }
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15
    },
    inputRow: {
        paddingHorizontal: 12,
        flexDirection: 'row',
        paddingVertical: 12,
        marginTop: 5,
        backgroundColor: 'white',
        borderTopWidth: PixelRatio.roundToNearestPixel(0.4),
        borderTopColor: 'rgba(173, 185, 193, 0.5)',
        // position:'absolute',
        // bottom:0
    },
    searchRow: {
        flex: 1,
        backgroundColor: 'white',
    },
    searchInput: {
        borderRadius: scaleSize(6),
        fontSize: px2dp(13),
        paddingHorizontal: scaleSize(24),
        // textAlign:'center',
        paddingVertical: scaleSize(15),
        borderWidth: PixelRatio.roundToNearestPixel(0.4),
        borderColor: 'rgba(190, 190, 190, 1)',
        // alignItems: 'center',
        ios: {
            paddingTop: scaleSize(20)
        }
    },
    searchExtra: {
        justifyContent: 'center',
    },
    sendText: {
        color: 'rgba(0, 186, 110, 1)',
        paddingLeft: 10,
        paddingVertical: 8,
        fontSize: px2dp(PlatfIOS ? 15 : 13)
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 4,
        paddingBottom: 2,
        paddingHorizontal: 8,
        borderBottomWidth: PixelRatio.roundToNearestPixel(0.4),
        borderBottomColor: 'rgba(173, 185, 193, 0.5)',
    },
    iconTouch: {
        padding: 8,
    },
    searchIcon: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    searchFocus: {
        flex: 0,
        width: 20,
        alignItems: 'center',
    },
});