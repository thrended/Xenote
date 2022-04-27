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
import colors from '../app/styles/colors';
import ReminderListDefaultText from '../app/components/ReminderListDefaultText';
import RemindersListContent from '../app/components/RemindersListContent';
import AddReminderButton from '../app/components/AddReminderButton';
import RealmContext, {Note, Reminder, Subtask} from '../app/models/Schemas';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SimpleNote from '../app/components/SimpleNote';
import NoteItem from '../app/components/NoteItem';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {globalStyles} from '../app/styles/global';

const {useRealm, useQuery, RealmProvider} = RealmContext;

const RemindersListScreen = ({navigation}: any) => {
  const realm = useRealm();
  const [modalOpen, setModalOpen] = useState(false);
  const [inputComplete, setInputComplete] = useState(false);
  const [inputDate, setInputDate] = useState(new Date());
  const [window, setWindow] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [notesResult, setNotesResult] = useState(useQuery(Note));
  const notes = useMemo(() => notesResult, [notesResult]);
  // const  = useState([
  //   { title: 'Note 1', author: 'jack frost', body: 'semper ad meliora', date: new Date().toLocaleString(), prio: 0, key: '1' },
  //   { title: 'TOP SECRET', author: 'CIA', body: 'top secret files', date: new Date().toLocaleString(), prio: 7, key: '2' },
  // ]);

  const handleSimpSwipe = (key: string) => {
    // setNotesResult((prevNotes) => {
    //   return prevNotes.filter(note => note.key != key);
    // })
  };
  const showDatePickerModal = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePickerModal = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    Alert.alert('A date has been picked: ' + date.toLocaleString());
    setInputDate(date);
    hideDatePickerModal();
  };

  const addNote = useCallback(
    (note: any): void => {
      realm.write(() => {
        realm.create(
          'Note',
          Note.generate(
            note.title,
            note.author,
            note.body,
            note.date,
            note.prio,
          ),
        );
      });
      setModalOpen(false);
    },
    [realm],
  );

  const [result, setResult] = useState(useQuery(Reminder));
  const reminders = useMemo(() => result, [result]);

  useEffect(() => {
    try {
      result.addListener(() => {
        // update state of tasks to the updated value
        setResult(result);
      });
      notesResult.addListener(() => {
        // update state of tasks to the updated value
        setNotesResult(notesResult);
      });
    } catch (error) {
      console.error(
        `Unable to update the result state, an exception was thrown within the change listener: ${error}`,
      );
    }
  });

  const handleAddReminder = useCallback(
    (_title: string, _scheduledDatetime: Date): void => {
      realm.write(() => {
        realm.create('Reminder', Reminder.generate(_title, _scheduledDatetime));
      });
    },
    [realm],
  );

  const navigateToReminderEditPage = useCallback(
    (reminder: Reminder): void => {
      navigation.navigate('ReminderSubtasksScreen', {reminder: reminder});
    },
    [realm],
  );

  const handleModifyReminder = useCallback(
    (reminder: Reminder, _title?: string, _subtasks?: Subtask[]): void => {
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
      <View
        style={[
          {flexDirection: 'row', justifyContent: 'space-around', padding: 10},
        ]}>
        <Pressable
          style={[
            styles.button,
            styles.buttonClose,
            {backgroundColor: window ? '#ee6e73' : '#22E734'},
          ]}
          onPress={() => {
            setWindow(false);
          }}>
          <Text style={styles.textStyle}>Notes</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            styles.buttonClose,
            {backgroundColor: window ? '#22E734' : '#ee6e73'},
          ]}
          onPress={() => {
            setWindow(true);
          }}>
          <Text style={styles.textStyle}>Reminders</Text>
        </Pressable>
      </View>

      {/* <View style={styles.content}>
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
      </View> */}
      {window && (
        <View style={styles.content}>
          {reminders.length === 0 ? (
            <ReminderListDefaultText />
          ) : (
            <RemindersListContent
              reminders={reminders}
              handleModifyReminder={handleModifyReminder}
              onDeleteReminder={handleDeleteReminder}
              onSwipeLeft={handleDeleteReminder}
              handleNavigation={navigateToReminderEditPage}
            />
          )}
          <AddReminderButton
            onSubmit={() => handleAddReminder('New Reminder', new Date())}
          />
        </View>
      )}
      {!window && (
        <View style={styles.content}>
          <Text>Notes Tab</Text>
          <Modal visible={modalOpen} animationType="slide">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={globalStyles.modalContent}>
                <View style={globalStyles.modalIcon}>
                  <MaterialIcons
                    name="close"
                    size={24}
                    style={{
                      ...globalStyles.modalToggle,
                      ...globalStyles.modalClose,
                    }}
                    onPress={() => setModalOpen(!modalOpen)}
                  />
                  <Foundation
                    name="check"
                    size={24}
                    style={{
                      ...globalStyles.modalToggle,
                      ...globalStyles.modalClose,
                    }}
                    onPress={() => setModalOpen(!modalOpen)}
                  />
                </View>
                <View style={[globalStyles.containerTitle, {paddingTop: 25}]}>
                  <Text style={globalStyles.titleMain}>New Simple Note</Text>
                </View>
                <SimpleNote addNote={addNote} />
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <View style={[styles.centeredView, {marginTop: 0}]}>
            <Text>Create Simple Note</Text>
          </View>
          <View style={globalStyles.list}>
            <FlatList
              data={notes}
              renderItem={({item}) => (
                <NoteItem item={item} handleSimpSwipe={handleSimpSwipe} />
                // <Text>{item.title}</Text>
              )}
              // ItemSeparatorComponent={() => <View style={styles.separator} />}
              keyExtractor={(item, index) => index.toString()}
              extraData={notes}
            />
          </View>
          <MaterialIcons
            name="add"
            size={24}
            style={globalStyles.modalToggle}
            onPress={() => setModalOpen(!modalOpen)}
          />
        </View>
      )}
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
  button: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '46%',
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: '#ee6e73',
  },
});

export default RemindersListScreen;
