import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Button,
  Text,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from 'react-native';
import colors from '../app/styles/colors';
import ReminderListDefaultText from '../app/components/ReminderListDefaultText';
import RemindersListContent from '../app/components/RemindersListContent';
import AddReminderButton from '../app/components/AddReminderButton';
import RealmContext, {Reminder, Subtask} from '../app/models/Schemas';

const {useRealm, useQuery, RealmProvider} = RealmContext;

const RemindersListScreen = ({navigation}: any) => {
  const realm = useRealm();
  const [result, setResult] = useState(useQuery(Reminder));

  useEffect(() => {
    try {
      result.addListener(() => {
        // update state of tasks to the updated value
        setResult(result);
      });
    } catch (error) {
      console.error(
        `Unable to update the result state, an exception was thrown within the change listener: ${error}`
      );
    }
  });

  const reminders = useMemo(() => result, [result]);

  const handleAddReminder = useCallback(
    (_title: string): void => {
      realm.write(() => {
        realm.create('Reminder', Reminder.generate(_title));
      });
    },
    [realm],
  );

  const navigateToReminderEditPage = useCallback(
    (reminder: Reminder): void => {
      navigation.navigate("ReminderSubtasksScreen", {reminder: reminder} );
    },
    [realm],
  );

  const handleModifyReminder = useCallback(
    (
      reminder: Reminder,
      _title?: string,
      _subtasks?: Subtask[]
    ): void => {
      realm.write(() => {
        _title ? (reminder.title = _title) : {};
        _subtasks ? (reminder.subtasks = _subtasks) : {};
        // setSubtasks(result);
      });
    },
    [realm],
  );

  const handleDeleteReminder = useCallback(
    (reminder: Reminder): void => {
      realm.write(() => {
        realm.delete(reminder);
      });
    },
    [realm],
  );

  return (
    <SafeAreaView style={styles.screen}>
      {/* <NewReminderHeaderBar onSubmit={() => {}} /> */}
      <View style={styles.content}>
        {reminders.length === 0 ? (
          <ReminderListDefaultText />
        ) : (
          <RemindersListContent
            reminders={reminders}
            handleModifyReminder={handleModifyReminder}
            onDeleteReminder={handleDeleteReminder}
            handleNavigation={navigateToReminderEditPage}
          />
        )}
        <AddReminderButton onSubmit={() => handleAddReminder("New Reminder")} />
      </View>
    </SafeAreaView>    
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RemindersListScreen;
