/**
 * Created by coatu on 2016/12/23.
 */
import React, {Component,PureComponent} from "react";
import {Image, InteractionManager, StyleSheet, View} from "react-native";
import Swiper from "react-native-swiper";
import {_, bindActionCreators, borderRadius, connect, deviceWidth} from "../common/CommonDevice";
import TopScrollWebView from "../pages/find/TopScrollWebView";
import * as FindAction from '../actions/FindAction';
import {BrannerById} from "../dao/FindDao";
import ATouchableHighlight from "./ATouchableHighlight";
import NetInfoDecorator from './NetInfoDecorator'
import {observer} from 'mobx-react/native'
import connectionStore from '../common/mobx/ConnectionStore'
import Find from "../reducers/FindReducer";

let ImageHeight = deviceWidth / 2;//188
let imgData = {};

// @NetInfoDecorator
// @observer
class BrannerView extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            activePage: 0,
            IMG:{},
            swiperShow: false,
        };
        this._isMounted;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {//
        let {IMG={}} = this.state;
        let {type} = this.props;
        let {brannerObj} = this.props.state.Find;
        let imgs = brannerObj[type]||[];
        // console.log(brannerObj)
        return (
            <View style={{height: ImageHeight, marginBottom: this.props.view ? 5 : 0}}>
                {!_.isEmpty(imgs) ?
                    <Swiper
                        loop={true}
                        autoplay={true}
                        scrollEnabled={true}
                        height={ImageHeight}
                        removeClippedSubviews={false}
                        dot={<View style={[styles.activeDotStyle, {backgroundColor: '#rgba(0,0,0,0.5)'}]}/>}
                        activeDot={<View style={[styles.activeDotStyle, {backgroundColor: 'white'}]}/>}
                        paginationStyle={{
                            bottom: 10
                        }}>
                        {imgs.map((item, index) => {
                            return (
                                <View key={index} style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <ATouchableHighlight onPress={() => this.pushToWebView(item)}>
                                        <Image
                                            style={styles.page}
                                            source={{uri: item.imgurl}}
                                            resizeMode={Image.resizeMode.contain}
                                        />
                                    </ATouchableHighlight>
                                </View>
                            )
                        })}
                    </Swiper> : <View style={{height: ImageHeight}}/>
                }
            </View>
        )
    }

    pushToWebView(item) {
        const {navigate} = this.props.navigation;
        /**
         { id: 3,
   imgurl: 'http://info.img.youzhongyouliao.com/app/banner/tj.png',
  jumptype: 'webLink',
   linkurl: 'http://activity.youzhongyouliao.com/advertisement.html?order=one' }
         //新加的
         { id: 2,
   imgurl: 'http://info.img.youzhongyouliao.com/app/banner/university_tianjin.png',
   jumptype: 'localPage',
   linkurl: '{"name":"CurriculumDetailView","params":{"id":"4","title":"课程详情"}}' }

         * */
        let data;
        if (item.jumptype) {
            switch (item.jumptype) {
                case "switch":
                    data = JSON.parse(item.linkurl);
                    switch (item.index) {
                        default:
                            data.name = item.name || ""; //参数{"index":3,"id": 11};
                            if (data.index) {
                                this.props.callback(data.index, data);//data:{ index: 3, id: 11, name: '配方' }
                            }
                            break;
                    }
                    break;
                case "localPage":
                    data = JSON.parse(item.linkurl);
                    if (data.name) {
                        if (data.name === "CurriculumDetailView" || data.name === "FormulaXNView") {
                            data.params.rightImageSource = true;
                            data.params.isCollection = true
                        }
                        navigate(data.name, data.params);//data.params中必须有title
                    }
                    // navigate('CurriculumDetailView', {
                    //     title: '课程详情',
                    //     id: data.id,
                    //     rightImageSource: false,
                    //     Data: rowData
                    // });
                    break;
                case "webLink"://跳转链接
                    navigate('TopScrollWebView', {
                        title: item.name || "详情",
                        name: 'TopScrollWebView',
                        linkurl: item.linkurl
                    });
                    break;
                case "webContent"://富文本
                    navigate('AgreementView',
                        {
                            name: 'AgreementView',
                            title: item.name,
                            agreementName: item.linkurl,
                        });
                    break;
                default:
                    break;
            }
        } else if (item.linkurl) {
            const {navigate} = this.props.navigation;
            InteractionManager.runAfterInteractions(() => {
                navigate('TopScrollWebView', {
                    title: '详情',
                    name: 'TopScrollWebView',
                    linkurl: item.linkurl
                })
            })
        }
    }

    componentDidMount() {
        this._isMounted = true;
        // if (connectionStore.isConnected) {
        //     let {type}  = this.props;
            // this.props.actions.fetchBrannerIfNeeded(this.props.type);
            // if(!this.state.IMG[type]){
            //     let data = {type};
            //     BrannerById(data, (res) => {
            //         if (this._isMounted) {
            //             this.state.IMG[type] = res;
            //             this.setState({
            //                 IMG:this.state.IMG
            //             })
            //         }
            //     }, (error) => {
            //     })
            // }else {
            //
            // }
        // }
    }
}

const styles = StyleSheet.create({
    activeDotStyle: {
        backgroundColor: 'white',
        width: 5,
        height: 5,
        borderRadius: borderRadius,
        marginLeft: 3,
        marginRight: 3,
    },
    page: {
        // flex: 1,
        height: ImageHeight,
        width: deviceWidth,
    },
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(FindAction, dispatch)
    })
)(BrannerView);
