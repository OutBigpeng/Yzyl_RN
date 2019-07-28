/**向我提问Tab
 * Created by Monika on 2017/6/27.
 */


import React, {Component} from 'react';
import {ListView, Text, View} from 'react-native';

import AutoHeightWebView from "../../component/autoHeightWebView/index";
import ATouchableHighlight from "../../component/ATouchableHighlight";

let data =
    [
        {
            title: 'React Native最近两三年之内整个框架在业界在做RN的一些研究开发工作.',
            content: '<input id="3" onclick="postQuestion(3)" size="32" readonly="readonly" style="color: rgb(16, 142, 233); border-style:none; border-width: initial; outline: none; background: transparent;" value="@优众优料优众优料优众优料优众优料"><input id="5" onclick="postQuestion(5)" size="40" readonly="readonly" style="color: rgb(16, 142, 233); border-style: none; border-width: initial; outline: none; background: transparent;" value="@谈吐不凡谈吐不凡谈吐不凡谈吐不凡谈吐不凡"><div></div><div>ScrollView可以在垂直或水平方向滚动，还可以配置pagingEnabled属性来让用户整屏整屏的滑动。此外，水平方向的滑动还可以使用Android上的ViewPagerAndroid 组件。ScrollView可以在垂直或水平方向滚动，还可以配置pagingEnabled属性来让用户整屏整屏的滑动。此外，水平方向的滑动还可以使用Android上的ViewPagerAndroid 组件。 </div>',
            ids: ['3', '5']
        }
        , {
        title: ' 很久没上来了，今天看邮箱发现有人还在看这篇文章。这里提醒大家一下：好像是从0.37还是0.36版本开始，官方组件WebView多了onMessage属性，可以用来做这个两端通讯了',
        content: '<input id="3" onclick="postQuestion(3)" size="8" readonly="readonly" style="color: rgb(16, 142, 233); border-style: none; border-width: initial; outline: none; background: transparent;" value="@优众优料"><input id="5" onclick="postQuestion(5)" size="8" readonly="readonly" style="color: rgb(16, 142, 233); border-style: none; border-width: initial; outline: none; background: transparent;" value="@谈吐不凡">kkkk另外就是官方组件一直在更新，版本不同时可能会有问题，看懂原理然后自己结合当前版本来研究比较合适  </div>',
        ids: ['3', '5']
    },
        {
            title: ' 2222很久没上来了，今天看邮箱发现有人还在看这篇文章。这里提醒大家一下：好像是从0.37还是0.36版本开始，官方组件WebView多了onMessage属性，可以用来做这个两端通讯了',
            content: '<input id="3" onclick="postQuestion(3)" size="8" readonly="readonly" style="color: rgb(16, 142, 233); border-style: none; border-width: initial; outline: none; background: transparent;" value="@优众优料"><input id="5" onclick="postQuestion(5)" size="8" readonly="readonly" style="color: rgb(16, 142, 233); border-style: none; border-width: initial; outline: none; background: transparent;" value="@谈吐不凡">目前大多数App都有头像展示的功能，在实际开发中，用户更换头像的需求屡见不鲜，社交方面的更为明显。在React Native的开发下，同样需要这样的功能来完善App需求。众多优秀的开源库让我们在自己的项目中使用起来非常方便。例如：react-native-image-picker。该库可以实现启动本地相册和照相机来采集图片，但是作者没有实现裁剪功能，针对头像上传的需求，一般都需要对图片进行裁剪。所以本篇和大家分享另一个开源库：react-native-image-crop-picker。该库同样实现了本地相册和照相机来采集图片，并且提供多选、图片裁剪等功能，支持iOS和Android两个平台，不同平台需要分别配置，github上有详细的文字说明。但是好多小伙伴都是android或者ios开发，可能对Android或IOS不熟悉，配置起来会遇到很多问题，所以，我将以图示的方式简化配置步骤，集成更为方便。 </div>',
            ids: ['3', '5']
        }
    ];

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class MyQuestion extends Component {
    // 构造

    constructor(props) {
        super(props);
        // this.html0 = `<p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.</span></p>`;
        // this.html1 = `<p>Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span>If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.</span></p>`;
        this.script0 = '';
        this.script1 = `document.body.style.background = 'cornflowerblue';`;
        // this.changeSource = this.changeSource.bind(this);
        this.changeScript = this.changeScript.bind(this);
        this.state = {
            // html: this.html0,
            script: this.script0,
            height: 0,
            dataSource: ds,
            height11: 200
        };
    }

    // changeSource(rowData) {
    //     this.setState(prevState => ({
    //         html: prevState.html === this.html0 ? this.html1 : this.html0
    //     }));
    // }
    //
    changeScript() {
        // this.changeSource();
        // this.setState(prevState => ({
        //     script: prevState.script === this.script0 ? this.script1 : this.script0
        // }));
    }


    render() {
        return (
            <ListView
                dataSource={this.state.dataSource.cloneWithRows(data)}
                renderRow={(rowData)=>this.renderRow(rowData)}
                style={{flex:1,marginBottom:60}}
            />
        )
    }

    renderRow(rowData) {
        let html = '<div><button onclick="postQuestion()">你好</button></div>';
        let s = `<script>
    function postQuestion(id) {
        window.postMessage&&window.postMessage(id)            
    }
</script>`;
        return (
            <View style={{marginBottom: 50}}>
                <AutoHeightWebView
                    source={{html: '<div>' + rowData.title + rowData.content + '</div>' + s}}
                    // onMessage={()=>this.onMessage()}
                    customScript={this.state.script}
                    javaScriptEnabled={true}
                    messagingEnabled={true}
                    // injectedJavaScript="document.addEventListener('message',function(e){eval(e.data)})"
                    onMessage={ (e) => this.onBridgeMessage(e)}
                    enableAnimation={false}
                    // heightOffset = {this.state.height}
                    // currentHeight={(height) => this.aa(height)}
                />

                <ATouchableHighlight onPress={() => alert(12)}>
                    <Text>点击查看详情</Text>
                </ATouchableHighlight>
            </View>
        );
    }

    aa(height) {
        this.setState({
            height: height
        });
    }

    onBridgeMessage = (event) => {
        const {navigate} = this.props.navigation;
        let id = JSON.parse(event.nativeEvent.data);
        if (id) {
            // navigate('HomeAbstractView', {
            //         title: ' ',
            //         id: id,
            //         callback: () => console.log("")
            //     }
            // );
        }

        // if(this.refs.webview){
        //     this.refs.webview.postMessage("msg('postQuestion')")
        // }else {
        //     alert('error')
        // }

    };
}
