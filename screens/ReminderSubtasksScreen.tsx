import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

import SubtaskContext, {Reminder, Subtask} from '../app/models/Schemas';
import SubtaskListDefaultText from '../app/components/SubtaskListDefaultText';
import AddSubtaskButton from '../app/components/AddSubtaskButton';
import NewReminderHeaderBar from '../app/components/NewReminderHeaderBar';
import ReminderContent from '../app/components/ReminderContent';
import colors from '../app/styles/colors';
import {Results} from 'realm';
import NewReminderTitleAndDateTimeBar from '../app/components/NewReminderTitleAndDateTimeBar';
import PushNotification from "react-native-push-notification";



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
  const [inputDate, setInputDate] = useState(new Date());

 
  const scheduleNotification = () => {
    PushNotification.localNotificationSchedule({
      date: new Date(Date.now() + 900 * 1000),
      allowWhileIdle: true,
      repeatType: 'time',
      repeatTime: 30000,  
      channelId: "Notif-test-1",
      title: "Scheduled notification success",
      message: "This reminder will reappear every 30 seconds",
  });
  }

  const handleAddSubtask = useCallback(
    (_title: string, _feature: string, _value: string, _scheduledDT: Date): void => {
      realm.write(() => {
        // realm.create('Subtask', Subtask.generate(_title, _feature, _value));
        reminder.subtasks.push(Subtask.generate(_title, _feature, _value, _scheduledDT));
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
    ): void => {
      realm.write(() => {
        _title ? (subtask.title = _title) : {};
        _feature ? (subtask.feature = _feature) : {};
        _value ? (subtask.value = _value) : {};
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
    (
      reminder: Reminder,
      _title?: string,
    ): void => {
      realm.write(() => {
        _title ? (reminder.title = _title) : {};
      });
    },
    [realm],
  );

  const initializeSubtaskInput = () => {
    setInputTitle('');
    setInputFeature('');
    setInputValue('');
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

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                handleAddSubtask(inputTitle, inputFeature, inputValue, inputDate);
                initializeSubtaskInput();
              }}>
              <Text style={styles.textStyle}>Done ✓</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      {/* <NewReminderHeaderBar onSubmit={() => {}} /> */}
      <NewReminderTitleAndDateTimeBar reminder={reminder} updateTitleCallback={handleModifyReminderTitle}/>
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
