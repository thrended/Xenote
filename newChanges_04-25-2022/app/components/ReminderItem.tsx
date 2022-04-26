import React, {memo, useDebugValue, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
  StyleSheet,
  _Text,
} from 'react-native';

import { useSwipe } from '../hooks/useSwipe';
import {Reminder, Subtask} from '../models/Schemas';
import colors from '../styles/colors';

interface ReminderItemProps {
  reminder: Reminder;
  handleModifyReminder: (
    reminder: Reminder,
    _title?: string,
    _subtasks?: Subtask[]
  ) => void;
  onDelete: () => void;
  onSwipeLeft: () => void
  handleNavigation: (reminder: Reminder) => void;
}

function ReminderItem({
  reminder: reminder,
  handleModifyReminder,
  onDelete,
  onSwipeLeft,
  handleNavigation,
}: ReminderItemProps) {

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRt, 12);

  function onSwipeRt() {
    /* flag or complete function goes here */

    // setInputComplete(!inputComplete);
    // onSwipeRight()
    // console.log('right Swipe performed');
}

  return (
    <Pressable
      onLongPress={() => handleNavigation(reminder)}
      onTouchStart={onTouchStart} 
      onTouchEnd={onTouchEnd}
      hitSlop={{ top: 0, bottom: 0, right: 0, left: 0}}
      android_ripple={{color:'#00f'}}
    >
      <View style={styles.task}>
        <View style={styles.content}>
          <View style={styles.titleInputContainer}>
            <Text style={styles.textTitle}>{reminder.title}</Text>
          </View>
          <View style={styles.subtaskListContainer}>
            {reminder.subtasks.map((subtask) => 
              <Text style={styles.textStyle}>{subtask.title}</Text>
            )}
          </View>
        </View>
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#ee6e73',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  task: {
    marginVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.black,
    fontSize: 16,
    marginBottom: 8,
  },
  subtaskListContainer: {
    flex: 1,
    flexDirection: "column",
    borderColor: "black",
    borderRadius: 2,
  },
  textInput: {
    flex: 1,
    // textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16
  },
  featureInputContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  textFeature: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  textTitle: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  textValue: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  titleInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  // status: {
  //   width: 50,
  //   height: '100%',
  //   justifyContent: 'center',
  //   borderTopLeftRadius: 5,
  //   borderBottomLeftRadius: 5,
  //   backgroundColor: colors.gray,
  // },
  // completed: {
  //   backgroundColor: colors.purple,
  // },
  deleteButton: {
    justifyContent: 'center',
  },
  deleteText: {
    marginVertical: 10,
    color: colors.gray,
    fontSize: 16,
  },
  // icon: {
  //   color: colors.white,
  //   textAlign: 'center',
  //   fontSize: 17,
  //   fontWeight: 'bold',
  // },
  modalRow: {
    flex: 1,
    flexDirection: 'row',
  },
  modalText: {
    marginBottom: 15,
    // textAlign: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});

// We want to make sure only tasks that change are rerendered
const shouldNotRerender = (
  prevProps: ReminderItemProps,
  nextProps: ReminderItemProps,
) => {};
  // prevProps.reminder.title === nextProps.reminder.title;
  // prevProps.reminder.title === nextProps.reminder.title &&
  // prevProps.reminder.subtasks === nextProps.reminder.subtasks;

export default memo(ReminderItem);
