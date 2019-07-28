/**首页——Reducer
 */
const initialAuthState = {

    //大学 主页 新闻 列表的总数据
    homeListData: [],
    homeListArray: [],

    technicalListData: [],
    technicalListArray: [],

    newListData: [],
    newListArray: [],

    //下拉刷新 上啦加载需要用到的数据
    isRefreshing: false,
    isLoadMore: false,

    //主页产品的数据
    homeRecommendData: [],
    homeRecommendLoading: false,


    //主页，大学，新闻选中的label，和id，还有名称
    homeSelectedLabel: '',
    homeSelectedLabelName: '',
    technicalSelectedLabel: '',
    technicalSelectedId: '',
    newSelectedLabel: '',
    newSelectedLabelName: '',
    selectedLabelStatus: '',

    technicalSelecteAllLabel:'',

    homelabelType:'',
    technicallabelType:'',
    newlabelType:'',

    //区分接口传过来的数据，防止数据混乱，被重置
    homeData: [],
    newData: [],
    technicalData: [],

    //页数
    homePages: 1,
    newPages: 1,
    technicalPages: 1,

//主页文章里面我的数据
    homeMyListData: {},
    homeIsLoadMore: false,
    homeMyLoading: false,
    homeMyIsRefreshing: false,
    homeMyDataArray: [],

   //主页文章是否关注按钮的状态
    homeFollowStatus:'',

    //导航条图片
    navSelectedImage:false

    // loginTechnicalStatus:false

};
import *as types from '../actions/ActionTypes';

function auth(state = initialAuthState, action) {
    switch (action.type) {
        case types.receive_home11:
            if (action.option == 'home') {
                state.homePages = action.page;
                state.homeData = action.res;
                if (action.page && action.page == 1) {
                    state.homeListData = state.homeData.data;
                } else if (action.page > 1) {
                    state.homeListData = state.homeListData.concat(state.homeData.data)
                }
            }

            if (action.option == 'coating') {
                state.technicalPages = action.page;
                state.technicalData = action.res;
                if (action.page && action.page == 1) {
                    state.technicalListData = state.technicalData.data;
                } else if (action.page > 1) {
                    state.technicalListData = state.technicalListData.concat(state.technicalData.data)
                }
            }

            if (action.option == 'new') {
                state.newPages = action.page;
                state.newData = action.res;
                if (action.page && action.page == 1) {
                    state.newListData = state.newData.data;
                } else if (action.page > 1) {
                    state.newListData = state.newListData.concat(state.newData.data)
                }
            }

            return Object.assign({}, state, {
                homeListArray: state.homeData,
                homeListData: state.homeListData,
                technicalListData: state.technicalListData,
                technicalListArray: state.technicalData,
                newListData: state.newListData,
                newListArray: state.newData,
                isRefreshing: false,
                isLoadMore: false,
                homePages: state.homePages,
                technicalPages: state.technicalPages,
                newPages: state.newPages,
                loginTechnicalStatus:false

            });
        case types.request_home11:
            return Object.assign({}, state, {
                isRefreshing: action.isRefreshing,
                isLoadMore: action.isLoadMore,
                selectedLabelStatus: false,
                loginTechnicalStatus:false
            });


        //推荐品牌
        case types.RECEIVE_HOMERECOMMEND:
            return Object.assign({}, state, {homeRecommendData: action.res.result, homeRecommendLoading: false});
            break;
        case types.REQUEST_HOMERECOMMEND:
            return Object.assign({}, state, {homeRecommendLoading: action.isData});
            break;


        case types.RECEIVE_SELECTEDLABEL:
            let value = action.label.value||action.label.name;
            let key = action.label.key||action.label.id;
            let labelType =  action.label.type;
            if (action.option == 'home') {
                state.homeSelectedLabel = value ? value : state.homeSelectedLabel;
                state.homeSelectedLabelName = key ? key : state.homeSelectedLabelName;
                state.homelabelType =labelType;
            }
            if (action.option == 'coating') {
                state.technicalSelecteAllLabel = action.label;
                state.technicalSelectedLabel = value;
                state.technicalSelectedId = key;
                state.technicallabelType =labelType;

            }
            if (action.option == 'new') {
                state.newSelectedLabel = value;
                state.newSelectedLabelName = key;
                state.newlabelType =labelType;
            }
            return Object.assign({}, state, {
                homeSelectedLabel: state.homeSelectedLabel,
                technicalSelectedLabel: state.technicalSelectedLabel,
                newSelectedLabel: state.newSelectedLabel,
                selectedLabelStatus: action.status,
                newSelectedLabelName: state.newSelectedLabelName,
                homeSelectedLabelName: state.homeSelectedLabelName,
                technicalSelectedId: state.technicalSelectedId,
                technicalSelecteAllLabel:state.technicalSelecteAllLabel,
                homelabelType:state.homelabelType,
                technicallabelType:state.technicallabelType,
                newlabelType:state.newlabelType,
            });
            break;

        //我的文章里面的列表
        case types.RECEIVE_HOMEMYLIST:
            return Object.assign({}, state, {
                homeMyDataArray: action.res,
                homeMyListData: state.homeIsLoadMore ? loadMore(state, action, 1) : combine(state, action, 1),
                homeMyIsRefreshing: false, homeIsLoadMore: false,
                noMore: action.res.data ? action.res.data.length === 0 : 0,
                homeMyLoading: state.res === undefined,
                // isView:false
            });
            break;

        case types.REQUEST_HOMEMYLIST:
            return Object.assign({}, state, {
                homeMyIsRefreshing: action.isRefreshing,
                homeMyLoading: action.loading,
                homeIsLoadMore: action.isLoadMore,
                // isView:action.isView
            });
            break;

        // case types.receive_aa:
        //     return Object.assign({},state,{scrollStatus:action.status});
        //     break;


            //主页是否关注的按钮状态
        case types.RECEIVE_HOMEFOLLOW:
            return Object.assign({},state,{homeFollowStatus:action.status});
            break;

            //导航条图片
        case types.RECEIVE_NAVSELECTEDIMAGE:
            return Object.assign({},state,{navSelectedImage:action.isSelectedImage});
            break;

        //
        //     //重新登录大学数据不刷新的问题
        // case types.RECEIVE_LOGINTECHNICAL:
        //     return Object.assign({},state,{loginTechnicalStatus:action.status});
        //     break;


        default:
            return state;
    }
}

function combine(state, action, option) {
    if (option) {
        state.homeMyListData = action.res.data;
        return state.homeMyListData;
    } else {
        if (action.option == 'home') {
            state.homeListData = state.homeData.data;
            return state.homeListData;
        }

        if (action.option == 'coating') {
            state.technicalListData = state.technicalData.data;
            return state.technicalListData;
        }
    }
}

function loadMore(state, action, option) {
    if (option) {
        state.homeMyListData = state.homeMyListData.concat(action.res.data);
        return state.homeMyListData;
    } else {
        switch (action.option) {
            case 'home':
                state.homeListData = state.homeListData.concat(state.homeData.data);
                return state.homeListData;
                break;

            case 'coating':
                state.technicalListData = state.technicalListData.concat(state.technicalData.data);
                return state.technicalListData;
                break;

            default:
                break;
        }
    }

}

export default auth;