package com.xuanit.yzyk.wxapi;

/**
 * Created by Monika on 2016/12/30.
 */

import android.app.Activity;
import android.os.Bundle;

import com.theweflex.react.WeChatModule;

public class WXEntryActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WeChatModule.handleIntent(getIntent());
        finish();
    }
}
