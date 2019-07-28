/**
 * Created by Monika on 2017/8/16.
 */
import {Animated, Image, Platform, Text, TouchableHighlight, View,ViewPropTypes} from 'react-native';
import React, {Component} from 'react'
import PropTypes from 'prop-types';

import TabBarItem from './TabBarItem';
import {Colors, Resources, StyleSheet} from '../../themes';
import {deviceWidth, PlatfIOS} from "../../common/CommonDevice";
import {px2dp} from "../../common/CommonUtil";

let defaultHeight = Platform.OS == 'ios' ? 42.5 * Resources.screen.scale : 45 + 1;
let isCircleHeight = 60 * Resources.screen.scale;
let defaultTabWidth = 0;
let isCircleWidth = 0;
export default class TabBar extends Component {
    static Item = TabBarItem;

    static defaultProps = {
        defaultPage: 0,
        badgeCount: 0,
        centerCircle: false,
        isCircleBg: false
    };

    static propTypes = {
        ...ViewPropTypes,
        style: ViewPropTypes.style,
        defaultPage: PropTypes.number,
        badgeCount: PropTypes.number,
        onItemSelected: PropTypes.func,
        centerCircle: PropTypes.bool,
        isCircleBg: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.visibles = [];
        this.state = {
            selectedIndex: 0,
        }
    }

    render() {
        let children = this.props.children;
        if (!children.length) {
            throw new Error("at least two child component are needed.");
        }


        defaultTabWidth = Resources.screen.screenWidth / children.length + 1;
        isCircleWidth = defaultTabWidth / 2;
        let circleImg = 33;
        // 底部tab按钮组
        let navs = [];
        const contentViews = children.map(
            (child, i) => {
                let isSelect = this.state.selectedIndex === i;
                const imgSrc = isSelect ? child.props.selectedIcon : child.props.icon;
                const textColor = {color: isSelect ? Colors.situColor : 'white'};

                navs[i] = (
                    <TouchableHighlight
                        key={i}
                        underlayColor={'transparent'}
                        style={[styles.navItem, {}]}
                        onPress={() => {
                            if (child.props.onPress) {
                                child.props.onPress();
                            }

                            this.update(i);
                        }}>
                        <View>
                            <View style={[styles.navView, styles.circleBg, {
                                height: defaultHeight, bottom: 0,
                                width: Resources.screen.screenWidth / children.length
                            }]}/>
                            {child.props.isCircleBg ?
                                <View style={[styles.circleView, {justifyContent: 'center', alignItems: 'center'}]}>
                                    <View style={[styles.circleBg, {
                                        borderRadius: circleImg + 12,
                                        width: circleImg + 12,
                                        top: 0,
                                        height: circleImg + 12,
                                        justifyContent: 'center',
                                        //  backgroundColor:'blue'
                                    }]}>
                                        <Image style={[{width: circleImg, height: circleImg, margin: 3}]}
                                               resizeMode='cover' source={child.props.circleImg}/>
                                    </View>

                                    <Text
                                        style={[styles.navText, textColor, {
                                            position: 'absolute',
                                            bottom: PlatfIOS ? px2dp(deviceWidth == 320 ? -1 : 0) : 0,
                                            alignItems: 'center',
                                        }]}>{child.props.text}</Text>
                                </View>
                                :
                                <View style={[styles.navView, {
                                    height: defaultHeight,
                                    width: Platform.OS == 'ios' ? defaultTabWidth : defaultTabWidth + 1
                                }]}>
                                    <Image style={[styles.navImage]}
                                           resizeMode='stretch' source={imgSrc}/>
                                    {child.props.badgeCount > 0 ?
                                        <View style={styles.badgeView}>
                                            <Text style={styles.badgeText}>{child.props.badgeCount}</Text>
                                        </View> : <View/>}
                                    <Text style={[styles.navText, textColor]}>{child.props.text}</Text>
                                </View>
                            }
                        </View>
                    </TouchableHighlight>
                );

                if (!this.visibles[i]) {
                    return null;
                } else {
                    const style = isSelect ? styles.base : [styles.gone];//[styles.base, styles.gone]
                    return (
                        <View
                            key={'view_' + i}
                            style={style}>
                            {child}
                        </View>
                    );
                }
            }
        );

        return (
            <View style={[styles.container, this.props.style,]}>
                <Animated.View
                    style={[styles.nav, this.props.centerCircle ? {height: isCircleHeight} : {height: defaultHeight}]}>
                    {navs}
                </Animated.View>
            </View>
        );
    }

    componentDidMount() {
        let page = this.props.defaultPage;

        if (page >= this.props.children.length || page < 0) {
            page = 0;
        }
        this.visibles.fill(false, 0, page);
        this.update(page);
    }

    update(index) {
        this.visibles[index] = true;
        this.setState({
            selectedIndex: index,
        });

        if (this.props.onItemSelected) {
            this.props.onItemSelected(index);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        opacity: 1,
        backgroundColor: 'transparent',
        width: Resources.screen.screenWidth,
        overflow: 'hidden',
    },
    base: {
        position: 'absolute',
        overflow: 'hidden',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    gone: {
        top: Resources.screen.screenHeight,
        bottom: -Resources.screen.screenHeight,
    },
    nav: {
        flexDirection: 'row',
        width: Resources.screen.screenWidth,

    },
    navItem: {
        flex: 1,
        // alignItems: 'center',//左右
        justifyContent: 'flex-end',//上下
    },
    navView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 3,
        backgroundColor: Colors.tabBarColor,
    },
    badgeView: {
        width: 15,
        height: 15,
        borderRadius: 15 / 2,
        backgroundColor: 'red',
        alignSelf: 'flex-end',
        position: 'absolute',
        top: Platform.OS == 'ios' ? 2 : 4,
        right: Platform.OS == 'ios' ? 18 : 20,
        alignItems: 'center',
        justifyContent: 'center'
    },

    badgeText: {
        fontSize: px2dp(8),
        color: 'white'
    },

    navText: {
        fontSize: px2dp(11),
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: PlatfIOS ? 2 : 3,
        android: {marginTop: 2},
        ios: {marginTop: 1},
    },

    navImage: {
        width: 22.8,//22.8
        height: 21,//21.5
        ios: {marginBottom: 4},
        android: {marginBottom: 2},
    },

    circleView: {
        height: isCircleHeight,
        alignItems: 'center',
        flexDirection: 'column'
    },

    circleBg: {
        backgroundColor: Colors.tabBarColor,
        position: 'absolute',
        alignItems: 'center',
    },

    circleColorBg: {
        backgroundColor: Colors.situColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },

    horizonLine: {
        backgroundColor: '#adadad',
        height: 0.5,
        width: Resources.screen.screenWidth,
    },
});
/**  {!child.props.circleImg?
 <View style={[styles.circleBg,{
                                    borderRadius: isCircleWidth+8,
                                    width:isCircleWidth+8,
                                    top:0,
                                    height: isCircleWidth+8,
                                }]}>
 <View style={[styles.circleColorBg,{
                                        borderRadius: isCircleWidth-5,
                                        width: isCircleWidth-5,
                                        height: isCircleWidth-5
                                    }]}>
 <Image style={[styles.navImage,{}]}
 resizeMode='cover' source={ child.props.icon}/>
 </View>
 </View>
 */