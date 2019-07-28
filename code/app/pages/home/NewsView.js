/**
 * Created by coatu on 2017/8/23.
 */
import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native';

import {_, BGColor, bindActionCreators, connect, Loading} from '../../common/CommonDevice'
import {getListShowGroupByCode} from "../../dao/HomeDao";
import {NoDataView} from '../../component/CommonAssembly'
import *as HomeAction from '../../actions/HomeAction'
import HomeList from './HomeList'

class NewsView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            typeLabelBts: [],
            isNetWork: true
        };
    }

    getLoading() {
        return this.refs['loading'];
    }

    componentDidMount() {
        this.navigationParams();
        this.getNetwork()
    }


    navigationParams() {
        const {state, navigate} = this.props.navigation;
        this.props.navigation.setParams({
            rightImageSource: true,
            rightOnPress: () =>
                navigate('SearchFirstView', {
                    rightImageSource: true,
                    selectItem: 'Home',
                    paged: 5
                })
        });
    }

    getNetwork() {
        let {navigate, state} = this.props.navigation;
        this.getLoading().show();
        getListShowGroupByCode("news", 0, (res) => {
            this.getLoading().dismiss();
            if (res && res[0]) {
                let typeDatum;
                if (state.params.label) {
                    let tempArr = res.filter((item) => {
                        return item.key == state.params.label;
                    });
                    typeDatum = tempArr[0];
                } else {
                    typeDatum = res[0];
                }
                this.props.HomeAction.selectedLabelInfo(typeDatum, 'new', false);
                this.setState({
                    typeLabelBts: res,
                    isNetWork: true,
                })
            }
        }, (error) => {
            this.getLoading().dismiss();
            this.setState({
                isNetWork: false
            })
        })
    }

    render() {
        return (
            <View style={styles.container}>
                {!_.isEmpty(this.state.typeLabelBts) ?
                    this.typeList(this.state.typeLabelBts) : null}
                <Loading ref={'loading'}/>
            </View>
        )
    }

    typeList(data) {
        return (
            this.state.isNetWork && !_.isEmpty(this.state.typeLabelBts) ?
                <HomeList
                    {...this.props}
                    typeData={this.state.typeLabelBts}
                    viewType="NewsView"
                    getNetwork={() => this.getNetwork()}
                />
                : <NoDataView title="数据" onPress={() => this.getNetwork()}/>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: BGColor,
        flex: 1
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        HomeAction: bindActionCreators(HomeAction, dispatch),
    })
)(NewsView);