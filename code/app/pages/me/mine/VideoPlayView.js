import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    Slider,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import {Alerts, px2dp} from "../../../common/CommonUtil";
import {scaleSize} from "../../../common/ScreenUtil";
import {_renderActivityIndicator} from "../../../component/CommonRefresh";

const screenWidth = Dimensions.get('window').width;

function formatTime(second) {
    let h = 0, i = 0, s = parseInt(second);
    if (s > 60) {
        i = parseInt(s / 60);
        s = parseInt(s % 60);
    }
    // 补零
    let zero = function (v) {
        return (v >> 0) < 10 ? "0" + v : v;
    };
    return [zero(h), zero(i), zero(s)].join(":");
}

export default class VideoPlayView extends Component {

    _onLoadStart = () => {
        console.log('loadStart');
        this.setState({
            isLoading: true
        })
    };
    _onBuffering = () => {
        console.log('buffering...')
    };
    _onLoaded = (data) => {
        console.log('loaded');
        if (this.state.currentTime > data.currentTime) {
            this.setState({
                currentTime: this.state.currentTime,
                duration: data.duration,
                showVideoControl: true,
                isPlaying: this.props.isPlaying,
                isLoading: false
            }, () => {
                this.videoPlayer.seek(this.state.currentTime);
            })
        } else {
            this.setState({
                duration: data.duration,
                isLoading: false,
            });
        }

    };

    /// -------Video组件回调事件-------
    _onProgressChanged = (data) => {
        // console.log('视频进度更新', this.state.isPlaying, this.state.currentTime);
        if (this.state.isPlaying) {
            this.setState({
                currentTime: data.currentTime,
            })
        }
    };
    _onPlayEnd = () => {
        console.log('---------------playend');
        if (this.state.currentTime) {
            this.setState({
                currentTime: 0,
                isPlaying: false,
                playFromBeginning: true
            }, () => {
                console.log("move playend---")
            });
        }
    };
    _onPlayError = (e) => {
        console.log('playerror', e);
        this.setState({
            isLoading: false
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            videoUrl: props.videoUrl,
            videoCover: props.videoCover,
            videoWidth: screenWidth,
            videoHeight: screenWidth * 9 / 16, // 默认16：9的宽高比
            showVideoCover: true,    // 是否显示视频封面
            showVideoControl: false, // 是否显示视频控制组件
            isPlaying: props.isPlaying && false,        // 视频是否正在播放
            currentTime: props.currentTime || 0,        // 视频当前播放的时间
            duration: 0,           // 视频的总时长
            isFullScreen: false,     // 当前是否全屏显示
            playFromBeginning: false, // 是否从头开始播放
            isLoading: true,
        };
        this._isMounted;
    }

    /// 屏幕旋转时宽高会发生变化，可以在onLayout的方法中做处理，比监听屏幕旋转更加及时获取宽高变化
    _onLayout(event) {
        //获取根View的宽高
        let {width, height} = event.nativeEvent.layout;
        // console.log('通过onLayout得到的宽度：' + width);
        // console.log('通过onLayout得到的高度：' + height);
        // 一般设备横屏下都是宽大于高，这里可以用这个来判断横竖屏
        let isLandscape = (width > height);
        if (isLandscape) {//横屏
            this.setState({
                videoWidth: width,
                videoHeight: height,
                isFullScreen: true,
            });
        } else {
            this.setState({
                videoWidth: width,
                videoHeight: width * 9 / 16,
                isFullScreen: false,
            });
        }

        Orientation.unlockAllOrientations();
    };

    render() {
        let {
            isLoading, videoWidth, videoHeight, videoUrl, isPlaying, showVideoCover,
            videoCover = '', flag, showVideoControl, currentTime, duration, isFullScreen
        } = this.state;
        let {isSelfOnLayout, isModal} = this.props;
        return (
            <View style={styles.container} onLayout={(e) => isSelfOnLayout ? this._onLayout(e) : null}>
                <View style={{width: videoWidth, height: videoHeight/*, backgroundColor: '#000000'*/}}>
                    <Video
                        ref={(ref) => this.videoPlayer = ref}
                        source={{uri: videoUrl}}
                        rate={1.0}
                        volume={1.0}
                        muted={false}
                        paused={!isPlaying}
                        resizeMode={'contain'}
                        playWhenInactive={false}
                        playInBackground={false}
                        ignoreSilentSwitch={'ignore'}
                        progressUpdateInterval={250.0}
                        onLoadStart={this._onLoadStart}
                        onLoad={this._onLoaded}
                        onProgress={this._onProgressChanged}
                        onEnd={this._onPlayEnd}
                        onError={this._onPlayError}
                        onBuffer={this._onBuffering}
                        style={{width: videoWidth, height: videoHeight}}
                    />
                    {isLoading &&
                    <View style={{
                        backgroundColor: 'transparent',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: videoWidth,
                        height: videoHeight
                    }}>
                        {_renderActivityIndicator()}
                    </View>}
                    {showVideoCover && videoCover ?
                        <Image style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: videoWidth,
                            height: videoHeight
                        }}
                               resizeMode={'cover'}
                               source={{uri: videoCover}}
                        /> : null
                    }
                    <TouchableWithoutFeedback onPress={() => {
                        this.hideControl()
                    }}>
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: videoWidth,
                            height: videoHeight,
                            backgroundColor: isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.2)',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {!isPlaying ?
                                <TouchableWithoutFeedback onPress={() => {
                                    this.onPressPlayButton()
                                }}>
                                    <Image style={[styles.playButton]}
                                           source={require('./image/icon_video_play.png')}
                                    />
                                </TouchableWithoutFeedback> : null}
                        </View>
                    </TouchableWithoutFeedback>

                    {showVideoControl && isModal &&
                    <TouchableOpacity
                        activeOpacity={0.3} style={{position: 'absolute', left: scaleSize(10), top: scaleSize(10)}}
                        onPress={() => {
                            this.props.onControlShrinkPress(this.state.currentTime, isPlaying);
                        }}>
                        <View style={{
                            paddingVertical: scaleSize(18),
                            paddingHorizontal: scaleSize(18),
                        }}>
                            <Image source={require('./image/Back_To_50px.png')}
                                   style={[{width: scaleSize(50), height: scaleSize(50)}, {}]}/>
                        </View>
                    </TouchableOpacity>
                    }

                    {showVideoControl ?
                        <View style={[styles.control, {width: videoWidth}]}>
                            <View style={{
                                width: this.state.flag ? '14%' : '24%', flexDirection: 'row',
                                marginLeft: scaleSize(flag ? 25 : 5),
                                alignItems: "center", justifyContent: 'space-between'
                            }}>
                                <TouchableOpacity activeOpacity={0.3}
                                                  onPress={() => {
                                                      this.onControlPlayPress()
                                                  }}>
                                    <View style={{
                                        padding: scaleSize(12)
                                    }}>
                                        <Image style={[styles.playControl,]}
                                               source={this.state.isPlaying ? require('./image/icon_control_pause.png') : require('./image/icon_control_play.png')}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.time}>{formatTime(currentTime)}</Text>
                            </View>
                            <Slider
                                style={{width: this.state.flag ? '95%' : '52%'}}
                                maximumTrackTintColor={'#999999'}
                                minimumTrackTintColor={'#00c06d'}
                                thumbImage={require('./image/icon_control_slider.png')}
                                value={currentTime}
                                minimumValue={0}
                                maximumValue={duration}
                                onValueChange={(currentTime) => {
                                    // console.log('视频进度拉拉拉', currentTime);
                                }}
                                onSlidingComplete={(currentTime) => {
                                    // console.log('视频进度结束-----', currentTime);
                                    this.onSliderValueChanged(currentTime)
                                }}
                            />
                            <View style={{
                                width: this.state.flag ? '14.5%' : '22%',
                                flexDirection: 'row',
                                marginRight: scaleSize(flag ? 15 : 5),
                                alignItems: "center",
                                justifyContent: 'space-between'
                            }}>
                                <Text style={styles.time}>{formatTime(duration)}</Text>
                                <TouchableOpacity activeOpacity={0.3}
                                                  onPress={() => {
                                                      this.props.onControlShrinkPress(this.state.currentTime, isPlaying);
                                                      !isModal && this.onControlShrinkPress()
                                                  }}>
                                    <View style={{
                                        padding: scaleSize(12)
                                    }}>
                                        <Image style={[styles.shrinkControl, {}]}
                                               source={isFullScreen ? require('./image/icon_control_shrink_screen.png') : require('./image/icon_control_full_screen.png')}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View> : null
                    }
                </View>
            </View>
        );
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        // !this.state.flag && Orientation.lockToPortrait()
    }

    ///-------控件点击事件-------
    /// 控制播放器工具栏的显示和隐藏
    hideControl() {
        if (this.props.videoFee) {
            // this.showAlert();
            return;
        }
        if (this.state.showVideoControl) {
            this.setState({
                showVideoControl: false,
            })
        } else {
            this.setState({
                    showVideoControl: true,
                }, () => {// 5秒后自动隐藏工具栏
                    setTimeout(() => {
                        this.setState({
                            showVideoControl: false
                        })
                    }, 5000)
                }
            )
        }
    }

    showAlert() {
        Alerts("当前为收费视频，请下载最新版本体验", '', () => {
        });
    }

    /// 点击了播放器正中间的播放按钮
    onPressPlayButton() {
        if (this.props.videoFee) {
            this.showAlert();
            // this.props.callIsFee()
            return;
        }
        let isPlay = !this.state.isPlaying;
        // console.log("当前是否显示中间那个按钮-----", isPlay);
        this.setState({
            isPlaying: isPlay,
            showVideoCover: false
        }, () => {
            // console.log("this.state.playFromBeginning", this.state.playFromBeginning, this.state.currentTime);
            if (this.state.playFromBeginning) {
                this.videoPlayer.seek(0);
                this.setState({
                    playFromBeginning: false,
                })
            }
        });

    }

    /// 点击了工具栏上的播放按钮
    onControlPlayPress() {
        this.onPressPlayButton();
    }

    /// 点击了工具栏上的全屏按钮
    onControlShrinkPress() {
        if (this.state.isFullScreen) {
            Orientation.lockToPortrait();
        } else {
            Orientation.lockToLandscape();
        }
    }

    /// 进度条值改变
    onSliderValueChanged(currentTime) {
        this.setState({
            currentTime: currentTime,
        }, () => {
            this.videoPlayer.seek(currentTime);
        })
    }

    /// -------外部调用事件方法-------

    ///播放视频，提供给外部调用
    playVideo(currentTime) {
        this.setState(Object.assign(this.state, {
            isPlaying: true,
            showVideoCover: false,
        }, currentTime && {currentTime}))
    }

    setCurrentTime(currentTime) {
        this.setState({
            currentTime
        }, () => {
            this.videoPlayer.seek(currentTime);
        })
    }

    /// 暂停播放，提供给外部调用
    pauseVideo() {
        this.setState({
            isPlaying: false,
        })
    }

    /// 切换视频并可以指定视频开始播放的时间，提供给外部调用
    switchVideo(videoURL, seekTime) {
        this.setState({
            videoUrl: videoURL,
            currentTime: seekTime,
            isPlaying: true,
            showVideoCover: false
        });
        this.videoPlayer.seek(seekTime);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        width: scaleSize(100),
        height: scaleSize(100),
    },
    playControl: {
        width: scaleSize(48),
        height: scaleSize(48),
    },
    shrinkControl: {
        width: scaleSize(35),
        height: scaleSize(35),
    },
    time: {
        fontSize: px2dp(11),
        color: 'white',
        marginHorizontal: scaleSize(5)
    },
    control: {
        flexDirection: 'row',
        height: scaleSize(88),
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        bottom: 0,
        left: scaleSize(0),
        right: scaleSize(0)
    },
});