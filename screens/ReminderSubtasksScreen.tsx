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
import AddSubtaskButton from '../app/components/AddSubtaskButton';
import NewReminderHeaderBar from '../app/components/NewReminderHeaderBar';
import ReminderContent from '../app/components/ReminderContent';
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

  const subtasks = useMemo(() => result, [result, result.length]);

  useEffect(() => {
    try {
      reminder.addListener(() => {
        // update state of tasks to the updated value
        setResult(reminder.subtasks);
      });
    } catch (error) {
      console.error(
        `Unable to update the result state, an exception was thrown within the change listener: ${error}`
      );
    }
  });

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const addSubtask = () : number => {
    realm.write(() => {
      reminder.subtasks.push(Subtask.generate("", "", "", new Date(reminder.scheduledDatetime)));
    });
    return reminder.subtasks.length - 1;
  }

  const handeNavigateToSubtaskEditPage = useCallback(
    (index: number, reminderId: string): void => {
      navigateToSubtaskEditPage(index, reminderId);
    },
    [realm],
  );

  const navigateToSubtaskEditPage = 
    (index: number, reminderId: string): void => {
      navigation.navigate("EditSubtaskScreen", {subtaskIndex: index, reminderId: reminderId} );
    }

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

  return (
    <SafeAreaView style={styles.screen}>
      {/* <NewReminderHeaderBar onSubmit={() => {}} /> */}
      <NewReminderTitleAndDateTimeBar
        reminder={reminder}
        updateReminderCallback={handleModifyReminderTitle}
      />
      <View style={styles.content}>
        <View style={{flexDirection: "row", alignContent: "center"}}>
          <Text>{isEnabled ? "Show Completed" : "Hide Completed"}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        {subtasks.length === 0 ? (
          <SubtaskListDefaultText />
        ) : (
          <ReminderContent
            subtasks={subtasks}
            reminderId={reminder._id.toHexString()}
            onDeleteSubtask={handleDeleteSubtask}
            onSwipeLeft={handleDeleteSubtask}
            handleNavigation={handeNavigateToSubtaskEditPage}
          />
        )}
        <AddSubtaskButton onSubmit={() => {
          const newSubtaskIndex = addSubtask();
          handeNavigateToSubtaskEditPage(newSubtaskIndex, reminder._id.toHexString())
        }} />
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