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



const Welcome = ({navigation}) => {
  return (
    <View style={styles.centeredView}>
      <Text style={styles.textStyle}> Welcome</Text>
      <Button onPress={() => navigation.navigate('main')} title="main" />
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
