'use strict';

import React, {PureComponent} from 'react';

import {
    ActivityIndicator,
    Animated,
    DeviceEventEmitter,
    Dimensions,
    findNodeHandle,
    Platform,
    ProgressBarAndroid,
    requireNativeComponent,
    StyleSheet, Text,
    UIManager,
    View,
    ViewPropTypes,
    WebView
} from 'react-native';

import PropTypes from 'prop-types';

import Immutable from 'immutable';
import {domMutationObserveScript, getScript, onHeightUpdated} from './common.js';

var keyMirror = require('fbjs/lib/keyMirror');

const RCTAutoHeightWebView = requireNativeComponent('RCTAutoHeightWebView', AutoHeightWebView, {
    nativeOnly: {
        nativeOnly: {
            onLoadingStart: true,
            onLoadingError: true,
            onLoadingFinish: true,
            messagingEnabled: PropTypes.bool
        }
    }
});

var WebViewState = keyMirror({
    IDLE: null,
    LOADING: null,
    ERROR: null,
});
var _renderActivityIndicator = () => {
    return ActivityIndicator ? (
        <View style={styles.loadingView}>
            <ActivityIndicator
                style={{marginRight: 10,}}
                animating={true}
                color={'gray'}
                size={'small'}/>
        </View>
    ) : Platform.OS === 'android' ?
        (<View style={styles.loadingView}>
                <ProgressBarAndroid
                    style={{marginRight: 10,}}
                    color={'gray'}
                    styleAttr={'Small'}/>
            </View>
        ) : (
            <View style={styles.loadingView}>
                <ActivityIndicatorIOS
                    style={{marginRight: 10,}}
                    animating={true}
                    color={'gray'}
                    size={'small'}/>
            </View>
        )

};
var defaultRenderLoading = () => (
    <View style={styles.loadingView}>
      <ActivityIndicator
            style={styles.loadingProgressBar}
            color={'gray'}
        />
    </View>
);


export default class AutoHeightWebView extends PureComponent {
    static propTypes = {
        source: WebView.propTypes.source,
        onHeightUpdated: PropTypes.func,
        customScript: PropTypes.string,
        customStyle: PropTypes.string,
        enableAnimation: PropTypes.bool,
        // if set to false may cause some layout issues (width of container will be than width of screen)
        scalesPageToFit: PropTypes.bool,
        // only works on enable animation
        animationDuration: PropTypes.number,
        // offset of rn webView margin
        heightOffset: PropTypes.number,
        // baseUrl not work in android 4.3 or below version
        enableBaseUrl: PropTypes.bool,
        style: ViewPropTypes.style,
        //  rn WebView callback
        onError: PropTypes.func,
        onLoad: PropTypes.func,
        onLoadStart: PropTypes.func,
        onLoadEnd: PropTypes.func,
        onMessage: PropTypes.func,
        startInLoadingState: PropTypes.bool,
        // works if set enableBaseUrl to true; add web/files... to android/app/src/assets/
        files: PropTypes.arrayOf(
            PropTypes.shape({
                href: PropTypes.string,
                type: PropTypes.string,
                rel: PropTypes.string
            })
        )
    };

    static defaultProps = {
        scalesPageToFit: true,
        enableBaseUrl: false,
        enableAnimation: true,
        startInLoadingState: true,
        animationDuration: 555,
        heightOffset: 20
    };

    constructor(props) {
        super(props);
        props.enableAnimation && (this.opacityAnimatedValue = new Animated.Value(0));
        isBelowKitKat && DeviceEventEmitter.addListener('webViewBridgeMessage', this.listenWebViewBridgeMessage);
        this.state = {
            isChangingSource: false,
            height: 0,
            heightOffset: 0,
            script: getScript(props, baseScript),
            viewState: WebViewState.IDLE,
            lastErrorEvent: null,
        };
    }

    componentDidMount() {
        if (this.props.startInLoadingState) {
            this.setState({viewState: WebViewState.LOADING});
        }
        this.startInterval();
    }

    componentWillReceiveProps(nextProps) {
        // injectedJavaScript only works when webView reload (source changed)
        if (Immutable.is(Immutable.fromJS(this.props.source), Immutable.fromJS(nextProps.source))) {
            return;
        } else {
            this.setState(
                {
                    isChangingSource: true,
                    height: 0,
                    heightOffset: 0
                },
                () => {
                    this.startInterval();
                    this.setState({isChangingSource: false});
                }
            );
        }
        this.setState({script: getScript(nextProps, baseScript)});
    }

    componentWillUnmount() {
        this.stopInterval();
        isBelowKitKat && DeviceEventEmitter.removeListener('webViewBridgeMessage', this.listenWebViewBridgeMessage);
    }

    // below kitkat
    listenWebViewBridgeMessage = body => this.onMessage(body.message);

    // below kitkat
    sendToWebView(message) {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RCTAutoHeightWebView.Commands.sendToWebView,
            [String(message)]
        );
    }

    getWebViewHandle = () => {
        return findNodeHandle(this.webView);
    };

    postMessage(data) {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RCTAutoHeightWebView.Commands.postMessage,
            [String(data)]
        );
    }

    startInterval() {
        this.finishInterval = false;
        this.interval = setInterval(() => {
            if (!this.finishInterval) {
                isBelowKitKat ? this.sendToWebView('getBodyHeight') : this.postMessage('getBodyHeight');
            }
        }, 205);
    }

    stopInterval() {
        this.finishInterval = true;
        clearInterval(this.interval);
    }

    onMessage = (e) => {
        const height = parseInt(isBelowKitKat ? e.nativeEvent.message : e.nativeEvent.data);
        if (height && height !== this.state.height) {
            const {enableAnimation, animationDuration, heightOffset} = this.props;
            enableAnimation && this.opacityAnimatedValue.setValue(0);
            this.stopInterval();
            this.setState(
                {
                    heightOffset,
                    height
                },
                () => {
                    enableAnimation
                        ? Animated.timing(this.opacityAnimatedValue, {
                            toValue: 1,
                            duration: animationDuration
                        }).start(() => onHeightUpdated(height, this.props))
                        : onHeightUpdated(height, this.props);
                }
            );
        }
        this.props.onMessage(e);

    };

    onLoadingStart = event => {
        const {onLoadStart} = this.props;
        onLoadStart && onLoadStart(event);
        this.updateNavigationState(event);

    };

    onLoadingError = event => {
        const {onError, onLoadEnd} = this.props;
        onError && onError(event);
        onLoadEnd && onLoadEnd(event);
        console.warn('Encountered an error loading page', event.nativeEvent);

        this.setState({
            lastErrorEvent: event.nativeEvent,
            viewState: WebViewState.ERROR
        });
    };

    onLoadingFinish = event => {
        const {onLoad, onLoadEnd} = this.props;
        onLoad && onLoad(event);
        onLoadEnd && onLoadEnd(event);

        this.setState({
            viewState: WebViewState.IDLE,
        });
        this.updateNavigationState(event);
    };

    /**
     * We return an event with a bunch of fields including:
     *  url, title, loading, canGoBack, canGoForward
     */
    updateNavigationState = (event) => {
        if (this.props.onNavigationStateChange) {
            this.props.onNavigationStateChange(event.nativeEvent);
        }
    };

    getWebView = webView => (this.webView = webView);

    stopLoading() {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RCTAutoHeightWebView.Commands.stopLoading,
            null
        );
    }

    //
    // goForward = () => {
    //     UIManager.dispatchViewManagerCommand(
    //         this.getWebViewHandle(),
    //         UIManager.RCTAutoHeightWebView.Commands.goForward,
    //         null
    //     );
    // };
    //
    // goBack = () => {
    //     UIManager.dispatchViewManagerCommand(
    //         this.getWebViewHandle(),
    //         UIManager.RCTAutoHeightWebView.Commands.goBack,
    //         null
    //     );
    // };
    reload = () => {
        this.setState({
            viewState: WebViewState.LOADING
        });
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RCTAutoHeightWebView.Commands.reload,
            null
        );
    };

    render() {
        const {height, script, isChangingSource, heightOffset} = this.state;
        const {scalesPageToFit, enableAnimation, source, customScript, style, contentContainerStyle, enableBaseUrl} = this.props;
        let webViewSource = source;
        if (enableBaseUrl) {
            webViewSource = Object.assign({}, source, {
                baseUrl: 'file:///android_asset/web/'
            });
        }
        var otherView = null;

        if (this.state.viewState === WebViewState.LOADING) {
            otherView = (this.props.renderLoading || defaultRenderLoading)();
        } else if (this.state.viewState === WebViewState.ERROR) {
            var errorEvent = this.state.lastErrorEvent;
            otherView = this.props.renderError && this.props.renderError(
                errorEvent.domain,
                errorEvent.code,
                errorEvent.description)||<View/>;
        } else if (this.state.viewState !== WebViewState.IDLE) {
            console.error('RCTWebView invalid state encountered: ' + this.state.loading);
        }
        var webViewStyles = [styles.container, this.props.style];
        if (this.state.viewState === WebViewState.LOADING ||
            this.state.viewState === WebViewState.ERROR) {
            // if we're in either LOADING or ERROR states, don't show the webView
            webViewStyles.push(styles.hidden);
        }
        var webView =
            <RCTAutoHeightWebView
                onLoadingStart={this.onLoadingStart}
                onLoadingFinish={this.onLoadingFinish}
                onLoadingError={this.onLoadingError}
                ref={this.getWebView}
                style={styles.webView}
                javaScriptEnabled={true}
                onNavigationStateChange={this.onNavigationStateChange}//在WebView中注册该回调方法
                injectedJavaScript={script + customScript}
                scalesPageToFit={scalesPageToFit}
                source={webViewSource}
                onMessage={this.onMessage}
                messagingEnabled={true}
                // below kitkat
                onChange={this.onMessage}
            />;
        return (
            <View style={[styles.container, contentContainerStyle]}>
                {otherView}
                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: enableAnimation ? this.opacityAnimatedValue : 1,
                            height: height + heightOffset
                        },
                        style,
                        webViewStyles
                    ]}
                >
                    {isChangingSource ? null : (
                        webView
                    )}
                </Animated.View>
            </View>
        );
    }
}

const screenWidth = Dimensions.get('window').width;

const isBelowKitKat = Platform.Version < 19;

const styles = StyleSheet.create({
    containerAll: {flex: 1},
    container: {
        width: screenWidth,
        backgroundColor: 'transparent',
        alignSelf: 'center'
    },
    hidden: {
        height: 0,
        flex: 0, // disable 'flex:1' when hiding a View
    },
    webView: {
        flex: 1,
        backgroundColor: 'transparent',
        // lineHeight:200
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingProgressBar: {
        height: 20,
    },
});

const baseScript = isBelowKitKat
    ? `
    ; (function () {
        AutoHeightWebView.onMessage = function (message) {
            AutoHeightWebView.send(String(document.body.offsetHeight));
        };
        ${domMutationObserveScript}
    } ());
    `
    : `
    ; (function () {
        document.addEventListener('message', function (e) {
            window.postMessage(String(document.body.offsetHeight));
        });
        ${domMutationObserveScript}
    } ());
    `;
