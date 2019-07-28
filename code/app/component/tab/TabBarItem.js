/**
 * Created by Monika on 2017/8/16.
 */
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import React, {Component} from 'react';

export default class TabBarItem extends Component {

    render() {
        let child = this.props.children;
        return (
            <View style={styles.weight}>
                {child}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    weight: {
        flex: 1,
    }
});