/**
 * Created by Monika on 2017/7/5.
 */
import *as types from '../actions/ActionTypes';
import _ from 'underscore'

const initialListSize = {
    // questionList: [],
    questionRes: [],
    isLoading: true,
    questionCount: 0,

    askQuestionRes: [],
    askLoading: true,


    isRefreshing: false,
    loading: false,
    isLoadMore: false,
    noMore: false,


    isQuestRefreshing: false,
    isQuestLoading: false,
    isQuestLoadMore: false,
    isQuestNoMore: false,
    isQuestNetWork: true,
    questionArray: [],
    questionList: {},

    DataArray: [],
    isView: true,
    commentListData: {},


    hotQuestionList: {},
    hotIsQuestRefreshing: {},
    hotIsQuestNoMore: {},
    hotQuestionArray: {},
    hotIsQuestNetWork: true,
    hotQuestLoading: {},
    hotIsQuestLoadMore: {},
    questionObj: {},
    allCertifiedLoading:false,
    allCertifiedData:[],
    allCertifiedRes: {},
    selectallCertifiedListData:[],//选中的@
    selectallCertifiedIds:[],//选中的@
};

export default function QuestionView(state = initialListSize, action = {}) {
    switch (action.type) {
        //热门推荐
        case types.RECEIVE_HOTQUESTLIST:
            state.hotQuestionArray[action.key] = action.res;
            state.questionObj[action.key] = action.res.data;
            if (action.key == 'hotRecommendKey' && _.isEmpty(state.questionObj[action.key])) {
            } else {
                state.hotIsQuestNetWork = _.isEmpty(state.questionObj[action.key]) ? false : true;
            }
            state.hotIsQuestRefreshing[action.key] = false;
            state.hotIsQuestLoadMore[action.key] = false;
            state.hotIsQuestNoMore[action.key] = action.res.data ? action.res.data.length === 0 : 0;
            return Object.assign({}, state, {
                hotQuestionList: state.hotIsQuestLoadMore ? loadMore(state, action, 1) : combine(state, action, 1),
                hotIsQuestRefreshing: state.hotIsQuestRefreshing,
                hotIsQuestLoadMore: state.hotIsQuestLoadMore,
                hotIsQuestNoMore: state.hotIsQuestNoMore,
                hotQuestionArray: state.hotQuestionArray,
                hotIsQuestNetWork: state.hotIsQuestNetWork
            });
            break;

        case types.REQUEST_HOTQUESTLIST:
            return Object.assign({}, state, {
                hotIsQuestRefreshing: action.isRefreshing,
                hotQuestLoading: action.isLoading,
                hotIsQuestLoadMore: action.isLoadMore,
                hotIsQuestNetWork: action.isNetWork
            });
            break;


        //所有认证用户列表
        case types.RECEIVE_LISTALLCERTIFIEDUSER:
            let userRes = action.res;
            return Object.assign({}, state, {
                allCertifiedLoading:_.isEmpty(userRes.result)?false:action.isLoading,
                allCertifiedData:_.isEmpty(userRes.result)?[]:userRes.result,
                allCertifiedRes: _.isEmpty(userRes)?[]:userRes,
                selectallCertifiedListData:[],
                selectallCertifiedIds:[],
            });
            break;
        //选中的@
        case types.RECEIVE_CERTIFIEDUSERSELECT:
            let listData = state.selectallCertifiedListData;
            let ids = state.selectallCertifiedIds;
            let obj = action.rowData;
            let isHave = false;
            for (let i = 0; i < listData.length; i++) {
                if (listData[i].id == obj.id) {
                    isHave = true;
                }
            }
            if (isHave) {
                if (_.first(listData).id == obj.id) {
                    listData.shift();
                    ids.shift()
                } else {
                    for (let i = 0; i < listData.length; i++) {
                        if (obj.id === listData[i].id) {
                            listData.splice([i], 1);
                            ids.splice(i, 1)
                        }
                    }
                }
            } else {
                ids.push(obj.id);
                listData.push({name: obj.nickname, id: obj.id})
            }
            return Object.assign({}, state, {selectallCertifiedListData: listData,selectallCertifiedIds:ids});
            break;

        //
        // case types.REQUEST_QUESTLIST:
        //     return Object.assign({},state,{
        //         isQuestRefreshing: action.isRefreshing,
        //         isQuestLoading: action.isLoading,
        //         isQuestLoadMore: action.isLoadMore,
        //         isQuestNetWork:action.isNetWork
        //     });
        //     break;


        // //向我提问
        // case types.RECEIVE_ASKQUESTLIST:
        //     // let askRes = action.res;
        //     // let askNewDataList = action.option == 1 && _.isEmpty(askRes.data) ? [] : state.askQuestionList.concat(askRes.data);
        //     return Object.assign({}, state, {
        //         askQuestionList: state.askIsQuestLoadMore ? loadMore(state, action, 3) : combine(state, action, 3),
        //         askIsQuestRefreshing: false, askIsQuestLoadMore: false,
        //         askIsQuestNoMore: action.res.data ? action.res.data.length === 0 : 0,
        //         askQuestionArray:action.res,
        //         askIsQuestNetWork:_.isEmpty(state.askQuestionList)?false:true
        //         // askLoading: action.option == 1 && _.isEmpty(askRes.data) ? false : action.isLoading,
        //         // askQuestionList: action.option == 1 ? _.isEmpty(askRes.data) ? [] : askRes.data : askNewDataList,
        //         // askQuestionRes:action.option === 1? _.isEmpty(askRes.data) ? [] : askRes:askRes,
        //     });
        //     break;
        //
        // case types.REQUEST_ASKQUESTLIST:
        //     return Object.assign({},state,{
        //         askIsQuestRefreshing: action.isRefreshing,
        //         askIsQuestLoading: action.isLoading,
        //         askIsQuestLoadMore: action.isLoadMore,
        //         askIsQuestNetWork:action.isNetWork
        //     });
        //     break;
        //
        // case types.RECEIVE_FABU:
        //     return Object.assign({}, state, {questionCount: state.questionCount + 1});
        //     break;


        //评论列表
        case types.RECEIVE_COMMENTDETAILLIST:
            var detailId = action.id;
            if (!_.isEmpty(state.hotQuestionList)) {
                if (!_.isEmpty(state.hotQuestionList[action.key])) {
                    for (var i = 0; i < state.hotQuestionList[action.key].length; i++) {
                        if (detailId == state.hotQuestionList[action.key][i].id) {
                            state.hotQuestionList[action.key][i].replyCount = action.res.count
                        }
                    }
                }
            }
            return Object.assign({}, state, {
                DataArray: action.res,
                commentListData: state.isLoadMore ? loadMore(state, action, 0) : combine(state, action, 0),
                isRefreshing: false, isLoadMore: false,
                noMore: action.res.data ? action.res.data.length === 0 : 0,
                loading: state.res === undefined,
                isView: false,
                questionList: state.questionList
            });
            break;

        case types.REQUEST_COMMENTDETAILLIST:
            return Object.assign({}, state, {
                isRefreshing: action.isRefreshing,
                loading: action.loading,
                isLoadMore: action.isLoadMore,
                isView: action.isView
            });
            break;


        default:
            return state;
    }
}


function combine(state, action, option) {
    if (option == 2) {
        state.questionList = !_.isEmpty(action.res.data) ? action.res.data : [];
        return state.questionList;
    }

    if (option == 1) {
        let data = action.res.data;
        state.hotQuestionList[action.key] = !_.isEmpty(data) ? data : [];
        return state.hotQuestionList;
    }

    if (option == 0) {
        state.commentListData = !_.isEmpty(action.res.data) ? action.res.data : [];
        return state.commentListData;
    }

    if (option == 3) {
        state.askQuestionList = !_.isEmpty(action.res.data) ? action.res.data : [];
        return state.askQuestionList;
    }


}

function loadMore(state, action, option) {
    if (option == 2) {
        state.questionList = _.isEmpty(action.res.data) ? [] : state.questionList.concat(action.res.data);
        return state.questionList;
    }

    if (option == 1) {
        state.hotQuestionList[action.key] = _.isEmpty(action.res.data) ? [] : state.hotQuestionList[action.key].concat(_.isEmpty(action.res.data) ? [] : action.res.data);
        return state.hotQuestionList;
    }

    if (option == 0) {
        state.commentListData = _.isEmpty(action.res.data) ? [] : state.commentListData.concat(action.res.data);
        return state.commentListData;
    }

    if (option == 3) {
        state.askQuestionList = _.isEmpty(action.res.data) ? [] : state.askQuestionList.concat(action.res.data);
        return state.askQuestionList;
    }


}