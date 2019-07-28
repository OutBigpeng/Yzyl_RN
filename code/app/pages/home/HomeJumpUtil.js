/**
 * Created by Monika on 2017/12/15.
 */
export function  pushToHomeDetail(navigate,rowData,label="",index=0,callback) {
    if (rowData&&(rowData.catId||rowData.type)) {
          typeJump(rowData.catId||rowData.type,rowData.sn||rowData.id,navigate,rowData.title||rowData.name,index,callback)
    } else {
        if(label==='product'){
            navigate('ProductDetail', {
                name: 'ProductDetail',
                title: '产品详情',
                pid: rowData.productid,
                thumb: rowData.thumb,
                rightImageSource: true
            })
        }else {
            jumpArticle(navigate, rowData.sn,label,callback)
        }
    }
}
export function typeJump(type,id,navigate,title,index = 0,callback) {
    switch (type) {
        case 10://课程
            navigate('CurriculumDetailView', {
                title: '课程详情',
                id: id,
                rightImageSource:true,
                isCollection: true,
                callback:callback
            });
            break;
        case 11://配方
            navigate('FormulaXNView', {
                title: title,
                id: id,
                index: index,
                rightImageSource:true,
                isCollection: true,
                callback:callback
            });
            break;

        default:
            jumpArticle(navigate, id,'',0,callback);
            break;
    }
}
export function jumpArticle(navigate,sn,label="",index = 0,callback) {
    navigate('HomeArticleView', {
        title: '正文',
        sn: sn,
        rightImageSource: true,
        label: label,
        isCollection: true,
        isShare: true,
        isRightFirstImage: true,
        callback:callback
    })
}