package cn.espush.cloud.contrib;

import android.content.Intent;

import com.espressif.iot.esptouch.demo_activity.EsptouchDemoActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by Sunday on 2016/6/17.
 */

public class SmartConfigModule extends ReactContextBaseJavaModule {
    public SmartConfigModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SmartConfigAndroid";
    }

    @ReactMethod
    public void configActivity() {
        Intent i = new Intent(getReactApplicationContext(), EsptouchDemoActivity.class);
        getCurrentActivity().startActivity(i);
    }
}
