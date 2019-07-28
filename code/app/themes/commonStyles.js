/**
 * Created by Monika on 2017/9/4.
 */
import {Dimensions, Platform} from 'react-native'
import {px2dp} from "../common/CommonUtil";

const {width, height} = Dimensions.get('window');


/**
 * Default styles
 * @type {StyleSheetPropType}
 */
const styles = {
    footerStyle: {
        fontSize: px2dp(12),
        color: '#999999',
        margin: Platform.OS === 'ios' ? 10 : 5
    },

    footViewStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    },
};
export default styles;
