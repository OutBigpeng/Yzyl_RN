import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, SectionList, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {scaleSize} from "../../common/ScreenUtil";
import {px2dp,} from "../../common/CommonUtil";

const {width, height} = Dimensions.get('window');
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import {BGTextColor, PlatfIOS} from "../../common/CommonDevice";


export default class SectionListContacts extends Component {

    static propTypes = {
        sectionListData: PropTypes.array.isRequired,//传入的数据
        sectionHeight: PropTypes.number,
        sectionHeaderHeight: PropTypes.number,
        letterViewStyle: View.propTypes.style,//右边字母组件样式
        sectionItemViewStyle: View.propTypes.style,//item组件样式
        sectionItemTextStyle: Text.propTypes.style,//item文字样式
        sectionHeaderTextStyle: Text.propTypes.style,//头部文字样式
        showAlphabet: PropTypes.bool, //是否显示右边字母
        otherAlphabet: PropTypes.string, //其他的字符串
        selectItemDefaultValue:PropTypes.string,
    };

    static defaultProps = {
        sectionHeight: scaleSize(80),
        sectionHeaderHeight: scaleSize(80),
        showAlphabet: true,
        otherAlphabet: '其他'
    };
    _renderSectionHeader = ({section}) => {
        if (this.props.renderHeader) {
            return (
                this.props.renderHeader(section)
            )
        }
        return (
            <View style={[styles.sectionHeaderView, {height: this.props.sectionHeaderHeight,}]}>
                <Text style={[styles.sectionHeaderText, this.props.sectionHeaderTextStyle]}>{section.key}</Text>
            </View>
        )
    };
    _keyExtractor = (item, index) => index;

    _renderItem = ({item, index}) => {
        if (this.props.renderItem) {
            return (
                this.props.renderItem(item)
            )
        }
        return (
            <SectionItem
                {...this.props}
                callback={() => {
                    this.props.SectionListClickCallback(item, index)
                }}
                item={item}/>
        )
    };

    constructor(props) {
        super(props);
    }

    filterData() {
        let data = this.props.sectionListData;
        let delData = [];
        let letterData = [];
        for (let i in data) {
            if (data[i].data.length !== 0) {
                delData.push(data[i]);
                letterData.push(data[i].key)
            }
        }
        return {
            delData: delData,
            letterData: letterData
        }
    }

    render() {
        let filterData = this.filterData();
        let delData = filterData.delData;
        let letterData = filterData.letterData;

        return (
            <View style={styles.container}>
                <SectionList
                    {...this.props}
                    style={this.props.SectionListStyle}
                    ref={s => this.sectionList = s}
                    keyExtractor={this._keyExtractor}
                    sections={delData}
                    renderSectionHeader={this._renderSectionHeader}
                    renderItem={this._renderItem}
                    getItemLayout={
                        sectionListGetItemLayout({
                            // The height of the row with rowData at the given sectionIndex and rowIndex
                            getItemHeight: (rowData, sectionIndex, rowIndex) => sectionIndex !== 0 ? this.props.sectionHeaderHeight :  this.props.sectionHeight,
                            getSectionHeaderHeight: () => this.props.sectionHeaderHeight, // The height of your section headers
                            // These four properties are optional
                            // getSeparatorHeight: () => PlatfIOS ? null : scaleSize(2), // The height of your separators
                            // getSectionFooterHeight: () => 0, // The height of your section footers
                            // listHeaderHeight: this.props.sectionHeight, // The height of your list header
                        })
                     }
                />
                {
                    this.props.showAlphabet ? (
                        <View style={[styles.letterView, this.props.letterViewStyle]}>
                            {
                                letterData.map((item, index) => {
                                    let otherStyle = [];
                                    if (index === letterData.length - 1) {
                                        if (item === this.props.otherAlphabet) {
                                            otherStyle.push({width: 20})
                                        }
                                    }
                                    return (
                                        <TouchableWithoutFeedback key={'letter_' + index} onPress={() => {
                                            this.sectionList.scrollToLocation({
                                                animated: true,
                                                itemIndex: 0,
                                                sectionIndex: index,
                                                viewOffset: this.props.sectionHeight
                                            })
                                        }}>
                                            <View style={[styles.letterItemView, otherStyle]}>
                                                <Text numberOfLines={0}
                                                      style={[styles.letterText, this.props.letterTextStyle]}>{item}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>
                    ) : (
                        <View/>
                    )
                }
            </View>
        )
    }

}

class SectionItem extends PureComponent {
    render() {
        let name = this.props.item[this.props.showName];
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.callback()
            }}>
                <View style={[styles.itemStyle, this.props.sectionItemViewStyle, {height: this.props.sectionHeight}]}>
                    <Text
                        style={[styles.artistText, this.props.sectionItemTextStyle,
                            name===this.props.selectItemDefaultValue&&{color:BGTextColor}]}>{name}</Text>
                </View>
            </TouchableWithoutFeedback>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemStyle: {
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#E4E4E4',
        borderBottomWidth: scaleSize(2),
        paddingHorizontal: scaleSize(20),
        justifyContent: 'center',
        width: '100%'
    },
    letterView: {
        width: scaleSize(60),
        // height: '100%',
        position: 'absolute',
        right: 0,
        flex: 1,
        justifyContent: 'center',
    },
    sectionHeaderView: {
        justifyContent: 'center',
        backgroundColor: '#eeeeee',
        paddingHorizontal: scaleSize(20),
        borderBottomWidth: scaleSize(2),
        borderBottomColor: '#E4E4E4'
    },
    sectionHeaderText: {
        color: '#333333',
        fontSize: px2dp(14),
        fontWeight: 'bold'
    },
    lineView: {
        width: '100%',
        height: scaleSize(2),
        backgroundColor: '#e5e5e5',
        position: 'absolute',
        bottom: 0
    },
    letterItemView: {
        alignItems: 'center',
        paddingVertical: scaleSize(2),
        paddingHorizontal: scaleSize(4),
        backgroundColor: "transparent"
    },
    letterText: {
        color: '#333333'
    },
    artistText: {
        fontSize: px2dp(15),
        color: '#4B4B4B'
    },
});
