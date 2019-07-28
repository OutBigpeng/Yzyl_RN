/**提问..
 * Created by Monika on 2017/6/27.
 */
import React, {Component} from "react";
import {Platform, StyleSheet, TextInput, View} from "react-native";
import {
    bindActionCreators,
    Colors,
    connect,
    deviceHeight,
    deviceWidth,
    domainObj as lDomainObj,
    Loading,
    PlatfIOS,
    px2dp,
    Sizes,
    toastShort
} from "../../common/CommonDevice";
import RichEditor from "../../component/web/RicheditorWeb";
import Keyparcer from "react-native-keyboard-spacer";
import {getQiuNiuTokenData} from "../../dao/QiniuDao";
import uuid from "uuid";
import *as QuestionAction from '../../actions/QuestionAction'
import {getNewAnswer, getNewQuestion} from "../../dao/InterlocutionDao";

const dismissKeyboard = require('dismissKeyboard');

let htmlContent;
let page = 1;
let pageSize = 10;
class PutQuestions extends Component {
    navigatePress = () => {
        const {state, navigate, goBack} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

        if (this.type === 1 && !this.state.htmlTitle) {//提问才有标题
            toastShort("请输入标题");
            return;
        }
        if (this.state.htmlTitle.length > 20) {
            toastShort("标题不能多于20个字");
            return;
        }
        this.RichEditor.hindKeybord();
        this.getLoading().show('正在发布');
        if (!htmlContent) {
            toastShort("请输入内容");
            // !PlatfIOS&&this.getHTML();
            this.getLoading().dismiss();
            return;
        }
        // console.log("侃侃 -----", htmlContent);
        let content = htmlContent;//this.state.htmlContent;
        let regx = /onclick=\"postQuestion\(([0-9]+)/ig;//获取当前@人的id
        // toastShort("发布成功");
        // this.getLoading().dismiss();
        let myArray = [];//当前提问或回复中@到的人
        content.replace(regx, function (s, value) {
            myArray.push(value * 1);
        });
        try {
            content = content.replaceAll(lDomainObj.info, domainObj.info);
        } catch (e) {
            console.log("好吧。没有图片。")
        }
        dismissKeyboard();

        /**
         "title": "问个问题",
         "content":"to be or not to be",
         "createUserId":   2,
         "atUserIdList":[116]
         */
        if (this.type === 1) {//提问
            let data = {
                "title": this.state.htmlTitle,
                "content": content,
                "atUserIdList": myArray,
                createUserId: userObj.userid
            };
            getNewQuestion(data, (res) => {
                toastShort("提交成功");
                this.refreshQuestionList();
                this.getLoading().dismiss();
                goBack();
            }, (error) => {
                this.getLoading().dismiss();
            });
        } else {
            let data;
            if (state.params.status === 'ChildReply') {//回复再回复
                data = {
                    "questionId": state.params.Data.questionId,
                    "content": content,
                    "createUserId": userObj.userid,
                    "replyId": state.params.Data.id,
                    "atUserIdList": myArray,
                    "replyUserId": state.params.Data.createUserId
                };
            } else {
                data = {
                    "createUserId": userObj.userid,
                    "questionId": state.params.Data.id,
                    "content": content,
                    "atUserIdList": myArray
                };
            }
            getNewAnswer(data, (res) => {
                toastShort("回复成功");
                this.getLoading().dismiss();
                state.params.callback();
                goBack();
            }, (err) => {
                this.getLoading().dismiss();
            })
        }
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            // htmlContent: '',
            htmlTitle: '',
        };
        this.type = this.props.navigation.state.params.type;//1:提问  2：回答
    }

    componentDidMount() {
        const {state, navigate} = this.props.navigation;
        this.props.navigation.setParams({
            rightOnPress: this.navigatePress,
        });
    }

    refreshQuestionList() {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        let data = {
            "pageIndex": page,
            "pageSize": pageSize,
            "status": 0,
            "createUserId": userObj.userid
        };
        this.props.actions.fetchQuestionList(data, this.props.navigation, false, true, false, true, 'myQuest');
    }

//获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {//传入atArray  .直接提问@的这个人{height: Math.max(80)}
        const {navigate, state} = this.props.navigation;
        let aa = state.params.atArray || [];

        return (
            <View style={styles.container}>
                {this.type == 1 ?
                    <View style={{borderBottomWidth: 2, margin: 5, borderBottomColor: '#E4393C'}}>
                        <TextInput
                            style={[styles.textInputStyle, {height: Math.max(35)}]}
                            placeholder="请输入标题(限制20字)"
                            defaultValue=""
                            // autoFocus={true}
                            multiline={true}
                            maxLength={80}
                            clearButtonMode='always'
                            placeholderTextColor={Colors.inputColor}
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.onChangeText(text)}
                        /></View> : <View/>}

                <RichEditor
                    ref={webview => {
                        this.RichEditor = webview;
                    }}
                    onMessage={(e) => {
                        htmlContent = e;
                    }}
                    initData={state.params.atArray || []}
                    loadStart={() => this.getLoading().show()}
                    loadEnd={() => this.getLoading().dismiss()}
                    atPress={(callback) => {
                        dismissKeyboard();
                        this.jumpFollow(callback)
                    }
                    }
                    imageUpdaLoad={(uri, callBack, failCallBack,split) => this.imageLoadUpdate(uri, callBack, failCallBack,split)}
                />

                {PlatfIOS && <Keyparcer/>}

                <Loading ref={'loading'}/>
            </View>
        )
    }


    onChangeText(text) {
        this.setState({
            htmlTitle: text
        })
    }

    imageLoadUpdate(uri, callBack, failCallBack/*,keysplit='jpeg'*/) {
        //请求七牛的token
        try {
            let data = {'opType': 'info'};
            getQiuNiuTokenData(data, (res) => {
                let key = uuid.v4();
                //key += keysplit.concat('4')?'.jpeg':`.${keysplit}`;
                key += '.jpeg';
                let formData = new FormData();

                formData.append('token', res.upToken);
                formData.append('key', key);
                formData.append('file', {
                    // type: keysplit.concat('4')?'video/mp4':'image/jpeg',
                    type: 'image/jpeg',
                    name: key,
                    uri: uri
                });
                this._upload(formData, callBack, failCallBack)

            }, (err) => {
                failCallBack(err);
            })
        } catch (err) {
            failCallBack(err);
        }
    }

    _upload(body, callBack, failCallBack) {
        let xhr = new XMLHttpRequest();
        //上传到七牛云的地址
        //  let url = 'http://upload-z2.qiniu.com';
        let url = 'http://up-z0.qiniu.com';
        // 开启post上传
        this.setState({
            avatarUploading: true,
            avatarProgress: 0
        });
        xhr.open('POST', url);
        //上传成功的返回
        xhr.onload = () => {
            // 状态码如果不等于200就代表错误
            if (xhr.status !== 200) {
                // alert('请求失败');
                failCallBack(xhr.status);
                return;
            }
            if (!xhr.responseText) {
                // alert('请求失败');
                failCallBack(xhr.status);
                return;
            }

            var response;
            try {
                response = JSON.parse(xhr.response)
            } catch (e) {
                // console.log('请求失败')
                failCallBack(e);
            }

            if (response) {
                this.setState({
                    avatarUploading: false,
                    avatarProgress: 0,
                });
                const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;

                callBack(domainObj.info + response.key + "-640x640")
            }
        };


        if (xhr.upload) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    var percent = (event.loaded / event.total).toFixed(2);
                    this.perent = percent;
                }
            }
        }

        // 发送请求
        xhr.send(body);
    }


    jumpFollow(callback) {
        const {navigate} = this.props.navigation;
        // this.RichEditor.hindKeybord();
        navigate('MyFollowView', {
                title: this.type == 2 ? '@的人' : '向谁提问',
                rightTitle: '确定',
                leftTitle: '取消',
                callback: (res) => callback(res)
            }
        );
    }

    componentWillUnmount() {
        htmlContent = ""
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 3
    },
    smallTitle: {
        padding: PlatfIOS ? 8 : 2,
        fontSize: px2dp(PlatfIOS ? 20 : 10)
    },
    richText: {
        width: deviceWidth,
        height: deviceHeight / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    textInputStyle: {
        paddingTop: PlatfIOS ? 7 : 0,
        paddingBottom: 0,
        backgroundColor: 'white',
        fontSize: px2dp(Sizes.listSize),
        width: deviceWidth,
        paddingLeft: 5,
        fontWeight: 'bold'
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(QuestionAction, dispatch)
    })
)(PutQuestions);

/*
:<View style={{flex:1}}>
                    <RichTextEditor
                        ref={(r) => this.richtext = r}
                        style={styles.richText}
                        editorInitializedCallback={() => this.onEditorInitialized()}
                        initData={aa}
                    />
                    <RichTextToolbar
                        getEditor={() => this.richtext}
                        initData={aa}
                        imageUpdaLoad={(uri, callBack, failCallBack) => this.imageLoadUpdate(uri, callBack, failCallBack)}
                        onPressAddAT={()=>{
                            this.richtext.insertAT([ { name: '华志宾嘿嘿嘿', id: 2 } ])
                            // this.AddAT()
                        }}
                        loadStart={() => this.getLoading().show()}
                        loadEnd={() => this.getLoading().dismiss()}
                        onPressAddLink={() => {
                            this.richtext.insertLink("http://www.baidu.com", "百度")
                        }}
                    />
                </View>}

 onEditorInitialized() {
        this.getHTML();
    }

    async getHTML() {
        htmlContent = await this.richtext.getContentHtml();
        console.log("****************************", ' ' + htmlContent)
    }
     AddAT(){
        const {navigate} = this.props.navigation;
        dismissKeyboard();
        navigate('MyFollowView', {
                title: this.type == 2 ? '@的人' : '向谁提问',
                rightTitle: '确定',
                leftTitle: '取消',
                callback: (res) =>this.callBack11111(res)
            }
        );
    }

    callBack11111(res){
        console.log('res',res)
        this.richtext.insertAT(res)
    }
*/