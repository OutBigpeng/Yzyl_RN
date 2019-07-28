package com.xuanit.yzyk;

import android.app.Application;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.beefe.picker.PickerViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecomponent.swiperefreshlayout.RCTSwipeRefreshLayoutPackage;
import com.rnfs.RNFSPackage;
import com.theweflex.react.WeChatPackage;
import com.xuanit.yzyk.autoheightwebview.AutoHeightWebViewPackage;
import com.github.yamill.orientation.OrientationPackage;
import org.wonday.pdf.RCTPdfView;

import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.JPushPackage;
import in.esseak.react_native_umeng.UmengPackage;
import me.jhen.react.BadgePackage;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new MyReactPackage(),
                    new RCTPdfView(),
                    new RNFetchBlobPackage(),
                    new ReactVideoPackage(),
                    new OrientationPackage(),
                    new AutoHeightWebViewPackage(),
                    new SplashScreenReactPackage(),
                    new RNDeviceInfo(),
                    new RNFSPackage(),
                    new PickerViewPackage(),
                    new ImagePickerPackage(),
                    new RCTSwipeRefreshLayoutPackage(),
                    new WeChatPackage(),
                    new BadgePackage(),
                    new JPushPackage(BuildConfig.DEBUG, BuildConfig.DEBUG),
                    new UmengPackage(),
                    new PickerPackage());
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
