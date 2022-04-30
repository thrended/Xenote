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