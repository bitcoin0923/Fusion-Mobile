package com.fusionalarm;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.util.Log;
import android.content.Context;
import android.os.Bundle;
import android.media.AudioManager;
import android.app.NotificationManager;
import android.content.Intent;
import java.lang.SecurityException;
import android.os.Build;
import android.media.AudioAttributes;
import android.os.PowerManager;
import android.content.Intent;
import android.provider.Settings;
import android.net.Uri;



public class MainActivity extends ReactActivity {
  private void requestDoNotDisturbPermissionOrSetDoNotDisturbApi23AndUp() {
      //TO SUPPRESS API ERROR MESSAGES IN THIS FUNCTION, since Ive no time to figrure our Android SDK suppress stuff
      if( Build.VERSION.SDK_INT < 23 ) {
          return;
      }

      NotificationManager notificationManager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
      if ( !notificationManager.isNotificationPolicyAccessGranted()) {
          Intent intent = new Intent(android.provider.Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
          startActivity( intent);
      }
  }

  private void requestIgnorePowerOptimization() {
    Intent intent = new Intent();
    String packageName = getPackageName();
    PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);

    if (!pm.isIgnoringBatteryOptimizations(packageName))
    {
        intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
        intent.setData(Uri.parse("package:" + packageName));
        startActivity(intent);
    }
  }
  @Override
  protected void onCreate (Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    //requestIgnorePowerOptimization();
    //requestDoNotDisturbPermissionOrSetDoNotDisturbApi23AndUp();
    //RingtoneManager.getRingtone().setAudioAttributes(AudioAttributes.USAGE_ALARM);
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Fusion";
  }

  @Override
  public void invokeDefaultOnBackPressed() {
    // do not call super. invokeDefaultOnBackPressed() as it will close the app.  Instead lets just put it in the background.
    moveTaskToBack(true);
  }
  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }
}
