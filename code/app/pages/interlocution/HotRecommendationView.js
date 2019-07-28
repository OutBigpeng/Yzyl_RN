import React, {Component} from 'react';
import {StyleSheet, View,} from 'react-native';

import CommonQuestionListView from './CommonQuestionListView'
import CommonHotProblemView from '../../component/CommonHotProblemView'
import {bindActionCreators, Colors, connect, PlatfIOS} from '../../common/CommonDevice'
import *as QuestionAction from '../../actions/QuestionAction'

class HotRecommendationView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        this._isMounted;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <View style={styles.container}>
                <CommonQuestionListView
                    {...this.props}
                    renderItem={this.renderItem}
                    view={1}
                />
            </View>
        )
    }

    renderItem = (rowData) => {
        return (
            <CommonHotProblemView
                {...this.props}
                rowData={rowData}
                onPress={()=>this.pushToDetail(rowData)}
            />
        )
    };

    pushToDetail(rowData) {
        const {navigate} = this.props.navigation;
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
         this.commonPush(navigate, rowData)

    }

    commonPush(navigate, rowData) {
        navigate('QuestionDetail', {
                title: '问题详情',
                id: rowData.id,
                replyCount: rowData.replyCount,
                view: 'hotRecommend',
                key:'hotRecommendKey',
            }
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        // height:300
        // marginBottom: PlatfIOS ? 70 : 75,
        flex: 1
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        QuestionAction: bindActionCreators(QuestionAction, dispatch),
    })
)(HotRecommendationView);