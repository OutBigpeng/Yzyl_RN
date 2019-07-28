import React, {Component} from 'react';
import {Image, ListView, Text, View} from 'react-native'
import {getSearchCompany} from '../dao/UserInfoDao'
import {getSysDictionaryData} from "../dao/SysDao";
import {_, bindActionCreators, connect, deviceWidth, Loading, PlatfIOS} from '../common/CommonDevice'
import *as RegisterAction from '../actions/RegisterAction';
import {StyleSheet} from '../themes';
import ATouchableHighlight from "./ATouchableHighlight";
import NavigatorView from './NavigatorView'

let arrayData = [];
let CheckBoxRefs = {};//存放item checkbox ref
const dismissKeyboard = require('dismissKeyboard');
const inputComponents = [];
const selectedImage = require('../imgs/problem/select_on.png');
const unSelectedImage = require('../imgs/problem/select_off.png');

class InputAndMutilSearch extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });

        CheckBoxRefs = {};
        this.state = {
            dataSource: ds,
            listData: [],
            ids: [],
            films: [],
            array: [],
            textInput: '',
            defaultValues: ''
        };

    }

    getLoading() {
        return this.refs['loading'];
    }

    componentDidMount() {
        const {type, selectData} = this.props;
        if (type === 'job') {//这个是职位的接口
            this.getNetWork("merchantUserJob")
        } else if (type === 'userType') {
            this.getNetWork("uUserType")
        }
        //如果有数据传进来的话 先赋值给state
        this.props.state.Register.radioArray = [];
        if (!_.isEmpty(selectData[type]) && type === 'job') {
            this.props.actions.fetchsetCheckView(selectData[type].concat());
        }
    }

    getNetWork(key) {
        let data = {parentKey: key};
        this.getLoading().show();
        getSysDictionaryData(data, (res) => {
            this.getLoading().dismiss();
            this.setState({
                films: !res ? [] : res,
            });
        }, (error) => {
            this.getLoading().dismiss();
        });
    }

    render() {
        const {type, onPress, sure} = this.props;
        let radioArray = this.props.state.Register.radioArray || [];
        // let isSigle = '单选';
        return (
            <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}
                  style={styles.allView}>
                <View style={{flex: 1}}>
                    <View>
                        {this.props.type == 'company' ?
                            <NavigatorView
                                {...this.props}
                                placeholder='请输入公司名称'
                                rightTitle='确定'
                                onRightPress={() => this.props.sure(this.state.defaultValues)}
                                leftOnPress={this.props.onPress}
                                onChangeText={(txt) => this.onChangeText(txt)}
                                defaultValues={this.state.defaultValues}
                            />
                            :
                            <View style={styles.jobViewStyle}>
                                <Text style={styles.jobTextStyle}>请选择您当前所属类型:</Text>
                                <View style={{flexDirection: 'row'}}>
                                    {this.cancelAndSureButtonView(onPress, '返回', 1)}
                                    {this.cancelAndSureButtonView(sure, '确定', 2)}
                                </View>
                            </View>
                        }
                    </View>

                    <ListView
                        style={{
                            backgroundColor: 'white',flex:1,
                        }}
                        dataSource={this.state.dataSource.cloneWithRows(this.state.films)}
                        renderRow={(rowData) => this.renderRow(rowData)}
                        enableEmptySections={true}
                        removeClippedSubviews={false}

                    />
                </View>
                <Loading ref={'loading'}/>
            </View>
        )
    }

    cancelAndSureButtonView(onPress, name, type) {
        return (
            <ATouchableHighlight
                style={styles.buttonViewStyle} onPress={onPress}>
                <Text style={styles.buttonTextStyle}>{name}</Text>
            </ATouchableHighlight>
        )
    }

    onChangeText(txt) {//公司名称的接口
        let data = {searchKey: txt};
        getSearchCompany(data, (res) => {
            this.setState({
                films: !res ? [] : res,
            })
        }, (err) => {
            console.log('错误', err);
        });

        this.setState({
            defaultValues: txt
        });

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

    renderRow(rowData) {
        const {type} = this.props;
        let select;
        let selectedArray = [];
        let radioArray = this.props.state.Register.radioArray;
        for (let j = 0; j < radioArray.length; j++) {
            let id = type == 'userType' ? radioArray[j] && radioArray[j].id : radioArray[j] && radioArray[j].name;
            selectedArray.push(id);
        }
        if (_.contains(selectedArray, type == 'userType' ? rowData.keyName : rowData.name)) {
            select = true
        } else {
            select = false;
        }
        return (
            <ATouchableHighlight key={rowData.keyName} onPress={() => this.changeData(rowData, type)}>
                <View style={styles.rowViewStyle}>
                    <Image style={styles.imageStyle}
                           source={!select ? unSelectedImage : selectedImage}/>
                    <Text style={styles.itemText}>{rowData.keyValue || rowData.name}</Text>
                </View>
            </ATouchableHighlight>
        );
    }

    changeData(temp, type) {
        if (type !== 'userType') {
            this.setState({
                defaultValues: temp.name
            })
        }

        //第二个参数（是单选 还是多选 1是单选  2是多选）
        this.props.actions.fetchProjectCheckView(temp, 1, type, this.state.textInput)
    }

    componentWillUnmount() {
        this.props.state.Register.radioArray = [];
    }
}

const styles = StyleSheet.create({
    listViewStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    rowViewStyle: {
        flexDirection: 'row',
        width: deviceWidth,
        backgroundColor: 'white',
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
        alignItems: 'center',
        ios: {
            padding: 10,
        },
        android: {padding: 8, marginLeft: 2}
    },

    itemText: {
        width: deviceWidth - 50,
        fontSize: PlatfIOS ? 16 : 14,
        marginLeft: 10
    },

    scrollViewStyle: {
        backgroundColor: '#e8e8e8',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },

    titleStyle: {
        fontSize: PlatfIOS ? 16 : 12,
        marginRight: 10,
        width: deviceWidth - 70
    },

    textInputStyle: {
        height: PlatfIOS ? 40 : 40,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e8e8e8',
        borderRadius: 2,
        marginRight: 2,
        marginLeft: 2,
        paddingLeft: 10,
    },

    allView: {
        backgroundColor: 'transparent',
        flex: 1,
    },

    promptStyle: {
        color: 'red',
        margin: 10,
        fontSize: PlatfIOS ? 15 : 13
    },

    deleteStyle: {
        color: 'red',
        padding: 3,
        fontSize: PlatfIOS ? 15 : 12
    },

    jobTextStyle: {
        fontSize: 16,
        marginBottom: 10,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 15
    },

    imageStyle: {
        width: PlatfIOS ? 22 : 18,
        height: PlatfIOS ? 22 : 18
    },

    jobViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    buttonViewStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonTextStyle: {
        padding: PlatfIOS ? 12 : 5,
        paddingRight: 10,
        color: 'white',
        fontSize: PlatfIOS ? 16 : 15,
        fontWeight: 'bold'
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(RegisterAction, dispatch)
    })
)(InputAndMutilSearch);


