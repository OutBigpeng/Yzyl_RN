/**
 * Created by Monika on 2017/12/13.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {StyleSheet, Text, View} from 'react-native';
import CustomTextView from "./CustomTextView";
import {px2dp, randomID} from "../common/CommonUtil";

let emojiReg = '\\[[^\\]]+\\]';
let nameReg = '@([^\\s@]+);';//@([^\\s@]+);
let chainReg = '#(.[^#]+?)#';
let httpReg = '((https://|http://|www\.|ftp://)[A-Za-z0-9\._\?%&;:+\-=/#]*)';
let emojiAt = new RegExp(emojiReg);
let nameAt = new RegExp(nameReg);
let chainAt = new RegExp(chainReg);
let httpAt = new RegExp(httpReg);

export default class CustomMsgView extends Component {


    static propTypes = {
        textContent: PropTypes.string,
        contentType: PropTypes.string,
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    };
    static defaultProps = {
    };

    constructor(props) {
        super(props);
        this.state = {
            textState: 1,
            rowHeight: 10000,
            Views: [],
        };
    }

    componentWillMount() {
        this.matchContentString(this.props.value)
    }

    render() {
        // let {key=""} = this.props
        return (
            <View  style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                {this.state.Views}
            </View>
        );
    }

    matchContentString(textContent) {
        // 匹配得到3个index并放入数组中
        let emojiIndex = textContent.search(emojiAt);
        let nameIndex = textContent.search(nameAt);
        let chainIndex = textContent.search(chainAt);
        let httpIndex = textContent.search(httpAt);
        let checkIndexArray = [];
        // 若匹配不到，则直接返回一个全文本
        if (emojiIndex === -1 && nameIndex === -1 && httpIndex === -1 && chainIndex === -1) {
            let emptyTextView = (<Text key={'emptyTextView' + (Math.random() * 100)}>{textContent}</Text>);
            this.state.Views.push(emptyTextView);
        } else {
            if (emojiIndex !== -1) checkIndexArray.push(emojiIndex);
            if (nameIndex !== -1) checkIndexArray.push(nameIndex);
            if (chainIndex !== -1) checkIndexArray.push(chainIndex);
            if (httpIndex !== -1) checkIndexArray.push(httpIndex);
            // 取index最小者
            let minIndex = Math.min.apply(Math, checkIndexArray);
            // 将0-index部分返回文本
            if(minIndex>0) {
                let firstTextView = (
                    <Text key={'firstTextView' + (Math.random() * 100)}>{textContent.substring(0, minIndex)}</Text>);
                this.state.Views.push(firstTextView);
            }
            // 将index部分作分别处理
            switch (minIndex) {
                case emojiIndex:
                    this.matchEmojiString(textContent.substring(minIndex));
                    break;
                case nameIndex:
                    this.matchNameString("name", textContent.substring(minIndex));
                    break;
                case chainIndex:
                    this.matchNameString("chain", textContent.substring(minIndex));
                    break;
                case httpIndex:
                    this.matchHttpString(textContent.substring(minIndex));
                    break;
                default:
                    break;
            }
        }
    }

    matchEmojiString(emojiStr) {
        let castStr = emojiStr.match(emojiAt);
        let emojiLength = castStr[0].length;
        // let imageView = (<Image key={emojiStr} style={{ width: 15, height: 14 }} source={emojiReflection[castStr]} />);
        // this.state.Views.push(imageView);
        this.matchContentString(emojiStr.substring(emojiLength));
    }

    matchNameString(type, nameStr) {
        let aa = type === "name" ? nameAt : chainAt;
        let castStr = nameStr.match(aa);
        let nameString = castStr[0];
        let nameView = (
            <CustomTextView  key = {type+nameString+randomID()} textContent={nameString} contentType={type}
                            style={{color: type === 'name' ? this.props.nameColor||'blue' : this.props.chainColor||'green'}}
                            onPress={(contentType, textContent) => this.props.onClick(contentType, textContent)}
            />);
        this.state.Views.push(nameView);
        this.matchContentString(nameStr.substring(nameString.length));
    }

    matchHttpString(httpStr) {
        let castStr = httpStr.match(httpAt);
        let httpString = castStr[0];
        let httpView = (
            <CustomTextView key = {httpString+randomID()} style={{color: 'red'}}
                            textContent={httpString} contentType={'http'}
                            onPress={(contentType, textContent) => this.props.onClick(contentType, textContent)}
            />);
        this.state.Views.push(httpView);
        this.matchContentString(httpStr.substring(httpString.length));
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