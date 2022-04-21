import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
// @ts-ignore openURLInBrowser will open the url in your machine browser. (This isn't currently typed in React Native)
import openURLInBrowser from 'react-native/Libraries/Core/Devtools/openURLInBrowser';

import colors from '../styles/colors';

function SubtaskListDefaultText() {
  return (
    <View style={styles.content}>
      <Text style={styles.paragraph}>
        Use the "+" button to add subtasks to this reminder.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  paragraph: {
    marginVertical: 10,
    textAlign: 'center',
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  link: {
    color: colors.purple,
    fontWeight: 'bold',
  },
});

export default SubtaskListDefaultText;
