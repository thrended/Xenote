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
  TextInput,
} from 'react-native';

import {Button, TouchableOpacity, Image} from 'react-native';

import SubtaskContext, {Reminder, Subtask} from '../app/models/Schemas';
import SubtaskListDefaultText from '../app/components/SubtaskListDefaultText';
import AddSubtaskButton from '../app/components/AddSubtaskButton';
import NewReminderHeaderBar from '../app/components/NewReminderHeaderBar';
import ReminderContent from '../app/components/ReminderContent';
import colors from '../app/styles/colors';
import {Results} from 'realm';
import NewReminderTitleAndDateTimeBar from '../app/components/NewReminderTitleAndDateTimeBar';
import DateTimePicker from '@react-native-community/datetimepicker';

const {useRealm, useQuery, RealmProvider} = SubtaskContext;

function ReminderSubtasksScreen({route, navigation}: any) {
  const {reminder} = route.params;
  // console.log(reminder.subtasks);
  const realm = useRealm();
  // const result = useQuery(Subtask);
  const [result, setResult] = useState(reminder.subtasks);

  const subtasks = useMemo(() => result, [result]);

  const [modalVisible, setModalVisible] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const [inputFeature, setInputFeature] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const handleAddSubtask = useCallback(
    (_title: string, _feature: string, _value: string, _scheduledDatetime: Date): void => {
      realm.write(() => {
        // realm.create('Subtask', Subtask.generate(_title, _feature, _value));
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
    ): void => {
      realm.write(() => {
        _title ? (subtask.title = _title) : {};
        _feature ? (subtask.feature = _feature) : {};
        _value ? (subtask.value = _value) : {};
        _scheduledDatetime? (subtask.scheduledDatetime = _scheduledDatetime) : {};
        // setSubtasks(result);
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
    (reminder: Reminder, _title?: string, _scheduledDatetime?): void => {
      realm.write(() => {
        _title ? (reminder.title = _title) : {};
        _scheduledDatetime ? (reminder.scheduledDatetime = _scheduledDatetime) : {};
      });
    },
    [realm],
  );

  const initializeSubtaskInput = () => {
    setInputTitle('');
    setInputFeature('');
    setInputValue('');
    setDate(new Date());
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalRow}>
              <Text style={styles.modalText}>Title: </Text>
              <TextInput
                value={inputTitle}
                onChangeText={setInputTitle}
                placeholder="Enter new task title"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalText}>Feature: </Text>
              <TextInput
                value={inputFeature}
                onChangeText={setInputFeature}
                placeholder="Add a feature"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalText}>Value: </Text>
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Add a feature value"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, alignItems: 'center'}}>
              <View style = {styles.timeanddatestyle}>
                <Text>Select Time and Date: </Text>
                <TouchableOpacity onPress={showDatepicker}>
                  <Image
                    style={styles.container}
                    source={require('../images/calendar.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={showTimepicker}>
                  <Image
                    style={styles.container}
                    source={require('../images/clock.png')}
                  />
                </TouchableOpacity>
              </View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={false}
                  onChange={onChange}
                />
              )}
            <Text style = {{padding:8}}>selected: {date.toLocaleString()}</Text>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                handleAddSubtask(inputTitle, inputFeature, inputValue,date );
                initializeSubtaskInput();
              }}>
              <Text style={styles.textStyle}>Done ✓</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* <NewReminderHeaderBar onSubmit={() => {}} /> */}
      <NewReminderTitleAndDateTimeBar
        reminder={reminder}
        updateReminderCallback={handleModifyReminderTitle}
      />
      <View style={styles.content}>
        {subtasks.length === 0 ? (
          <SubtaskListDefaultText />
        ) : (
          <ReminderContent
            subtasks={subtasks}
            handleModifySubtask={handleModifySubtask}
            onDeleteSubtask={handleDeleteSubtask}
            onSwipeLeft={handleDeleteSubtask}
          />
        )}
        <AddSubtaskButton onSubmit={() => setModalVisible(true)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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