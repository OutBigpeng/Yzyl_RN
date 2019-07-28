/**涂料大学页面
 * Created by coatu on 2017/8/21.
 */
import React, {Component} from 'react'
import {Animated, StyleSheet, View} from 'react-native'
import {_, BGColor, bindActionCreators, connect, Loading} from '../../common/CommonDevice'
import ProductNavigator from '../find/ProductNavigator'
import * as HomeAction from "../../actions/HomeAction";
import * as CoatingUniversityAction from "../../actions/CoatingUniversityAction";
import {NoDataView} from "../../component/CommonAssembly";
import BrannerView from "../../component/BrannerView";
import {StringData} from '../../themes'
import {getListShowGroupByCode} from "../../dao/HomeDao";
import ClassifyListView from "./ClassifyListView";
import * as FindAction from "../../actions/FindAction";


class Technical extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            scrollY: new Animated.Value(0),
            selectedLabel: '',
            selectedId: '',
            selectType: 0,
            selectView: '',
            isNetWork: true,//是否有网,
            isRefreshing: false,
            pages: 0,
            headType: false
        };
        this._isMounted;
    }

    componentDidMount() {
        this._isMounted = true;
        this.getNetwork()
    }

    getLoading() {
        return this.refs['loading'];
    }

    getNetwork(option) {
        this.getLoading().show();
        let {navigate} = this.props.navigation;
        this.props.findAction.fetchBrannerIfNeeded(1);
        getListShowGroupByCode("article", 0, (res) => {
            if (res) {
                this.props.coatingUniversityAction.fetchSetSelectCoatingLabel(res);
                this._isMounted && this.setState({
                    isNetWork: true,
                    isRefreshing: false
                }, () => {
                    this.getLoading().dismiss();
                });
            }
        }, (error) => {
            this.getLoading().dismiss();
            this._isMounted && this.state.isNetWork && this.setState({
                isNetWork: false
            })
        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        const {selectCoatingLabelList, selectCoatingLabel} = this.props.state.CoatingUniversity;

        return (
            <View style={styles.container}>
                {this.setActionBar()}
                {this.state.isNetWork ? !_.isEmpty(selectCoatingLabelList) ?
                    this.typeList()
                    : <View/>
                    : this.state.isNetWork ?
                        this.noDataView(1) :
                        this.noDataView(2)
                }
                <Loading ref={'loading'}/>
            </View>
        );
    }

    setActionBar() {
        let lbsOpaticy = this.state.scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: ['rgba(228,57,60,0)', 'rgba(228,57,60,1)']
        });
        return (
            <ProductNavigator
                {...this.props}
                lbsOpaticy={lbsOpaticy}
                page='technical'
                isNetWork={this.state.isNetWork}
                count={this.props.state.Find.collectProductCount}
                searchOnPress={() => this.pushToSearchView()}/>
        )
    }

    header() {
        return (
            <BrannerView key={'Technical_brannerView'} {...this.props} type={1}/>
        )
    }

    noDataView(option) {
        return (
            <View style={{flex: 1}}>
              {/*  <NavigatorView
                    {...this.props}
                    contentTitle=''
                    isShowTabBar={true}
                    leftImageSource={false}
                />*/}
                <NoDataView title={option === 2 ? StringData.noNetWorkText : "数据"} onPress={() => this.getNetwork()}
                            type={option === 2 ? 1 : 2}/>
            </View>
        )
    }

    typeList() {
        let {selectCoatingLabelList, selectCoatingLabel} = this.props.state.CoatingUniversity;
        return (
            <ClassifyListView
                {...this.props}
                typeData={selectCoatingLabelList}
                viewType="Coating"
                header={() => this.header()}
                scroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                ref={(home) => {
                    this.typeView = home
                }}
                getNetwork={() => this.getNetwork(1)}
            />
        );
    }


    pushToSearchView() {
        const {navigate} = this.props.navigation;
        navigate('SearchFirstView', {
            rightImageSource: true,
            selectItem: 'Article',
            paged: 5
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(HomeAction, dispatch),
        coatingUniversityAction: bindActionCreators(CoatingUniversityAction, dispatch),
        findAction: bindActionCreators(FindAction, dispatch)
    })
)(Technical);