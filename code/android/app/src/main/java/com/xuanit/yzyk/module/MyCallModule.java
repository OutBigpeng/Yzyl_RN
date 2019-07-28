package com.xuanit.yzyk.module;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.v4.app.ActivityCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * 原生模块  实现打电话的功能
 * Created by Monika on 2016/9/13.
 */
public class MyCallModule extends ReactContextBaseJavaModule {
    public MyCallModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void gotoCall(String number) {
        //用intent启动拨打电话
        Intent intent = new Intent(Intent.ACTION_CALL, Uri.parse("tel:" + number));
        if (ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        getReactApplicationContext().startActivity(intent);
    }

    @Override
    public String getName() {
        return "MyCallModule";
    }
}
