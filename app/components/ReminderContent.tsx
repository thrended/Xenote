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

interface SubtaskListProps {
  subtasks: Realm.Results<Subtask> | [];
  handleModifySubtask: (
    subtask: Subtask,
    _title?: string,
    _feature?: string,
    _value?: string,
    _isComplete?: boolean,
    _scheduledDatetime?: Date,
  ) => void;
  onDeleteSubtask: (subtask: Subtask) => void;
  onSwipeLeft: (subtask: Subtask) => void;
  onSwipeRight: (
    subtask: Subtask,
    _isComplete?: boolean,
  ) => void;
}

function ReminderContent({
  subtasks: subtasks,
  handleModifySubtask,
  onDeleteSubtask, 
  onSwipeLeft,
  onSwipeRight,
}: SubtaskListProps) {
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
            onSwipeRight={() => onSwipeRight(item)}
            // Don't spread the Realm item as such: {...item}
          />
        )}
        extraData={subtasks}
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

export default ReminderContent;
