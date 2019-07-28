/**
 * pdf 查看器
 * Created by Monika on 2018/8/2.
 * //const source = require('./test.pdf');  // ios only
 //const source = {uri:'bundle-assets://test.pdf'};

 //const source = {uri:'file:///sdcard/test.pdf'};
 //const source = {uri:"data:application/pdf;base64,..."};
 <View style={{
                    flexDirection: 'row',
                    bottom: scaleSize(20),
                    position: 'absolute',
                    right: scaleSize(20),
                    backgroundColor: 'white'
                }}>
 <ATouchableHighlight onPress={() => {
                        if (scale <= 1) {
                            toastShort('不能再小了')
                        } else {
                            this.setState({
                                scale: scale - 0.1
                            })
                        }
                    }}>
 <Text style={[styles.textStyle, {
                            paddingHorizontal: scaleSize(18),
                            borderBottomLeftRadius:scaleSize(5),
                            borderTopLeftRadius:scaleSize(5)
                        }]}>－</Text>
 </ATouchableHighlight>
 <ATouchableHighlight onPress={() => {
                        if (scale >= 3) {
                            toastShort('不能再大了')
                        } else {
                            this.setState({
                                scale: scale + 0.1
                            })
                        }
                    }}>
 <Text style={[styles.textStyle, {
                            paddingHorizontal: scaleSize(16),
                            borderBottomRightRadius:scaleSize(5),
                            borderTopRightRadius:scaleSize(5)
                        }]}>＋</Text>
 </ATouchableHighlight>
 </View>*/

'use strict';
import {connect, Loading} from "../../common/CommonDevice";
import React, {Component} from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import Pdf from "react-native-pdf";
import {scaleSize} from "../../common/ScreenUtil";
import {Alerts} from "../../common/CommonUtil";
import {downFile} from "../../common/RNFSDownloadUtil";

class OpenPdfView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: 1
        };
        let {state: {params: {url = ''}}} = this.props.navigation;
        this.pdfPath = url;
    }

    componentDidMount() {
        this.navigationParams()
    }

    navigationParams() {
        const {state, navigate} = this.props.navigation;
        this.props.navigation.setParams({
            rightOnPress: () => {
                this.downPdf()
            },
        });
    }

    downPdf() {
        this.getLoading().show();
        downFile({url:this.pdfPath}, () => {
            this.getLoading().dismiss();
        }, () => {
            this.getLoading().dismiss();
        })
    }

    //获取加载进度的组件
    getLoading() {
        return this.refs['loading'];
    }

    render() {
        const source = {uri: this.pdfPath, cache: true};
        return (
            <View style={styles.container}>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        Alerts(`PDF有异：${error}`, '温馨提示', () => {
                            this.props.navigation.goBack();
                        })
                    }}
                    style={styles.pdf}/>
                <Loading ref={'loading'} text={'正在保存....'}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    textStyle: {
        paddingVertical: scaleSize(10),
        borderColor: '#eeeeee',
        borderWidth: scaleSize(2),
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({})
)(OpenPdfView);