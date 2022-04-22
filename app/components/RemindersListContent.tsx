import React, {useState} from 'react';
import {
  View,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Realm} from '@realm/react';

import {Reminder, Subtask} from '../models/Schemas';
import ReminderItem from './ReminderItem';

interface ReminderListProps {
  reminders: Realm.Results<Reminder> | [];
  handleModifyReminder: (
    reminder: Reminder,
    _title?: string,
    _subtasks?: Subtask[]
  ) => void;
  handleNavigation: (reminder: Reminder) => void;
  onDeleteReminder: (reminder: Reminder) => void;
}

function RemindersListContent({
  reminders: reminders,
  handleModifyReminder,
  onDeleteReminder,
  handleNavigation,
}: ReminderListProps) {
  return (
    <View style={styles.subtaskListContainer}>
      <FlatList
        data={reminders}
        keyExtractor={reminder => reminder._id.toString()}
        renderItem={({item}) => (
          <ReminderItem
            reminder={item}
            handleModifyReminder={handleModifyReminder}
            handleNavigation={handleNavigation}
            onDelete={() => onDeleteReminder(item)}
            // Don't spread the Realm item as such: {...item}
          />
        )}
        extraData={reminders}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  subtaskListContainer: {
    marginTop: 50,
    flex: 1,
    // justifyContent: 'center',
  },
  buttonStyle: {
    justifyContent: 'center',
  },
});

export default RemindersListContent;
