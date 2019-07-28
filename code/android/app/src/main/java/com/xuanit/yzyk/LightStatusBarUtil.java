//package com.xuanit.yzyk;
//
//import android.app.Activity;
//import android.graphics.Color;
//import android.os.Build;
//import android.view.View;
//import android.view.Window;
//import android.view.WindowManager;
//
//import java.lang.reflect.Field;
//import java.lang.reflect.Method;
//
///**
// * Created by Monika on 2018/8/15.
// */
//class LightStatusBarUtil {
//    /**
//     * @Override protected void onCreate(Bundle savedInstanceState) {
//     * <p>
//     * super.onCreate(savedInstanceState);
//     * if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
//     * View decorView = this.getWindow().getDecorView();
//     * decorView.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
//     * @Override public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
//     * WindowInsets defaultInsets = null;
//     * if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT_WATCH) {
//     * defaultInsets = v.onApplyWindowInsets(insets);
//     * return defaultInsets.replaceSystemWindowInsets(
//     * defaultInsets.getSystemWindowInsetLeft(),
//     * 0,
//     * defaultInsets.getSystemWindowInsetRight(),
//     * defaultInsets.getSystemWindowInsetBottom());
//     * }
//     * return null;
//     * }
//     * <p>
//     * });
//     * ViewCompat.requestApplyInsets(decorView);
//     * }
//     * }
//     */
//    private void setStatus(Activity activity) {
//        // 设置透明状态栏
//        if (Build.VERSION.SDK_INT >= 21) {
//            View decorView = activity.getWindow().getDecorView();
//            int option = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
//                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
//            decorView.setSystemUiVisibility(option);
//            activity.getWindow().setStatusBarColor(Color.TRANSPARENT);
//        }
//
//        // 设置透明状态栏和透明导航栏
//        if (Build.VERSION.SDK_INT >= 21) {
//            View decorView = activity.getWindow().getDecorView();
//            int option = View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
//                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
//                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
//            decorView.setSystemUiVisibility(option);
//            activity.getWindow().setNavigationBarColor(Color.TRANSPARENT);
//            activity.getWindow().setStatusBarColor(Color.TRANSPARENT);
//        }
//    }
//
//    //LightStatusBarUtil.FlymeSetStatusBarLightMode(this.getWindow(), false);
////        LightStatusBarUtil.MIUISetStatusBarLightMode(this, false);
////        LightStatusBarUtil.setAndroidNativeLightStatusBar(this, true);
//    public static boolean FlymeSetStatusBarLightMode(Window window, boolean dark) {
//        boolean result = false;
//        if (window != null) {
//            try {
//                WindowManager.LayoutParams lp = window.getAttributes();
//                Field darkFlag = WindowManager.LayoutParams.class
//                        .getDeclaredField("MEIZU_FLAG_DARK_STATUS_BAR_ICON");
//                Field meizuFlags = WindowManager.LayoutParams.class
//                        .getDeclaredField("meizuFlags");
//                darkFlag.setAccessible(true);
//                meizuFlags.setAccessible(true);
//                int bit = darkFlag.getInt(null);
//                int value = meizuFlags.getInt(lp);
//                if (dark) {
//                    value |= bit;
//                } else {
//                    value &= ~bit;
//                }
//                meizuFlags.setInt(lp, value);
//                window.setAttributes(lp);
//                result = true;
//            } catch (Exception e) {
//
//            }
//        }
//        return result;
//    }
//
//    public static void setAndroidNativeLightStatusBar(Activity activity, boolean dark) {
//        //状态栏字体图标颜色
//        View decor = activity.getWindow().getDecorView();
//        if (dark) {
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//                decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR //浅色状态栏(字体图标白色)
//                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN //contentView 全屏(置于statusbar之下)
//                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
//            }
//        } else {
//            decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
//        }
//    }
//
//    public static boolean MIUISetStatusBarLightMode(Activity activity, boolean dark) {
//        if (Build.VERSION.SDK_INT >= 24) {
//            return false;
//        }
//        boolean result = false;
//        Window window = activity.getWindow();
//        if (window != null) {
//            Class clazz = window.getClass();
//            try {
//                int darkModeFlag = 0;
//                Class layoutParams = Class.forName("android.view.MiuiWindowManager$LayoutParams");
//                Field field = layoutParams.getField("EXTRA_FLAG_STATUS_BAR_DARK_MODE");
//                darkModeFlag = field.getInt(layoutParams);
//                Method extraFlagField = clazz.getMethod("setExtraFlags", int.class, int.class);
//                if (dark) {
//                    extraFlagField.invoke(window, darkModeFlag, darkModeFlag);//状态栏透明且黑色字体
//                } else {
//                    extraFlagField.invoke(window, 0, darkModeFlag);//清除黑色字体
//                }
//                result = true;
//
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//                    //开发版 7.7.13 及以后版本采用了系统API，旧方法无效但不会报错，所以两个方式都要加上
//                    if (dark) {
//                        activity.getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
//                    } else {
//                        activity.getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
//                    }
//                }
//            } catch (Exception e) {
//
//            }
//        }
//        return result;
//    }
//}
