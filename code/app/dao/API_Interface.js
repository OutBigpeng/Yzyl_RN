/**
 * Created by coatu on 2016/12/26.
 */
export const API_GETSYSDICTIONARY = 'system/GetSysDictionary';//系统请求字段名称
export const API_LISTFIRSTPYBYPARENTKEY = 'system/queryListFirstPYByParentKey';//系统请求


export const API_REGISTER = 'user/register'; //注册
export const API_ADDRESS = 'dict/getTreeProvinceCity';//获取省市区地址
export const API_ALERABYID = 'user/queryBuyerGradeAndAreaIdById';//根据id获取买家等级信息和销售区域
export const API_BUYERGRADE ='user/queryListBuyerGrade'; //获取用户等级

export const API_QUERYLINKMANJOBTREE='system/queryLinkManJobTree';//职位分级下拉

export const API_WECHATAUTH = 'auth/getTokenByWeChatAuth';//微信认证code
export const API_BINDUSERINFO= 'user/bindUserInfo';//绑定 用户信息
export const API_COMPLEUSERINFO= 'user/compleUserInfo';//完善 用户信息

export const API_PWDLOGIN = 'auth/getTokenByPWDAuth';//密码登录
export const API_SMSAUTH = 'auth/getTokenBySMSAuth'; //短信验证码登录
export const API_CODE = 'user/sendMessage';//短信验证码
export const API_RESETPWD = 'user/resetPassword';//重置密码
export const API_RETIEVEASSWORD = 'user/retrievePassword'; //短信验证
export const API_MODIFY_PHONE = 'user/modifyMobile';//重置手机
export const API_ISMESSAGECOUNT = 'message/getMessageCount';//消息数量未读
export const API_MESSAGEISREAD = 'message/markMessageIsRead'; //消息数量已读
export const API_MERCHANTSERACHCOMPANY = 'merchant/getMerchantBySearch';//注册时模糊匹配公司名称

/*找产品*/
/*根据供应商账号查找所属产品 */
export const API_PRODUCT_LIST = 'product/pageListProduct';//'product/queryListProductByKeyword' 产品搜索功能
export const API_BANNER = 'product/queryListBanner'; //图片轮播
export const API_RECOMMENDBRAND = 'product/queryListRecommendBrand'; //推荐品牌
export const API_LISTBRANDFIRSTPY = 'product/queryListBrandFirstPY'; //品牌
export const API_PRODUCTLISTKEYWORD= 'product/queryListKeyword'; //产品热门搜索功能
export const API_RECOMMENDPRODUCT = 'product/getListProduct'; //'product/queryListRecommendProduct'; //推荐产品
export const API_TYPE ='product/getFirstCategory'; //全部分类
export const API_TYPEDETAIL = 'product/getNextCategory';//分类详情
export const API_PRODUCTDETAIL = "product/getProductDetail";//'product/queryProductDetail';//产品详情
export const API_SAMPLE = 'product/askForSample';//索样
export const API_DEFAULTADDRESS = 'user/getDefaultAddress'; //默认选中地址
export const API_GETUSERRECEIVER= 'user/getUserReceiver'; //索样地址获取   user/getUserReceiver
export const API_PRODUCTPARAMETES ='product/queryProductParameters';//产品详情页技术参数，生产介绍等
export const API_LISTPRODUCTPRICE = 'product/queryListProductPrice';//查看VIP会员价格
export const API_TELEPHONE = 'system/queryXujiaTelephone'; //打电话

export const API_COLLECTPRODUCT ='product/collectProduct';//收藏产品
export const API_COLLECTPRODUCTLIST ='product/getListCollectProduct';//收藏产品列表
export const API_COLLECTPRODUCTCOUNT ='product/getCountCollectProduct';//收藏产品数量

/*购物车*/
export const API_SHOPCOUNT ='order/queryCountShoppingCart';//购物车数量
export const API_SHOPCAR = 'order/queryShoppingCar';//购物车列表
export const API_ADDSHOPCART = 'order/addShoppingCart'; //加入购物车

 /**----------订单----------*/

export const API_CONFIRM_ORDER = 'order/confirmOrder';//确定订单(下订单)功能
export const API_COMMIT_ORDER = 'order/submitOrder';//提交订单
export const API_DELETESHOPCART = 'order/deleteShoppingCart';//删除购物车

export const API_ORDER_LIST = 'order/queryListOrder';//订单列表
export const API_ORDER_DETAIL = 'order/queryOrderDetail';//订单详情
export const API_ORDER_RETRY_BUY = 'order/submitCopyOrder';//再次购买订单提交功能
export const API_ORDER_RETRY_BUY_CALC = 'order/confirmCopyOrder';//订单重新购买计算总金额功能
export const API_ORDER_TRACK = 'order/queryListOrderTrack';//订单跟踪功能


/*-----------------------------个人中心模块------------------------*/

//-------------------收货人-----------
export const API_RECEIVER_LIST = 'user/queryListOrderRecAddress';//订单收货人列表
export const API_RECEIVER_EDIT = 'user/updateOrderRecAddress';//编辑
export const API_RECEIVER_NEWADD = 'user/addOrderRecAddress';//新增
export const API_RECEIVER_DEL = 'user/deleteOrderRecAddress';//删除
export const API_RECEIVER_SHOW = 'user/queryOrderRecAddressDetail';//查询
export const API_RECEIVER_SETTDEFAULT = 'user/settingDefaultOrderRecAddress';//设置默认

//----------------发票-------------
export const API_BILL_LIST = 'order/queryListInvoice';//发票列表
export const API_BILL_SHOW = 'order/queryInvoiceDetail';//查看发票详情
export const API_BILL_SETTDEFAULT = 'order/settingDefaultInvoice';//设置发票默认
export const API_BILL_RECEIVER_LIST = 'user/queryListInvoiceRecAddress';//发票收件人列表
export const API_BILL_RECEIVER_EDIT = 'user/updateInvoiceRecAddress';//编辑发票收件人地址
export const API_BILL_RECEIVER_SHOW = 'user/queryInvoiceRecAddressDetail';//查询发票收件人地址详情
export const API_BILL_RECEIVER_NEWADD = 'user/addInvoiceRecAddress';//新增发票收件人地址
export const API_BILL_RECEIVER_DEL = 'user/deleteInvoiceRecAddress';//删除发票收件人地址
export const API_BILL_RECEIVER_SETTDEFAULT = 'user/settingDefaultInvoiceRecAddress';//设置默认发票收件人地址

//------------优惠券---------
export const API_COUPON_LIST = 'coupon/queryListCoupon';//列表
export const API_COUPON_LIST_ORDER = 'coupon/queryListMatchConditionCoupon';//提交时是否有满足的下单
export const API_COUPON_LIST_NUM = 'coupon/queryCouponQty';//各个状态优惠券的值
export const API_ALIVE_COUPON = 'coupon/bindCoupon';//激活/绑定优惠券
//------------优惠券---------



/**-------系统--------*/
export const API_MESSAGE_LIST = 'systemRelated/queryListSysMessage';//系统消息
export const API_FEEDBACK = 'systemRelated/feedback';//反馈
export const API_SYSTEM_AGREEMENT = 'systemRelated/queryAgreementByName';//获取系统协议功能
export const API_VERSIONUPDATE = 'systemRelated/versionUpdate';//更新


/**-------------聊天------旧-----------------*/
export const API_CHATMESSAGE = "im/getChatMessages";//向后台发送消息

export const API_CHATIMGMESSAGE = "im/getChatMessagesForPic";//向后台发送消息(接收)

export const API_DEALMESSAGEIMGURL = "im/dealMessageImgUrl";//向后台发送本地的图片上传后的消息

export const API_QUERYVALUEBYSCKEY = "system/queryValueBySCKey";//是否开始使用环信或欢迎语

/**--新私信--*/
export const API_IMADDCHATMSG = 'im/addChatMsg';//发送消息
export const API_IMPAGECHATMSG = 'im/pageChatMsg';//列表

//获取未读消息数量
export const API_IMNOMESSAGECOUNT = 'im/getOfflineMsgCount';

//消息通知   当前是前台还是后台
export const API_GETUSERPOSITION= 'im/getUserPosition';


//大学与首页  条形菜单合并
export const API_LISTSHOWGROUPBYCODE = 'article/queryListShowGroupByCode';

/*首页接口*/
export const API_HOMELIST = 'article/queryArticlesForApp';
export const API_HOMEAPPLABEL = 'app/getListAppLabel';//获取首页七标签信息列表

export const API_HOMEARTICLE = 'article/getArticle'; //首页正文
export const API_HOMEABSTRACT = 'user/getUserWithCertifiedInfo';//用户资料简介
export const API_HOMEFOLLOW = 'user/follow';//关注
export const API_UNHOMEFOLLOW = 'user/unFollow';//取消关注
export const API_HOMEISFOLLOW ='user/isFollow'; //是否关注
export const API_HOMERECOMMEND = 'app/getListAppHomeRecommend';//首页推荐认证账号

/*我的关注*/
export const API_MYFOLLOWLIST = 'user/queryMyFollowList';

/**文章收藏或者取消收藏的接口*/
export const API_ISCOLLECTARTICLE = 'article/collectArticle';

/*七牛的接口*/
export const API_QINIUTOKEN = 'image/getUpToken';
export const API_QINIUDOMAIN = 'system/queryDomain';
export const API_UPDATEIMAGE = 'user/updateUserByIdOrMobile';



/*问答的接口*/
export const API_NEWQUESTION = 'qa/newQuestion';//我的提问
export const API_GETQUESTION = 'qa/getQuestion';//获取问题信息
export const API_GETANSWERLISTBYQUESTION= 'qa/getAnswerListByQuestion';//某个问题的回答列表
export const API_QUERYMETIONEDQUESTION= 'qa/queryMetionedQuestion';//向我提问
export const API_QUERYMYANSWER= 'qa/queryMyAnswer';//我回答过的问题列表
export const API_QUERYMYQUESTIONS= 'qa/queryMyQuestions';//查询我提的问题列表-分页

export const API_LISTALLCERTIFIEDUSER= 'user/queryListAllCertifiedUser';//获取所有认证用户


export const API_DELQUESTION = 'qa/deleteQuestion';//删除问题
export const API_DELANSWER = 'qa/deleteAnswer';//删除回答
export const API_NEWANSWER = 'qa/newAnswer';//提交新的回答
export const API_HOTRECOMMEND = 'qa/queryRecommendQuestions';//推荐问答列表





/**涂料大学页面接口*/
export const API_ARTICLECATEGORYBYCOATINGUNIVERSITY = 'article/getArticleCategoryByCoatingUniversity';// 获取涂料大学标签项列表
export const API_ARTICLESFORAPPNEW = 'article/queryArticlesForAppNew';// 涂料大学列表
export const API_ARTICLELISTKEYWORD = 'article/queryListKeyword';// 文章 大家都在搜 搜索关键字功能
export const API_UNIVERSITYCOURSE= 'coatuUniversity/getUniversityCourse';// 课程表详情功能
export const API_UNIVERSITYSIGNUP= 'coatuUniversity/signUp';// 课程表报名接口
export const API_FORMULAPFBYID= 'formula/getFormulaPFById';// 配方详情2
export const API_FORMULAXNBYID= 'formula/getFormulaXNById';// 配方性能详情1

/**聊天->私信*/
export const API_UNREADCHATMSGCOUNT = 'im/unReadChatMsgCount';//未读消息总数
export const API_READCHATMSG = 'im/readChatMsg';//全部置为已读

/*收藏列表*/
export const API_COLLECTLIST = 'article/queryListCollectArticle';//收藏列表


export const API_APPLYUSERCERTIFICATION = 'user/applyUserCertification';//申请加V认证
export const API_USERSIGNIN = 'user/signIn';//签到
export const API_LISTSIGNIN = 'user/queryListSignIn';//签到天数的集合
export const API_GETMYUSERSCORE = 'userScore/getMyUserScore';//getMyUserScore 获取我的当前积分
export const API_GETMYEXPERTSCORE = 'userScore/getMyExpertScore';//getMyExpertScore 我的专家总分和专家等级
export const API_GETMYEXPERTSCOREDETAIL = 'userScore/queryMyExpertScoreDetail';// 查询专家分明细


export const API_EXCHANGEGOODS = 'userScore/exchangeGoods';//积分兑换商品
export const API_MYEXCHANGEGOODS = 'userScore/queryMyExchangeGoods';//查询我兑换礼品的记录
export const API_MYUSERSCOREDETAIL = 'userScore/queryMyUserScoreDetail';//查询我的积分明细
export const API_MYUSERSCORETASKS= 'userScore/queryMyUserScoreTasks';//查询我的积分任务
export const API_USERSCOREGOODS = 'userScore/queryUserScoreGoods';//查询可兑换的商品列表
export const API_UPDATEUSERSCORE = 'userScore/updateUserScore';//获得用户积分接口

/**=-----------------------------涂友圈-------------------------------*/
export const API_IMUNREADYZCHATMSGCOUNT = 'im/unReadYzChatMsgCount';//私聊未读消息
export const API_IMGETCANCHAT = 'im/getCanChat';//个人主页，是否可以私聊
export const API_IMSAVEYZCHATMSG = 'im/saveYzChatMsg';//发送聊天消息
export const API_IMPAGEYZCHATMSG= 'im/pageYzChatMsg';//聊天消息页面列表
export const API_IMPAGEYZCHATACCOUNT= 'im/pageYzChatAccount';//查询聊天人的列表
export const API_DISCUSSGETDISCUSSNOTICE = 'discuss/getDiscussNotice';//发布通知消息
export const API_DISCUSSPAGEDISCUSSNOTICE = 'discuss/pageDiscussNotice';//通知消息列表
export const API_DISCUSSCLEARDISCUSSNOTICE = 'discuss/clearDiscussNotice';//删除通知消息
export const API_DISCUSSSAVEMESSAGE = 'discuss/saveMessage';//发布说说功能
export const API_DISCUSSLISTMESSAGE = 'discuss/queryListMessage';//信息列表 discuss/queryListMessage
export const API_DISCUSSDETAILMESSAGE= 'discuss/detailMessage';//信息详情 discuss/detailMessage   msgId
export const API_DISCUSSDELETEMESSAGE = 'discuss/deleteMessage';//删除信息 discuss/deleteMessage
export const API_DISCUSSDELETECOMMENT = 'discuss/deleteComment';//删除评论 discuss/deleteComment
export const API_DISCUSSDELETELIKE = 'discuss/deleteLike';//取消点赞 discuss/deleteLike
export const API_DISCUSSSAVELIKE = 'discuss/saveLike';//点赞 discuss/saveLike
export const API_DISCUSSSAVECOMMENT= 'discuss/saveComment';//评论（回复评论）discuss/saveComment
export const API_DISCUSSLISTMESSAGEBYCOMMENT= 'discuss/queryListMessageByComment';//我评论的列表 discuss/queryListMessageByComment pageIndex,pageSize,pageUserId
export const API_DISCUSSSAVECOMMENTLIKE = 'discuss/saveCommentLike';//评论点赞 discuss/saveCommentLike
export const API_DISCUSSDELETECOMMENTLIKE= 'discuss/deleteCommentLike';//评论取消点赞 discuss/deleteCommentLike


export const API_DISCUSSLISTREPLIER= 'discuss/queryListReplier';//查询悬赏问答帖的回答者列表  msgId
export const API_DISCUSSFINISHREWARD= 'discuss/finishReward';//结帖分配悬赏分 msgId  replyUsers
// export const API_DISCUSSLISTREPLIER= 'discuss/queryListReplier';//查询悬赏问答帖的回答者列表












