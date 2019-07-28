/**
 * Created by coatu on 2016/12/26.
 */
import React, {Component} from "react";
import {InteractionManager, ScrollView, StyleSheet, Text, TextInput, View,} from "react-native";
import {
    _,
    BGTextColor,
    bindActionCreators,
    borderColor,
    borderRadius,
    connect,
    deviceHeight,
    deviceWidth,
    phoneInspect,
    PlatfIOS,
    px2dp,
    Sizes,
    textHeight,
    toastShort
} from "../../common/CommonDevice";
import VerigicationCodeView from "../../component/VerificationCode";
import AgreementView from "./Agreement";
import {PwdChange} from "../../common/CommonUtil";
import Loading from "../../common/Loading";
import CommonPhoneTextView from "../../component/CommonPhoneTextView";
import CommonLoginButton from "../../component/CommonLoginButton";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import InputSearchModal from '../../component/InputSearchModal'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import CityModal from "./CityModal";
import JobSearchModal from "./JobSearchModal";
import * as StratifiedLevelAction from "../../actions/StratifiedLevelAction";
import {Register} from "../../dao/UserInfoDao";

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];
let cityObj;
let modalData = {};

class RegisterView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            cityText: '',
            mobile: '',
            pwd: '',
            company: '',
            address: '',
            code: '',
            dataArray: '',
            timer: '',
            name: '',
            modalVisible: false,
            userType: '',
            userTypeId: '',
            jobSearchModal: false,
            job: '',
            jobId: '',
            currentItemInfo: {},
            type: ''
        };
        this._isMounted;
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    setModalVisible(isVisible) {
        this.setState({
            modalVisible: isVisible
        })
    }

    setJobSearchModal(isVisible) {
        this.setState({
            jobSearchModal: isVisible
        })
    }

    //接口请求
    componentDidMount() {
        this._isMounted = true;
    }

    notNetWork(option) {
        this.city.request(option);
        // toastShort('网络发生错误，请查看网络是否正常')
    }

    componentWillUnmount() {
        this._isMounted = false;

        modalData = {};
        this.back();
    }

    back() {
        this.city.toggle();
        this.state.timer && clearTimeout(this.state.timer);
        this.props.navigation.goBack();
    }

    timers(timer) {
        this.setState({
            timer: timer
        })
    }

    //键盘的方法
    _onStartShouldSetResponderCapture(event) {
        let target = event.nativeEvent.target;
        if (!inputComponents.includes(target)) {
            dismissKeyboard();
        }
        return false;
    }

    _inputOnLayout(event) {
        inputComponents.push(event.nativeEvent.target);
    }

    render() {
        // const {userTypeObj: {type = ""}} = this.props.navigation.state.params;
        let isCompany = true;//type === 'company';
        let {cityText, mobile, pwd, company, code, name} = this.state;
        let b = cityText ? cityText : '';
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollViewStyle}
                    // keyboardShouldPersistTaps='always'
                >
                    <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}
                          style={{alignItems: 'center'}}>
                        {this.commonTextInputView('手机号', 1)}
                        {this.commonTextInputView('密码', 2)}
                        {this.commonTextInputView('姓名', 3)}
                        {isCompany && this.getPost(company, 'company', '公司名称')}

                        {isCompany && <ATouchableHighlight
                            onPress={() => {
                                this.city._showAreaPicker()
                            }}>
                            <View style={styles.pickerViewStyle}>
                                <View style={{alignItems: 'center', justifyContent: 'center', width: 15,}}>
                                    <Text style={{color: BGTextColor}}>{'* '}</Text>
                                </View>
                                <Text style={styles.textNameStyle}>所在地区</Text>
                                <Text style={{
                                    fontSize: px2dp(Sizes.listSize),
                                    color: !b ? '#aaaaaa' : 'black', paddingLeft: 25
                                }}>{b || '所在地区'}</Text>
                            </View>
                        </ATouchableHighlight>}
                        {this.getPost(this.state.userType, 'userType', '用户类型')}
                        {isCompany && this.getPost(this.state.job, 'job', '职位')}
                        {isCompany && this.commonTextInputView('详细地址', 4)}

                        {/*验证码*/}
                        <View style={styles.codeViewStyle}>
                            <View style={{alignItems: 'center', justifyContent: 'center', marginLeft: 15}}>
                                <Text style={styles.textNameStyle}>验证码</Text>
                            </View>
                            <TextInput
                                style={[styles.TextInputStyle, {width: deviceWidth - 205, paddingLeft: 25}]}
                                placeholder='验证码'
                                clearButtonMode='always'
                                keyboardType='numeric'
                                placeholderTextColor="#aaaaaa"
                                underlineColorAndroid="transparent"
                                numberOfLines={1}
                                onChangeText={(text) => this.setState({code: text})}
                            />
                            <VerigicationCodeView
                                mobile={mobile}
                                smstype={1}
                                callBack={this.timers.bind(this)}
                                compent={this}
                                onPress={() => {
                                    this.toggle();
                                }}
                            />
                        </View>

                        <View style={styles.bottomViewStyle}>
                            <CommonLoginButton
                                {...this.props}
                                name='注册'
                                num={0}
                                compent={this}
                                style={{backgroundColor: this.isButtonClick(isCompany) ? BGTextColor : '#rgba(190,190,190,1)'}}
                                onPress={() => this.pushToDetail(isCompany)}
                            />
                            <View style={styles.secondViewStyle}>
                                <ATouchableHighlight onPress={() => this.pushToAgreement()}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={[styles.textStyle, {color: 'gray'}]}>注册并同意</Text>
                                        <Text style={styles.textStyle}>《用户服务协议》</Text>
                                    </View>
                                </ATouchableHighlight>
                                <CommonPhoneTextView/>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {isCompany && <JobSearchModal
                    {...this.props}
                    onPress={(flag, array) => this.inputSearchSure(flag, this.state.currentItemInfo, array)}
                    jobSearchModal={this.state.jobSearchModal}
                    selectData={[this.state.currentItemInfo]}
                />}
                <InputSearchModal
                    onPress={(flag, array, rowData, txt) => this.inputSearchSure(flag, rowData, array, txt)}
                    inputSearchModal={this.state.modalVisible}
                    //selectItem={this.state.currentItemInfo}
                    selectData={this.state.currentItemInfo}
                    type={this.state.type}
                />
                <CityModal ref={(city) => {
                    this.city = city;
                }}
                           {...this.props}
                           component={this}
                           cityText={cityText}
                           onSure={(res, text) => {
                               if (res) {
                                   cityObj = res;
                                   this.setState({cityText: text})
                               }
                           }}
                />
                {PlatfIOS && <KeyboardSpacer/>}
                <Loading ref={'loading'}/>
            </View>
        );
    }

    isButtonClick(isCompany) {
        let {cityText, mobile, pwd, company, code, name} = this.state;
        return (isCompany ? mobile && pwd && company && cityText && code && name : mobile && pwd && code && name);
    }

    inputSearchSure(flag, selectData, array, txt) {
        const {type} = this.state;
        if (flag) {
            if (!_.isEmpty(array)) {//选中的时候
                array.map((item, index) => {
                    modalData[type] = array;
                    this.setStateVisible(modalData);
                    if (item) {
                        if (type === "userType") {
                            this.setState({
                                userType: item.name,
                                userTypeId: item.id,
                            });
                        } else if (type === "job" && item.keyName) {
                            {
                                this.setState({
                                    job: item.keyValue,
                                    jobId: item.keyName,
                                });
                            }

                        } else {
                            this.setState({
                                company: txt,
                                address: item.address,
                            });
                        }
                    }
                });
            } else {
                if (!_.isEmpty(selectData[type])) {
                    if (type === "company" && selectData[type][0].key === 'company') {
                        this.setState({
                            company: txt ? txt : '',
                            address: '',
                        })
                    } else if (type === 'job') {
                        modalData[type] = [];
                        this.setState({
                            job: '',
                            jobId: '',
                        })
                    } else if (type === "userType") {
                        this.setState({
                            userType: ""
                        })
                    }
                } else {
                    if (txt) {
                        this.setState({
                            company: txt,
                            address: ''
                        })
                    }
                }
                this.setStateVisible(modalData)
            }
        } else {
            this.setState({
                modalVisible: false,
                jobSearchModal: false,
            });
        }
    }

    setStateVisible(data) {
        this.setState({
            modalVisible: false,
            jobSearchModal: false,
            currentItemInfo: data
        });
    }

    commonTextInputView(placeholder, opation) {
        return (
            <View style={{alignItems: 'center'}}>
                <View style={styles.TextInputViewStyle}>
                    {opation >= 4 ? <View style={{alignItems: 'center', justifyContent: 'center', width: 15,}}/> :
                        <View style={{alignItems: 'center', justifyContent: 'center', width: 15,}}>
                            <Text style={{color: BGTextColor}}>{'*'}</Text>
                        </View>}

                    <Text style={styles.textNameStyle}>{placeholder}</Text>

                    <TextInput
                        style={[styles.TextInputStyle]}
                        placeholder={placeholder}
                        keyboardType={opation === 1 ? 'numeric' : 'default'}
                        defaultValue={opation === 4 ? this.state.address : ''}
                        clearButtonMode='always'
                        placeholderTextColor="#aaaaaa"
                        underlineColorAndroid="transparent"
                        numberOfLines={1}
                        onFocus={() => {
                            this.toggle();
                        }}
                        secureTextEntry={opation === 2 || false}
                        maxLength={opation === 1 ? 11 : 1000}
                        onChangeText={(text) => this.changeText(text, opation)}
                        onLayout={this._inputOnLayout.bind(this)}
                    />
                </View>
            </View>
        )
    }

    toggle() {
        if (this.city) {
            this.city.toggle();
        }
    }

    getPost(name, type, title) {
        const {job, company, userType} = this.state;
        return (
            <ATouchableHighlight onPress={() => {
                this.toggle();
                this.setState({type: type});
                if (type === "job") {
                    this.setJobSearchModal(true);
                } else {
                    this.setModalVisible(true)
                }
            }}>
                <View style={{alignItems: 'center'}}>
                    <View style={[styles.jobViewStyle, {paddingLeft: type !== 'job' ? 5 : 10}]}>
                        {type !== 'job' ? <Text style={{color: BGTextColor}}>* </Text> : null}
                        <Text style={[styles.textNameStyle, {marginLeft: type === 'job' ? 5 : 0}]}>{title}</Text>
                        <Text style={{
                            fontSize: px2dp(Sizes.listSize),
                            color: name ? 'black' : '#aaaaaa',
                            paddingLeft: 25
                        }}>{name || title}</Text>
                    </View>
                </View>
            </ATouchableHighlight>
        )
    }

    changeText(text, opation) {
        switch (opation) {
            case 1:
                this.setState({
                    mobile: text
                });
                break;
            case 2:
                this.setState({
                    pwd: text
                });
                break;
            case 3:
                this.setState({
                    name: text
                });
                break;
            case 4:
                this.setState({
                    address: text
                });
                break;
            default:
                break;
        }
    }

    pushToDetail(isCompany) {
        this.toggle();
        const {navigate, state} = this.props.navigation;
        let {cityText = "", mobile = "", pwd = "", company = "", code = "", name = "", address = "", jobId = ''} = this.state;
        if (!mobile) {
            toastShort('请输入手机号');
        } else if (!phoneInspect.test(mobile)) {
            toastShort('请输入正确的手机号');
        } else if (!pwd) {
            toastShort('请输入密码');
        } else if (!name) {
            toastShort('请输入姓名');
        } else if (isCompany && !company) {
            toastShort('请选择或输入公司名称');
        } else if (isCompany && !cityText) {
            toastShort('请选择所在地区');
        } else if (!this.state.userType) {
            toastShort('请选择用户类型')
        } else if (!code) {
            toastShort('请输入验证码');
        } else {
            // const {userTypeObj: {type = "", keyName = ""}} = state.params;
            let data = Object.assign({
                mobile: mobile,
                vcode: code,
                password: PwdChange(pwd),
                name: name,
                // type: keyName,
            }, isCompany ? {
                company: company,
                address: address,
                job: jobId
            } : {});
            isCompany && Object.assign(data, cityObj);
            this.getLoading().show();
            Register(data, (res) => {
                this.getLoading().dismiss();
                if (res) {
                    // console.log(state.params,"");
                    InteractionManager.runAfterInteractions(() => {
                        navigate('ReviewedView', Object.assign(state.params, {
                            name: 'ReviewedView',
                            title: '审核',
                            userName: mobile,
                            passWord: pwd,
                            result: res,//好吧。用到了。用于下一个页面的显示
                        }))
                    })
                }
            }, (err) => {
                toastShort(`注册出错-${err}`);
                this.getLoading().dismiss();
            })
        }
    }

    pushToAgreement() {
        const {navigate} = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            navigate('AgreementView', {name: 'AgreementView', title: '用户服务协议', agreementName: '用户服务协议',})
        })
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        height: deviceHeight,
        borderTopColor: borderColor,
        borderTopWidth: 2,
    },

    scrollViewStyle: {
        paddingTop: 10
    },

    TextInputViewStyle: {
        borderBottomColor: borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: 10,
        width: deviceWidth - 20,
    },

    TextInputStyle: {
        width: deviceWidth - 100,
        height: textHeight,
        paddingLeft: 25,
        fontSize: px2dp(Sizes.listSize),
        padding: PlatfIOS ? 0 : 4,
    },

    bottomViewStyle: {
        marginTop: 30,
        alignItems: 'center'
    },

    bottomTopViewStyle: {
        width: deviceWidth - 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BGTextColor,
        borderRadius: borderRadius,
        height: 40
    },

    secondViewStyle: {
        // marginTop: 8,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: deviceWidth - 20,
        flexDirection: 'row'
    },

    textStyle: {
        fontSize: px2dp(PlatfIOS ? Sizes.listSize : 13),
        color: BGTextColor
    },

    codeViewStyle: {
        width: deviceWidth - 20,
        height: 45,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderBottomColor: borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },

    codeTextInputStyle: {
        width: deviceWidth - 165,
        paddingLeft: 10,
        fontSize: px2dp(14),
        height: textHeight,
    },

    pickerViewStyle: {
        width: deviceWidth - 20,
        height: textHeight,
        backgroundColor: 'white',
        borderBottomColor: borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },

    jobViewStyle: {
        backgroundColor: 'white',
        height: textHeight,
        borderBottomColor: borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        // justifyContent: 'center',
        paddingLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: deviceWidth - 20,
        marginTop: 10
    },

    textNameStyle: {
        width: 70,
        // marginLeft:8,
        fontSize: px2dp(15),
        color: '#rgba(64,64,64,1)'
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(StratifiedLevelAction, dispatch)
    })
)(RegisterView);
