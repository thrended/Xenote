import React, {memo, useState} from 'react';
import {View, Text, TextInput, Pressable, Platform, StyleSheet} from 'react-native';

import colors from '../styles/colors';

interface SubtaskItemProps {
  title: string;
  feature: string;
  value: string
  isComplete: boolean;
  onToggleStatus: () => void;
  onDelete: () => void;
}

function SubtaskItem({
  title: title,
  feature: feature,
  value: value,
  isComplete,
  onToggleStatus,
  onDelete,
}: SubtaskItemProps) {
  const [_title, setTitle] = useState(title);

  return (
    <View style={styles.task}>
      {/* <Pressable
        onPress={onToggleStatus}
        style={[styles.status, isComplete && styles.completed]}>
        <Text style={styles.icon}>{isComplete ? '✓' : '○'}</Text>
      </Pressable> */}
      <View style={styles.content}>
        <View style={styles.titleInputContainer}>
          <TextInput
            value={_title}
            placeholder="Enter new task description"
            onChangeText={setTitle}
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.textInput}
          />
        </View>
      </View>
      
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  task: {
    marginVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
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
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.black,
    fontSize: 16,
    marginBottom: 8
  },
  textInput: {
    textAlign: "center",
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  titleInputContainer: {
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
});

// We want to make sure only tasks that change are rerendered
const shouldNotRerender = (
  prevProps: SubtaskItemProps,
  nextProps: SubtaskItemProps,
) =>
  prevProps.title === nextProps.title &&
  prevProps.isComplete === nextProps.isComplete;

export default memo(SubtaskItem, shouldNotRerender);
