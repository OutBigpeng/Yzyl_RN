/**
 * Created by Monika on 2017/10/23.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {Modal, View, ViewPropTypes} from "react-native";
import {
    actionBar,
    bindActionCreators, connect,
    deviceHeight,
    deviceWidth,
    PlatfIOS
} from "../common/CommonDevice";
import InputAndMutilSearch from "./InputAndMutilSearch";
import *as RegisterAction from '../actions/RegisterAction';

let inputSearchObj = {};
let textInput = '';

class InputSearchModal extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        inputSearchObj = {};
    }

    static propTypes = {
        ...ViewPropTypes,
        onPress: PropTypes.func,
        inputSearchModal: PropTypes.bool,
        selectData: PropTypes.object,
        selectItem: PropTypes.object,
        style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    };

    static defaultProps = {
        data: [],
        selectData: [],
        selectItem: {},
    };

    render() {
        let {inputSearchModal, data, onPress, editData, selectData, type} = this.props;
        return (
            <Modal
                visible={inputSearchModal}
                onRequestClose={() => inputSearchModal}
                transparent={true}
                animationType={'none'}
            >
                <View style={{backgroundColor: '#rgba(0,0,0,0.5)', flex: 1, alignItems: 'center', width: deviceWidth}}>
                    <View style={{height: deviceHeight, width: deviceWidth}}>
                        <View style={{
                            height: type != 'company' ? PlatfIOS ? 64 : actionBar : 0,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingTop: type != 'company' ? PlatfIOS ? 15 : 0 : 0,
                        }}>

                        </View>

                        <InputAndMutilSearch
                            {...this.props}
                            selectData={selectData}
                            rowData={(rowData) => this.getRowData(rowData)}
                            type={type}
                            onPress={() => onPress(false)}
                            sure={(txt) => this.sure(txt)}
                        />
                    </View>
                </View>
            </Modal>
        )
    }

    onChangeText(text, key) {
        inputSearchObj[key] = text;
    }

    getRowData(rowDatas) {
        textInput = rowDatas;
    }

    sure(txt) {
        let array = this.props.state.Register.radioArray || [];
        this.props.onPress(true, array, this.props.selectData, txt);
        inputSearchObj = {};
        textInput = '';
    }

    componentWillUnmount() {
        inputSearchObj = {};
        textInput = '';
        this.props.state.Register.radioArray = [];
    }
}

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(RegisterAction, dispatch)
    })
)(InputSearchModal);