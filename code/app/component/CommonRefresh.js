/**
 * Created by coatu on 2017/5/11.
 */

import React from 'react';
import {
    ActivityIndicator,
    Platform,
    ProgressBarAndroid,
    StyleSheet,
    Text,
    View
} from 'react-native'
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
import {Colors, px2dp, Sizes} from "../common/CommonDevice";

export const _renderHeader = (viewState) => {
    let {pullState, pullDistancePercent} = viewState;
    let {refreshing,} = PullToRefreshListView.constants.viewState;
    pullDistancePercent = Math.round(pullDistancePercent * 100);
    switch (pullState) {
        case refreshing:
            return (_commonRefreshViews('', 1))
    }
};
export const _renderFooter = (viewState) => {
    let {pullState, pullDistancePercent} = viewState;
    let {load_more_idle, loading_more, loaded_all,} = PullToRefreshListView.constants.viewState;
    pullDistancePercent = Math.round(pullDistancePercent * 100);
    switch (pullState) {
        case load_more_idle:
            return (_commonRefreshViews(`上拉加载更多 ${pullDistancePercent}%`));
        case loading_more:
            return (_commonRefreshViews('加载中...', 1));
        case loaded_all:
            return (_commonRefreshViews('- 已经到底了 -'))
    }
};
_commonRefreshViews = (text, option) => {
    return (
        option === 1 ? <View style={styles.refreshTextStyle}>
                {_renderActivityIndicator()}<Text style={styles.refreshingTextStyle}>{text}</Text>
            </View> :
            <View style={styles.refreshTextStyle}>
                <Text style={styles.refreshingTextStyle}>{text}</Text>
            </View>
    )
};
export const _renderActivityIndicator = () => {
    return ActivityIndicator ? (
        <ActivityIndicator
            style={{marginRight: 10,}}
            animating={true}
            color={'gray'}
            size={'small'}/>
    ) : Platform.OS == 'android' ?
        (
            <ProgressBarAndroid
                style={{marginRight: 10,}}
                color={'gray'}
                styleAttr={'Small'}/>
        ) : (
            <ActivityIndicator
                style={{marginRight: 10,}}
                animating={true}
                color={'gray'}
                size={'small'}/>
        )
};


const styles = StyleSheet.create({
    refreshTextStyle: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },

    refreshingTextStyle: {
        color: Colors.ExplainColor,
        fontSize: px2dp(Sizes.searchSize)
    }
});
