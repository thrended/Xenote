/**
 * @format
 */

import 'react-native-get-random-values';
import {Alert, AppRegistry} from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import {name as appName} from './app.json';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Check if the user pressed the notification in the background
  if (type === EventType.ACTION_PRESS && pressAction.id === 'reminder') {
      
    // Remove the notification
    //Alert.alert("Removed the reminder notification");
    await notifee.cancelNotification(notification.id);
  }
  else if (type === EventType.ACTION_PRESS && pressAction.id === 'subtask') {
      
    // Remove the notification
    //Alert.alert("Removed the subtask notification");
    await notifee.cancelNotification(notification.id);
  }
});


AppRegistry.registerComponent(appName, () => App);
