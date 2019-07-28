/**
 * 课程表 报名
 * Created by coatu on 2017/8/24.
 */
import React, {Component} from 'react';
import {StyleSheet, TextInput, View} from 'react-native'

import {borderRadius, Colors, deviceWidth, Loading, Sizes} from '../../common/CommonDevice'
import {CommonButton} from '../../component/CommonAssembly'
import {getSignUp} from "../../dao/CoatingUniversityDao";
import {toastShort} from "../../common/ToastUtils";
import {px2dp} from "../../common/CommonUtil";

export default class SignUpView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            phone: '',
            name: '',
            company: '',
            job: ''
        };
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        return (
            <View style={{backgroundColor: 'white', flex: 1, alignItems: 'center'}}>

                <View style={{marginTop: 40, alignItems: 'center', justifyContent: 'center'}}>
                    {this.commonTextInputView('姓名', 1)}
                    {this.commonTextInputView('公司', 2)}
                    {this.commonTextInputView('职务', 3)}
                    {this.commonTextInputView('手机', 4)}
                </View>

                <CommonButton
                    title='报 名'
                    buttonOnPress={() => this.pushToDetail()}
                />
                <Loading ref={'loading'}/>

            </View>
        )
    }

    commonTextInputView(placeholder, num) {
        return (
            <TextInput
                style={styles.textInputStyle}
                placeholder={placeholder}
                clearButtonMode='always'
                placeholderTextColor={Colors.ExplainColor}
                maxLength={num === 4 ? 11 : 100}
                keyboardType={num === 4 ? 'numeric' : 'default'}
                underlineColorAndroid="transparent"
                onChangeText={(text) => this.onChangeText(text, num)}
            />
        )
    }

    onChangeText(text, num) {
        switch (num) {
            case 1:
                this.setState({
                    name: text
                });
                break;
            case 2:
                this.setState({
                    company: text
                });
                break;
            case 3:
                this.setState({
                    job: text
                });
                break;
            case 4:
                this.setState({
                    phone: text
                });
                break;
            default:
                break;
        }
    }


    pushToDetail() {
        let {state, navigate} = this.props.navigation;
        if (this.state.phone && this.state.name && this.state.job && this.state.company) {
            this.getLoading().show();
            /**
             *  "username":"华志斌",
             "company":"上海优众实业有限公司",
             "jobtitle":"Java开发",
             "mobile":"18552435201",
             "courseid":1*/
            let data = {
                "username": this.state.name,
                "company": this.state.company,
                "jobtitle": this.state.job,
                "mobile": this.state.phone,
                "courseid": state.params.courseid
            };
            // console.log(data);
            getSignUp(data, this.props.navigation, (res) => {
                this.getLoading().dismiss();
                navigate('SignUpStatusView', {
                    title: '报名'
                })
            }, (err) => {
                // console.log(data, err);
                this.getLoading().dismiss();
            })
        } else {
            toastShort(" —— 想要报名，四项必填哦！！！  ")
        }

    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        width: deviceWidth - 20,
        height: 40,
        backgroundColor: Colors.line,
        paddingLeft: 10,
        fontSize:  px2dp(Sizes.searchSize),
        marginBottom: 15,
        borderRadius: borderRadius
    }
});