/**技术参数
 * Created by coatu on 16/8/10.
 */
'use strict';
import React, {Component} from "react";
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    ScrollView,
    Image,
    InteractionManager,
    TouchableOpacity,
    AsyncStorage,
    Alert
} from "react-native";
// 引入外部组件
import {deviceWidth,px2dp,Sizes} from "../../../common/CommonDevice";
import {productParametersById} from "../../../dao/FindDao";
import _ from "underscore";

global.ProductParameters = 'product/queryProductParameters';


export default class technicalpParameter extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            item: []
        };
    }

    render() {
        return (
            <View style={styles.container}>
                {this.commonView('#rgba(100,100,100,1)', '项目', '测试方法或单位', '值')}
                {this.dataView()}

            </View>
        );

    };

    commonView(bgcolor, firstText, secondText, threeText) {
        return (
            <View>
                <View style={[styles.commonViewStyle,{backgroundColor:bgcolor}]}>
                    <Text style={styles.TextStyle}>{firstText}</Text>
                    <Text style={styles.TextStyle}>{threeText}</Text>
                    <Text style={styles.TextStyle}>{secondText}</Text>

                </View>

            </View>
        )


    }

    // componentDidMount() {
    //     // //获取技术参数 产品详情 生产商介绍的接口
    //     const {navigator}= this.props;
    //     let data = {'supplierid': this.props.supplierid, 'pid': this.props.pid};
    //     productParametersById(data, (res) => {
    //         AsyncStorage.setItem(global.ProductParameters, JSON.stringify(res));
    //         this.setState({
    //             item: res.techParams
    //         })
    //
    //     }, (err) => {
    //
    //     })
    // }

    dataView() {
        let dataArry = [];
        if (!_.isEmpty(this.props.techParams)) {
            for (let i = 0; i < this.props.techParams.length; i++) {
                let color = ['#rgba(242,242,242,1)', '#rgba(188,188,188,1)'];
                dataArry.push(
                    <View key={i} style={[styles.commonViewStyle,{backgroundColor:color[i%2]}]}>
                        <Text style={styles.TextStyle}>{this.props.techParams[i].tpitemname}</Text>
                        <Text style={styles.TextStyle}>{this.props.techParams[i].tpvalue}</Text>
                        <Text style={styles.TextStyle}>{this.props.techParams[i].tpunit}</Text>
                    </View>
                )
            }
            return dataArry;
        }
    }
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginTop: 15,
        marginBottom: 200,
        alignItems: 'center'
    },

    commonViewStyle: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        width: deviceWidth * 0.9,
        padding: 10,
        backgroundColor: 'gray'
    },
    TextStyle: {
        width: deviceWidth * 0.28,
        textAlign: 'center',
        fontSize:px2dp(Sizes.searchSize)
    }
});