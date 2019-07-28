/** @列表选择
 * Created by Monika on 2017/7/6.
 */
import React, {Component} from "react";
import {Image, ListView, StyleSheet, Text, View} from "react-native";
import TimerEnhance from "react-native-smart-timer-enhance";
import {NoDataView} from '../../component/CommonAssembly'
import *as QuestionAction from "../../actions/QuestionAction";
import {
    _,
    AvatarStitching,
    BGColor,
    bindActionCreators,
    Colors,
    connect,
    deviceWidth,
    Loading,
    Sizes
} from "../../common/CommonDevice";
import ATouchableHighlight from "../../component/ATouchableHighlight";

const dismissKeyboard = require('dismissKeyboard');

class MyFollowView extends Component {
    navigatePress = () => {
        const {state, navigate, goBack} = this.props.navigation;
        const {selectallCertifiedListData} = this.props.state.Question;
        state.params.callback(selectallCertifiedListData);
        goBack();
    };

// 构造
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        // 初始状态
        this.state = {
            dataSource: ds,
            isSelected: false,
            isLoading: true,
            isStatus: true
        };
        this.props.state.Question.allCertifiedData = [];
        this.props.state.Question.selectallCertifiedListData = [];
        this.props.state.Question.selectallCertifiedIds = [];
        this.props.state.Question.allCertifiedRes = [];
    }

    componentDidMount() {
        dismissKeyboard();
        this.props.navigation.setParams({
            rightOnPress: this.navigatePress,
        });
        this.getNetwork()
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    getNetwork() {
        let that = this;
        that.getLoading().show();
        const {state, navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        this.props.actions.fetchListAllCertifiedUser( this.props.navigation, true, that)
    }

    //
    componentWillReceiveProps(nextProps) {
        const {allCertifiedData, allCertifiedLoading} = nextProps.state.Question;
        if (allCertifiedData.length > 0) {
            this.setState({
                isStatus: true
            })
        } else {
            this.setState({
                isStatus: false
            })
        }
    }

    render() {
        const {allCertifiedData, allCertifiedLoading} = this.props.state.Question;
        return (
            <View style={[styles.container, {}]}>
                {allCertifiedData || this.state.isStatus ?
                    <ListView
                        dataSource={this.state.dataSource.cloneWithRows(allCertifiedData)}
                        renderRow={(rowData) => this.renderRow(rowData)}
                        enableEmptySections={true}
                        removeClippedSubviews={false}
                    /> : <NoDataView title="数据" onPress={() => this.getNetwork()}/>}

                <Loading ref={'loading'}/>
            </View>
        )
    }


    renderRow(rowData, sectionId, rowID) {
        const {selectallCertifiedIds} = this.props.state.Question;
        const {isLoginIn, userObj = {}, domainObj = {}} = this.props.state.Login;

        let select;
        if (_.contains(selectallCertifiedIds, rowData.id)) {
            select = true
        } else {
            select = false;
        }
        let url;
        if (rowData && rowData.logo) {
            url = AvatarStitching(rowData.logo, domainObj.avatar)
        }

        return (
            <View style={[styles.rowViewStyle, {justifyContent: 'space-between'}]}>
                <View style={styles.allViewStyle}>
                    <Image
                        source={url ? {uri: url} : require('../../imgs/home/defaultVipAvatar.png')}
                        style={styles.imageStyle}/>
                    <Text style={styles.textStyle}>{rowData.nickname}</Text>
                </View>
                <ATouchableHighlight style={{padding: 10}}
                                     onPress={() => this.selectFolow(rowData, rowID)}>
                    <Image
                        source={select ? require('../../imgs/problem/select_on.png')
                            : require('../../imgs/problem/select_off.png')}
                        resizeMode={Image.resizeMode.contain}
                        style={{width: 18, height: 18}}/>
                </ATouchableHighlight>
            </View>
        )
    }

    selectFolow(rowData) {
        //选中购物车
        this.props.actions.fetchSelectCertifiedUser(rowData);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    },

    refreshTextStyle: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },

    rowViewStyle: {
        width: deviceWidth,
        height: 50,
        backgroundColor: 'white',
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    allViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    imageStyle: {
        width: 25,
        height: 25,
        borderRadius: 12.5
    },

    textStyle: {
        marginLeft: 10,
        color: Colors.contactColor,
        fontSize: Sizes.listSize
    }
});
export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(QuestionAction, dispatch)
    })
)(TimerEnhance(MyFollowView));