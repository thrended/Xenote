import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import colors from '../styles/colors';

function SubtaskListDefaultText() {
  return (
    <View style={styles.content}>
      <Text style={styles.paragraph}>Use the "+" button to add subtasks.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 0.8,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  paragraph: {
    marginVertical: 10,
    textAlign: 'center',
    color: 'green',
    fontSize: 24,

  },
});

export default SubtaskListDefaultText;
