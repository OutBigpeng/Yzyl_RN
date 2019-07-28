/**产品Branner 页
 * Created by coatu on 2016/12/29.
 */
import React, {Component} from "react";
import {Image, StyleSheet, View} from "react-native";
import _ from "underscore";
import Swiper from "react-native-swiper";
import ATouchableHighlight from "../../../component/ATouchableHighlight";
import ImageModal from "../../../component/ImageModal";


export default class ProductBrannerView extends Component {
// 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            imgModalVisible: false,
            imageUrls: [],
            imgPosition: 0,
        };
    }

    render() {
        return (
            <View>
                {this.TopScrollView()}
            </View>
        )
    }

    setImgModalVisible(visible) {
        this.setState({
            imgModalVisible: visible
        });
    }

    TopScrollView() {
        return (
            <View>
                <View style={{height: 200, marginTop: 8}}>
                    <Swiper
                        height={200}
                        style={styles.wrapper}
                        dot={<View style={styles.dotStyle}/>}
                        activeDot={<View style={styles.activeDotStyle}/>}
                        prevButton={
                            <View>
                                <Image style={{width: 20, height: 20, padding: 15,}}
                                       source={require('../../../imgs/shop/arrow_left_normal.png')}/>
                            </View>}
                        nextButton={
                            <View><Image style={{width: 20, height: 20, padding: 15,}}
                                         source={require('../../../imgs/shop/arrow_right_normal.png')}/></View>
                        }
                        paginationStyle={{bottom: 1}}
                        loop={false}
                        showsButtons
                    >
                        {_.isEmpty(this.props.BrannerData) ?
                            <Image source={require('../../../imgs/other/defaultimg.png')}
                                   style={styles.page}/>
                            :
                            this.props.BrannerData.map((item, index) => {
                                return (
                                    <View key={index} style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <View style={styles.imageViewsStyle}>
                                            {_.isEmpty(item.url) ? null :
                                                <ATouchableHighlight onPress={() => this.pushDetail(item, index)}>
                                                    <Image source={{uri: item.url}} style={styles.page}
                                                            resizeMode={Image.resizeMode.contain}
                                                    />
                                                </ATouchableHighlight>}
                                        </View>
                                    </View>
                                )
                            })}
                    </Swiper>

                </View>
                <ImageModal
                    modalVisible={this.state.imgModalVisible}
                    imageUrls={this.state.imageUrls}
                    position={this.state.imgPosition}
                    onPress={() => this.cloneModal()}
                />
            </View>
        )
    }

    cloneModal() {
        this.setImgModalVisible(!this.state.imgModalVisible)
    }

    pushDetail(item, index) {
        const {navigate} = this.props.navigation;
        this.setState({
            imageUrls: this.props.BrannerData,
            imgPosition: index,
            imgModalVisible: !this.state.imgModalVisible
        });
    }
}


const styles = StyleSheet.create({
    activeDotStyle: {
        backgroundColor: 'white',
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 3,
        marginRight: 3,
    },
    dotStyle: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 3,
        marginRight: 3,
    },

    page: {
        flex: 1,
        height: 220.5,
        width: 220.5,
        resizeMode: 'contain',
        alignSelf: 'center'
    },

    imageViewsStyle: {
        height: 220.5,
        width: 220.5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
});


