import React, {useEffect, useState} from 'react';
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

import RealmContext, {Subtask, Reminder} from '../models/Schemas';
import SubtaskItem from './SubtaskItem';
const {useRealm} = RealmContext;

interface ReminderContentProps {
  subtasks: Realm.Results<Subtask> | [];
  reminderId: string;
  onDeleteSubtask: (subtask: Subtask) => void;
  onSwipeLeft: (subtask: Subtask) => void;
  handleNavigation: (index : number, reminderId : string) => void;
}

function ReminderContent({
  subtasks: subtasks,
  reminderId: reminderId,
  onDeleteSubtask,
  onSwipeLeft,
  handleNavigation,
}: ReminderContentProps) {

  const [subtaskList, setSubtaskList] = useState(subtasks);

  const refreshSubtaskList = () => {
    setSubtaskList(subtasks);
  }

  const subtaskRenderItem = ({item, index}) => {
    return (
      <SubtaskItem
        subtask={item}
        reminderId={reminderId}
        index={index}
        onDelete={() => onDeleteSubtask(item)}
        onSwipeLeft={() => onSwipeLeft(item)}
        handleNavigation={handleNavigation}
        onChange={refreshSubtaskList}
        // Don't spread the Realm item as such: {...item}
      />
    );
  }

  return (
    <View style={styles.subtaskListContainer}>
      <FlatList
        data={subtaskList}
        keyExtractor={subtask => subtask._id.toString()}
        renderItem={subtaskRenderItem}
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
