import React from 'react';
import {View, FlatList, Pressable, StyleSheet} from 'react-native';
import { Realm } from '@realm/react';

import { Subtask } from '../models/Schemas';
import SubtaskItem from './SubtaskItem';

interface SubtaskListProps {
  tasks: Realm.Results<Subtask> | [];
  onToggleTaskStatus: (task: Subtask) => void;
  onDeleteTask: (task: Subtask) => void;
}

function Reminder({tasks: subtasks, onToggleTaskStatus: onToggleSubtaskStatus, onDeleteTask: onDeleteSubtask}: SubtaskListProps) {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={subtasks}
        keyExtractor={subtask => subtask._id.toString()}
        renderItem={({item}) => (
          <SubtaskItem
            title={item.title}
            feature={item.feature}
            value={item.value}
            isComplete={item.isComplete}
            onToggleStatus={() => onToggleSubtaskStatus(item)}
            onDelete={() => onDeleteSubtask(item)}
            // Don't spread the Realm item as such: {...item}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 50,
    flex: 1,
    // justifyContent: 'center',
  },
});

export default Reminder;
