import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RemindersListScreen from './screens/RemindersListScreen';
import ReminderSubtasksScreen from './screens/ReminderSubtasksScreen';
import RealmContext from './app/models/Schemas';
import { LogBox } from 'react-native';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
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
          </Stack.Group>

        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
  );
};
export default App;