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
import PushNotification from "react-native-push-notification";


const scheduleNotification = (item: any) => {
  PushNotification.localNotificationSchedule({
  date: new Date(Date.now() + 900 * 1000),
  allowWhileIdle: true,
  repeatType: 'time',
  repeatTime: 30000,  
  channelId: "Notif-test-1",
  title: "Scheduled notification success",
  message: "This reminder will appear every 30 seconds",
});
}
interface ReminderListProps {
  reminders: Realm.Results<Reminder> | [];
  handleModifyReminder: (
    reminder: Reminder,
    _title?: string,
    _scheduledDT?: Date,
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
          <Pressable onPress={scheduleNotification} >
            <ReminderItem
              reminder={item}
              handleModifyReminder={handleModifyReminder}
              handleNavigation={handleNavigation}
              onDelete={() => onDeleteReminder(item)}
              onSwipeLeft={() => onSwipeLeft(item)}
              // Don't spread the Realm item as such: {...item}
            />
          </Pressable>
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
