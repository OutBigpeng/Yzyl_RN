'use strict';
import React, {Component} from 'react';

import {Platform, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

import Video from 'react-native-video';

let uri = ['https://video.pearvideo.com/mp4/adshort/20180825/cont-1420507-12743314_adpkg-ad_hd.mp4','https://video.pearvideo.com/mp4/third/20180709/cont-1384138-10002550-110800-hd.mp4'];

export default class TestView extends Component {
    state = {
        rate: 1,
        volume: 1,
        muted: false,
        resizeMode: 'contain',
        duration: 0.0,
        currentTime: 0.0,
        controls: true,
        paused: true,
        skin: 'native',
        ignoreSilentSwitch: null,
        isBuffering: false,
    };

    constructor(props) {
        super(props);
        console.log("进来了");
        this.onLoad = this.onLoad.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onBuffer = this.onBuffer.bind(this);
        this.currentInt=this.getRandomIntInclusive(0,1);
    }

    onLoad(data) {
        console.log('On load fired!');
        this.setState({duration: data.duration});
    }

    onProgress(data) {
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

    renderSkinControl(skin) {
        const isSelected = this.state.skin == skin;
        const selectControls = skin == 'native' || skin == 'embed';
        return (
            <TouchableOpacity onPress={() => {
                this.setState({
                    controls: selectControls,
                    skin: skin
                })
            }}>
                <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
                    {skin}
                </Text>
            </TouchableOpacity>
        );
    }

    renderRateControl(rate) {
        const isSelected = (this.state.rate == rate);

        return (
            <TouchableOpacity onPress={() => {
                this.setState({rate: rate})
            }}>
                <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
                    {rate}x
                </Text>
            </TouchableOpacity>
        )
    }

    renderResizeModeControl(resizeMode) {
        const isSelected = (this.state.resizeMode == resizeMode);

        return (
            <TouchableOpacity onPress={() => {
                this.setState({resizeMode: resizeMode})
            }}>
                <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
                    {resizeMode}
                </Text>
            </TouchableOpacity>
        )
    }

    renderVolumeControl(volume) {
        const isSelected = (this.state.volume == volume);

        return (
            <TouchableOpacity onPress={() => {
                this.setState({volume: volume})
            }}>
                <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
                    {volume * 100}%
                </Text>
            </TouchableOpacity>
        )
    }

    renderIgnoreSilentSwitchControl(ignoreSilentSwitch) {
        const isSelected = (this.state.ignoreSilentSwitch == ignoreSilentSwitch);

        return (
            <TouchableOpacity onPress={() => {
                this.setState({ignoreSilentSwitch: ignoreSilentSwitch})
            }}>
                <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
                    {ignoreSilentSwitch}
                </Text>
            </TouchableOpacity>
        )
    }

    componentWillUnmount() {
        // this.player._onPlaybackResume();
    }
     getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    }
    renderCustomSkin() {
        const flexCompleted = this.getCurrentTimePercentage() * 100;
        const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
        let {duration} = this.state;

        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.fullScreen} onPress={() => {
                    this.setState({paused: !this.state.paused})
                }}>
                    <Video
                        source={{
                            uri: uri[this.currentInt]
                        }}
                        style={styles.fullScreen}
                        rate={this.state.rate}
                        paused={this.state.paused}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        // audioOnly={false}
                        playInBackground={false}
                        ignoreSilentSwitch={this.state.ignoreSilentSwitch}
                        resizeMode={this.state.resizeMode}
                        onLoad={this.onLoad}
                        onBuffer={this.onBuffer}
                        onProgress={this.onProgress}
                        ref={player => {
                            this.player = player;
                        }}
                        onEnd={() => {
                            alert('Done!');
                            this.player.seek(0);
                        }}
                        repeat={true}
                    />
                </TouchableOpacity>

              <View style={styles.controls}>
                    {this.setControls()}

                    <View style={styles.trackingControls}>
                        <View style={styles.progress}>
                            <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]}/>
                            <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]}/>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderNativeSkin() {
        const videoStyle = this.state.skin == 'embed' ? styles.nativeVideoControls : styles.fullScreen;
        let {duration} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.fullScreen}>
                    <TouchableOpacity style={styles.fullScreen} onPress={() => {
                        this.setState({paused: !this.state.paused})
                    }}>
                        <Video
                            source={{
                                uri: uri[this.currentInt]
                            }}
                            style={videoStyle}
                            rate={this.state.rate}
                            paused={this.state.paused}
                            volume={this.state.volume}
                            muted={this.state.muted}
                            playInBackground={false}
                            ignoreSilentSwitch={this.state.ignoreSilentSwitch}
                            resizeMode={this.state.resizeMode}
                            onLoad={this.onLoad}
                            onBuffer={this.onBuffer}
                            onProgress={this.onProgress}
                            onEnd={() => {
                                alert('Done!')
                            }}
                            repeat={true}
                            controls={this.state.controls}
                        />
                    </TouchableOpacity>

                </View>
               {/* <View style={styles.controls}>
                    {this.setControls()}
                </View>*/}

            </View>
        );
    }

    setControls() {
        return (
            <View>
                <View style={styles.generalControls}>
                    <View style={styles.skinControl}>
                        {this.renderSkinControl('custom')}
                        {this.renderSkinControl('native')}
                        {this.renderSkinControl('embed')}
                    </View>
                </View>
                <View style={styles.generalControls}>
                    <View style={styles.rateControl}>
                        {this.renderRateControl(0.5)}
                        {this.renderRateControl(1.0)}
                        {this.renderRateControl(2.0)}
                    </View>

                    <View style={styles.volumeControl}>
                        {this.renderVolumeControl(0.5)}
                        {this.renderVolumeControl(1)}
                        {this.renderVolumeControl(1.5)}
                    </View>

                    <View style={styles.resizeModeControl}>
                        {this.renderResizeModeControl('cover')}
                        {this.renderResizeModeControl('contain')}
                        {this.renderResizeModeControl('stretch')}
                    </View>
                </View>
                <View style={styles.generalControls}>
                    {
                        (Platform.OS === 'ios') ?
                            <View style={styles.ignoreSilentSwitchControl}>
                                {this.renderIgnoreSilentSwitchControl('ignore')}
                                {this.renderIgnoreSilentSwitchControl('obey')}
                            </View> : null
                    }
                </View>
            </View>
        )
    }

    render() {
        let {duration} = this.state;
        return this.state.controls ? this.renderNativeSkin() : this.renderCustomSkin()
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controls: {
        backgroundColor: "transparent",
        borderRadius: 5,
        position: 'absolute',
        bottom: 44,
        left: 4,
        right: 4,
    },
    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 20,
        backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
        height: 20,
        backgroundColor: '#2C2C2C',
    },
    generalControls: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        paddingBottom: 10,
    },
    skinControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    rateControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    volumeControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resizeModeControl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ignoreSilentSwitchControl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    controlOption: {
        alignSelf: 'center',
        fontSize: 11,
        color: "white",
        paddingLeft: 2,
        paddingRight: 2,
        lineHeight: 12,
    },
    nativeVideoControls: {
        top: 184,
        height: 300
    }
});

