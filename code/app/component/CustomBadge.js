/**
 * Created by Monika on 2016/11/10.
 */
'use strict';

import React from "react";
import {StyleSheet, Text, PixelRatio, Platform} from "react-native";
import {BGTextColor} from "../common/CommonDevice";

let pixel = 1 / PixelRatio.get();
export default class CustomBadge extends React.Component {
    static propTypes = Text.propTypes;

    constructor(props, context) {
        super(props, context);

        this._handleLayout = this._handleLayout.bind(this);
    }

    state = {
        computedSize: null,
    };

    render() {
        let {computedSize} = this.state;
        let style = {};
        if (!computedSize) {
            style.opacity = 0;
        } else {
            style.width = Math.max(computedSize.height, computedSize.width);
        }

        return (
            <Text
                {...this.props}
                numberOfLines={1}
                onLayout={this._handleLayout}
                style={[styles.container, this.props.style, style]}>
                {this.props.children}
            </Text>
        );
    }

    _handleLayout(event) {
        let {width, height} = event.nativeEvent.layout;
        let {computedSize} = this.state;
        if (computedSize && computedSize.height === height &&
            computedSize.width === width) {
            return;
        }

        this.setState({
            computedSize: {width, height},
        });

        if (this.props.onLayout) {
            this.props.onLayout(event);
        }
    }
}

let styles = StyleSheet.create({
    container: {
        fontSize:  Platform.OS === 'ios' ?12:10,
        color: BGTextColor,
        backgroundColor: 'white',
        lineHeight: Platform.OS === 'ios' ? 18 : 16,
        textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? 1.5 : 2.5,
        marginRight: 2,
        // borderWidth: 1 + pixel,
        /*  borderColor: '#fefefe',*/
        borderRadius: Platform.OS === 'ios' ?18 / 2:8,
        overflow: 'hidden',
        alignItems: 'center',
    },
});
