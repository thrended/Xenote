import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RemindersListScreen from './screens/RemindersListScreen';
import ReminderSubtasksScreen from './screens/ReminderSubtasksScreen';
import RealmContext from './app/models/Schemas';
import { LogBox } from 'react-native';
import PushNotification, {Importance} from "react-native-push-notification";
import SimpleNote from './app/components/EditNote';
import SubtaskModal from './app/components/SubtaskModal';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Each child in a list should have a unique "key" prop.',
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
          <Stack.Group>
            <Stack.Screen
              name="RemindersListScreen"
              component={RemindersListScreen}
              options={{title: 'Reminders'}}
            />
            <Stack.Screen name="ReminderSubtasksScreen" component={ReminderSubtasksScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="EditNoteScreen" component={SimpleNote} />
            <Stack.Screen name="EditSubtaskScreen" component={SubtaskModal} />
          </Stack.Group>

        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
  );
};
export default App;
