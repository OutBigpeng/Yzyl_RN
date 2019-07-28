import React, {Component } from "react";
import PropTypes from 'prop-types';
import {ListView, RefreshControl, StyleSheet, View,} from "react-native";
// custom
import {create} from "../lib/PlatformStyleSheet";
import {Colors} from "../themes";
import {scaleSize} from "../../common/ScreenUtil";

class BaseListView extends Component {

    // ------------ init -------------

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });

        const {data = [], search} = this.props;

        this.state = {
            isRefreshing: false,
            ds,
            dataSource: ds.cloneWithRows(data)
        }
    }

    // ------------ logic  ---------------

    updateList(props) {
        //TODO: 比对prev和next，search的筛选
        const {data = [], search} = props || this.props;
        this.setState({
            dataSource: this.state.ds.cloneWithRows(data)
        })
    }

    // ------------ lifecycle ------------

    componentDidMount() {
        // this.updateList()
    }

    componentWillReceiveProps(nextProps) {
        this.updateList(nextProps)
    }

    componentDidUpdate() {
        const {autoScroll} = this.props;

        if (autoScroll && "listHeight" in this.state &&
            "footerY" in this.state &&
            this.state.footerY > this.state.listHeight) {
            let scrollDistance = this.state.listHeight - this.state.footerY;
            this.refs.list.getScrollResponder().scrollTo({y: -scrollDistance, animated: true});
        }
    }

    // ------------ handlers -------------

    handleRefresh() {
        const {handleRefresh} = this.props;

        this.setState({isRefreshing: true});
        handleRefresh();
        // TODO: 刷新成功/刷新失败
        setTimeout(() => {
            this.setState({isRefreshing: false})
        }, 1000)
    }

    // ------------ renders -------------

    // _renderRow(rowData, sectionId, rowID, highlightRow) {
    //     return (
    //         <TouchableOpacity onPress={() => {
    //             {/*NavigationActions.contactInfo({"uid": rowData})*/
    //             }
    //         }}>
    //             <View style={Styles.row}>
    //                 <Image source={Images.default} resizeMode='cover' style={Styles.rowLogo}/>
    //                 <View style={Styles.rowName}>
    //                     <Text>{rowData}</Text>
    //                 </View>
    //             </View>
    //         </TouchableOpacity>
    //     )
    // }

    // _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    //     return (
    //         <View
    //             key={`${sectionID}-${rowID}`}
    //             style={Styles.separator}
    //         />
    //     )
    // }


    render() {
        const {hasNav, renderRow, renderSeparator, listViewStyle, autoScroll = false} = this.props;

        const containerStyle = [Styles.container];
        // hasNav && containerStyle.push({marginTop: Metrics.navBarHeight})
        const listStyle = [Styles.listView];
        listViewStyle && listStyle.push(listViewStyle);

        return (
            <View style={containerStyle}>
                <ListView
                    ref={"list"}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.handleRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }
                    removeClippedSubviews={true}
                    automaticallyAdjustContentInsets={false}
                    initialListSize={10}
                    enableEmptySections={true}
                    style={listStyle}
                    dataSource={this.state.dataSource}
                    renderRow={renderRow || this._renderRow.bind(this)}
                    // renderSeparator={renderSeparator || this._renderSeparator.bind(this)}
                    onLayout={(event) => {
                        this.setState({
                            listHeight: event.nativeEvent.layout.height
                        })
                    }}
                    renderFooter={() => {
                        return (
                            <View onLayout={(event) => {
                                this.setState({
                                    footerY: event.nativeEvent.layout.y
                                })
                            }}/>
                        )
                    }}
                />
            </View>
        )
    }

    /*
     renderScrollComponent={(props) => <RecyclerViewBackedScrollView {...props} />}
     */
}


BaseListView.propTypes = {
    hasNav: PropTypes.bool,
    data: PropTypes.array,
    search: PropTypes.string,
    handleRefresh: PropTypes.func,
    renderRow: PropTypes.func,
    renderSeparator: PropTypes.func,
};

const Styles = create({
    container: {
        flex: 1,
        backgroundColor: '#EBEBEB',
        // paddingBottom: scaleSize(145)
        // marginTop: Metrics.navBarHeight,
    },
    // ListView
    listView: {
        flex: 1,
    },
    row: {
        marginHorizontal: 15,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    separator: {
        height: this.hairlineWidth,
        marginHorizontal: 15,
        backgroundColor: '#CCCCCC',
    },
    rowLogo: {
        marginTop: 10,
        width: 30,
        height: 30,
        borderRadius: 15
    },
    rowName: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 5
    },
    groupHeader: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.steel
    },
    groupHeaderTextWrapper: {
        paddingLeft: 15,
        justifyContent: 'center',
    },
    groupHeaderText: {
        fontSize: 15,
    },
    groupHeaderIcon: {
        flex: 1,
        paddingRight: 16,
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    noticeHeaderWrapper: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: Colors.denim
    },
    noticeHeaderText: {
        color: Colors.snow,
        textAlign: 'left',
    },
    noticeHeaderLeft: {
        width: 45,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    noticeHeaderRight: {
        flex: 1,
        justifyContent: 'center',
    },
    noticeHeaderMiddle: {
        flex: 1,
        justifyContent: 'center',
    },
    noticeHeaderTextRight: {
        textAlign: 'right',
        paddingRight: 15
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    accept: {
        height: 40,
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: Colors.buttonGreen,
        marginRight: 5,
    },
    decline: {
        height: 40,
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: Colors.buttonGrey,
    },
});

export default BaseListView;


