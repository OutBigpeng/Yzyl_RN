/**加载图
 */
'use strict';
import React,{Component} from 'react';

import {
    StyleSheet,
    View,
    Platform,
    ActivityIndicator


} from 'react-native';
export default class CircleProgress extends Component{

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }
    render(){
        return(
            <ActivityIndicator
                animating = {true}
                color="white"
                style={styles.centering}
                size = 'small'
            />
        );
    };
};

const styles = StyleSheet.create({

    centering:{
        justifyContent:'center',
        alignItems:'center',
        height:40,
        width:40
    }
});
