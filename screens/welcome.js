import React from 'react';
import {
  View,
  Button,
  Text,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from 'react-native';
import colors from '../app/styles/colors';
import { globalStyles } from '../app/styles/global';



const Welcome = ({navigation}) => {
  return (
    <View style={styles.centeredView}>
      <Text style={styles.textStyle}> Welcome</Text>
      <Button onPress={() => navigation.navigate('main')} title="main" />
          
      <View style={styles.separatorV}/>
      <Pressable
          onPress={() => navigation.push('Menu')}
      >
        <View style={[globalStyles.button, {flex: 0.3, flexDirection: 'row', marginTop: 15, marginVertical: 15, backgroundColor: 'cyan'}]}>
            <Text style={[globalStyles.buttonprio, {fontSize: 20, color: 'green'}]}>
                Menu
            </Text>
        </View>
      </Pressable>

    </View>
  );
};



const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default Welcome;
