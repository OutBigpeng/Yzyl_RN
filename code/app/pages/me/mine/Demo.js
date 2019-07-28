import React, {Component} from 'react';
import {Alert, Dimensions, Image, Slider, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import {scaleSize} from "../../../common/ScreenUtil";
import {px2dp} from "../../../common/CommonUtil";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
let uri = 'https://cdn-video.xinpianchang.com/5b8a96b28ad17.mp4';

export default class Demo extends Component<> {
    static navigationOptions = ({navigation}) => ({header: null,});
    _updateOrientation = (orientation) => this.setState({orientation});
    _updateSpecificOrientation = (specificOrientation) => this.setState({specificOrientation});

    constructor(props) {
        super(props);
        this.player = null;
        this.state = {
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            slideValue: 0.00,
            currentTime: 0,
            controls: false,
            paused: true,
            ignoreSilentSwitch: null,
            isBuffering: false,
            flag: true
        };
        this.onLoad = this.onLoad.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onBuffer = this.onBuffer.bind(this);
    }

    componentWillMount() {
        const init = Orientation.getInitialOrientation();
        this.setState({init, orientation: init, specificOrientation: init,});
    }

    componentDidMount() {
        Orientation.addOrientationListener(this._updateOrientation);
        Orientation.addSpecificOrientationListener(this._updateSpecificOrientation);
    }

    componentWillUnmount() {
        Orientation.removeOrientationListener(this._updateOrientation);
        Orientation.removeSpecificOrientationListener(this._updateSpecificOrientation);
    }

    _getOrientation() {
        Orientation.getOrientation((err, orientation) => {
            Alert.alert(`Orientation is ${orientation}`);
        });
    }

    _getSpecificOrientation() {
        Orientation.getSpecificOrientation((err, orientation) => {
            Alert.alert(`Specific orientation is ${orientation}`);
        });
    } //以上为横向
    onEnd(data) {
        this.player.seek(0)
    }

    onLoad(data) { //视频总长度
        console.log("onLoad---", data);
        this.setState({duration: data.duration});
    }

    onProgress(data) { //播放进度
        console.log("onProgess---", data);

        this.setState({currentTime: data.currentTime});
    }

    onBuffer({isBuffering}: { isBuffering: boolean }) {
        this.setState({isBuffering});
    }

    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        } else {
            return 0;
        }
    }

    /*
  * 将秒数格式化时间
  * @param {Number} seconds: 整数类型的秒数
  * @return {String} time: 格式化之后的时间
  */
    formatTime(seconds) {
        let min = Math.floor(seconds / 60),
            second = seconds % 60,
            hour, newMin, time;

        if (min > 60) {
            hour = Math.floor(min / 60);
            newMin = min % 60;
        }

        if (second < 10) {
            second = '0' + second;
        }
        if (min < 10) {
            min = '0' + min;
        }

        return time = hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
    }

    renderNativeSkin() {
        const videoStyle = styles.fullScreen;
        const {init, orientation, specificOrientation} = this.state;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                        this.setState({paused: !this.state.paused})
                    }} style={{
                    width: '100%',
                    height: this.state.flag ? height / 3 : '100%',
                    alignItems: 'center',
                    backgroundColor: '#000',
                }}>
                    <Video ref={ref => this.player = ref}
                           source={{uri}}
                           style={styles.fullScreen}
                           rate={this.state.rate}
                           paused={this.state.paused}
                           volume={this.state.volume}
                           muted={this.state.muted}
                           ignoreSilentSwitch={this.state.ignoreSilentSwitch}
                           resizeMode="contain"
                           onLoad={this.onLoad}
                           onBuffer={this.onBuffer}
                           onProgress={this.onProgress}
                           onEnd={(data) => this.onEnd(data)}
                           repeat={true}
                           controls={this.state.controls}/>

                    <View style={{
                        width: '100%',
                        backgroundColor: '#eeeeee44',
                        height: scaleSize(80),
                        paddingHorizontal: scaleSize(10),
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 0
                    }}>
                        <TouchableOpacity onPress={() => {
                            this.setState({paused: !this.state.paused})
                        }}>
                            <Text style={{
                                fontSize: px2dp(12),
                                color: 'white', paddingHorizontal: scaleSize(10)
                            }}>{this.state.paused ? '播放' : '暂停'}</Text>
                        </TouchableOpacity>
                        <View style={{width:'auto'}}>
                            <Text style={{fontSize: px2dp(12),color:'#fff'}}>{this.formatTime(this.state.currentTime.toFixed(0))}</Text>
                        </View>
                        <Slider style={styles.slider}
                                value={this.state.currentTime}
                                minimumValue={0}
                                maximumValue={this.state.duration}
                                minimumTrackTintColor='orange'
                                maximumTrackTintColor='#fff'
                                thumbTintColor={'red'}
                                step={1}
                                onValueChange={value => {
                                    console.log(value);
                                    this.setState({currentTime: value})
                                }}
                                onSlidingComplete={value => this.player.seek(value)}/>
                        <View style={{width: 'auto'}}>
                            <Text style={{fontSize: px2dp(12),color:'#fff'}}>{`${this.formatTime(this.state.duration.toFixed(0))}`}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            this.setState({flag: !this.state.flag}, () => {
                                !this.state.flag ? Orientation.lockToLandscapeRight() : Orientation.lockToPortrait()
                            });
                        }}>
                            {/*<Image style={{width: scaleSize(35), height: scaleSize(35), marginHorizontal: scaleSize(10)}}
                                   source={this.state.flag ? require('../../../imgs/Rotate_Right_25px.png') : require('../../../imgs/Rotate_Left_25px.png')}/>
                       */} </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>);
    }

    componentWillUnmount() {
        !this.state.flag && Orientation.lockToPortrait()
    }

    render() {
        return this.renderNativeSkin();
    }
}
const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff',},
    fullScreen: {position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,},
    instructions: {textAlign: 'center', color: '#aaaaaa', marginBottom: 5,},
    buttonContainer: {flex: 0, flexDirection: 'row', justifyContent: 'space-around'},
    button: {padding: 5, margin: 5, borderWidth: 1, borderColor: 'white', borderRadius: 3, backgroundColor: 'grey',},
    slider: {flex: 1, width: '85%', height: scaleSize(30)}
});
