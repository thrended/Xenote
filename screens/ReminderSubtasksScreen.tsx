/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo, useState} from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Switch,
} from 'react-native';

import colors from '../app/styles/colors';

import AddReminderButton from '../app/components/AddReminderButton';
import NewReminderTitleAndDateTimeBar from '../app/components/NewReminderTitleAndDateTimeBar';
import ReminderContent from '../app/components/ReminderContent';
import SubtaskContext, {Reminder, Subtask} from '../app/models/Schemas';
import SubtaskListDefaultText from '../app/components/SubtaskListDefaultText';
import SubtaskModal from '../app/components/SubtaskModal';

const {useRealm} = SubtaskContext;

function ReminderSubtasksScreen({route, navigation}: any) {
  
  // Realm data
  const {reminderId} = route.params;
  const realm = useRealm();
  const reminder : (Reminder & Realm.Object) | undefined = realm?.objectForPrimaryKey("Reminder", new Realm.BSON.ObjectId(reminderId))!;
  const [result, setResult] = useState(reminder.subtasks);
  const subtasks = useMemo(() => result, [result]);

  // UI State variables
  const [modalVisible, setModalVisible] = useState(false);
  const [hideSwitchIsEnabled, setHideSwitchIsEnabled] = useState(false);
  const toggleSwitch = () => setHideSwitchIsEnabled(previousState => !previousState);

  // DB Transaction callbacks
  const handleAddSubtask = useCallback(
    (_title: string, _feature: string, _value: string, _scheduledDatetime: Date): void => {
      realm.write(() => {
        // const newSubtask = realm.create('Subtask', Subtask.generate(_title, _feature, _value, _scheduledDatetime));
        // reminder.subtasks.push(newSubtask);
        reminder.subtasks.push(Subtask.generate(_title, _feature, _value, _scheduledDatetime));
      });
    },
    [realm],
  );

  const handleDeleteSubtask = useCallback(
    (task: Subtask): void => {
      realm.write(() => {
        realm.delete(task);
        setResult(reminder.subtasks);
        // Alternatively if passing the ID as the argument to handleDeleteTask:
        // realm?.delete(realm?.objectForPrimaryKey('Task', id));
      });
    },
    [realm],
  );

  const handleModifySubtask = useCallback(
    (
      subtask: Subtask,
      _title?: string,
      _feature?: string,
      _value?: string,
      _scheduledDatetime?: Date,
      _isComplete?: boolean,
    ): void => {
      realm.write(() => {
        _title ? (subtask.title = _title) : {};
        _feature ? (subtask.feature = _feature) : {};
        _value ? (subtask.value = _value) : {};
        _scheduledDatetime ? (subtask.scheduledDatetime = _scheduledDatetime) : {};
        _isComplete !== undefined? (subtask.isComplete = _isComplete) : {};
        // setResult(reminder.subtasks);
      });
    },
    [realm],
  );

  const handleModifyReminderTitle = useCallback(
    (reminder: Reminder, _title?: string, _scheduledDatetime?, _isExpired?: boolean): void => {
      realm.write(() => {
        _title ? (reminder.title = _title) : {};
        _scheduledDatetime ? (reminder.scheduledDatetime = _scheduledDatetime) : {};
        _isExpired ? (reminder.isExpired = _isExpired) : {};
      });
    },
    [realm],
  );

  // JSX UI Code
  return (
    <SafeAreaView style={styles.screen}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <SubtaskModal 
          onSubmit={() => {}}
          handleAddSubtask={handleAddSubtask}
          handleModifySubtask={handleModifySubtask}
          isNew={true}
          closeModal={() => setModalVisible(!modalVisible)}
        />
      </Modal>
      {/* <NewReminderHeaderBar onSubmit={() => {}} /> */}
      <NewReminderTitleAndDateTimeBar
        reminder={reminder}
        updateReminderCallback={handleModifyReminderTitle}
      />
      <View style={styles.content}>
        <View style={styles.switchContainer}>
          <Text>{hideSwitchIsEnabled ? "Show Completed" : "Hide Completed"}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={hideSwitchIsEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={hideSwitchIsEnabled}
          />
        </View>
        {subtasks.length === 0 ? (
          <SubtaskListDefaultText />
        ) : (
          <ReminderContent
            subtasks={
              !hideSwitchIsEnabled? 
                subtasks : subtasks.filter(subtask => !subtask.isComplete)}
            handleModifySubtask={handleModifySubtask}
            onDeleteSubtask={handleDeleteSubtask}
            onSwipeLeft={handleDeleteSubtask}
          />
        )}
        <View style={{ marginVertical: 30}}/>
        <AddReminderButton onSubmit={() => {
          setModalVisible(true);}} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  switchContainer: {
    flexDirection: "row", 
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center"
  },
});

export default ReminderSubtasksScreen;