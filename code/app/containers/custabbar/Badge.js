'use strict';

import React from 'react';
import {StyleSheet, Text,} from 'react-native';

import Layout from './Layout';

export default class Badge extends React.Component {
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
        fontSize: 10,
        color: '#e4393c',
        backgroundColor: 'white',
        // height: 14,
        // width: 14,
        lineHeight:16,
        marginTop: 4,
        marginRight:2,
        textAlign: 'center',
        // borderWidth: 1 + Layout.pixel,
        borderColor: '#fefefe',
        borderRadius:8,
        overflow: 'hidden',
    },
});
