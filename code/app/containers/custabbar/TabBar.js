'use strict';

import React from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import ViewPropTypes from './config/ViewPropTypes';
import Layout from './Layout';

export default class TabBar extends React.Component {
  static propTypes = {
    ...Animated.View.propTypes,
    shadowStyle: ViewPropTypes.style,
  };

  render() {
    return (
      <Animated.View {...this.props} style={[styles.container, this.props.style]}>
        {this.props.children}
        <View style={[styles.shadow, this.props.shadowStyle]} />
      </Animated.View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
   // backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // height: Layout.tabBarHeight,//这个高度只适用于tab 是一条的情况 。像我们这种有突出的圆的。要注释掉
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
   // backgroundColor:'#rgba(51,51,51,1)'
  },
  shadow: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    height: Layout.pixel,
    position: 'absolute',
    left: 0,
    right: 0,
    top: Platform.OS === 'android' ? 0 : -Layout.pixel,
  },
});
