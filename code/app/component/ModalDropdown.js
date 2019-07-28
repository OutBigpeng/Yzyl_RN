/**
 * Created by sohobloo on 16/9/13.
 */


'use strict';

import React, {Component,} from 'react';

import {
    ActivityIndicator,
    Dimensions,
    ListView,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import PropTypes from 'prop-types';
import {scaleSize} from "../common/ScreenUtil";
import {px2dp} from "../common/CommonUtil";
import {PlatfIOS} from "../common/CommonDevice";

const TOUCHABLE_ELEMENTS = [
    'TouchableHighlight',
    'TouchableOpacity',
    'TouchableWithoutFeedback',
    'TouchableNativeFeedback'
];
const {width, height} = Dimensions.get('window');

let modalHeight = height/2;
let itemHeight = (scaleSize(66) + StyleSheet.hairlineWidth) * 5;
export default class ModalDropdown extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        scrollEnabled: PropTypes.bool,
        defaultIndex: PropTypes.number,
        defaultValue: PropTypes.string,
        options: PropTypes.array,

        accessible: PropTypes.bool,
        animated: PropTypes.bool,
        showsVerticalScrollIndicator: PropTypes.bool,
        keyboardShouldPersistTaps: PropTypes.string,

        style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        dropdownStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        modalStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        dropdownTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        dropdownTextHighlightStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

        adjustFrame: PropTypes.func,
        renderRow: PropTypes.func,
        renderSeparator: PropTypes.func,
        renderButtonText: PropTypes.func,

        onDropdownWillShow: PropTypes.func,
        onDropdownWillHide: PropTypes.func,
        onSelect: PropTypes.func,
        modalVisible: PropTypes.func,
    };

    static defaultProps = {
        disabled: false,
        scrollEnabled: true,
        defaultIndex: -1,
        defaultValue: 'Please select...',
        options: null,
        animated: true,
        showsVerticalScrollIndicator: true,
        keyboardShouldPersistTaps: 'never'
    };
    _onButtonPress = () => {
        const {onDropdownWillShow} = this.props;
        if (!onDropdownWillShow ||
            onDropdownWillShow() !== false) {
            this.show();
        }
    };
    _onRequestClose = () => {
        const {onDropdownWillHide} = this.props;
        if (!onDropdownWillHide ||
            onDropdownWillHide() !== false) {
            this.hide();
        }
    };
    _onModalPress = () => {
        const {onDropdownWillHide} = this.props;
        if (!onDropdownWillHide ||
            onDropdownWillHide() !== false) {
            this.hide();
        }
    };
    _renderRow = (rowData, sectionID, rowID, highlightRow) => {
        const {renderRow, showName,dropdownTextStyle, dropdownTextHighlightStyle, accessible} = this.props;
        const {selectedIndex} = this.state;
        const key = `row_${rowID}`;
        const highlighted = rowID * 1 === selectedIndex;
        const row = !renderRow ?
            (<Text style={[
                styles.rowText,
                dropdownTextStyle,
                highlighted && styles.highlightedRowText,
                highlighted && dropdownTextHighlightStyle
            ]}
            >
                {showName?rowData:rowData[showName]}
            </Text>) :
            renderRow(rowData, rowID, highlighted);
        const preservedProps = {
            key,
            accessible,
            onPress: () => this._onRowPress(rowData, sectionID, rowID, highlightRow),
        };
        if (TOUCHABLE_ELEMENTS.find(name => name === row.type.displayName)) {
            const props = {...row.props};
            props.key = preservedProps.key;
            props.onPress = preservedProps.onPress;
            const {children} = row.props;
            switch (row.type.displayName) {
                case 'TouchableHighlight': {
                    return (
                        <TouchableHighlight {...props}>
                            {children}
                        </TouchableHighlight>
                    );
                }
                case 'TouchableOpacity': {
                    return (
                        <TouchableOpacity {...props}>
                            {children}
                        </TouchableOpacity>
                    );
                }
                case 'TouchableWithoutFeedback': {
                    return (
                        <TouchableWithoutFeedback {...props}>
                            {children}
                        </TouchableWithoutFeedback>
                    );
                }
                case 'TouchableNativeFeedback': {
                    return (
                        <TouchableNativeFeedback {...props}>
                            {children}
                        </TouchableNativeFeedback>
                    );
                }
                default:
                    break;
            }
        }
        return (
            <TouchableHighlight {...preservedProps} >
                {row}
            </TouchableHighlight>
        );
    };
    _renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
        const key = `spr_${rowID}`;
        return (
            <View style={styles.separator}
                  key={key}
            />
        );
    };

    constructor(props) {
        super(props);

        this._button = null;
        this._buttonFrame = null;
        this._nextValue = null;
        this._nextIndex = null;

        this.state = {
            accessible: !!props.accessible,
            loading: !props.options,
            showDropdown: false,
            buttonText: props.defaultValue,
            selectedIndex: props.defaultIndex
        };
    }

    get _dataSource() {
        const {options} = this.props;
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        return ds.cloneWithRows(options);
    }

    componentWillReceiveProps(nextProps) {
        let {buttonText, selectedIndex} = this.state;
        const {defaultIndex, defaultValue, options} = nextProps;
        buttonText = this._nextValue == null ? buttonText : this._nextValue;
        selectedIndex = this._nextIndex == null ? selectedIndex : this._nextIndex;
        if (selectedIndex < 0) {
            selectedIndex = defaultIndex;
            if (selectedIndex < 0) {
                buttonText = defaultValue;
            }
        }
        this._nextValue = null;
        this._nextIndex = null;

        this.setState({
            loading: !options,
            buttonText,
            selectedIndex: selectedIndex * 1
        });
    }

    render() {
        return (
            <View {...this.props}>
                {this._renderButton()}
                {this._renderModal()}
            </View>
        );
    }

    _updatePosition(callback) {
        if (this._button && this._button.measure) {
            this._button.measure((fx, fy, width, height, px, py) => {
                this._buttonFrame = {x: px, y: py, w: width, h: height};
                callback && callback();
            });
        }
    }

    show() {
        this._updatePosition(() => {
            this.setModalVisible(true)
        });
    }

    hide() {
        this.setModalVisible(false)
    }

    select(idx) {
        const {defaultValue, options, defaultIndex, renderButtonText} = this.props;

        let value = defaultValue;
        if (idx == null || !options || idx >= options.length) {
            idx = defaultIndex;
        }

        if (idx >= 0) {
            value = renderButtonText ? renderButtonText(options[idx]) : options[idx].toString();
        }

        this._nextValue = value;
        this._nextIndex = idx;

        this.setState({
            buttonText: value,
            selectedIndex: idx * 1
        });
    }

    _renderButton() {
        const {disabled, accessible, children, textStyle} = this.props;
        const {buttonText} = this.state;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                ref={button => this._button = button}
                disabled={disabled}
                accessible={accessible}
                onPress={this._onButtonPress}
            >
                {
                    children ||
                    (
                        <View style={styles.button}>
                            <Text style={[styles.buttonText, textStyle]}
                                  numberOfLines={1}
                            >
                                {buttonText}
                            </Text>
                        </View>
                    )
                }
            </TouchableOpacity>
        );
    }

    _renderModal() {
        const {animated, accessible, dropdownStyle, modalStyle} = this.props;
        const {showDropdown, loading} = this.state;
        if (showDropdown && this._buttonFrame) {
            const frameStyle = this._calcPosition();
            const animationType = animated ? 'fade' : 'none';
            const {options} = this.props;
            let item1 = scaleSize(PlatfIOS?70:73);
            let item = scaleSize(modalHeight);
            let tempHeight = item1 * (options.length);
            tempHeight = Math.min(tempHeight, item);
            return (
                <Modal animationType={animationType}
                       visible={true}
                       transparent={true}
                       onRequestClose={this._onRequestClose}
                       supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
                >
                    <TouchableWithoutFeedback accessible={accessible}
                                              disabled={!showDropdown}
                                              onPress={this._onModalPress}
                    >
                        <View style={[styles.modal, modalStyle,{borderBottomRightRadius:scaleSize(4)}]}>
                            <View style={[styles.dropdown, dropdownStyle, frameStyle,{height:tempHeight,borderBottomRightRadius:scaleSize(4)}]}>
                                {loading ? this._renderLoading() : this._renderDropdown()}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            );
        }
    }

    _calcPosition() {
        const {dropdownStyle, style, adjustFrame} = this.props;

        const dimensions = Dimensions.get('window');
        const windowWidth = dimensions.width;
        const windowHeight = dimensions.height;

        const dropdownHeight = (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) ||
            StyleSheet.flatten(styles.dropdown).height;

        const bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
        const rightSpace = windowWidth - this._buttonFrame.x;
        const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
        const showInLeft = rightSpace >= this._buttonFrame.x;

        const positionStyle = {
            height: dropdownHeight,
            top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
        };

        if (showInLeft) {
            positionStyle.left = this._buttonFrame.x;
        } else {
            const dropdownWidth = (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
                (style && StyleSheet.flatten(style).width) || -1;
            if (dropdownWidth !== -1) {
                positionStyle.width = dropdownWidth;
            }
            positionStyle.right = rightSpace - this._buttonFrame.w;
        }

        return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
    }

    _renderLoading() {
        return (
            <ActivityIndicator size='small'/>
        );
    }

    _renderDropdown() {
        const {scrollEnabled, renderSeparator, showsVerticalScrollIndicator, keyboardShouldPersistTaps} = this.props;

        return (
            <ListView
                      scrollEnabled={scrollEnabled}
                      style={[styles.list,/*{height:tempHeight}*/]}
                      dataSource={this._dataSource}
                      renderRow={this._renderRow}
                      renderSeparator={renderSeparator || this._renderSeparator}
                      automaticallyAdjustContentInsets={false}
                      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            />
        );
    }

    _onRowPress(rowData, sectionID, rowID, highlightRow) {
        const {onSelect, renderButtonText, onDropdownWillHide} = this.props;
        if (!onSelect || onSelect(rowID, rowData) !== false) {
            highlightRow(sectionID, rowID);
            const value = renderButtonText && renderButtonText(rowData) || rowData.toString();
            this._nextValue = value;
            this._nextIndex = rowID;
            this.setState({
                buttonText: value,
                selectedIndex: rowID * 1
            });
        }
        if (!onDropdownWillHide || onDropdownWillHide() !== false) {
            this.setModalVisible(false)
        }
    }

    setModalVisible(flag) {
        this.props.modalVisible(flag);
        this.setState({
            showDropdown: flag
        },()=>{
        });
    }

    isShowDropdown() {
        return this.state.showDropdown;
    }
}
const styles = StyleSheet.create({
    button: {
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: px2dp(12)
    },
    modal: {
        flexGrow: 1
    },
    dropdown: {
        position: 'absolute',
        height: itemHeight,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
        borderRadius: scaleSize(4),
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    loading: {
        alignSelf: 'center'
    },
    list: {
        //flexGrow: 1,
    },
    rowText: {
        paddingHorizontal: scaleSize(12),
        paddingVertical: scaleSize(PlatfIOS?20:15),
        fontSize: px2dp(11),
        color: 'gray',
        backgroundColor: 'white',
        textAlignVertical: 'center'
    },
    highlightedRowText: {
        color: 'black'
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'lightgray'
    }
});
