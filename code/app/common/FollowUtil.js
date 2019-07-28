/**
 * Created by coatu on 2017/6/28.
 */

import {getHomeIsFollowData, getHomeFollowData, getHomeUnFollowData} from '../dao/HomeDao'
import {toastShort} from '../common/CommonDevice'

var datas = '';
//是否关注或取消关注
export const getFollowData = (option, items, navigation, userInfo, getLoad, callback,status) => {
    const {navigate} = navigation;
    let data = {
        'userId': items ,
        'followerId': userInfo.userid
    };
    if (option == 1) {
        getHomeIsFollowData(data, (res) => {
            datas = res;
            callback(res)
        }, (err) => {
        })
    } else {
        getLoad.getLoading().show();
        if (status) {
            getHomeFollowData(data, navigate, (res) => {
                getLoad.getLoading().dismiss();
                datas = true;
                callback(true)
            }, (err) => {
                toastShort('关注失败，请重新操作');
                getLoad.getLoading().dismiss()
            })
        } else {
            getHomeUnFollowData(data, navigate, (res) => {
                getLoad.getLoading().dismiss();
                datas = false;
                callback(false)
            }, (err) => {
                toastShort('取消关注失败，请重新操作');
                getLoad.getLoading().dismiss()
            })
        }
    }
};

export const getIsCollectData = ()=>{

}