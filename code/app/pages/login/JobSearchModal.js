/**
 * Created by Monika on 2017/10/23.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Animated, Image, ListView, Modal, StyleSheet, Text, View, ViewPropTypes} from "react-native";
import ATouchableHighlight from "../../component/ATouchableHighlight";
import {_, bindActionCreators, connect, deviceWidth, Loading, actionBar, PlatfIOS} from "../../common/CommonDevice";
import * as StratifiedLevelAction from "../../actions/StratifiedLevelAction";
import {cloneObj} from "../../common/CommonUtil";
import Toast from "react-native-root-toast";
import {getQueryLinkManJobTree} from "../../dao/StratifiedLevelDao";
import {toastShort} from "../../common/ToastUtils";

class JobSearchModal extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.state = {
            dataSource: ds,
            classifyData: []
        }
    }

    static propTypes = {
        ...ViewPropTypes,
        onPress: PropTypes.func,
        jobSearchModal: PropTypes.bool,
        isSingle: PropTypes.bool,//是否单选
        selectData: PropTypes.array,
        style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    };

    static defaultProps = {
        isSingle: true
    };

    componentDidMount() {
        let {classifyData = [], onPress,selectData} = this.props;
        if (!_.isEmpty(classifyData)) {
            this.setState({
                classifyData: classifyData
            });
        } else {
            let {jobClassifyData = []} = this.props.state.StratifiedLevel;
            if (_.isEmpty(jobClassifyData)) {
                this.getLoading() && this.getLoading().show();
                getQueryLinkManJobTree(this.props.navigation, (res) => {
                    this.getLoading() && this.getLoading().dismiss();
                    this.props.actions.fetchJobClassifyData(res);
                    this.setState({
                        classifyData: res
                    });
                }, () => {
                    this.getLoading() && this.getLoading().dismiss();
                    onPress(false);
                    toastShort("请求出问题啦！请稍候再试...")
                })
            } else {
                this.setState({
                    classifyData: jobClassifyData
                });
            }
        }
    }

    getLoading() {
        return this.refs['loading'];
    }

    render() {
        let {jobSearchModal, onPress, isSingle} = this.props;
        let {jobClassifySelectData} = this.props.state.StratifiedLevel;
        return (
            <Modal
                visible={jobSearchModal}
                onRequestClose={() => jobSearchModal}
                transparent={true}
                animationType={'none'}
            >
                <View style={{backgroundColor: '#rgba(0,0,0,0.6)', flex: 1, alignItems: 'center', width: deviceWidth}}>
                    <View style={{
                        height: actionBar,
                        width: deviceWidth,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingTop: PlatfIOS ? 15 : 0,
                    }}>
                        <ATouchableHighlight
                            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => onPress(false)}>
                            <Text style={{
                                padding: PlatfIOS ? 12 : 5,
                                paddingRight: 16,
                                color: 'white',
                                fontSize: PlatfIOS ? 16 : 15
                            }}>返回</Text>
                        </ATouchableHighlight>
                        <ATouchableHighlight
                            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => this.sure()}>
                            <Text style={{
                                padding: PlatfIOS ? 12 : 5,
                                paddingRight: 16,
                                color: 'white',
                                fontSize: PlatfIOS ? 16 : 15
                            }}>确定<Text
                                style={{color: '#E4393C'}}>{jobClassifySelectData.length > 0 ? `(${jobClassifySelectData.length})` : isSingle ? '(单选)' : '(多选)'}</Text></Text>
                        </ATouchableHighlight>
                    </View>
                        <ListView
                        dataSource={this.state.dataSource.cloneWithRows(this.state.classifyData)}
                        renderRow={this.renderRow}
                        enableEmptySections={true}
                        removeClippedSubviews={false}
                    />

                    <Loading ref={'loading'}/>
                </View>
            </Modal>
        )
    }

    renderRow = (rowData, setionId, rowId) => {
        return (
            <View>
                {rowData.children&&!_.isEmpty(rowData.children) ? this.sectionItem(rowData, rowId) :
                    this.commonItem(rowData, 1)
                }
            </View>
        );
    };

    changeData(temp) {
        this.props.actions.fetchJobClassifySelect(temp, this.props.isSingle)
    }

    commonItem(rowData, classify) {
        let select;
        let selectedArray = [];
        let selectData = this.props.state.StratifiedLevel.jobClassifySelectData;
        for (let j = 0; j < selectData.length; j++) {
            let i = selectData[j].keyName;
            selectedArray.push(i);
        }
        if (_.contains(selectedArray,  rowData.keyName)) {
            select = true
        } else {
            select = false;
        }
        return (
            <ATouchableHighlight key={rowData.keyName} onPress={() => this.changeData(rowData, classify)}>
                <View style={[styles.rowViewStyle, classify == 2 && {paddingLeft: 20}]}>
                    <Image style={PlatfIOS ? {width: 22, height: 22} : {width: 18, height: 18}}
                           source={select ? require('../../imgs/problem/select_on.png')
                               : require('../../imgs/problem/select_off.png')}/>
                    <Text style={styles.itemText}>{rowData.keyValue}</Text>
                </View>
            </ATouchableHighlight>
        )
    }

    sectionItem(rowData, rowId) {
        let key = `${rowData.keyName}${rowId}`;
        let selected = this.props.state.StratifiedLevel.jobClassifyIsSpread[key];
        return (
            <View style={{}}>
                <ATouchableHighlight onPress={() => this.selectShow(key)}>
                    <View style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderBottomWidth: 1,
                        padding: 10,
                        borderBottomColor: '#e8e8e8',
                    }}>
                        <Text>{rowData.keyValue}</Text>
                        <Image
                            source={!selected ? require('../../imgs/other/down_arrow.png') : require('../../imgs/other/right_arrow.png')}
                            resizeMode={Image.resizeMode.contain}
                            style={!selected ? {width: 15, height: 9} : {width: 9, height: 15}}/>
                    </View>
                </ATouchableHighlight>
                {!selected && <Animated.View style={{backgroundColor:'white'}}>
                    {rowData.children&&!_.isEmpty(rowData.children)&&rowData.children.map((item, pos) => {
                        return this.commonItem(item, 2);
                    })}
                </Animated.View>}
            </View>
        )
    }

    selectShow(key) {
        this.props.actions.fetchJobClassifyIsSpread(key, this.props.isSingle)
    }

    sure() {
        let array = this.props.state.StratifiedLevel.jobClassifySelectData || [];
        // if (!_.isEmpty(array)) {
            this.props.onPress(true, cloneObj(array));
        // } else {
        //     toastShort("还没选哦，请点返回！！！", Toast.positions.CENTER)
        // }
    }

    componentWillUnmount() {
        this.props.state.StratifiedLevel.jobClassifySelectData = [];
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
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
        // ios: {
        padding: 10,
        // }, android: {padding: 8, marginLeft: 2}
    },

    itemText: {
        width: deviceWidth - 50,
        fontSize: PlatfIOS ? 16 : 14,
        marginLeft: 10
    },

});
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(StratifiedLevelAction, dispatch)
    })
)(JobSearchModal);