/**
 * Created by mifind on 2016/12/10.
 */
const Dimensions = require('Dimensions');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const scaleX = screenWidth / 375.0;
const scaleY = screenHeight / 667.0;
let fontDisparity = 3; //text的fontSize一般要略小于height的差值。
const CommonResources = {
    screen: {
        scale: scaleX,
        scaleX:scaleX,
        scaleY:scaleY,
        screenHeight: screenHeight,
        screenWidth: screenWidth+1,
        fontDisparity:fontDisparity,
    }
};

export default CommonResources;