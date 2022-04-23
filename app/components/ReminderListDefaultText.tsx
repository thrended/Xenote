import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import colors from '../styles/colors';

function ReminderListDefaultText() {
  return (
    <View style={styles.content}>
      <Text style={styles.paragraph}>
        Use the "+" button to add a reminder!
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

export default ReminderListDefaultText;
