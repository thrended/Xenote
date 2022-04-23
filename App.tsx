import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Welcome from './screens/welcome';
import AppWrapper from './screens/main';
import Menu from './screens/MenuScreen';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="welcome"
          component={Welcome}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="main" component={AppWrapper} />
        <Stack.Screen name="Menu" component={Menu} options={{ title: 'Menu' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MyStack;
