import App from './App';

/**react-native init bbb --version react-native@0.44.3*/

//<AndroidSDK所在目录>/platform-tools/systrace/systrace.py --time=10 -o trace.html sched gfx view -a <你的应用包名>
// D:\DeveloperTools\android-sdk/platform-tools/systrace/systrace.py --time=10 -o trace.html sched gfx view -a com.xuanit.yzyk


/**
 极光推送
 文档： https://docs.jiguang.cn/jpush/client/Android/android_guide/#jcenter
 github: https://github.com/jpush/jpush-react-plugin

 友盟：　
 github： https://github.com/1123746696/react-native-umeng-analytics
 */

/**
 react-native bundle --platform android --dev false --entry-file index.android.js \ --bundle-output android/app/src/main/assets/index.android.bundle \ --assets-dest android/app/src/main/res/

 gradlew assembleRelease
 */