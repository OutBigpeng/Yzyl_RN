import React, {Component} from 'react';
import {AsyncStorage, Image, StyleSheet, Text, View} from 'react-native';

import Calendar from '../../component/calendars/index';
import moment from 'moment';
import {
    _, BGTextColor, bindActionCreators, connect, deviceWidth, Loading, PlatfIOS,
    toastShort
} from '../../common/CommonDevice'
import {getListSignIn, getUserSignIn} from "../../dao/MeDao";
import Toast from "react-native-root-toast";
import {px2dp} from "../../common/CommonUtil";
import {scaleSize} from "../../common/ScreenUtil";
import {Images} from "../../themes";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import * as MeAction from "../../actions/MeAction";

const customDayHeadings = ['日', '一', '二', '三', '四', '五', '六'];
const customMonthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

global.signUserDate = "signUserDate";

 class SignView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDate: moment().format('YYYY-MM-DD'),
            calendarList: [],
            signAllDays: '0',
            signText: '签到',
            myScore: 0
        };
        this._isMounted;
    }

    async componentDidMount() {
        this._isMounted = true;
        let currentDate = this.getCurrentDate();
        const {navigate} = this.props.navigation;
        if (this._isMounted) {
            //本地判断今天是否已签
            this.getLoading().show();
            const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
            let {userid} = userObj;
            AsyncStorage.getItem(`${signUserDate}&${userid}`, (err, res) => {
                // if (err) {//err ,做一次签到请求
                // this.signIn(currentDate, userid);
                // } else {
                this.getLoading().dismiss();
                res = JSON.parse(res);
                if (res && res.days > 0) {//如果当前有数据
                    //判断是否包含今天的日期
                    //包含
                    let signDates = res.signDates;
                    !_.isEmpty(signDates) && this.signAfter(userid, res, signDates, currentDate);
                } else {//不包含，请求签到的日集合数据
                    let temp = currentDate.split("-");
                    temp[2] = "01";
                    getListSignIn({"signDate": temp.join("-")}, 0, (res) => {
                        this.getLoading().dismiss();
                        if (res) {
                            let signDates = res.signDates || [];
                            !_.isEmpty(signDates) && this.signAfter(userid, res, signDates, currentDate);
                        }
                    }, () => {
                        this.getLoading().dismiss();
                    });
                }
            })
        }
    }

    //请求签到
    signIn(currentDate, userid) {
        this.getLoading().show();
        this.requestSignIn(currentDate, 0, (res) => {
            // Alerts(`您已连续签到${res.days.toString()}天`);
            let signDates = res.signDates || [];
            toastShort("签到成功！", Toast.positions.CENTER);
            this.props.meAction.fetchMyScore();
            this.getLoading().dismiss();
            !_.isEmpty(signDates) && this.signAfter(userid, res, signDates, currentDate, 1);
        })
    }

    signAfter(userid, res, signDates, currentDate, type) {
        AsyncStorage.setItem(`${signUserDate}&${userid}`, JSON.stringify(res));
        if (this.isHaveDate(signDates, currentDate)) {
            type = 1;
        }
        this.setState(Object.assign({
            calendarList: signDates,
            signAllDays: res.days.toString(),
        }, type && {signText: '已签到'}));
    }

    /**
     * 当前数组 是否存在这条数据
     * @param array  数组
     * @param temp  数据里面的值
     * @returns {boolean|*|{example}}
     */
    isHaveDate(array, temp) {
        function isHave(item) {
            return item.date == temp;
        }

        return array.some(isHave);
    }

    /**
     *
     * @param signDate  补签或签到的日期
     * @param isFill    是否补签    int    1是 0不是
     * @param callback
     * @param failback
     */
    requestSignIn(signDate, isFill, callback, failback) {
        const {navigate} = this.props.navigation;
        // this.getLoading().show();
        let data = {
            signDate: signDate,
            isFill: isFill
        };
        getUserSignIn(data, this.props.navigation, (res) => {
            if (callback && res&&res.code) {
               if(res.code=='200'){
                   callback(res.result, this.props.navigation)
               }else {
                   toastShort(res.msg)
               }
            }
            this.getLoading().dismiss();
        }, (err) => {
            if (failback) {
                failback();
            }else {
                toastShort(err.msg||"签到失败！");
                console.log(err.msg);
            }
            this.getLoading().dismiss();
        })
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {myScore = 0} = this.props.state.Me;
        //eventDates={this.state.array}
        return (
            <View style={styles.container}>
                <Image source={Images.signBigImg}
                       resizeMode={Image.resizeMode.cover}
                       style={{
                           height: scaleSize(deviceWidth / 375 * 180 * 2),
                           width: deviceWidth
                       }}>
                    <View style={{alignItems: "center", marginTop: scaleSize(70), flex: 1}}>
                        <View style={{
                            backgroundColor: '#f0f0f075',
                            borderRadius: scaleSize(85),
                            width: scaleSize(170),
                            height: scaleSize(170),
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            {this.state.signText == "签到" ? <ATouchableHighlight onPress={() => {
                                let currentDate = this.getCurrentDate();
                                const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
                                this.signIn(currentDate, userObj.userid);
                            }}>
                                {this.signBt()}
                            </ATouchableHighlight> : this.signBt()}
                        </View>
                        <View style={{
                            flexDirection: "row",
                            padding: scaleSize(10),
                            borderColor: '#aaaaaa66',
                            position: "absolute",
                            bottom: 0
                        }}>
                            {this.renderItem("我的积分", myScore, () => this.jumpScoreUse())}
                            {this.renderItem("连续打卡天数", this.state.signAllDays, null)}
                        </View>
                    </View>
                </Image>
                <Calendar
                    ref="calendar"
                    events={this.state.calendarList}
                    dayHeadings={customDayHeadings}
                    monthNames={customMonthNames}
                    currentMonth = {(new Date())}
                    weekStart={7}
                    onDateSelect={(date) => this.onDateChange(date)}
                    selectedDate={this.state.selectedDate}
                    showEventIndicators={true}
                    customStyle={customStyle}
                    bottomView={(e) => this.bottomView(e)}
                    removeClippedSubviews={false}
                />

                <Loading ref={'loading'}/>
            </View>

        );
    }

    signBt() {
        return (<View style={{
            backgroundColor: this.state.signText === "签到" ? "#ffc400" : "white",
            borderRadius: scaleSize(75),
            width: scaleSize(150),
            height: scaleSize(150),
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text style={{fontSize: px2dp(PlatfIOS?16:14)}}>{this.state.signText}</Text>
        </View>)
    }

    renderItem(str, score, onPress) {
        return (
            <ATouchableHighlight style={{flex: 1}} onPress={onPress}>
                <View>
                    <Text style={{alignSelf: "center", color: 'white', fontSize: px2dp(PlatfIOS?16:14),marginBottom:5}}>{score}</Text>
                    <Text style={{alignSelf: "center", color: 'white', fontSize: px2dp(PlatfIOS?14:12)}}>{str}</Text>
                </View>
            </ATouchableHighlight>)
    }

    signDay() {
        return (
            <View style={{flex: 1, margin: 20, alignItems: 'center'}}>
                {this.state.signAllDays ? <Text
                    style={{color: 'gray', fontSize: px2dp(16), fontWeight: 'bold'}}>您已连续签到<Text
                    style={{color: BGTextColor}}> {this.state.signAllDays} </Text>天</Text> : null}
            </View>
        )
    }

    getCurrentDate() {
        return (new Date()).Format('yyyy-MM-dd');
    }

    onDateChange(date) {
        let selectedDate = date.split("T")[0];
        let currentDate = this.getCurrentDate();
        if (currentDate > selectedDate) {//以前的要补签
            let select = this.isHaveDate(this.state.calendarList, selectedDate);
            if (select) {
                // Alerts('已经签到过了，不需要再次签到!');
            } else {
                // Alerts('暂无补签功能，敬请期待下一个版本！！！');
                // Alert.alert('确定需要补签?', '需要花费10个积分券奥!', [
                //     {text: '取消', onPress: () => console.log('')},
                //     {text: '确定', onPress: () => this.sure(selectedDate, date)},
                // ]);
            }
        } else if (currentDate < selectedDate) {//以后的不能签
            // Alerts('只能签到当前日期');
        } else if (selectedDate == currentDate) {
            // Alerts('签到完成');
            // let array = this.state.array.concat(selectedDate);
            // this.setState({selectedDate: date, array})
        }
    }

    bottomView(event) {//event = { date: '2018-01-02', isFill: 1 }
        return (
            <View style={styles.bottomViewStyle}>
                <Text style={styles.bottomTextStyle}>签</Text></View>
        )
    }

    componentWillUnmount() {
        this._isMounted = false;
        const {state} = this.props.navigation;
        if (state.params && state.params.callback) {
            state.params.callback(this.state.myScore);
        }
    }

    jumpScoreUse() {
        const {navigate} = this.props.navigation;
        navigate("ScoreUserListView", {
            title: '积分记录'
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    welcome: {
        fontSize: px2dp(20),
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    bottomViewStyle: {
        margin: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: BGTextColor
    },
    bottomTextStyle: {
        fontSize: px2dp(PlatfIOS ? 12 : 8),
        color: 'white',
        fontWeight: 'bold',
        padding: PlatfIOS ? 1 : 2

    }

});

const customStyle = {
    calendarHeading: {
        // backgroundColor: 'rgba(254,240,214,1)',
        height: 45,
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#e8e8e8',
    },

    weekendHeading: {
        color: BGTextColor,
        fontSize: px2dp(16),
        fontWeight: 'bold'
    },

    dayHeading: {
        color: PlatfIOS ? 'black' : 'rgba(0,0,0,0.6)',
        fontSize: px2dp(16),
        fontWeight: 'bold'
    },

    dayCircleFiller: {
        backgroundColor: 'transparent',
    },
    title: {
        textAlign: 'center',
        fontSize: px2dp(18),
        color: 'gray'
    },

    dayButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#e9e9e9',
        padding: PlatfIOS ? 14 : 12,
        backgroundColor: '#fafafa'
    },
    day: {
        color: PlatfIOS ? 'black' : 'rgba(0,0,0,0.6)',
    },
    selectedDayCircle: {
        backgroundColor: 'transparent',
    },

    currentDayCircle: {
        backgroundColor: 'transparent',
    },

    selectedDayText: {
        color: BGTextColor,
        fontWeight: 'normal',
        fontSize: px2dp(16)
    },

    weekendDayText: {
        color: PlatfIOS ? 'black' : 'rgba(0,0,0,0.5)',
        fontWeight: 'normal',
        fontSize: px2dp(16)
    },
    currentDayText: {
        color: 'rgba(0,0,0,0.6)',
        fontWeight: 'normal',
        fontSize: px2dp(16)
    },
};
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        meAction: bindActionCreators(MeAction, dispatch)
    })
)(SignView);
