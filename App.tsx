import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RemindersListScreen from './screens/RemindersListScreen';
import ReminderSubtasksScreen from './screens/ReminderSubtasksScreen';
import RealmContext from './app/models/Schemas';
import { LogBox } from 'react-native';
import PushNotification, {Importance} from "react-native-push-notification";

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const {RealmProvider} = RealmContext;
const Stack = createNativeStackNavigator();

const App = () => {

  React.useEffect( () => {
    createTestNotifChannels();
  })

  const createTestNotifChannels = () => {
    PushNotification.createChannel(
      {
        channelId: "Notif-test-1", // REQUIRED
        channelName: "Test notifications channel 1", // REQUIRED
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) 
    )
  };

  if (!RealmProvider) {
    return null;
  }
  return (
    <RealmProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="RemindersListScreen"
            component={RemindersListScreen}
            options={{title: 'Reminders'}}
          />
          <Stack.Screen name="ReminderSubtasksScreen" component={ReminderSubtasksScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
  );
};
export default App;
