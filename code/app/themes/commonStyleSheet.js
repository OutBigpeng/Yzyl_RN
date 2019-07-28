/**
 * Created by mifind on 16/12/7.
 *
 * 使用方法
 *  var StyleSheet = require('ccmsStyle')
 *
 *  const styles = StyleSheet.create({
 *  example:{
 *     textSize:12,
 *     //ios 样式
 *     ios:{
 *        color:'#F123411',
 *
 *     },
 *     //android 样式
 *     android:{
 *      color:'#F22222',
 *     }
 *  }
 *  ]);
 *
 */


'use strict';

import {StyleSheet, Platform} from 'react-native';

export function create(styles: Object): {[name: string]: number} {
    const platformStyles = {};
    Object.keys(styles).forEach((name) => {
        let {ios, android, ...style} = {...styles[name]};
        if (ios && Platform.OS === 'ios') {
            style = {...style, ...ios};
        }
        if (android && Platform.OS === 'android') {
            style = {...style, ...android};
        }
        platformStyles[name] = style;
    });
    return StyleSheet.create(platformStyles);
}
