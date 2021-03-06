// import React, {Component} from "react";
// import PropTypes from 'prop-types';
//
// import {Platform, View} from "react-native";
// // let WebViewBridge = (Platform.OS === 'ios' ? '' : require("react-native-webview-bridge"));
// import WebViewBridge from "react-native-webview-bridge";
//
//
// export default class DisplayHTML extends Component {
//
//     static propTypes() {
//         return {
//             htmlString: PropTypes.string.isRequired,
//             onMessage: PropTypes.func,
//             additionalScripts: PropTypes.array,
//             title: PropTypes.string,
//             style: PropTypes.style,
//             containerStyle: PropTypes.style,
//             HTMLStyles: PropTypes.string,
//             defaultHeight: PropTypes.number,
//             additionalHeight: PropTypes.number
//         };
//     };
//
//     static defaultProps = {
//         title: `react-native-display-html-${Date.now()}`,
//         scrollEnabled: false,
//         defaultHeight: 100,
//         additionalHeight: 0,
//         containerStyle: {},
//         style: {flex: 1}
//     };
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             height: props.defaultHeight + props.additionalHeight
//         };
//         this.onMessage = this.onMessage.bind(this);
//         this.additionalScripts = [this.heightScript];
//         if (props.additionalScripts && props.additionalScripts.length) {
//             this.additionalScripts = this.additionalScripts.concat(props.additionalScripts);
//         }
//         this._buildAdditionalScripts();
//     }
//
//     get HTMLSource() {
//         return `
//             <!DOCTYPE html>
//             <title>${this.props.title}</title>
//             <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
//             <style> input{font-size: 12px;}div{font-size: 14px;}</style>
//             <html>${this.HTMLStyles}
//             <body>
//                 <div class="article--content" onclick="postQuestion('-1','BigView')">
//                     ${this.props.htmlString}
//                 </div>
//                 <script>
//              function postQuestion(id,type) {
//                // var evt = window.event;
//                //    if (evt.stopPropagation) {  
//                //       evt.stopPropagation();
//                //  }else {   
//                //       evt.cancelBubble = true;
//                //  }
//                 var data = {
//                     'id':id,
//                     'type':type,
//                 };
//                 window.postMessage&&window.postMessage(JSON.stringify(data))
//                 }
//             </script>
//          </body>
//             </html>`;
//         /*var data = {
//                     'id':id,
//                     'type':type
//                 }
//                 window.postMessage&&window.postMessage(JSON.stringify(data))
//                 }`<!DOCTYPE html>
//          <title>${this.props.title}</title>
//          <html>
//          <body>
//          <div class="article--content">
//          ${this.props.htmlString}
//          </div>
//          ${this.props.script}
//          <script>window.onload=function(){
//          window.location.hash = 1;
//          document.title = document.body.clientHeight;
//          }
//          </script>
//          </body>
//          </html>`;*/
//
//     }
//
//     get HTMLStyles() {
//         return this.props.HTMLStyles ? `<style>${this.props.HTMLStyles}</style>` : '';
//     }
//
//     get source() {
//         let source = {html: this.HTMLSource};
//
//         if (Platform.OS === 'android' && Platform.Version > 18) {
//             // Allows loading assets such as fonts from the webview.
//             // Setting a baseUrl prevents the HTML from rendering
//             // on Android < 4.4.
//             // See: https://github.com/facebook/react-native/issues/11753
//             // Potential fix: http://bit.ly/2jrH6RC
//             source.baseUrl = 'file:///android_asset/';
//         }
//
//         return source;
//     }
//
//     /**
//      * Checks regularly the height of the webview to update the webview
//      * accordingly.
//      * Note : this isn't transpiled and must be written in ES5 !
//      */
//     heightScript() {
//         function updateHeight() {
//             var B = document.body;
//             var height;
//             if (typeof document.height !== 'undefined') {
//                 height = document.height;
//             } else {
//                 height = Math.max(B.scrollHeight, B.offsetHeight);
//             }
//             window.WebViewBridge.send(JSON.stringify({height: height}));
//         }
//
//         if (window.WebViewBridge) {
//             updateHeight();
//             // setInterval(updateHeight, 1000);
//         }
//     }
//
//     /**
//      * Little helper converting functions to plain strings to inject
//      * in the webview.
//      * @param {function} func
//      */
//     _stringifyFunc(func) {
//         return `(${String(func)})();`;
//     }
//
//     /**
//      * Build a single large string with all scripts so it can be injected
//      * in the webview.
//      */
//     _buildAdditionalScripts() {
//         this._injectedScripts = "";
//         // this._injectedScripts = "document.addEventListener('message',function(e){eval(e.data)})";
//
//         this.additionalScripts.forEach((func) => {
//             this._injectedScripts += this._stringifyFunc(func);
//         });
//     }
//
//
//     /**
//      * Callback when the bridge sends a message back to react-native.
//      * It updates the webview's height if the payload contains the
//      * 'height' key. Else, it fires this.props.onMessage.
//      * @param {object} event
//      */
//     onMessage(event) {
//         const {additionalHeight, onMessage} = this.props;
//         const eventData = JSON.parse(event);
//         // console.log("eventDataeventData--",eventData);
//         const {height} = eventData;
//
//         if (height) {
//
//             let newHeight = height;
//             if (!this._additionalHeightInjected) {
//                 newHeight += additionalHeight;
//                 this._additionalHeightInjected = true;
//             }
//             this.setState({height: newHeight});
//             // onMessage && onMessage(event);
//             // return onMessage && onMessage(eventData);
//
//         } else {
//             return onMessage && onMessage(eventData);
//         }
//     }
//
//     render() {
//         const {style, containerStyle} = this.props;
//
//         const container = [
//             containerStyle,
//             {height: this.state.height}
//         ];
//
//         return (
//             <View style={container}>
//                 <WebViewBridge
//                     {...this.props}
//                     injectedJavaScript={this._injectedScripts}
//                     style={style}
//                     source={this.source}
//                     javaScriptEnabled={true}
//                     messagingEnabled={true}
//                     onBridgeMessage={this.onMessage}
//                     startInLoadingState={true}
//                     domStorageEnabled={true}
//                 />
//             </View>
//         );
//     }
// }
//
