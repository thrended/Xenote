import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ReminderScreen from './screens/ReminderScreen';
import ReminderSubtasksScreen from './screens/ReminderSubtasksScreen';
import RealmContext from './app/models/Schemas';

const Stack = createNativeStackNavigator();

const {useRealm, useQuery, RealmProvider} = RealmContext;

const App = () => {
  if (!RealmProvider) {
    return null;
  }
  return (
    <RealmProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="welcome"
            component={ReminderScreen}
            options={{title: 'Welcome'}}
          />
          <Stack.Screen name="main" component={ReminderSubtasksScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
  );
};
export default App;
