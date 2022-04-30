/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Switch,
  TextInput,
} from 'react-native';

import {Button, TouchableOpacity, Image} from 'react-native';

import SubtaskContext, {Reminder, Subtask} from '../app/models/Schemas';
import SubtaskListDefaultText from '../app/components/SubtaskListDefaultText';
import AddReminderButton from '../app/components/AddReminderButton';
import NewReminderHeaderBar from '../app/components/NewReminderHeaderBar';
import ReminderContent from '../app/components/ReminderContent';
import SubtaskModal from '../app/components/SubtaskModal';
import colors from '../app/styles/colors';
import {Results} from 'realm';
import NewReminderTitleAndDateTimeBar from '../app/components/NewReminderTitleAndDateTimeBar';
import DateTimePicker from '@react-native-community/datetimepicker';

const {useRealm, useQuery, RealmProvider} = SubtaskContext;

function ReminderSubtasksScreen({route, navigation}: any) {
  const {reminderId} = route.params;
  
  const realm = useRealm();
  const reminder : (Reminder & Realm.Object) | undefined = realm?.objectForPrimaryKey("Reminder", new Realm.BSON.ObjectId(reminderId))!;
  const [result, setResult] = useState(reminder.subtasks);

  const subtasks = useMemo(() => result, [result]);

  const [modalVisible, setModalVisible] = useState(false);
  const [hideSwitchIsEnabled, setHideSwitchIsEnabled] = useState(false);
  const toggleSwitch = () => setHideSwitchIsEnabled(previousState => !previousState);

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
        <AddReminderButton onSubmit={() => {
          setModalVisible(true);}} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row", 
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center"
  },
  timeanddatestyle:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    resizeMode: 'center',
    height: 30,
    width: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalRow: {
    flex: 1,
    flexDirection: 'row',
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
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#ee6e73',
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  modalText: {
    marginBottom: 15,
    // textAlign: "center"
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
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ReminderSubtasksScreen;