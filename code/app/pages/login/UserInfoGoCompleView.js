/**
 * Created by Monika on 2018/7/20.
 */
'use strict';
import React, {Component} from "react";
import {ScrollView, Text, TextInput, View} from "react-native";
import {
    _,
    BGTextColor,
    bindActionCreators,
    borderColor,
    connect,
    deviceWidth,
    Loading,
    MobclickAgent,
    PlatfIOS,
    px2dp,
    Sizes,
    textHeight,
    toastShort
} from "../../common/CommonDevice";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import CityModal from "./CityModal";
import InputSearchModal from "../../component/InputSearchModal";
import JobSearchModal from "./JobSearchModal";
import KeyboardSpacer from "react-native-keyboard-spacer";
import {scaleSize} from "../../common/ScreenUtil";
import {CommonButton} from "../../component/CommonAssembly";
import * as FindAction from "../../actions/FindAction";
import * as DiscussAction from "../../actions/DiscussAction";
import * as MeAction from "../../actions/MeAction";
import * as LoginAction from "../../actions/LoginAction";
import {DeviceStorage} from "../../common/CommonUtil";
import JPushModule from "jpush-react-native/index";
import {StyleSheet} from '../../themes'
import {CompleUserInfo} from "../../dao/UserInfoDao";

let modalData = {};
const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];
let cityObj;

class UserInfoGoCompleView extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            commitObj: {},
            modalVisible: false,
            jobSearchModal: false,
            currentItemInfo: {},
        };
        this._isMounted;
    };


    componentDidMount() {
        this._isMounted = true;
    }


    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {commitObj: {cityText, company, job, userType}} = this.state;
        let b = cityText ? cityText : '';
        return (// userid,name,company,provinceid,province,cityid,city,countyid,county,address,job
            <View style={styles.container}>
                <ScrollView>
                    <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}
                          style={{alignItems: 'center'}}>
                        <Text style={{
                            padding: scaleSize(deviceWidth / 8),
                            fontSize: px2dp(15),
                            lineHeight: scaleSize(50),
                        }}>没有这些信息无法使用索样、查看配方等功能。</Text>
                        {this.setTextAndInput('name', '姓名', '请输入姓名')}
                        {this.getPost(company, 'company', '公司名称')}
                        {this.getPost(b || '所在地区', 'City', '所在地区', !b ? '#aaaaaa' : 'black')}
                        {this.getPost(userType, 'userType', '用户类型')}
                        {this.getPost(job, 'job', '职位')}
                        {this.setTextAndInput('address', '详细地址', '请输入详细地址')}
                        <View style={styles.bottomViewStyle}>
                            <CommonButton
                                title={'完成'}
                                buttonOnPress={() => this.pushToCommit()}
                                buttonStyle={[{
                                    backgroundColor: BGTextColor,
                                }]}
                            />
                        </View>
                    </View>

                </ScrollView>

                {<JobSearchModal
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
                                   this._isMounted && this.setState(Object.assign(this.state.commitObj, {cityText: text}))
                               }
                           }}
                />

                {PlatfIOS && <KeyboardSpacer/>}

                <Loading ref={'loading'}/>
            </View>
        );
    }

    getPost(name, type, title, color) {
        color = !color ? name ? 'black' : '#aaaaaa' : color;
        return (
            <ATouchableHighlight onPress={() => {
                if (type === 'City') {
                    this.city._showAreaPicker()
                } else {
                    this.toggle();
                    this.setState({type: type});
                    if (type === "job") {
                        this.setModalVisible('jobSearchModal', true);
                    } else {
                        this.setModalVisible('modalVisible', true)
                    }
                }
            }}>
                <View style={{
                    alignItems: 'center',
                    borderBottomColor: '#eeeeee',
                    borderBottomWidth: scaleSize(1),
                }}>
                    <View style={[styles.jobViewStyle, {paddingLeft: scaleSize(type !== 'job' ? 10 : 15)}]}>
                        {<Text style={{color: BGTextColor}}>{type !== 'job' ? '* ' : '  '}</Text>}
                        <Text
                            style={[styles.textNameStyle, {width: deviceWidth / 4}]}>{title}</Text>
                        <Text style={{
                            fontSize: px2dp(Sizes.listSize),
                            color: color,
                            // paddingLeft: scaleSize(25)
                        }}>{name || title}</Text>
                    </View>
                </View>
            </ATouchableHighlight>
        )
    }

    setTextAndInput(type, name, placeholder) {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: 'center',
                width: deviceWidth,
                paddingTop: scaleSize(20),
                borderBottomColor: '#eeeeee',
                borderBottomWidth: scaleSize(1),
                paddingLeft: scaleSize(10)
            }}>
                {<Text style={{color: BGTextColor}}>{type === 'name' ? '* ' : '  '}</Text>}
                <Text style={[styles.textNameStyle, {width: deviceWidth / 4}]}>{name}</Text>
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    flex: 1
                }}>
                    <TextInput
                        ref="textInput"
                        style={styles.tv_content}
                        placeholder={placeholder}
                        placeholderTextColor='#aaaaaa'
                        autoFocus={type === 'name'}
                        onFocus={() => {
                            this.toggle();
                        }}
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => this.textChange(type, text)}
                        onLayout={this._inputOnLayout.bind(this)}
                    />
                </View>
            </View>
        )
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


    setModalVisible(type, isVisible) {
        this._isMounted && this.setState({
            [type]: isVisible
        })
    }

    inputSearchSure(flag, selectData, array, txt) {
        const {type, commitObj} = this.state;
        if (flag) {
            if (!_.isEmpty(array)) {//选中的时候
                array.map((item, index) => {
                    modalData[type] = array;
                    this.setStateVisible(modalData);
                    if (item) {
                        if (type === "userType") {
                            this.setState(Object.assign(commitObj, {
                                userType: item.name,
                                userTypeId: item.id,
                            }));
                        } else if (type === "job" && item.keyName) {
                            this.setState(Object.assign(commitObj, {
                                job: item.keyValue,
                                jobId: item.keyName,
                            }));
                        } else {
                            this.setState(Object.assign(commitObj, {
                                company: txt,
                                address: item.address,
                            }));
                        }
                    }
                });
            } else {
                if (!_.isEmpty(selectData[type])) {
                    if (type === "company" && selectData[type][0].key === 'company') {
                        this.setState(Object.assign(commitObj, {
                            company: txt ? txt : '',
                            address: '',
                        }))
                    } else if (type === 'job') {
                        modalData[type] = [];
                        this.setState(Object.assign(commitObj, {
                            job: '',
                            jobId: '',
                        }))
                    } else if (type === "userType") {
                        this.setState(Object.assign(commitObj, {
                            userType: ""
                        }))
                    }
                } else {
                    if (txt) {
                        this.setState(Object.assign(commitObj, {
                            company: txt,
                            address: ''
                        }))
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
        this._isMounted && this.setState({
            modalVisible: false,
            jobSearchModal: false,
            currentItemInfo: data
        });
    }

    toggle() {
        if (this.city) {
            this.city.toggle();
        }
    }

    textChange(type, text) {
        let {commitObj} = this.state;
        this._isMounted && this.setState(Object.assign(commitObj, {[type]: text}));
    }

    pushToCommit() {//user/compleUserInfo userid,name,company,provinceid,province,cityid,city,countyid,county,address,job
        let {userid} = this.props.navigation.state.params;
        let {commitObj: {company = '', cityText = '', address = '', jobId = '', name = '', userType, userTypeId}} = this.state;
        if (name && name.trim()) {
            if (company && company.trim()) {
                if (cityText) {
                    if (userType) {
                        this.getLoading().show();
                        this.state.commitObj['userid'] = userid;
                        this.state.commitObj['job'] = jobId;
                        this.state.commitObj['type'] = userTypeId;
                        CompleUserInfo(Object.assign(this.state.commitObj, cityObj), (res) => {
                            this.getLoading().dismiss();
                            //登录操作，跳转主页。。
                            if (res && res.userid)
                                this.jump(res)
                        }, (err) => {
                            this.getLoading().dismiss();
                        })
                    } else {
                        toastShort('请选择用户类型')
                    }
                } else {
                    toastShort('请选择所在地区')
                }
            } else {
                toastShort('请选择或输入公司名称')
            }
        } else {
            toastShort('请输入姓名')
        }
    }

    jump(uObj) {
        const {navigate, state, goBack} = this.props.navigation;
        MobclickAgent.onProfileSignIn(uObj.userid.toString());

        DeviceStorage.save(USERINFO, uObj);// "areaid": 1,如果 这个是0 》代表 全区。不通过
        this.props.loginAction.requestLogin(uObj, true);
        let {nav} = this.props;
        if (nav && nav.routes) {
            this.props.meAction.fetchMyScore();
            this.props.meAction.fetchMyExpertScore((res)=>{
                this.props.loginAction.updateUserInfo(res);
            });
            this.props.findAction.fetchCollectProductCount({}, 0);
            this.judgeShareData(nav);
            this.props.discussAction.fetchDiscussShareRefresh(1);
            state.params.callback && state.params.callback();
        }
    }

    judgeShareData(nav) {
        let routes = nav.routes;
        const {navigate, state, goBack} = this.props.navigation;
        let shareKey = state.params && state.params.sharePageKey || "";
        if (shareKey) {
            this.props.navigation.goBack(routes[state.params && state.params.sharePageLen].key);
        } else {
            this.props.navigation.goBack(routes[1].key)
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: deviceWidth
    },
    tv_content: {
        justifyContent: 'flex-start',
        textAlign: 'left',
        // textAlignVertical: 'top',
        flex: 1,
        paddingLeft: 0,
        ios: {
            fontSize: px2dp(Sizes.listSize),
            paddingVertical: scaleSize(30)
        }
    },
    bottomViewStyle: {
        marginTop: scaleSize(80),
        paddingHorizontal: scaleSize(deviceWidth / 8),
        alignItems: 'center'
    },
    scrollViewStyle: {
        // padding:scaleSize(10)
    },
    jobViewStyle: {
        backgroundColor: 'white',
        height: textHeight,
        borderBottomColor: borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingLeft: scaleSize(10),
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scaleSize(20),
        width: deviceWidth,
        paddingHorizontal: deviceWidth / 8
    },

    textNameStyle: {
        // width: 70,
        // marginLeft:8,
        fontSize: px2dp(15),
        color: '#rgba(64,64,64,1)'
    }
});

export default connect(state => ({
        nav: state.nav
    }), dispatch => ({
        loginAction: bindActionCreators(LoginAction, dispatch),
        meAction: bindActionCreators(MeAction, dispatch),
        findAction: bindActionCreators(FindAction, dispatch),
        discussAction: bindActionCreators(DiscussAction, dispatch),
    })
)(UserInfoGoCompleView);