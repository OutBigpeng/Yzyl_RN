import React from 'react';
import {StackNavigator} from 'react-navigation';
import CardStackStyleInterpolator from "react-navigation/src/views/CardStackStyleInterpolator";
import WelcomeView from "./containers/weclome/WeclomeView";
import {View} from "react-native";
import {StackOptions} from "./component/StackOptions";
import HomeArticleView from "./pages/home/HomeArticleView";
import HomeAbstractView from "./pages/home/HomeAbstractView";
import MyQuestion from "./pages/interlocution/MyQuestion1";
import AskMeQuestion from "./pages/interlocution/AskMeQuestion1";
import ProductForSample from "./pages/find/product/ProductForSample";
import BrannerDetailView from "./pages/find/product/BrannerDetailView";
import ProductListView from "./pages/find/search/ProductListView";
import TypeView from "./pages/find/type/TypeView";
import TypeDetail from "./pages/find/type/TypeDetailView";
import TopScrollWebView from "./pages/find/TopScrollWebView";

import TechnicalFormula from "./pages/support/TechnicalFormula";

import MyOrder from "./pages/me/mine/order/MyOrder";
import OrderDetail from "./pages/me/mine/order/OrderDetail";
import OrderTrack from "./pages/me/mine/order/OrderTrack";

import MyAccount from "./pages/me/mine/account/MyAccount";
import ChangePhone from "./pages/me/mine/account/ChangePhone";
import ForgetView from "./pages/login/ForgetView";

import MyMessage from "./pages/me/mine/message/MyMessage";
import MessageWebView from "./pages/me/mine/message/MessageWebView";
import MySetting from "./pages/me/mine/set/MySetting";
import AgreementView from "./pages/login/Agreement";
import FeedBack from "./pages/me/mine/set/FeedBack";
import WebViews from "./pages/me/mine/set/WebViews";
import PutPuestions from "./pages/interlocution/PutQuestions";
import MyFollowView from "./pages/interlocution/MyFollowView";
import QuestionDetail from "./pages/interlocution/QuestionDetail";
import FollowView from './pages/me/mine/follow/FollowView'
import CollectionView from './pages/me/mine/collection/CollectionView'
import ModifyMeHeaderView from './pages/me/ModifyMeHeaderView'
import LoginView from './pages/login/LoginView'
import RegisterView from './pages/login/RegisterView'
import ResetView from './pages/login/ResetPwd';
import ResetPwdView from './pages/login/ResetPwd';
import ReviewedView from './pages/login/Reviewed';
import TabBarView from "./TabHome";
import NewsView from './pages/home/NewsView'
import FormulaView from './pages/technical/FormulaView'
import CurriculumDetailView from './pages/technical/CurriculumDetailView'
import SignUpView from './pages/technical/SignUpView'
import SignUpStatusView from './pages/technical/SignUpStatusView'
import ArticleListView from "./pages/technical/ArticleListView";
import FormulaXNView from "./pages/technical/FormulaXNView";
import ChatCustom from "./pages/interlocution/ChatCustom";
import SignView from './pages/me/SignView'
import SearchFirstView from "./pages/SearchFirstView";
import MaterialListView from "./pages/technical/MaterialListView";
import ScoreMyExchangeGoodsListView from "./pages/me/mine/score/ScoreMyExchangeGoodsListView";
import ScoreUserListView from "./pages/me/mine/score/ScoreUserListView";
import ScoreMallView from "./pages/me/mine/score/ScoreMallView";
import ScoreTaskView from "./pages/me/mine/score/ScoreTaskView";
import MallGoodsOrder from "./pages/me/mine/score/MallGoodsOrder";
import DiscussListView from "./pages/discuss/DiscussListView";
import DiscussPersonHomeView from "./pages/discuss/DiscussPersonHomeView";
import SendContentView from "./pages/discuss/SendContentView";
import GridImageShow from "./pages/discuss/GridImageShow";
import InterlocutionView from "./pages/interlocution/InterlocutionView";
import RegisterUserTypeView from "./pages/login/RegisterUserTypeView";
import DiscussTabView from "./pages/discuss/DiscussTabView";
import TestView from "./pages/me/mine/TestView";
import BindPhoneView from "./pages/login/BindPhoneView";
import UserInfoGoCompleView from "./pages/login/UserInfoGoCompleView";
import DiscussDetailView from "./pages/discuss/DiscussDetailView";
import DiscussQaDetailView from "./pages/discuss/DiscussQaDetailView";
import MyDiscussList from "./pages/discuss/MyDiscussList";
import OpenPdfView from "./pages/home/OpenPdfView";
import ReplierListView from "./pages/discuss/ReplierListView";
import MyExpertScoreView from "./pages/me/mine/score/MyExpertScoreView";
import DiscussMessageView from "./pages/discuss/DiscussMessageView";
import ChatMsgView from "./pages/me/mine/discuss/ChatMsgView";
import MyChatMsgListView from "./pages/me/mine/discuss/MyChatMsgListView";
import AllTypeView from "./pages/find/type/AllTypeView";
import SectionListView from "./pages/find/SectionListView";
import ProductDetailView from "./pages/find/product/ProductDetailView";
import Demo from "./pages/me/mine/Demo";
import VideoPlayView from "./pages/me/mine/VideoPlayView";

const headerNullOptions = {
    header: null
};
const headerOptions = {
    headerStyle: {backgroundColor: 'red'},
    headerTitleStyle: {color: '#333', alignSelf: 'center'},
    headerTintColor: '#999',
    headerBackTitle: null,
    headerRight: <View style={{width: 24}}/>
};
const Routes = StackNavigator({
    WelcomeView: {screen: WelcomeView, navigationOptions: {...headerNullOptions}},

    SearchFirstView: {
        screen: SearchFirstView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    HomeArticleView: {
        screen: HomeArticleView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    OpenPdfView: {
        screen: OpenPdfView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    HomeAbstractView: {
        screen: HomeAbstractView,
        navigationOptions: {header: null}
    },

    Interlocution: {
        screen: InterlocutionView,
        navigationOptions: {header: null}
    },

    AskMeQuestion: {
        screen: AskMeQuestion,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    MyQuestion: {
        screen: MyQuestion,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    PutQuestions: {
        screen: PutPuestions,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    MyFollowView: {
        screen: MyFollowView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    QuestionDetail: {
        screen: QuestionDetail,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    ChatCustom: {
        screen: ChatCustom,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    SectionList: {
        screen: SectionListView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    ProductDetail: {
        screen: ProductDetailView,
        navigationOptions: {header: null}
    },

    ProductForSample: {
        screen: ProductForSample,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    BrannerDetailView: {
        screen: BrannerDetailView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    ProductListView: {
        screen: ProductListView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    ArticleListView: {
        screen: ArticleListView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    TypeView: {
        screen: TypeView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    TypeDetail: {
        screen: TypeDetail,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    AllType: {
        screen: AllTypeView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    TopScrollWebView: {
        screen: TopScrollWebView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    TechnicalFormula: {
        screen: TechnicalFormula,
        navigationOptions: (navigation) => StackOptions(navigation)
    },


    MyExpertScore: {
        screen: MyExpertScoreView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    ScoreMyExchangeGoodsListView: {
        screen: ScoreMyExchangeGoodsListView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    ScoreUserListView: {
        screen: ScoreUserListView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    ScoreMallView: {
        screen: ScoreMallView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    MallGoodsOrder: {
        screen: MallGoodsOrder,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    DiscussListView: {
        screen: DiscussListView,
        navigationOptions: {header: null}
    },
    DiscussMessage: {
        screen: DiscussMessageView,
        navigationOptions: {header: null}
    },
    DiscussTabView: {
        screen: DiscussTabView,
        navigationOptions: {header: null}
    },
    DiscussDetailView: {
        screen: DiscussDetailView,
        navigationOptions: {header: null}
    },

    ReplierList: {
        screen: ReplierListView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    DiscussQaDetailView: {
        screen: DiscussQaDetailView,
        navigationOptions: {header: null}
    },
    DiscussPersonHome: {
        screen: DiscussPersonHomeView,
        navigationOptions: {header: null}
    },
    MyDiscussList: {
        screen: MyDiscussList,
        navigationOptions: {header: null}
    },
    MyChatMsgList: {
        screen: MyChatMsgListView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    ChatMsg: {
        screen: ChatMsgView,
        navigationOptions: {header: null}
    },
    SendContentView: {
        screen: SendContentView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    GridImageShow: {
        screen: GridImageShow,
        navigationOptions: {header: null}
    },

    ScoreTaskView: {
        screen: ScoreTaskView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    MyOrder: {
        screen: MyOrder,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    OrderDetail: {
        screen: OrderDetail,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    OrderTrack: {
        screen: OrderTrack,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    ForgetView: {
        screen: ForgetView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    MyAccount: {
        screen: MyAccount,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    ChangePhone: {
        screen: ChangePhone,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    MyMessage: {
        screen: MyMessage,
        path: 'my/myMessage',
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    MessageWebView: {
        screen: MessageWebView,
        path: 'my/MessageWeb',
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    MySetting: {
        screen: MySetting,
        path: 'my/mySetting',
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    FeedBack: {
        screen: FeedBack,
        path: 'my/FeedBack',
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    WebViews: {
        screen: WebViews,
        path: 'my/WebViews',
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    FollowView: {
        screen: FollowView,
        path: 'my/FollowView',
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    CollectionView: {
        screen: CollectionView,
        path: 'my/CollectionView',
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    ModifyMeHeaderView: {
        screen: ModifyMeHeaderView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    TestView: {
        screen: TestView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    Demo: {
        screen: Demo,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    VideoPlay: {
        screen: VideoPlayView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    LoginView: {
        screen: LoginView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    BindPhone: {
        screen: BindPhoneView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    UserInfoGoComple: {
        screen: UserInfoGoCompleView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    RegisterUserTypeView: {
        screen: RegisterUserTypeView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    RegisterView: {
        screen: RegisterView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    ResetView: {
        screen: ResetView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    ReviewedView: {
        screen: ReviewedView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    AgreementView: {
        screen: AgreementView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    ResetPwdView: {
        screen: ResetPwdView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    NewsView: {//注意： 这个不能随便 改。后台一起配置了。
        screen: NewsView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    FormulaView: {
        screen: FormulaView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    FormulaXNView: {
        screen: FormulaXNView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    MaterialList: {
        screen: MaterialListView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    CurriculumDetailView: {//注意： 这个不能随便 改。后台一起配置了。
        screen: CurriculumDetailView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    SignUpView: {
        screen: SignUpView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    SignUpStatusView: {
        screen: SignUpStatusView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },
    SignView: {
        screen: SignView,
        navigationOptions: (navigation) => StackOptions(navigation)
    },

    Main: {screen: TabBarView, navigationOptions: {...headerNullOptions}},

}, {
    mode: 'card',//跳转效果
    headerMode: 'screen',
    transitionConfig: (() => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal,
        timeout: 2000,
    })),
    cardStyle: {
        shadowOpacity: 0,
        backgroundColor: 'white',
    },
    animationEnabled: false,
});

export default Routes;