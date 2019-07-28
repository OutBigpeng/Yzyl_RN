/**编辑我的收货人、发票收货人
 * Created by Monika on 2016/12/27.
 */

'use strict';
import React, {Component} from "react";
import {Alert, AsyncStorage, Image, Platform, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import Picker from "react-native-picker";
import {createAreaData, getAddressDataList} from "../../../../dao/UserReceiverDao";
import * as ShowAddressAction from "../../../../actions/ShowAddressAction";
import Loading from "../../../../common/Loading";
import {
    BGColor,
    BGTextColor,
    bindActionCreators,
    borderColor,
    borderRadius,
    connect,
    deviceHeight,
    deviceWidth,
    isEmptyObject,
    phoneInspect,
    px2dp,
    Sizes,
    textHeight,
    toastShort,
    trimStr
} from "../../../../common/CommonDevice";
import CommonLoginButton from "../../../../component/CommonLoginButton";
import ATouchableHighlight from "../../../../component/ATouchableHighlight";

const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];

let pickerData = [];

class EditReceiveAddress extends Component {
    // 构造
    constructor(props) {
        super(props);
        const {userId, type, itemRow, from} = this.props.navigation.state.params;
        this.state = {
            isSelect: false,
            userId: userId,
            type: type,
            itemRow: itemRow,
            pcc: '',
            name: '',
            phone: '',
            telephone: '',//固定电话
            address: '',
            province: '',
            city: '',
            county: '',
            cityId: 0,
            countyId: 0,
            provinceId: 0,
            id: 0,
            isEdit: false,
            from: from ? 'cart' : 'mine',
            isLoading: false,
            isNetwork: true,
            modalVisible: false,
        };
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible})
    }

    componentDidMount() {
        this.props.navigation.setParams({
            rightOnPress: this.delAddress,
        });
        // this.state.isEdit?  this.props.navigation.setParams({
        //         title:'编辑收货人'
        // }):
        //     this.props.navigation.setParams({
        //         title:'新增收货人'
        //     })

        const {state} = this.props.navigation;
        let page = state.params.page;
        if (page === 'edit') {
            if (this.state.itemRow.province) {
                this.state.province = this.state.itemRow.province;
                this.state.city = this.state.itemRow.city;
                this.state.county = this.state.itemRow.county;
            } else {
                this.state.province = '北京';
                this.state.city = '北京';
                this.state.county = '东城区';
            }
            this.setState({
                pcc: this.state.itemRow.province + this.state.itemRow.city + this.state.itemRow.county,
                selectedValue: [this.state.province, this.state.city, this.state.county],
                isSelect: state.params.isSelect,
                name: this.state.itemRow.name,
                phone: this.state.itemRow.mobile,
                telephone: this.state.itemRow.telephone,
                address: this.state.itemRow.address,
                cityId: this.state.itemRow.cityId,
                city: this.state.itemRow.city,
                countyId: this.state.itemRow.countyId,
                county: this.state.itemRow.county,
                province: this.state.itemRow.province,
                provinceId: this.state.itemRow.provinceId,
                id: this.state.itemRow.id,
                isEdit: true,
            })
        }
        this.getAddressData()
    }

    getAddressData(option) {
        AsyncStorage.getItem(ADDRESSSOUCE, (err, id) => {
            if (err) {
                this.getAddress(option);
                return;
            }
            let data = JSON.parse(id);
            if (data) {
                pickerData = data.picker;
                this.setState({
                    dataArray: data.dataRes,
                    isNetwork: true
                });
                if (option == 1) {
                    this._toggle()
                }
            } else {
                this.getAddress(option);
            }
        })
    }

    getAddress(option) {
        this.getLoading().show();
        getAddressDataList((result) => {
            this.getLoading().dismiss();
            let creat = createAreaData(result);
            pickerData = creat;
            if (option == 1) {
                this._toggle()
            }
            let save = {picker: creat, dataRes: result};
            AsyncStorage.setItem(ADDRESSSOUCE, JSON.stringify(save));
            this.setState({
                dataArray: result,
                isNetwork: true
            });
        }, (err) => {
            this.getLoading().dismiss();
            this.setState({isNetwork: false})
        });
    }

    componentWillUnmount() {
        this.back();
    }

    back() {
        Picker.hide();
        this.props.navigation.goBack();
    }

    //发票
    render() {
        const {state, navigate} = this.props.navigation;
        // let title = '新增收货人';
        // if (state.params.page === 'edit') {
        //     title = '编辑收货人';
        // }
        // if (this.state.type == 2) {
        //     title = '新增发票收件人';
        //     if (state.params.page == 'edit') {
        //         title = '编辑发票收件人';
        //     }
        // }
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <ScrollView
                        contentContainerStyle={{paddingBottom: 30, width: deviceWidth}}>
                        <View style={styles.inputbg}>
                            {/*<View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}>*/}
                            {this.commonTextInputView('姓名', this.state.name, 1)}
                            {this.commonTextInputView('手机号码', this.state.phone, 2)}
                            {this.commonTextInputView('固定电话', this.state.telephone, 21)}

                            <View style={styles.regionView}>
                                <Text style={[styles.tv, {paddingBottom: 15, paddingTop: 15}]}>所在地区</Text>
                                <ATouchableHighlight
                                    onPress={() => this.state.isNetwork ? this._toggle() : this.NoNetWorkData()}
                                    style={{flex: 2, justifyContent: 'center'}}>
                                    <Text style={styles.regionTv}>{this.state.pcc}</Text>
                                </ATouchableHighlight>
                            </View>
                            {this.commonTextInputView('详细地址', this.state.address, 3)}

                            <View style={styles.defaultView}>
                                <Text style={[styles.tv, {}]}>设为默认</Text>
                                <ATouchableHighlight onPress={() => this.setDefault()}>
                                    {this.state.isSelect ? <Image style={styles.switch_style}
                                                                  source={require('../../../../imgs/me/on.png')}/> :
                                        <Image style={styles.switch_style}
                                               source={require('../../../../imgs/me/off.png')}/>}
                                </ATouchableHighlight>
                            </View>
                        </View>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <CommonLoginButton
                                {...this.props}
                                name={this.state.from === 'cart' ? '保存并使用' : '保存'}
                                num={0}
                                compent={this}
                                style={{backgroundColor: this.inspect() ? BGTextColor : '#rgba(190,190,190,1)'}}
                                onPress={() => this.saveAddress()}
                            />
                        </View>
                    </ScrollView>

                </View>
                <Loading ref={'loading'}/>
            </View>
        );
    }

    inspect() {
        return (this.state.phone && this.state.name && this.state.province && this.state.city && this.state.county && this.state.address) || false;
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    commonTextInputView(name, defaultValue, num) {
        return (
            <View style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: borderColor}}>
                <Text style={styles.tv}>{name} </Text>
                <TextInput placeholderTextColor='black'
                           numberOfLines={1}
                           maxLength={num === 2 || num === 21 ? 11 : 1000}
                           keyboardType={num === 2 || num === 21 ? 'numeric' : 'default'}
                           defaultValue={defaultValue}//{this.state.name}
                           style={[styles.textInputStyle, Platform.OS === 'ios' ? {paddingTop: (num === 3 ? (defaultValue.length > 44 ? 0 : 17) : 0)} : {alignItems: 'center'}, {height: num === 3 ? 50 : textHeight,}]}
                           underlineColorAndroid='transparent'
                           onChangeText={(text) => this.onChangeText(text, num)}
                           onFocus={() => {
                               Picker.hide();
                           }}
                           autoFocus={num === 1 || false}
                           onLayout={this._inputOnLayout.bind(this)}
                           clearButtonMode='always'
                           multiline={num === 3 || false}
                />
            </View>

        )
    }

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

    onChangeText(text, num) {
        switch (num) {
            case 1:
                this.setState({name: text});
                break;
            case 2:
                this.setState({phone: text});
                break;
            case 21:
                this.setState({telephone: text});
                break;
            case 3:
                this.setState({address: text});
                break;
        }
    }

    NoNetWorkData() {
        this.getAddressData(1)
    }

    _showDatePicker() {
        Picker.init({
            showDuration: 300,
            pickerData: pickerData,
            wheelFlex: Platform.OS === 'android' ? [1.15, 3.15, 3.0] : [1, 1, 1],
            selectedValue: this.state.selectedValue,
            onPickerConfirm: pickedValue => {
                {
                    this.getAddressID(pickedValue)
                }
                this.setState({
                    selectedValue: pickedValue
                });
            },
            onPickerCancel: pickedValue => {
                Picker.hide();
            },
            onPickerSelect: pickedValue => {
            }
        });
        Picker.show();
    }

    _toggle() {
        Picker.isPickerShow(show => {
            if (show) {
            } else {
                this._showDatePicker();
            }
        });
    }

    getAddressID(pickValue) {
        for (let i = 0; i < pickValue.length; i++) {
            this.state.province = pickValue[0];
            this.state.city = pickValue[1];
            if (!isEmptyObject(pickValue[2])) {
                this.state.county = pickValue[2];
            } else {
                this.state.county = '';
            }
        }
        this.setState({
            pcc: this.state.province + this.state.city + this.state.county,
        });
        if (!isEmptyObject(this.state.productDetailObj)) {
            for (let i = 0; i < this.state.productDetailObj.length; i++) {
                if (this.state.productDetailObj[i].n === this.state.province) {
                    this.state.provinceId = this.state.productDetailObj[i].i;
                    let children = this.state.productDetailObj[i].c;
                    for (let j = 0; j < children.length; j++) {
                        if (children[j].n === this.state.city) {
                            this.state.cityId = children[j].i;
                            if (!isEmptyObject(this.state.county)) {
                                let city = children[j].c;
                                for (let a = 0; a < city.length; a++) {
                                    if (city[a].n === this.state.county) {
                                        this.state.countyId = city[a].i;
                                    }
                                }
                            } else {
                                this.state.countyId = '';
                            }
                        }
                    }
                }
            }
        }
    }

    setDefault() {
        this.setState({
            isSelect: !(this.state.isSelect),
        });
    }

    saveAddress() {
        dismissKeyboard();
        const {navigate, state} = this.props.navigation;
        if (trimStr(this.state.phone) === '') {
            toastShort("请输入手机号！");
            return;
        }
        if (!phoneInspect.test(this.state.phone)) {
            toastShort('手机号码格式不正确');
            return;
        }
        if (trimStr(this.state.name) === '') {
            toastShort("请输入收货人！");
            return;
        }
        if (trimStr(this.state.province) === '' || trimStr(this.state.city) === '' || trimStr(this.state.county) === '') {
            toastShort("请选择省市区");
            return;
        }
        if (trimStr(this.state.address) === '') {
            toastShort("请输入详细地址！");
            return;
        }

        let data = {
            'userId': this.state.userId,
            'name': this.state.name,
            'province': this.state.province,
            'city': this.state.city,
            'county': this.state.county,
            'provinceId': this.state.provinceId,
            'cityId': this.state.cityId,
            'countyId': this.state.countyId,
            'address': this.state.address,
            'mobile': this.state.phone,
            'telephone': this.state.telephone,
            'isDefault': this.state.isSelect ? 1 : 0,
            'id': this.state.id
        };

        if (this.state.isEdit) {
            this.getLoading().show();
            this.props.actions.fetchEditAddIfNeeded(this.state.type, data, this.props.navigation, this);
            this.props.navigation.goBack();
            if (this.state.from === 'cart') {
                this.getLoading().show();
                state.params.callback(data);
            }
        } else {
            // if (this.state.from === 'cart') {
            //     this.getLoading().show();
            //     this.props.actions.fetchNewAddIfNeeded(this.state.type, data, this.props.navigation, this, state.params.callback);
            //     state.params.callback(null);
            // } else {
            this.getLoading().show();
            this.props.actions.fetchNewAddIfNeeded(this.state.type, data, this.props.navigation, this);
            this.props.navigation.goBack();
            // }
        }
    }

    delAddress = () => {
        const {navigate, goBack} = this.props.navigation;
        Alert.alert("温馨提示", "确定要删除当前地址？", [
            {text: '取消', onPress: () => console.log('Cancel Pressed!')},
            {
                text: '确定', onPress: () => {
                this.props.actions.fetchDelAddressIfNeeded(this.state.type, this.state.userId, this.state.itemRow.id, true, this.props.navigation);
                goBack();
            }
            },
        ]);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
        height: deviceHeight
    },
    inputbg: {
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 20,
    },
    regionView: {
        flexDirection: 'row',
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: borderColor
    },
    regionTv: {
        color: 'black',
        justifyContent: 'center',
        paddingLeft: 10,
        fontSize: px2dp(Sizes.searchSize)
    },
    tv: {
        color: 'gray',
        alignSelf: 'center',
        padding: 5,
        marginLeft: 5,
        alignItems: 'center',
        fontSize: px2dp(Sizes.listSize)
    },
    textInputStyle: {
        flex: 1,
        height: textHeight,
        fontSize: px2dp(Sizes.searchSize),
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    defaultView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: borderColor
    },
    switch_style: {
        width: 50,
        height: 25,
        alignSelf: 'center',
    },
    btnStyle: {
        width: deviceWidth - 20,
        height: textHeight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BGTextColor,
        borderRadius: borderRadius,
    }

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(ShowAddressAction, dispatch)
    })
)(EditReceiveAddress);
