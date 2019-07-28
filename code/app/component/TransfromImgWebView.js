/**
 * 用于需要放大的图片
 * Created by Monika on 2017/11/13.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {WebView} from 'react-native';
import {deviceHeight, PlatfIOS} from '../common/CommonDevice';
import {StyleSheet} from '../themes';

export class TransfromImgWebView extends Component {
    static propTypes = {
        dataUrl: PropTypes.string
    };

    render() {
        let html =
            `<html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
             <title>优众优料</title>
             <meta http-equiv="X-UA-Compatible" content="IE=edge">
             <meta name="viewport" content="width=device-width, initial-scale=1">
             <link rel="shortcut icon" href="http://activity.youzhongyouliao.com/favicon.ico">
              <style type="text/css">
                body{
                  margin: 0;
                  padding: 10px 3px 0 3px;
                  overflow-x: hidden;
                 }
                img{
                  width: 100%;
                  height: auto;
                }
                .advertise_one{
                  display: none;
                }
              </style>
           </head>
         <body>
           <div class="advertise_one" style="display: block"><img src=${this.props.dataUrl} class="img"></div>
         </body>
      </html>`;

        return (
            <WebView
                style={styles.webView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                source={PlatfIOS ? {html: html, baseUrl: ''} : {html: html}}
                automaticallyAdjustContentInsets={true}
            >
            </WebView>
        )
    }
}


const styles = StyleSheet.create({
    webView: {
        flex: 1,
        height: deviceHeight,
    }
});