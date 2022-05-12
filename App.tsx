import * as React from 'react';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RemindersListScreen from './screens/RemindersListScreen';
import ReminderSubtasksScreen from './screens/ReminderSubtasksScreen';
import RealmContext from './app/models/Schemas';
import { LogBox } from 'react-native';
import notifee, {AuthorizationStatus, EventType, IntervalTrigger, RepeatFrequency, 
TimestampTrigger, TimeUnit, TriggerNotification, TriggerType,} from '@notifee/react-native';
import SimpleNote from './app/components/EditNote';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Each child in a list should have a unique "key" prop.',
]);

const {RealmProvider} = RealmContext;
const Stack = createNativeStackNavigator();

const App = () => {

  React.useEffect( () => {
    checkNotificationPermissions();
    return notifee.onForegroundEvent(({ type, detail }) => {
      //const { notification, pressAction } = detail;      
      let date = new Date(Date.now());
      var amt = 600000;
      var interval = 24;
      var timeUnit = TimeUnit.HOURS;
      const trigger10: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime() + amt,
        repeatFrequency: RepeatFrequency.WEEKLY,
      };
      const trigger20: IntervalTrigger = {
        type: TriggerType.INTERVAL,
        interval,     // MIN = 15 minutes
        timeUnit,
      };

      switch (type) {
        case EventType.ACTION_PRESS:
          switch(detail.input)
          {
            case 'Snooze 10':
              amt = 600000,
              Alert.alert("Snoozed the notification for 10 minutes");
              console.assert(detail.notification);
              detail.notification ? notifee.createTriggerNotification({
                  id: detail.notification.id,
                  title: detail.notification.title + " (Snoozing)",
                  body: detail.notification.body,
                  android: {
                    autoCancel: false,
                    channelId: detail.notification.android?.channelId,
                    timeoutAfter: 15000,
                    timestamp: Date.now() + 600000,
                    showTimestamp: true,
                    showChronometer: true,
                    chronometerDirection: 'down',
                  },             
              }, trigger10, ) : {};
              break;
            case 'Snooze 15':
              amt = 900000;
              Alert.alert("Snoozed the notification for 15 minutes");
              console.assert(detail.notification);
              detail.notification ? notifee.createTriggerNotification({
                  id: detail.notification.id,
                  title: detail.notification.title + " (Snoozing)",
                  body: detail.notification.body,
                  android: {
                    autoCancel: false,
                    channelId: detail.notification.android?.channelId,
                    timeoutAfter: 25000,
                    timestamp: Date.now() + 900000,
                    showTimestamp: true,
                    showChronometer: true,
                    chronometerDirection: 'down',
                  }

              }, trigger10, ) : {};
              break;
            case 'Snooze 30':
              amt = 1800000,
              Alert.alert("Snoozed the notification for 30 minutes");
              console.assert(detail.notification);
              detail.notification ? notifee.createTriggerNotification({
                  id: detail.notification.id,
                  title: detail.notification.title + " (Snoozing)",
                  body: detail.notification.body,
                  android: {
                    autoCancel: false,
                    channelId: detail.notification.android?.channelId,
                    timeoutAfter: 50000,
                    timestamp: Date.now() + 1800000,
                    showTimestamp: true,
                    showChronometer: true,
                    chronometerDirection: 'down',
                  },

              }, trigger10, ) : {};
              break;
            case 'Snooze 60':
              amt = 3600000,
              Alert.alert("Snoozed the notification for an hour");
              console.assert(detail.notification);
              detail.notification ? notifee.createTriggerNotification({
                  id: detail.notification.id,
                  title: detail.notification.title + " (Snoozing)",
                  body: detail.notification.body,
                  android: {
                    autoCancel: false,
                    channelId: detail.notification.android?.channelId,
                    timeoutAfter: 50000,
                    timestamp: Date.now() + 3600000,
                    showTimestamp: true,
                    showChronometer: true,
                    chronometerDirection: 'down',
                  },

              }, trigger10, ) : {};
              break;
            case 'Dismiss':
              Alert.alert("Dismissed the notification");
              console.assert(detail.notification);
              detail.notification ? notifee.cancelNotification(detail.notification.id?? '') : {};
              break;
            case 'Delete':
              Alert.alert("Removed the notification");
              console.assert(detail.notification);
              detail.notification ? notifee.cancelNotification(detail.notification.id?? '') : {};
              break;
            case 'Remind Daily':
              interval = 24;
              Alert.alert("Notification set to remind daily");
              console.assert(detail.notification);
              detail.notification ? notifee.createTriggerNotification({
                id: detail.notification.id,
                title: detail.notification.title + " (Daily)",
                body: detail.notification.body,
                android: {
                  autoCancel: false,
                  channelId: detail.notification.android?.channelId,
                  timeoutAfter: 75000,
                  timestamp: Date.now() + 3600000 * 24,
                  showTimestamp: true,
                  showChronometer: true,
                  chronometerDirection: 'down',
                },

              },
              trigger20,
              ) : {};
              break;
            case 'Weekly':
              interval = 192;
              Alert.alert("Notification set to remind weekly");
              console.assert(detail.notification != undefined);
              detail.notification ? notifee.createTriggerNotification({
                id: detail.notification.id,
                title: detail.notification.title + " (Weekly)",
                body: detail.notification.body,
                android: {
                  autoCancel: false,
                  channelId: detail.notification.android?.channelId,
                  timeoutAfter: 150000,
                  timestamp: Date.now() + 3600000 * 168,
                  showTimestamp: true,
                  showChronometer: true,
                  chronometerDirection: 'down',
                },

              },
              trigger20,
              ) : {};
              break;
            default:
              break;
          }
          break;
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  })
  
  async function checkNotificationPermissions() {
    const settings = await notifee.getNotificationSettings();
  
    if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
      console.log('Notification permissions have been authorized');
    } 
    else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
      console.log('Notification permissions status is currently denied. Requesting permission...');
      await notifee.openNotificationSettings();
    }
  }

  // let timeoutLoop = setTimeout(function tick() {
  //   console.log('M gud');
  //   try{
  //     //checkTimeforRenew();
  //   }
  //   catch (e)
  //   {
  //     console.log("M error", e);
  //   }
  //   timeoutLoop = setTimeout(tick, 3000);
  // }, 3000);

  if (!RealmProvider) {
    return null;
  }
  return (
    <RealmProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Group>
            <Stack.Screen
              name="RemindersListScreen"
              component={RemindersListScreen}
              options={{title: 'Reminders'}}
            />
            <Stack.Screen 
              name="ReminderSubtasksScreen" 
              component={ReminderSubtasksScreen} 
              options={{title: 'Reminder'}}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen 
              name="EditNoteScreen" 
              component={SimpleNote} 
              options={{title: 'Note'}}  
            />
          </Stack.Group>

        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
  );
};
export default App;