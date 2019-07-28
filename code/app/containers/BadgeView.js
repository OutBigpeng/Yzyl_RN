/**
 * Created by coatu on 2017/6/21.
 */
import React, {Component} from 'react';
import {AsyncStorage, Image, Platform, Text, View} from 'react-native';
import {BGTextColor, connect, px2dp} from '../common/CommonDevice'

let PlatfIOS = Platform.OS == 'ios';

class BadgeView extends Component {
    componentDidMount() {
        // AsyncStorage.getItem(BUYINFO, (error, id) => {
        //     let item = JSON.parse(id);
        //     if (item) {
        //         this.props.actions.fetchShopCountInfo(item, 0);
        //         // this.getMessageCount(item.userid);
        //     }
        // });
    }

    /**                    {this.props.tabBarTitle !='问答'?

     :
     <View style={PlatfIOS?{width:55,height:55,backgroundColor: 'white',
                        borderRadius:27.5,alignItems:'center',justifyContent:'center',marginTop:10}:
                        {width:35,height:35,backgroundColor: 'white',
                            borderRadius:35,alignItems:'center',justifyContent:'center'}
                    }>
  //   <Text style={this.props.focused?{color:BGTextColor,fontWeight:'bold'}:{color:'white'}}>问答</Text>
     <Image
          source={this.props.Images}
          resizeMode={PlatfIOS?Image.resizeMode.contain:Image.resizeMode.stretch}
          style={this.props.style}/>
</View>




     * */
    render() {
        let msgC = this.props.state.ChatSubscribe.msgCount || 0;
        let cartC = 0;
        let count = 0;
        // let bili = 1;
        // if(this.props.tabBarTitle == '问答'){
        //     bili = 2
        // }
        if (this.props.tabBarTitle == '收藏夹' || this.props.tabBarTitle == '购物车') {
            count = cartC
        } else {
            count = msgC
        }
        return (
            <View style={{flexDirection: 'row'}}>
                {this.props.tabBarTitle !== '1111' ? <Image
                        source={this.props.Images}
                        resizeMode={Image.resizeMode.contain}
                        style={this.props.style}
                    /> :
                    <View style={{
                        width: Platform.OS == 'ios' ? 45 : 30,
                        height: Platform.OS == 'ios' ? 45 : 30,
                        backgroundColor: 'red',
                        borderRadius: Platform.OS == 'ios' ? 22.5 : 15,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text
                            style={{fontSize: px2dp(PlatfIOS ? 15 : 10), color: 'white', fontWeight: 'bold'}}>提问</Text>

                    </View>}

                {count != 0 ? this.props.tabBarTitle == '收藏夹' || this.props.tabBarTitle == '购物车' || this.props.tabBarTitle == '技术' ?
                    <View style={{
                        backgroundColor: 'white',
                        height: PlatfIOS ? 20 : 12.5,
                        width: PlatfIOS ? 20 : 12.5,
                        position: 'absolute',
                        right: PlatfIOS ? -15 : 0,
                        top: PlatfIOS ? 0 : 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: PlatfIOS ? 10 : 6
                    }}><Text
                        style={{
                            fontSize: px2dp(PlatfIOS ? 12 : 8),
                            color: BGTextColor
                        }}>{count}</Text></View> : null : null}
            </View>
        )
    }


    // getMessageCount(id) {
    //     let data = {
    //         "userid": id,
    //         "usertype": "merchant",
    //         "isread": 0
    //     };
    //     messageCountById(data, (res) => {
    //         if (res) {
    //             this.setSysMsgCount(res);
    //         }
    //     }, (err) => {
    //     })
    // }

    // setSysMsgCount(count) {
    //     AsyncStorage.setItem(NOMESSAGECOUNT, JSON.stringify(count));
    //     this.setState({
    //         messageIsReadCount: count
    //     })
    // }
}

export default connect(state => ({
        state: state
    }),
    (dispatch) => ({
        // actions: bindActionCreators(ShopAction, dispatch)
    })
)(BadgeView);