/**
 * Created by Monika on 2017/8/29.
 */

let listData = {};
let text = ["Home","University","News"];


let labels = {'Home': {}, 'University': {}, 'News': {}};
let selectedLabel = {'Home':'', 'University': '', 'News': ''};

// let wenzhang = [,{'id':2,'title':'标题啦','time':'20170605','author':'作者大大'},{'id':2,'title':'标题啦','time':'20170605','author':'作者大大'}]
// let wenzhang1 = [{'id':2,'title':'哈哈我是标题啦2','time':'20170605','author':'作者大大3'},{'id':2,'title':'哈哈我是标题啦','time':'20170605','author':'作者大大'},{'id':2,'title':'哈哈我是标题啦','time':'20170605','author':'作者大大'}]
let WzData = [];
for (let i = 0;i<4;i++) {
    let a = {};
    a.id = i;
    a.title = "标题"+Math.floor((Math.random()*999));
    a.time = new Date().toDateString();
    a.author = "作者" + Math.floor((Math.random()*999));
    WzData.push(a);
}
// for(let c in listData) {
//     console.log(listData[c]);
//     obj[aa+listData[c].id] = bb;
// }
let homeLabel = [ { keyName: 'tj', keyValue: '推荐', listOrder: 0 }, { keyName: 'gd', keyValue: '观点', listOrder: 2 }, { keyName: 'zc', keyValue: '政策', listOrder: 3 }, { keyName: 'js', keyValue: '技术', listOrder: 4 }, { keyName: 'qy', keyValue: '企业', listOrder: 5 }, { keyName: 'hy', keyValue: '行业', listOrder: 6 } ];
let teLabel = [{id: 9, name: '推荐'}, {id: 10, name: '课程表'}, {id: 11, name: '配方'}, {id: 12, name: '评测'}, {id: 13, name: '标准'}, {id: 14, name: '百科'}, {id: 15, name: '900问'}];
let HomeObj = {};
let TeObj = {};
let NewObj = {};
function swith(index,selLabelObj,data,page) {
    let type = text[index];
    selectedLabel[type] = selLabelObj;
    let itemData = [];
    let   tempData = [];
    switch (index){
        case 0:
             itemData =  HomeObj[selLabelObj.keyName]||[];
             tempData  = itemData.concat(data);
            HomeObj[selLabelObj.keyName] = tempData;
            labels[type] = HomeObj;
            break;
        case 1:
            itemData =  TeObj[selLabelObj.id]||[];
             tempData  = itemData.concat(data);
            TeObj[selLabelObj.id] = tempData;
            labels[type] = TeObj;
            break;
        case 2:
            itemData =  NewObj[selLabelObj.keyName]||[];
            tempData  = itemData.concat(data);
            NewObj[selLabelObj.keyName] = tempData;
            labels[type] = NewObj;
            break;
        default:
            break;
    }
}

let index = Math.floor((Math.random()*homeLabel.length));
let teIndex = Math.floor((Math.random()*teLabel.length));
for(let i = 0;i<1;i++) {
    swith(0, homeLabel[index], WzData, i);
}
for(let i = 0;i<1;i++) {
    swith(1, teLabel[teIndex], WzData, i);
}
let indexs = Math.floor((Math.random()*homeLabel.length));

for(let i = 0;i<1;i++) {
    swith(2, homeLabel[indexs], WzData, i);
}
// console.log(JSON.stringify(labels));
// console.log(selectedLabel);
console.log("哈哈")