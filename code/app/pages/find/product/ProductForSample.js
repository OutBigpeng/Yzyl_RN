/**产品索样
 * Created by coatu on 16/8/10.
 */
'use strict';
import React, {Component} from "react";

import {Alert, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {
    BGColor,
    BGTextColor,
    bindActionCreators,
    borderColor,
    borderRadius,
    Colors,
    connect,
    deviceWidth,
    PlatfIOS,
    px2dp,
    Sizes,
    textHeight,
    trimStr
} from "../../../common/CommonDevice";
import {toastShort} from "../../../common/ToastUtils";
import Loading from "../../../common/Loading";
import {productDefaultAddressById, productSampleAddressById, productSouYangById} from "../../../dao/FindDao";
import KeyboardSpacer from 'react-native-keyboard-spacer'
import ATouchableHighlight from "../../../component/ATouchableHighlight";
import * as MeAction from "../../../actions/MeAction";

let Remarks = '备注';
let email = '电子邮箱', name = '姓名', mobile = '手机号', company = '公司名称', address = '地址';


class ProductForSample extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            Name: '',
            Mobile: '',
            Company: '',
            Address: '',
            Email: '',
            remarks: '',
        };
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        const {productName, productDetail, pid} = this.props.navigation.state.params;
        let {Name,Company,Mobile,Address,Email,remarks} = this.state;

        return (
            <View style={styles.container}>
                {/*导航*/}
                <ScrollView>
                    <View style={styles.allViewStyle}>
                        <Text style={{fontSize: px2dp(Sizes.listSize), color: Colors.titleColor}}>{productName}</Text>
                        <Text style={{
                            marginTop: 10, color: Colors.redColor, fontSize: px2dp(Sizes.searchSize), lineHeight: 20
                        }}>{productDetail}</Text>
                    </View>

                    {this.textView(name,Name)}
                    {this.textView(company,Company)}
                    {this.textView(mobile, Mobile)}
                    {this.textView(address, Address)}
                    {this.textView(email,Email)}
                    {this.textView(Remarks)}

                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <ATouchableHighlight onPress={() => this.confirm(productName, productDetail, pid)}>
                            <View
                                style={[styles.buttonViewStyle, {backgroundColor: Name && Company &&Mobile &&Address ? '#rgba(215,35,48,1)' : '#rgba(204,204,204,1)'}]}>
                                <Text style={{color: 'white', fontSize: px2dp(17)}}>提交</Text>
                            </View>
                        </ATouchableHighlight>

                    </View>

                </ScrollView>
                {PlatfIOS && <KeyboardSpacer/>}
                <Loading ref={'loading'}/>
            </View>
        );
    }

    textView(item, defaultValue) {
        return (
            <View style={[styles.textViewStyle, {height: item === Remarks ? 80 : 40, justifyContent: 'center'}]}>
                <View style={{alignItems: 'center', justifyContent: 'center', width: 15, height: 40}}>
                    <Text style={{color: '#rgba(215,35,48,1)'}}>{item === Remarks || item === email ? '' : '*'}</Text>
                </View>
                <View>
                    <TextInput
                        placeholder={item}
                        placeholderTextColor='#rgba(0,0,0,0.3)'
                        style={[styles.textInputStyle, {height: item === Remarks ? 80 : 40}]}
                        multiline={item === Remarks ? true : false}
                        defaultValue={defaultValue}
                        underlineColorAndroid='transparent'
                        clearButtonMode='always'
                        onChangeText={(text) => this.getChangeText(text, item)}
                        //onLayout={this._inputOnLayout.bind(this)}
                    />
                </View>
            </View>
        )
    }

    getChangeText(text, item) {
        if (item === name) {
            this.setState({Name: text})
        } else if (item === company) {
            this.setState({Company: text})
        } else if (item === mobile) {
            this.setState({Mobile: text})
        } else if (item === address) {
            this.setState({Address: text})
        } else if (item === email) {
            this.setState({Email: text})
        } else if (item === Remarks) {
            this.setState({remarks: text})
        }
    }

    //确定
    confirm(productName, productDetail, pid) {
        let {Name,Company,Mobile,Address,Email,remarks} = this.state;
        if (trimStr(Name) === '') {
            toastShort('请输入姓名');
        } else if (trimStr(Company) === '') {
            toastShort('请输入公司名称');
        } else if (trimStr(Mobile) === '') {
            toastShort('请输入联系电话');
        } else if (trimStr(Address) === '') {
            toastShort('请输入地址');
        } else {
            this.getLoading().show();
            let data = {
                'productname': productName,
                'productid': pid,
                'title': '',
                'content': remarks,
                'name': Name,
                'company': Company,
                'telephone': Mobile,
                'address': Address,
                'email': Email
            };
            productSouYangById(data, this.props.navigation, (res) => {
                this.getLoading().dismiss();
                /**
                 * { { scoreResult: { result: 0, detailId: 0, score: 0 } } }
                 */
                if (res.scoreResult) {
                    let {scoreResult: {result = 0, score = 0}} = res;
                    if (result > 0 && score > 0) {
                        this.setAlert(`您已成功提交索样信息，获得${score}积分`, '我们会尽快与您联系！')
                    } else {
                        this.setAlert('您已成功提交索样信息！', '我们会尽快与您联系！')
                    }
                } else {
                    toastShort(res.msg)
                }
            }, (err) => {
                this.getLoading().dismiss();
            })
        }
    }

    setAlert(title, content) {
        const {navigate, goBack} = this.props.navigation;
        Alert.alert(
            title,
            content,
            [
                {
                    text: '确定', onPress: () => {
                    this.props.meAction.fetchMyScore();
                    goBack()
                }
                },
            ]
        )
    }

    componentDidMount() {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        this.getLoading().show();
        productSampleAddressById( this.props.navigation, (res) => {
            this.getLoading().dismiss();
            if(res) {
                let {address="",mobile="",company="",email="",name=""} = res;
                this.setState({
                    Address: address,
                    Mobile: mobile,
                    Company:company,
                    Email:email,
                    Name:name
                })
            }
        }, (error) => {
            this.getLoading().dismiss();
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
    },

    textInputStyle: {
        width: deviceWidth - 20,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: px2dp(14),
    },

    allViewStyle: {
        marginTop: 10,
        padding: 10,
        width: deviceWidth,
        backgroundColor: 'white',
        marginBottom: 10
    },

    textViewStyle: {
        width: deviceWidth,
        height: 40,
        borderTopWidth: 1,
        borderTopColor: borderColor,
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
    },

    buttonViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceWidth - 15,
        height: textHeight,
        backgroundColor: BGTextColor,
        marginTop: 25,
        borderRadius: borderRadius
    },

    TextViewStyle: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: borderColor,
        width: deviceWidth,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        meAction: bindActionCreators(MeAction, dispatch)
    })
)(ProductForSample);
