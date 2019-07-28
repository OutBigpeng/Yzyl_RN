/**推荐产品与产品列表——产品条目
 * Created by coatu on 2016/12/22.
 */
import React, {Component} from "react";
import {ListView, StyleSheet, View} from "react-native";
import {
    _,
    BGColor,
    bindActionCreators,
    connect,
    deviceHeight,
    deviceWidth,
    isEmptyObject,
    Sizes
} from "../../common/CommonDevice";
import ProductItem from "./ProductItem";
import * as FindAction from "../../actions/FindAction";
import {CommonNavTitleView} from '../../component/CommonAssembly'
import {px2dp} from "../../common/CommonUtil";

class CommonProductCell extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds
        };
    }

    componentDidMount() {
        this.props.state.Find.ProductData = []
    }

    render() {
        return (
            <View style={styles.container}>
                {!_.isEmpty(this.props.state.Find.ProductData) ?
                    <View>
                        <CommonNavTitleView
                            title='推荐产品'
                            fontsize={px2dp(Sizes.listSize)}
                        />

                        <ListView
                            dataSource={this.state.dataSource.cloneWithRows(this.props.state.Find.ProductData)}
                            renderRow={(rowData) => this.renderRow(rowData)}
                            contentContainerStyle={styles.ListViewStyle}
                            enableEmptySections={true}
                            removeClippedSubviews={false}
                        />
                    </View>
                    :
                    <View/>}

            </View>
        );
    }

    renderRow(rowData) {
        if (rowData) {
            return (
                <ProductItem
                    {...this.props}
                    rowData={rowData}
                    callback={this.props.callback}
                />
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        backgroundColor: 'white',
        // marginBottom:75
    },

    ListViewStyle: {},
    NoDataViewStyle: {
        width: deviceWidth,
        height: deviceHeight - 400,
        backgroundColor: BGColor,
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        actions: bindActionCreators(FindAction, dispatch)
    })
)(CommonProductCell);