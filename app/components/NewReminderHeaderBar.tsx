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

interface NewReminderHeaderBarProps {
  onSubmit: (reminderID: string) => void;
}

function NewReminderHeaderBar({onSubmit}: NewReminderHeaderBarProps) {
  const [reminderID, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit(reminderID);
    setDescription('');
  };

  return (
    <View style={styles.titlebar}>
        <View style={styles.titleTextContainer}>
            <Text style={styles.titleText}>Edit Reminder</Text>
        </View>

        <Pressable style={styles.finishedButton}>
            <Text style={styles.icon}>{'✓'}</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titlebar: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 50,
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
  finishedButton: {
    position: "absolute",
    right: 20
  },
  icon: {
    color: colors.black,
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default NewReminderHeaderBar;
