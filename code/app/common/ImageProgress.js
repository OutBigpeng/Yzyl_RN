import React, {PureComponent} from "react";
import PropTypes from 'prop-types';

import {ActivityIndicator, Image, StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
let defaultImg400 = require('../imgs/other/defaultimg.png');

const DefaultIndicator = ActivityIndicator;

class ImageProgress extends PureComponent {
    static propTypes = {
        indicator: PropTypes.func,
        indicatorProps: PropTypes.object,
        renderIndicator: PropTypes.func,
        threshold: PropTypes.number,
    };

    static defaultProps = {
        threshold: 50,
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            progress: 0,
            thresholdReached: !props.threshold,
            imgUrl: this.props.source
        };
    }

    componentDidMount() {
        if (this.props.threshold) {
            this._thresholdTimer = setTimeout(() => {
                this.setState({thresholdReached: true});
                this._thresholdTimer = null;
            }, this.props.threshold);
        }
    }

    componentWillUnmount() {
        if (this._thresholdTimer) {
            clearTimeout(this._thresholdTimer);
        }
    }

    componentWillReceiveProps(props) {
        if (!this.props.source || !props.source || this.props.source.uri !== props.source.uri) {
            this.setState({
                loading: false,
                progress: 0,
            });
        }
    }

    ref = null;
    handleRef = (ref) => {
        this.ref = ref;
    };

    setNativeProps(nativeProps) {
        if (this.ref) {
            this.ref.setNativeProps(nativeProps);
        }
    }

    bubbleEvent(propertyName, event) {
        if (typeof this.props[propertyName] === 'function') {
            this.props[propertyName](event);
        }
    }

    handleLoadStart = () => {
        if (!this.state.loading && this.state.progress !== 1) {
            this.setState({
                loading: true,
                progress: 0,
                imgUrl: this.props.source
            });
        }
        this.bubbleEvent('onLoadStart');
    };

    handleProgress = (event) => {
        const progress = event.nativeEvent.loaded / event.nativeEvent.total;
        // RN is a bit buggy with these events, sometimes a loaded event and then a few
        // 100% progress – sometimes in an infinite loop. So we just assume 100% progress
        // actually means the image is no longer loading
        if (progress !== this.state.progress && this.state.progress !== 1) {
            this.setState({
                loading: progress < 1,
                progress: progress,
            });
        }
        this.bubbleEvent('onProgress', event);
    };

    handleError = (event) => {
        this.setState({
            loading: false,
            imgUrl: defaultImg400
        });
        this.bubbleEvent('onError', event);
    };

    handleLoad = (event) => {
        // console.log("ls0000handleLoad0000",this.state.progress);
        if (this.state.progress !== 1) {
            this.setState({
                loading: false,
                progress: 1,
            });
        }
        this.bubbleEvent('onLoad', event);
    };

    handleLoadEnd = (event) => {
        // console.log("ls0000handleLoadEnd0000",this.state.progress);
        if (this.state.progress != 1) {
            this.setState({
                loading: false,
                imgUrl: defaultImg400
            });
        }
        this.bubbleEvent('onError', event);
    };

    render() {
        const {indicator, indicatorProps, renderIndicator, source, errorSource, threshold, ...props} = this.props;
        const {progress, thresholdReached, loading} = this.state;

        let style = this.props.style;
        let content = this.props.children;

        if ((loading || progress < 1) && thresholdReached) {
            style = style ? [styles.container, style] : styles.container;
            if (renderIndicator) {
                content = renderIndicator(progress, !loading || !progress);
            } else {
                const IndicatorComponent = (typeof indicator === 'function' ? indicator : DefaultIndicator);
                content = (<IndicatorComponent progress={progress}
                                               indeterminate={!loading || !progress} {...indicatorProps} />);
            }
        }
        return (
            <Image
                {...props}
                key={source ? source.uri || source : undefined}
                onLoadStart={this.handleLoadStart}
                onProgress={this.handleProgress}
                onError={this.handleError}
                onLoad={this.handleLoad}
                onLoadEnd={this.handleLoadEnd}
                ref={this.handleRef}
                source={this.state.imgUrl}
                style={style}
                resizeMode={Image.resizeMode.cover}
            >
                {content}
            </Image>
        );
    }
}

module.exports = ImageProgress;
