import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  StyleSheet,
} from 'react-native';

import colors from '../styles/colors';

interface NewReminderTitleAndDateTimeBarProps {
  
}

function NewReminderTitleAndDateTimeBar({}: NewReminderTitleAndDateTimeBarProps) {
  const [titleInput, setTitleInput] = useState('');

  return (
    <View style={styles.titlebar}>
      <View style={styles.titleTextContainer}>
        <TextInput
          value={titleInput}
          onChangeText={setTitleInput}
          placeholder="Reminder Title"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.textInput}
        />
      </View>

      <Pressable style={styles.setScheduledDateTimeButton}>
          <Text style={styles.icon}>{'📅'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titlebar: {
    width: "100%",
    height: 50,
    top: 50,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.7,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  titleTextContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : 0,
    fontSize: 24,
    fontWeight: "bold",
  },
  setScheduledDateTimeButton: {
    position: "absolute",
    right: 20
  },
  icon: {
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
  },
  textInput: {
    flex: 1,
    // textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
});

export default NewReminderTitleAndDateTimeBar;
