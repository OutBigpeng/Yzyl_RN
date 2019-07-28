/**
 * Created by Monika on 2017/12/13.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {StyleSheet, Text} from 'react-native';
import ATouchableHighlight from "../component/ATouchableHighlight";
import {px2dp, randomID} from "../common/CommonUtil";

export default class CustomTextView extends Component {


    static propTypes = {
        // key: PropTypes.string,
        textContent: PropTypes.string,
        contentType: PropTypes.string,
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    };
    static defaultProps = {
        // key:randomID()+""
    };

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        let { textContent, contentType, style, onPress} = this.props;
        // console.log("CustomTextView", textContent, contentType);
        return (
            <ATouchableHighlight  onPress={()=>onPress(contentType,textContent)}>
                <Text style={style}>{textContent}</Text>
            </ATouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15
    },
    flexDirection: {
        flexDirection: 'row'
    },
    inputHeight: {
        height: 35,
        alignItems: 'center'
    },
    textInputStyle: {
        flex: 1,
        height: 35,
        fontSize:  px2dp(18),
    },
    buttonStyle: {
        fontSize:  px2dp(20),
        color: 'white',
        width: 100,
        textAlign: 'center',
        backgroundColor: '#4CA300'
    },
});