// @flow
import {Platform} from 'react-native'

// 不能使用rgb，必须rgba
const colors = {
    BGColor: '#f0f0f0',//背景色
    whiteColor: '#fff',
    line: '#dddddd',//分割线的颜色
    redColor: '#e4393c',//全局红色包括字体的红色
    fontColor:'#353535',
    titleColor: '#333333',//标题的颜色
    contactColor: '#666666',//内容颜色
    inputColor: '#bbbbbb',//input提示文字颜色
    placeholderColor:'#F0F0F0',
    ExplainColor: '#999999',//辅助性文字的颜色
    clear: 'rgba(0,0,0,0)',
    transparent: 'rgba(0,0,0,0)',
    situColor:'rgba(228,57,60,1)',//主色调
    tabBarColor: '#rgba(51,51,51,1)',//tabBar颜色
    background: '#rgba(242,242,242,1)',
    textColor: '#rgba(0,0,0,0.8)',
    silver: '#F7F7F7',
    steel: '#CCCCCC',
    error: 'rgba(200, 0, 0, 0.8)',
    ricePaper: 'rgba(255,255,255, 0.75)',
    frost: '#D8D8D8',
    cloud: 'rgba(200,200,200, 0.35)',
    windowTint: 'rgba(0, 0, 0, 0.4)',

};
const colorsIos = {};

const colorsAndroid = {};

export default Object.assign(colors, (Platform.OS === 'ios' ? colorsIos : colorsAndroid))
