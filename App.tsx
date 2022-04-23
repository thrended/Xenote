import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RemindersListScreen from './screens/RemindersListScreen';
import ReminderSubtasksScreen from './screens/ReminderSubtasksScreen';
import RealmContext from './app/models/Schemas';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const {RealmProvider} = RealmContext;
const Stack = createNativeStackNavigator();

const App = () => {
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
          <Stack.Screen
            name="ReminderSubtasksScreen"
            component={ReminderSubtasksScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
  );
};
export default App;
