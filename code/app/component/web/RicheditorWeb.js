/**
 * @flow
 * 使用：
 *
 import RichEditor from './web/RicheditorWeb';
 import KeyboardSpacer from 'react-native-keyboard-spacer';//用来把字体选择放在键盘上面

 <RichEditor onMessage={(e) => {
                    console.log("message_html--", e);
                }}/>
 <KeyboardSpacer/>
 */

import React, {Component} from "react";
import PropTypes from 'prop-types';

import {Alert, Dimensions, Platform, ScrollView, StyleSheet, TouchableOpacity, View, WebView} from "react-native";
import {Alerts, PlatfIOS} from '../../common/CommonDevice'
import ImagePicker from "react-native-image-picker";
import FotAwesome from "react-native-vector-icons/FontAwesome";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import {px2dp} from "../../common/CommonUtil";
import PermissionUtil from "../../common/PermissionUtil";

export const ICON_CHECK = ('check');
export const ICON_UNCHECK = ('uncheck');
export const ICON_KEYBOARD = ("keyboard");

export const ICON_IMAGEFILE = ("image");
export const ICON_BOLD = ("bold");
export const ICON_ITALIC = ("italic");
export const ICON_AT = ("at");
export const ICON_REDO = ('repeat');
export const ICON_UNDO = ("undo");
export const ICON_HEADER1 = ("format-header-1");
export const ICON_HEADER2 = ("format-header-2");
export const ICON_HEADER3 = ("format-header-3");
export const ICON_HEADER4 = ("format-header-4");
export const ICON_UNORDEREDLIST = ('list-ul');
export const ICON_ORDEREDLIST = ('list-ol');
export const ICON_INDENT = ('indent');
export const ICON_OUTDENT = ('outdent');
export const ICON_QUOTE = ("quora");

export default class RicheditorWeb extends Component {//WebViewRichEditor
    static propTypes = {
        atPress: PropTypes.func,//@某人  跳转点击事件  eg:  atPress={this.getAt()}    getAt() {    return  [{name: '优众优料', id: 3}, {name: '谈吐不凡', id: 5}]}
        loadStart: PropTypes.func,//中间会有一些加载较慢问题添加Loading
        loadEnd: PropTypes.func,
        initData: PropTypes.array,//一进来导入的@数据
        showToolBarData: PropTypes.array//想要显示的操作图标
    };
    static defaultProps = {
        showToolBarData: [ICON_IMAGEFILE, ICON_AT, ICON_BOLD, ICON_ITALIC]//默认显示 图片，@，加粗，斜体
    };

    constructor(props) {
        super(props);
        this.state = {
            editorStates: [],
            showToolBar: true,
            editorHtml: ''
        };

        this.onMessage = this.onMessage.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.initCommands = this.initCommands.bind(this);

        this.initCommands();
    }


    initCommands() {
        let tempCommands = [];
        let showToolBarData = this.props.showToolBarData;
        showToolBarData.forEach(function (item) {
            switch (item) {
                case ICON_IMAGEFILE:
                    Platform.select({
                        ios: () => {
                            tempCommands.push({
                                name: 'INSERTLOCALIMAGE', glyph: ICON_IMAGEFILE, command: JSON.stringify({
                                    command: 'insertLocalImage'
                                })
                            });
                        },
                        android: () => {
                            if (Platform.Version >= 19) {
                                tempCommands.push({
                                    name: 'INSERTLOCALIMAGE', glyph: ICON_IMAGEFILE, command: JSON.stringify({
                                        command: 'insertLocalImage'
                                    })
                                });
                            }
                        }
                    })();
                    break;
                case ICON_AT:
                    tempCommands.push({
                        name: 'AT', glyph: ICON_AT, command: JSON.stringify({
                            command: ICON_AT
                        })
                    });
                    break;
                case ICON_BOLD:
                    Platform.select({
                        ios: () => {
                            tempCommands.push({
                                name: 'BOLD', glyph: ICON_BOLD, command: JSON.stringify({
                                    command: "bold"
                                })
                            });
                        },
                        android: () => {
                            if (Platform.Version >= 19) {
                                tempCommands.push({
                                    name: 'BOLD', glyph: ICON_BOLD, command: JSON.stringify({
                                        command: "bold"
                                    })
                                });
                            }
                        }
                    })();
                    break;
                case ICON_ITALIC:
                    Platform.select({
                        ios: () => {
                            tempCommands.push({
                                name: 'ITALIC', glyph: ICON_ITALIC, command: JSON.stringify({
                                    command: "italic"
                                })
                            });
                        },
                        android: () => {
                            if (Platform.Version >= 19) {
                                tempCommands.push({
                                    name: 'ITALIC', glyph: ICON_ITALIC, command: JSON.stringify({
                                        command: "italic"
                                    })
                                });
                            }
                        }
                    })();
                    break;
                case ICON_REDO :
                    tempCommands.push({
                        name: 'REDO', glyph: ICON_REDO, command: JSON.stringify({
                            command: "redo"
                        })
                    });
                    break;
                case ICON_UNDO :
                    tempCommands.push({
                        name: 'UNDO', glyph: ICON_UNDO, command: JSON.stringify({
                            command: "undo"
                        })
                    });
                    break;
                case ICON_HEADER1 :
                    tempCommands.push({
                        name: 'H1', glyph: ICON_HEADER1, command: JSON.stringify({
                            command: "heading1"
                        })
                    });
                    break;
                case ICON_HEADER2 :
                    tempCommands.push({
                        name: 'H2', glyph: ICON_HEADER2, command: JSON.stringify({
                            command: "heading2"
                        })
                    });

                    break;
                case ICON_HEADER3 :
                    tempCommands.push({
                        name: 'H3', glyph: ICON_HEADER3, command: JSON.stringify({
                            command: "heading3"
                        })
                    });

                    break;
                case ICON_HEADER4 :
                    tempCommands.push({
                        name: 'H4', glyph: ICON_HEADER4, command: JSON.stringify({
                            command: "heading4"
                        })
                    });
                    break;
                case ICON_UNORDEREDLIST :
                    Platform.select({
                        ios: () => {
                            tempCommands.push({
                                name: 'UNORDERLIST', glyph: ICON_UNORDEREDLIST, command: JSON.stringify({
                                    command: "unorderList"
                                })
                            });
                        },
                        android: () => {
                            if (Platform.Version >= 19) {
                                tempCommands.push({
                                    name: 'UNORDERLIST', glyph: ICON_UNORDEREDLIST, command: JSON.stringify({
                                        command: "unorderList"
                                    })
                                });
                            }
                        }
                    })();
                    break;
                case ICON_ORDEREDLIST :
                    Platform.select({
                        ios: () => {
                            tempCommands.push({
                                name: 'ORDERLIST', glyph: ICON_ORDEREDLIST, command: JSON.stringify({
                                    command: "orderList"
                                })
                            });
                        },
                        android: () => {
                            if (Platform.Version >= 19) {
                                tempCommands.push({
                                    name: 'ORDERLIST', glyph: ICON_ORDEREDLIST, command: JSON.stringify({
                                        command: "orderList"
                                    })
                                });
                            }
                        }
                    })();
                    break;
                case ICON_INDENT :
                    tempCommands.push({
                        name: 'INDENT', glyph: ICON_INDENT, command: JSON.stringify({
                            command: "indent"
                        })
                    });
                    break;
                case ICON_OUTDENT :
                    tempCommands.push({
                        name: 'OUTDENT', glyph: ICON_OUTDENT, command: JSON.stringify({
                            command: "outdent"
                        })
                    });
                    break;
                case ICON_QUOTE :
                    Platform.select({
                        ios: () => {
                            tempCommands.push({
                                name: 'BLOCKQUOTE', glyph: ICON_QUOTE, command: JSON.stringify({
                                    command: "quote"
                                })
                            });
                        },
                        android: () => {
                            if (Platform.Version >= 19) {
                                tempCommands.push({
                                    name: 'BLOCKQUOTE', glyph: ICON_QUOTE, command: JSON.stringify({
                                        command: "quote"
                                    })
                                });
                            }
                        }
                    })();
                    break;
                default:
                    break;
            }
        });
        this.commands = tempCommands;
    }

    componentDidMount() {
        this.initIntervalID = setInterval(() => {
            this.postMessage('init');
        }, 500)
    }

    componentWillUnmount() {
    }

    onMessage(e) {
        let message = e.nativeEvent.data;
        if (message == 'loaded' && this.initIntervalID) {
            clearInterval(this.initIntervalID);
            this.initIntervalID = undefined;
            // let refreshQuestionList = [{name:'',id:''},{name:'优众优料',id:3},{name:'谈吐不凡',id:5},{name:'优众优料',id:3},{name:'谈吐不凡',id:5}];

            let timestamp = new Date().getTime().toString();
            let temp = this.props.initData || [];
            this.postMessage(
                JSON.stringify({
                    command: 'temp',
                    id: timestamp,
                    source: '',
                })
            );
            if (temp.length > 0) {
                // temp.unshift({name: '', id: ''});
                // console.log("唑---222");
                // setTimeout(()=>{
                this.postMessage(
                    JSON.stringify({
                        command: ICON_AT,
                        id: timestamp,
                        source: temp,
                    })
                );
            }
            return
        }

        let command = null;
        try {
            command = JSON.parse(message);
        } catch (error) {
            console.log("WebError", error);
            return;
        }

        switch (command.command) {
            case 'STATES':
                // console.log(command.states);
                this.setState({editorStates: command.states});
                break;
            case 'HTML':
                this.setState({editorHtml: command.html});
                this.props.onMessage(command.html);
                break;
        }
    }

    postMessage(str) {
        if (this.webview) {
            this.webview.postMessage(str);
        }
    }

    hindKeybord() {
        this.postMessage(
            JSON.stringify({
                command: 'hindKeyboad',
            })
        );
    }

    renderButton() {
        let isChage = false;
        if (this.commands && this.commands.length > 0) {
            return this.commands.map((item, index) => {
                let isChecked = this.state.editorStates.indexOf(item.name) != -1 ? true : false;
                let fontColor = isChecked ? {color: '#5fa137'} : {color: 'black'};
                isChage = item.name == 'H1' || item.name == 'H2' || item.name == 'H3' || item.name == 'H4';
                return (//item.name == 'AT' ? () => this.atPressLoc() :
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => {
                            this.hindKeybord();
                            switch (item.name) {
                                case 'INSERTLOCALIMAGE':
                                    // PlatfIOS ? this.jumpPic() :
                                        this.reqPermission();
                                    break;
                                case 'AT':
                                    this.props.atPress((res) => {
                                        let aa = [];
                                        let timestamp = new Date().getTime().toString();
                                        // console.log("ATATATAT____________", res);
                                        if (res != undefined) {
                                            aa = res;
                                            this.postMessage(
                                                JSON.stringify({
                                                    command: ICON_AT,
                                                    id: timestamp,
                                                    source: aa,
                                                })
                                            );
                                        } else {
                                            this.postMessage(
                                                JSON.stringify({
                                                    command: 'temp',
                                                    id: timestamp,
                                                    source: ''
                                                })
                                            );
                                        }
                                    });
                                    break;
                                case 'H1':
                                case 'H2':
                                case 'H3':
                                case 'H4':
                                case 'BLOCKQUOTE':
                                    for (let state of this.state.editorStates) {
                                        if (state == item.name) {
                                            this.postMessage(JSON.stringify({
                                                command: "removeFormat"
                                            }));
                                            return;
                                        }
                                    }
                                    this.postMessage(item.command);
                                    break;
                                case 'HIDEKEYBOARD':
                                    this.webview.blur();
                                    return;
                                    break;
                                default:
                                    this.postMessage(item.command);
                                    break;
                            }
                        }}>

                        {isChage ? <Material name={item.glyph} size={21} style={[fontColor, styles.text]}/> :
                            <FotAwesome name={item.glyph} size={20} style={[fontColor, styles.text]}/>}
                        {/*
                         <Text style={[fontColor, styles.text,{backgroundColor:'red'}]} >{item.glyph}</Text>
                         */}
                    </TouchableOpacity>);
            })
        } else {
            return null;
        }
    }

    render() {//require('../../../assets/richeditor.html'){uri:'assets/richeditor.html'}
        const {messagesReceivedFromWebView, message} = this.state;
        let url;
        // if (__DEV__) {
        //     url = require('../../../android/app/src/main/assets/richeditor.html')
        // } else if (Platform.OS === 'ios') {
        // url = require('../../../android/app/src/main/assets/richeditor.html');
        // } else {
        url = {uri: 'file:///android_asset/richeditor.html'};
        // }
        return (
            <View style={[styles.container]}>
                <WebView
                    ref={webview => {
                        this.webview = webview;
                    }}
                    source={url}
                    onMessage={this.onMessage}
                    dataDetectorTypes={'none'}
                    startInLoadingState={true}
                    // automaticallyAdjustContentInsets={true}
                    contentInset={{top: 2, left: 2, bottom: 2, right: 0}}
                />
                {
                    this.state.showToolBar ?
                        <View style={{height: 50, backgroundColor: '#f0f0f0'}}>
                            <View style={{
                                height: 1,
                                alignItems: 'stretch',
                                backgroundColor: '#D9E1E9',
                            }}/>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style={styles.buttonContainer}>
                                    {
                                        this.renderButton()
                                    }
                                </View>
                            </ScrollView>
                        </View> : null
                }
            </View>
        );
    }

    jumpPic() {
        const options = {
            title: "选择图片",
            cancelButtonTitle: "取消",
            takePhotoButtonTitle: "相机",
            chooseFromLibraryButtonTitle: "图库",
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            // mediaType:'video',
            quality: 0.8,
        };
        ImagePicker.showImagePicker(options, (response) => {
            // console.log("哈哈，，是不是权限不够----", options, response);
            // alert("返回"+ JSON.stringify(response));
            if (response.didCancel) {
            } else if (response.error) {
                if (!PlatfIOS) {
                    Alerts("您拒绝了获取本机图片的权限，若需使用，请先去设置中打开。")
                }
            } else if (response.customButton) {
            } else {
                let timestamp = new Date().getTime().toString();
                // let base64 = 'data:image/png;base64,' + response.data;
                let source = null;
                if (Platform.OS === 'ios') {
                    source = {uri: response.uri.replace('file://', ''), isStatic: true};
                } else {
                    source = {uri: response.uri, isStatic: true};
                }
                response.uri = source.uri || '';
                if (response.uri) {
                    this.props.loadStart();
                    try {
                        let iosWidth = 0, iosHeight = 0;
                        if (PlatfIOS) {
                            let maxWidth = 250;
                            if (response.width && response.height) {
                                iosWidth = Math.min(maxWidth, response.width) * 0.5;
                                iosHeight = response.height * iosWidth / response.width;
                            }
                        }
//                         let split = response.path.split('.')[1];
// console.log(response,split)
                        this.props.imageUpdaLoad(response.uri, (src) => {
                            PlatfIOS && this.postMessage(
                                JSON.stringify({
                                    command: 'insertLocalImage',
                                    id: timestamp,
                                    source: '',
                                })
                            );
                            this.postMessage(
                                JSON.stringify({
                                    command: 'insertLocalImage',
                                    id: timestamp,
                                    source: src,
                                    width: PlatfIOS ? iosWidth + "px" : response.width && response.width > 1000 ? "30%" : "40%",
                                    height: PlatfIOS ? iosHeight + "px" : "auto",
                                })
                            );

                            this.props.loadEnd();
                        }, (err) => {
                            // console.log("哈哈------", err);
                            Alerts("图片上传失败,请稍候再试!");
                            this.props.loadEnd();
                        }/*,split*/)
                    } catch (e) {
                        console.log("err", e);
                        this.props.loadEnd();

                    }
                } else {//图片地址出错
                    Alerts("图片上传失败,请稍候再试!");
                    this.props.loadEnd();
                }
            }
        });

    }

    reqPermission() {
        PermissionUtil.checkPermission(() => {
            this.jumpPic();
        }, () => {
            Alert.alert(
                '无法使用！',
                '如需使用，请授予应用【相机】与【读写手机存储】权限',
                [
                    {
                        text: '确定', onPress: () => {
                        }
                    },
                ], Platform.OS == 'android' ? {cancelable: false} : {}
            );
        }, ["camera", "photo"]);
    }
}


const window = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        width: window.width,
        flexDirection: 'row',
        // alignItems:'center',
        // justifyContent:'center'
    },
    button: {
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    text: {
        fontSize:  px2dp(18),
        width: 25,
        // fontFamily: "fontawesome",
    }
});
