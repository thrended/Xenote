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

import {Subtask} from '../models/Schemas';
import SubtaskItem from './SubtaskItem';

interface ReminderContentProps {
  subtasks: Realm.Results<Subtask> | [];
  handleModifySubtask: (
    subtask: Subtask,
    _title?: string,
    _feature?: string,
    _value?: string,
    _scheduledDatetime?: Date,
    _isComplete?: boolean,
  ) => void;
  onDeleteSubtask: (subtask: Subtask) => void;
  onSwipeLeft: (subtask: Subtask) => void;
}

function ReminderContent({
  subtasks: subtasks,
  handleModifySubtask,
  onDeleteSubtask,
  onSwipeLeft,
}: ReminderContentProps) {
  return (
    <View style={styles.subtaskListContainer}>
      <FlatList
        data={subtasks}
        keyExtractor={subtask => subtask._id.toString()}
        renderItem={({item}) => (
          <SubtaskItem
            subtask={item}
            handleModifySubtask={handleModifySubtask}
            onDelete={() => onDeleteSubtask(item)}
            onSwipeLeft={() => onSwipeLeft(item)}
            // Don't spread the Realm item as such: {...item}
          />
        )}
        extraData={subtasks}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  subtaskListContainer: {
    marginTop: 0,
    flex: 1,
    // justifyContent: 'center',
  },
  buttonStyle: {
    justifyContent: 'center',
  },
});

export default ReminderContent;
