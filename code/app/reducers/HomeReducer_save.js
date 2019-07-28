/**登录——Reducer
 * Created by coatu on 2016/12/21.
 */
import *as types from '../actions/ActionTypes';
import _ from 'underscore'
const initialListSize = {
    homeListData: {},
    // homeListData:[],
    homeRes: [],
    isRefreshing: false,
    loading: false,
    isLoadMore: false,
    DataArray: [],
    MessageData: {},
    isView: true,

    technicalDataArray: [],
    technicalListData: {},

    newDataArray: [],
    newListData: {},


    homeMyListData: {},
    homeIsLoadMore: false,
    homeMyLoading: false,
    homeMyIsRefreshing: false,
    homeMyDataArray: [],


    homeData: [],
    coating: [],
    newData: [],

    newLoading: true,
    homeLoading: true,
    coatingLoading: true,


    isNetWork: false,

    homeSelectedLabel: '',
    homeSelectedLabelName: '',
    technicalSelectedLabel: '',
    technicalSelectedId: '',
    newSelectedLabel: '',
    newSelectedLabelName: '',

    homeRecommendData: [],
    homeRecommendLoading: false,

    selectedLabelStatus: '',
    homePage: '',
    newPage: '',
    technicalPage: '',


    //上面的。没看懂。
    selectedLabels:{'Home':'', 'University': '', 'News': ''},
    labels:{'Home': {}, 'University': {}, 'News': {}},
     HomeObj : {},
    UniversityObj: {},
     NewsObj : {},

};

export default function HomeView(state = initialListSize, action = {}) {
    switch (action.type) {
        //主页的列表
        case types.RECEIVE_HOMELIST:
            // var aa = [],bb = [];
            if (action.option == 'home') {
                state.homeData = action.res
            } else if (action.option == 'coating') {
                state.coating = action.res
            } else {
                state.newData = action.res
            }


            if (!state.isLoadMore && action.option == 'home') {
                state.homeListData = state.homeData.data;
            }

            if (state.isLoadMore && action.option == 'home') {
                state.homeListData = state.homeListData.concat(state.homeData.data);
            }


            if (!state.isLoadMore && action.option == 'new') {
                state.newListData = state.newData.data;
            }

            if (state.isLoadMore && action.option == 'new') {

                state.newListData = state.newListData.concat(state.newData.data);
            }


            if (!state.isLoadMore && action.option == 'coating') {
                state.technicalListData = state.coating.data;
            }

            if (state.isLoadMore && action.option == 'coating') {
                state.technicalListData = state.technicalListData.concat(state.coating.data);
            }

            return Object.assign({}, state, {
                DataArray: state.homeData,
                homeListData: state.isLoadMore ? state.homeListData : state.homeListData,
                newListData: state.isLoadMore ? state.newListData : state.newListData,
                newDataArray: state.newData,

                technicalDataArray: state.coating,
                technicalListData: state.isLoadMore ? state.technicalListData : state.technicalListData,
                noMore: action.option == 'home' ? state.homeData.data ? state.homeData.data.length === 0 : 0 :
                    action.option == 'new' ? state.newData.data ? state.newData.data.length === 0 : 0 : state.coating.data ? state.coating.data.length === 0 : 0,
                loading: action.option == 'home' ? state.homeData === undefined : action.option == 'new' ? state.newData === undefined : state.coating === undefined,
                // isView: false,
                newLoading: _.isEmpty(state.newData.data) ? false : true,
                homeLoading: _.isEmpty(state.homeData.data) ? false : true,
                coatingLoading: _.isEmpty(state.coating.data) ? false : true,
                isRefreshing: false,
                isLoadMore: false,
                isNetWork: true,
                selectedLabelStatus:false
            });
            break;

        case types.REQUEST_HOMELIST:
            if(action.option == 'coating'){
                state.technicalPage = action.pages
            }
            if(action.option == 'new'){
                state.newPage = action.pages;
            }
            if(action.option == 'home'){
                state.homePage = action.pages;
            }
            return Object.assign({}, state, {
                isRefreshing: action.isRefreshing,
                loading: action.loading,
                isLoadMore: action.isLoadMore,
                // isView: action.isView,
                isNetWork: action.isNetWork,
                selectedLabelStatus:action.techinalStatus,
                technicalPage:state.technicalPage,
                newPage:state.newPage,
                homePage:state.homePage
            });
            break;


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


        case types.RECEIVE_SELECTEDLABEL:
            if (action.option == 'home') {
                state.homeSelectedLabel = action.label.keyValue;
                state.homeSelectedLabelName = action.label.keyName;
            } else if (action.option == 'coating') {
                state.technicalSelectedLabel = action.label.name;
                state.technicalSelectedId = action.label.id
            } else if (action.option == 'new') {
                state.newSelectedLabel = action.label.keyValue;
                state.newSelectedLabelName = action.label.keyName;
            }
            return Object.assign({}, state, {
                homeSelectedLabel: state.homeSelectedLabel,
                technicalSelectedLabel: state.technicalSelectedLabel,
                newSelectedLabel: state.newSelectedLabel,
                selectedLabelStatus: action.status,
                newSelectedLabelName:state.newSelectedLabelName,
                homeSelectedLabelName:state.homeSelectedLabelName
            })
            break;



        //推荐品牌
        case types.RECEIVE_HOMERECOMMEND:

            return Object.assign({}, state, {homeRecommendData: action.res.result, homeRecommendLoading: false});
            break;
        case types.REQUEST_HOMERECOMMEND:
            return Object.assign({}, state, {homeRecommendLoading: action.isData});
            break;

        default:
            return state;
    }
}


function combine(state, action, option) {
    if (option) {
        state.homeMyListData = action.res.data;
        return state.homeMyListData;
    } else {

        // if(action.option == 'home'){
        state.homeListData = state.aa.data;
        return state.homeListData;
        // }else {
        //     state.technicalListData = state.bb.data;
        //     console.log(' state.technicalListData', state.technicalListData)
        //     return state.technicalListData;
        // }

    }
}

function loadMore(state, action, option) {
    if (option) {
        state.homeMyListData = state.homeMyListData.concat(action.res.data);
        return state.homeMyListData;
    } else {
        if (action.option == 'home') {
            state.homeListData = state.homeListData.concat(action.res.data);
            return state.homeListData;
        } else {
            state.technicalListData = state.technicalListData.concat(action.res.data);
            return state.technicalListData;
        }
    }
}