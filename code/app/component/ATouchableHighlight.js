/**
 * Created by Monika on 2017/9/13.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {Platform, TouchableHighlight,ViewPropTypes} from 'react-native';
import debounce from "tiny-debounce";

export default class ATouchableHighlight extends PureComponent {

    static defaultProps = {
        delayTime: Platform.OS === 'ios' ? 200 : 320
    };
    static propTypes = {
        ...ViewPropTypes,
        onPress: PropTypes.func,
        onLongPress: PropTypes.func,
        delayTime: PropTypes.number,
        style: PropTypes.oneOfType([PropTypes.array, PropTypes.object,PropTypes.number]),
    };

    render() {
        let {onPress, delayTime, children, onLongPress} = this.props;
        return (
            <TouchableHighlight
                underlayColor='transparent'
                {...this.props}
                onPress={onPress ? debounce(onPress, delayTime) : null}
                // style={style}
                onLongPress={onLongPress}>
                {children}
            </TouchableHighlight>
        )
    }
}