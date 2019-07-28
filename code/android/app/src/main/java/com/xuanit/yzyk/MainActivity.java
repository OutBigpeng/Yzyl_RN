package com.xuanit.yzyk;

import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;

import com.cboy.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;

import cn.jpush.android.api.JPushInterface;

public class MainActivity extends ReactActivity {

    private void setStatus() {
        if (Build.VERSION.SDK_INT >= 21) {
            // View decorView = getWindow().getDecorView();
            // int option = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            //      | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
            // decorView.setSystemUiVisibility(option);
            getWindow().setStatusBarColor(Color.BLACK);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
//            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.LOLLIPOP_MR1) {
//               Window window = getWindow();
//        // 设置为沉浸式状态栏
//              window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
//          }
        setStatus();

        JPushInterface.init(this);
        MobclickAgent.setDebugMode(false);
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
        MobclickAgent.onPause(this);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        moveTaskToBack(true);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
        MobclickAgent.onResume(this);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        //do nothing
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Yzyl_RN";
    }


}

