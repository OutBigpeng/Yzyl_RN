/**
 * 我的动态列表
 * Created by Monika on 2018/7/25.
 */
'use strict';
import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import NavigatorView from "../../component/NavigatorView";
import {connect, deviceHeight} from "../../common/CommonDevice";
import MyDiscussListView from "../me/mine/discuss/MyDiscussListView";


class Comm extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    };

    componentWillMount() {
        const {navigate, state} = this.props.navigation;
        this.title = state.params && state.params.title || '广场';
        this.type = state.params && state.params.type || 'other';
    }

    componentDidMount() {

    }

    render() {
        const {isLoginIn, userObj = {}, domainObj} = this.props.state.Login;
        return (
            <View style={styles.container}>
                <NavigatorView
                    {...this.props}
                    leftImageSource={false}
                    onTitleOnPress={() => {
                        this.scollToTop();
                    }}
                    contentTitle={this.title}
                />
                {<MyDiscussListView
                    ref={(component) => this.MyDiscussListView = component}
                    key={'MyDiscussList_MyDiscussListView'}
                    {...this.props}
                    type="myDiscussHomePage"
                    style={{height: deviceHeight}}
                    userId={userObj.userid}
                />}
            </View>
        );
    }

    scollToTop() {
        this.MyDiscussListView._pullToRefreshListView && this.MyDiscussListView._pullToRefreshListView._scrollView.scrollTo({
            x: 0,
            y: 0,
            animated: true
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(Comm);