package com.xuanit.yzyk.module;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * 按键
 */
public class BackKey extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    public BackKey(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "BackKey";
    }

    /**
     * 此方法是为了解决返回键退出程序后,ToastAndroid不会消失的bug
     */
    @ReactMethod
    public void onBackPressed() {
        Intent setIntent = new Intent(Intent.ACTION_MAIN);
        setIntent.addCategory(Intent.CATEGORY_HOME);
        setIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getCurrentActivity().startActivity(setIntent);
    }

    public static String getVersionName(Context mContext) {
        if (mContext != null) {
            try {
                return mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0).versionName;
            } catch (PackageManager.NameNotFoundException ignored) {
            }
        }

        return "";
    }

    @ReactMethod
    public void getVersionInfo(final Callback callback) {
        JSONObject versionInfo = new JSONObject();
        try {
//            versionInfo.put("versionCode", getVersionCode(context));
            versionInfo.put("versionName", getVersionName(this.reactContext));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        callback.invoke(versionInfo.toString());
    }
}  