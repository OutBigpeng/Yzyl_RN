/**
 * Created by coatu on 2017/3/30.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {
    BGTextColor,
    borderRadius,
    Colors,
    deviceHeight,
    deviceWidth, Metrics,
    PlatfIOS,
    px2dp,
    Sizes
} from '../common/CommonDevice'
import ATouchableHighlight from "./ATouchableHighlight";

export class AuditNoDataView extends Component {
    render() {
        const {title, onPress} = this.props;
        return (
            <View style={styles.SearchViewStyle}>
                <Text style={{fontSize:  px2dp(18), marginTop: 12, color: 'gray'}}>数据有待查询</Text>
            </View>
        )
    }
}

//listview 没有数据的时候显示的view
export class NoDataView extends Component {
    render() {
        const {title, onPress, type, style} = this.props;
        let titles  = "";
        if (type !== 1) {
            titles = `暂无${title}`
        } else {
            titles = title
        }
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={[styles.SearchViewStyle,style?style:{}]}>
                    <Image source={require('../imgs/other/chongxinjiazai.png')} style={{width: 70, height: 70}}/>
                    <Text style={{fontSize: px2dp(Sizes.listSize), marginTop: 12, color: 'gray'}}>{titles}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export class NoSearchView extends Component {
    render() {
        const {title} = this.props;
        return (
            <View style={styles.SearchViewStyle}>
                <Text>{title}</Text>
            </View>
        )

    }
}

export class CommonNavTitleView extends Component {
    static propTypes = {
        title: PropTypes.string,
        fontsize: PropTypes.number,
        viewStyle: PropTypes.object,
        Color: PropTypes.string,
    };
    render() {
        const {title, fontsize, Color,viewStyle} = this.props;
        return (
            <View style={[styles.NavTitleViewStyle,viewStyle]}>
                <Text
                    style={{fontSize:fontsize?px2dp(fontsize):px2dp(Sizes.titleSize),
                        color:Color?Color:Colors.textColor}}>{title}</Text>
            </View>
        )
    }
}

export class CommonButton extends Component {
    static propTypes = {
        title: PropTypes.string,
        buttonStyle: PropTypes.array,
        buttonTitleStyle: PropTypes.object,
        buttonOnPress: PropTypes.func,
        buttonWidth: PropTypes.number,
        buttonHeight: PropTypes.number
    };

    render() {
        const {buttonStyle, buttonTitleStyle, buttonOnPress, title, buttonWidth, buttonHeight} = this.props;
        return (
            <ATouchableHighlight onPress={buttonOnPress}>
                <View style={[styles.ButtonViewStyle,buttonStyle]}>
                    <Text style={buttonTitleStyle?buttonTitleStyle:styles.ButtonTitleStyle}>{title}</Text>
                </View>
            </ATouchableHighlight>
        )
    }
}


export class CommonSuccessView extends Component{
    static propTypes = {
        BGColor: PropTypes.string, // 背景
        logo: PropTypes.number.isRequired, //logo
        title: PropTypes.string,
        isOther: PropTypes.bool, //是否有其他东西
        content: PropTypes.string
    };

    render() {
        const {BGColor, logo, title, isOther, content} = this.props;
        return (
            <View style={[styles.container,{backgroundColor:BGColor}]}>
                <View style={styles.successViewStyle}>
                    <Image source={logo}
                           style={styles.successImageStyle}/>
                    <Text style={styles.successViewTextStyle}>{title}</Text>
                    <Text style={[styles.successViewTextStyle,{marginTop:8}]}>{content}</Text>
                </View>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    headerViewStyle: {
        width: deviceWidth,
        height: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8'
    },
    lineViewStyle: {
        backgroundColor: '#rgba(237,237,237,1)',
        width: 1,
        height: 35
    },

    headerLeftBoxViewStyle: {
        width: deviceWidth / 2,
        alignItems: 'center',
        flexDirection: 'row',
    },

    headerBoxViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },

    headerTextStyle: {
        fontSize:  px2dp(PlatfIOS ? 16 : 14),
        color: '#rgba(91,97,102,1)'
    },

    ListViewStyle: {
        marginTop: 10
    },

    dropDown: {
        width: deviceWidth / 3.5,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },

    dropDownOptions: {
        width: deviceWidth,
        marginTop: 15,
        marginLeft: 0,
    },

    jiantouStyle: {
        width: 10,
        height: 10,
    },

    headerRightViewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    dateViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1
    },

    SearchViewStyle: {
        width: deviceWidth,
        height: deviceHeight - 200,
        alignItems: 'center',
        justifyContent: 'center'
    },

    ButtonViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BGTextColor,
        width: deviceWidth - 20,
        height: Metrics.buttonHeight,
        borderRadius: borderRadius,
        alignSelf:'center'
    },

    ButtonTitleStyle: {
        fontSize: px2dp(Sizes.navSize),
        color: 'white'
    },

    container:{
        flex:1
    },

    successViewTextStyle:{
        color: Colors.contactColor,
        fontSize:px2dp(Sizes.titleSize)
    },

    successViewStyle:{
        alignItems: 'center',
        marginTop: 40
    },

    successImageStyle:{
        width: 80,
        height: 80,
        marginBottom: 30
    },

    NavTitleViewStyle:{
        padding:10,
        borderBottomColor:Colors.line,
        borderBottomWidth:1
    }

});