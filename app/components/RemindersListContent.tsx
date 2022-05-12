import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
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
  onSwipeLeft: (reminder: Reminder) => void;
}

function RemindersListContent({
  reminders: reminders,
  handleModifyReminder,
  onDeleteReminder,
  onSwipeLeft,
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
            onSwipeLeft={() => onSwipeLeft(item)}
          />
        )}
        extraData={reminders}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  subtaskListContainer: {
    marginTop: 0,
    flex: 1,
    marginBottom: 40
  },
});

export default RemindersListContent;
