import {PlatfIOS} from "./CommonDevice";
import RNFS from "react-native-fs";
import MD5 from "./Md5";
import {Alert} from "react-native";

export function downFile({url, saveUrl = ''}, callback, failback) {
    let downloadBegin = (response) => {
        let jobId = response.jobId;
        // console.log('contentLength:', response.contentLength / 1024 / 1024, 'M');
    };

    let downloadProgress = (res) => {
        let pro = Math.floor((res.bytesWritten / res.contentLength) * 100);
        // console.log('UPLOAD IS ' + pro + '% DONE!');
    };

    let path = saveUrl || judgePath() + "/" + MD5.hex_md5(url) + "";
    RNFS.downloadFile({
        fromUrl: url,
        toFile: path,
        headers: {
            'Accept': 'application/json',
        },
        begin: downloadBegin,
        progress: downloadProgress
    }).promise.then((response) => {
        if (response && response.statusCode == 200) {
            callback();
            Alert.alert('保存成功', path);
            console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
        } else {
            failback();
            Alert.alert('保存失败,请稍后重试...');
            console.log('SERVER ERROR');
        }
    }).catch((err) => {
        failback();
        if (err.description === "cancelled") {
            // cancelled by user
        }
        console.log("err", err);
    });
}

function judgePath() {
    let pathAndroid;
    if (!PlatfIOS) {
        if (RNFS.exists(RNFS.ExternalDirectoryPath)) {
            pathAndroid = RNFS.ExternalDirectoryPath;
        } else if (RNFS.exists(RNFS.ExternalStorageDirectoryPath)) {
            pathAndroid = RNFS.ExternalStorageDirectoryPath;
        } else {
            pathAndroid = RNFS.LibraryDirectoryPath
        }
    }
    return PlatfIOS ? RNFS.MainBundlePath : pathAndroid
}