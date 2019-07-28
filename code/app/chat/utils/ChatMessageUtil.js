/**
 * Created by Monika on 2017/4/6.
 */
export const msgTpl = {
    base: {
        error: false,
        errorCode: '',
        errorText: '',
        // status 为空将被当做服务端的数据处理，处理成sent
        status: 'sending', // [sending, sent ,fail, read]
        id: '',
        // from 不能删除，决定了房间id
        from: '',
        to: '',
        toJid: '',
        time: '',
        type: '', // chat / groupchat
        body: {},
        ext: {},
        bySelf: false,
    },
    txt: {
        type: 'txt',
        msg: ''
    },
    img: {
        type: 'img',
        file_length: 0,
        filename: '',
        filetype: '',
        length: 0,
        secret: '',
        width: 0,
        height: 0,
        url: '',
        thumb: '',
        thumb_secret: ''
    }
};

// 统一消息格式：本地发送
export function parseFromLocal(type, to, message = {}, bodyType,msgId) {
    let ext = message.ext || {};
    let obj = copy(message, msgTpl.base);
    let body = copy(message, msgTpl[bodyType]);
    return {
        ...obj,
        type,
        to,
        bySelf: true,
        time : +new Date(),
        id:msgId||WebIM.conn.getUniqueId(),
        body: {
            ...body, ...ext, type: bodyType
        }
    }
}
// 统一消息格式：服务端
export function parseFromServer(message = {}, bodyType) {
    let ext = message.ext || {};
    let obj = copy(message, msgTpl.base);
    // body 包含：所有message实体信息都放到body当中，与base区分开
    // body 包含：ext 存放用户自定义信息，比如图片大小、宽高等
    let body = copy(message, msgTpl[bodyType]);

    let delay = message.delay;
    let delayTime = delay ? Date.parse(_timeParse(Math.round(new Date(delay),'/'))) : "";
    switch (bodyType) {
        case 'txt':
            return {
                ...obj, status: 'sent',time:delayTime,
                body: {
                    ...body, ...ext, msg: message.data, type: 'txt',
                }
            };
            break;
        case 'img':
            return {
                ...obj, status: 'sent',time:delayTime,
                body: {
                    ...body, ...ext, type: 'img'
                }
            };
            break;
    }
}

function _timeParse(time,divide="-"){
    const d = new Date(time);
    let year = d.getFullYear();
    let month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
    let date = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();
    let hour = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();// d.getHours()%12 === 0 ? 12 : d.getHours()%12+12;
    let minute = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
    let seconds = d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds();
    return `${year}${divide}${month}${divide}${date} ${hour}:${minute}:${seconds}`
}

export function defaultSend(chatId, msg,item) {
    let aId = '3199bw654194377200';
    let message = {
        "error": false,
        "errorCode": "",
        "byself": false,
        "errorText": "",
        "status": "sent",
        'id': aId,
        'from': chatId,
        'to': '',
        "toJid": "",
        'time': +new Date(),
        "type": "chat",
        "body": {
            "type": "txt",
            "msg": msg,
            "weichat": {
                "originType": "webim"
            }
        },
        ext: {weichat: {originType: 'webim'}},
        bySelf: false
    };
    let itemTemp = {'chat': {}, 'byId': {}};
    let aa = [aId];
    itemTemp.chat[chatId] = aa;
    itemTemp.byId[aId] = {...message};
    if (item && item.chat && item.chat[chatId]) {
        let array = [].concat(item.chat[chatId]);
        array.push(aId);
        item.chat[chatId] = DuplicateRemoval(array);
        for (let m = 0; m < array.length; m++) {
            item.byId[array[m]] = itemTemp.byId[array[m]]||item.byId[array[m]] ;
        }
        itemTemp = item;
    }
    return itemTemp
}


//去重
export function DuplicateRemoval(item) {
    let json = {}, res = [];
    if (item) {
        for (let i = 0; i < item.length; i++) {
            if (!json[item[i]]) {
                res.push(item[i]);
                json[item[i]] = 1;
            }
        }
        return res
    }
}



export function copy(message, tpl) {
    let obj = {};
    Object.keys(tpl).forEach((v) => {
        obj[v] = message[v] || tpl[v]
    });
    return obj;
}