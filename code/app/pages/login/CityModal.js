/**
 * Created by Monika on 2017/10/20.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Alert, AsyncStorage, StyleSheet, View, ViewPropTypes} from 'react-native'
import {createAreaData, getAddressDataList} from "../../dao/UserReceiverDao";
import Picker from "react-native-picker";
import {PlatfIOS} from "../../common/CommonDevice";

global.AreaSave = "AREASAVE";
let first, second, three;
let firstID, secondID, threeID;
let obj;
export default class CityModal extends Component {
    static propTypes = {//element
        ...ViewPropTypes,
        pickerData: PropTypes.array,
        cityText: PropTypes.string,//以空格作为分隔
        onSure: PropTypes.func,
    };
    static defaultProps = {
        pickerData: [{
            '北京': {
                '北京': ['东城区']
            }
        }],
        cityText: '北京 北京 东城区'
    };

    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
        };
        this._isMounted;

    }

    componentDidMount() {
        this._isMounted = true;
        AsyncStorage.getItem(AreaSave, (err, result) => {
            if (err) {
                this.request();
                return;
            }
            let data = JSON.parse(result);
            if (data) {
                this._isMounted && this.setState({
                    pickerData: data.picker,
                    dataArray: data.dataRes
                });
            } else {
                this.request();
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    request() {
        if (this.props.component.getLoading()) {
            this.props.component.getLoading().show();
        }
        getAddressDataList((res) => {
            let creat = createAreaData(res);
            this._isMounted && this.setState({
                pickerData: creat,
                dataArray: res
            });
            let save = {picker: creat, dataRes: res};
            AsyncStorage.setItem(AreaSave, JSON.stringify(save));
            if (this.props.component.getLoading()) {
                this.props.component.getLoading().dismiss();
            }
        }, (error) => {
            if (this.props.component.getLoading()) {
                this.props.component.getLoading().dismiss();
            }
            let {goBack} = this.props.navigation;
            Alert.alert("!!!", "当前网络有点差，请重新请求或稍候再试", [
                // {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                {
                    text: '确定', onPress: () => {
                        this.request();
                        goBack()
                    }
                }])
        })
    }

    render() {
        return (<View/>)
    }

    _showAreaPicker() {
        let defaultValue = ['北京', '北京', '东城区'];
        let selectedValue = this.props.cityText ? this.props.cityText.split(" ") : defaultValue;
        Picker.init({
            showDuration: 300,
            pickerData: this.state.pickerData,
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            pickerTitleText: '请选择',
            wheelFlex: PlatfIOS ? [1, 1, 1] : [1.2, 3.1, 3.0],
            selectedValue: selectedValue,
            pickerToolBarFontSize: PlatfIOS ? 16 : 16,
            pickerFontSize: PlatfIOS ? 16 : 14,
            pickerTextEllipsisLen: PlatfIOS ? 6 : 8,
            onPickerConfirm: pickedValue => {
                this.getAddressID(pickedValue);
            },
            onPickerCancel: pickedValue => {
                this.toggle();
            },
            onPickerSelect: pickedValue => {
            }
        });
        Picker.show();
    }

    toggle() {
        Picker.isPickerShow(status => {
            if (status) {
                Picker.toggle();
            }
        });
    }

    getAddressID(pickValue) {
        for (let i = 0; i < pickValue.length; i++) {
            first = pickValue[0];
            second = pickValue[1];
            if (pickValue[2]) {
                three = pickValue[2];
            } else {
                three = ''
            }
        }
        if (this.state.dataArray) {
            for (let i = 0; i < this.state.dataArray.length; i++) {
                if (this.state.dataArray[i].n === first) {
                    firstID = this.state.dataArray[i].i;
                    let children = this.state.dataArray[i].c;
                    for (let j = 0; j < children.length; j++) {
                        if (children[j].n === second) {
                            secondID = children[j].i;
                            if (three) {
                                let city = children[j].c;
                                for (let a = 0; a < city.length; a++) {
                                    if (city[a].n === three) {
                                        threeID = city[a].i;
                                    }
                                }
                            } else {
                                threeID = ''
                            }
                        }
                    }
                }
            }
        }
        obj = {
            "provinceid": firstID,
            "province": first,
            "city": second,
            "cityid": secondID,
            "countyid": threeID,
            "county": three,
        };
        this.props.onSure(obj, `${first} ${second} ${three}`);
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftText: {
        flex: 1,
    },
    rightText: {
        flex: 1,
        marginLeft: 20
    }
});