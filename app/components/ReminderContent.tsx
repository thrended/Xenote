import React from 'react';
import {View, FlatList, Pressable, StyleSheet} from 'react-native';
import { Realm } from '@realm/react';

import { Subtask } from '../models/Schemas';
import SubtaskItem from './SubtaskItem';

interface SubtaskListProps {
  subtasks: Realm.Results<Subtask> | [];
  onDeleteSubtask: (subtask: Subtask) => void;
  onSwipeLeft: (subtask: Subtask) => void;
}

function ReminderContent({subtasks: subtasks, onDeleteSubtask: onDeleteSubtask, onSwipeLeft: onSwipeLeft}: SubtaskListProps) {
  return (
    <View style={styles.subtaskListContainer}>
      <FlatList
        data={subtasks}
        keyExtractor={subtask => subtask._id.toString()}
        renderItem={({item}) => (
          <SubtaskItem
            title={item.title}
            feature={item.feature}
            value={item.value}
            onDelete={() => onDeleteSubtask(item)}
            onSwipeLeft={() => onSwipeLeft(item)}
            // Don't spread the Realm item as such: {...item}
          />
        )}
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
});

export default ReminderContent;
