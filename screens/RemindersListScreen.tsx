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
  Switch,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../app/styles/colors';
import ReminderListDefaultText from '../app/components/ReminderListDefaultText';
import RemindersListContent from '../app/components/RemindersListContent';
import AddReminderButton from '../app/components/AddReminderButton';
import RealmContext, {Note, Reminder, Subtask} from '../app/models/Schemas';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SimpleNote from '../app/components/EditNote';
import NoteItem from '../app/components/NoteItem';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {globalStyles } from '../app/styles/global';
import Entypo from 'react-native-vector-icons/Entypo';
import PushNotification from "react-native-push-notification";
import notifee from '@notifee/react-native';

const {useRealm, useQuery, RealmProvider} = RealmContext;

const RemindersListScreen = ({route, navigation} : any) => {

  const realm = useRealm();
  const [modalOpen, setModalOpen] = useState(false);
  const [inputComplete, setInputComplete] = useState(false);
  const [inputDate, setInputDate] = useState(new Date());
  const [window, setWindow] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [hideSwitchIsEnabled, setHideSwitchIsEnabled] = useState(false);
  const toggleSwitch = () => setHideSwitchIsEnabled(previousState => !previousState);

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
  }
  const showDatePickerModal = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePickerModal = () => {
    setDatePickerVisibility(false);
  }

  const handleConfirm = (date: Date) => {
    Alert.alert( "A date has been picked: " + date.toLocaleString() );
    setInputDate(date);
    hideDatePickerModal();
  }

  // const [newNote, setNewNote] = useState();
  // const addNote = useCallback(
  //   (note: any): void => {
  //     realm.write(() => {
  //       const newNote = realm.create(
  //         'Note',
  //         Note.generate(
  //           note.title,
  //           note.author,
  //           note.body,
  //           note.date,
  //           note.prio,
  //         ),
  //       );
  //       setNewNote(newNote);
  //     });
  //     setModalOpen(false);
  //   },
  //   [realm],
  // );
  const addNote = () : Realm.BSON.ObjectId => {
    let newNoteId = new Realm.BSON.ObjectId();
    realm.write(() => {
      const newNote = realm.create<Note>(
        'Note',
        Note.generate(
          "",
          "",
          "",
          new Date(),
          5,
        ),
      );
      newNoteId = newNote._id;
    });
    return newNoteId;
  }

  const deleteNote = useCallback(
    (note: Note): void => {
      realm.write(() => {
        realm.delete(note);
      });
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
        `Unable to update the result state, an exception was thrown within the change listener: ${error}`
      );
    }
  });

  // const handleAddReminder = useCallback(
  //   (_title: string, _scheduledDatetime: Date): void => {
  //     realm.write(() => {
  //       realm.create('Reminder', Reminder.generate(_title, _scheduledDatetime));
  //     });
  //   },
  //   [realm],
  // );

  const addReminder = () : Realm.BSON.ObjectId => {
    let newReminderId = new Realm.BSON.ObjectId();
    realm.write(() => {
      const newReminder = realm.create<Reminder>(
        'Reminder', Reminder.generate("", new Date()),
      );
      newReminderId = newReminder._id;
    });
    return newReminderId;
  }

  const handeNavigateToReminderEditPage = useCallback(
    (reminder: Reminder): void => {
      navigateToReminderEditPage(reminder._id.toHexString());
    },
    [realm],
  );

  const navigateToReminderEditPage = 
    (reminderId: string): void => {
      navigation.navigate("ReminderSubtasksScreen", {reminderId: reminderId} );
    }

  const handleNavigateToNoteEditPage = useCallback(
    (note: Note): void => {
      navigateToNoteEditPage(note._id.toHexString());
    },
    [realm],
  );

  const navigateToNoteEditPage = 
    (noteId: string): void => {
      navigation.navigate("EditNoteScreen", {noteId: noteId} );
    }

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
  
  const cancelNotificationonDelete = (id?: any) => {
    PushNotification.cancelLocalNotification(id);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View
        style={[
          {flexDirection: 'row', justifyContent: 'space-around', padding: 10},
        ]}>
      <Pressable
          style={[
            styles.button,
            styles.buttonClose,
            {
              backgroundColor: window ? '#ffffff' : '#3CB043',
              borderColor: window ? '#3CB043' : '#000000',
              borderWidth: 1,
            },
          ]}
        onPress={() => {
          setWindow(false);
          navigation.setOptions({ title: 'Notes' })
        }}
      >
        <Text style={[
          styles.textStyle,
          { color : window? '#000000' : '#ffffff'}
        ]}>Notes</Text>
      </Pressable>
      
      <MaterialCommunityIcons
        name='notification-clear-all'
        size={24}
        style={{...globalStyles.modalToggle, ...globalStyles.modalIcon}}
        onPress={() => { 
          Alert.alert("Cancelled all active push notifications.")
          PushNotification.getScheduledLocalNotifications(console.log);
          PushNotification.cancelAllLocalNotifications();
          notifee.cancelTriggerNotifications();
        }}
      />
      
      <Pressable
          style={[
            styles.button,
            styles.buttonClose,
            {
              backgroundColor: !window ? '#ffffff' : '#3CB043',
              borderColor: !window ? '#3CB043' : '#000000',
              borderWidth: 1,
            },
          ]}
        onPress={() => {
          setWindow(true);
          navigation.setOptions({ title: 'Reminders' })
        }}
      >
        <Text style={[
          styles.textStyle,
          { color : !window? '#000000' : '#ffffff'}
        ]}>Reminders</Text>
      </Pressable>
      </View>
      { window && (
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
        {reminders.length === 0 ? (
          <ReminderListDefaultText />
        ) : (
          <RemindersListContent
            reminders={!hideSwitchIsEnabled? reminders : reminders.filter(reminder => !reminder.isComplete)}
            handleModifyReminder={handleModifyReminder}
            onDeleteReminder={handleDeleteReminder}
            onSwipeLeft={handleDeleteReminder}
            handleNavigation={handeNavigateToReminderEditPage}
          />
        )}
          <AddReminderButton
            onSubmit={() => {
              const newReminderId = addReminder();
              navigateToReminderEditPage(newReminderId.toHexString());
            }}
          />
      </View>
      )}
      { !window && (
        <View style={styles.content}>
          {/* <Text>Notes Tab</Text> */}
          <View style={[styles.centeredView, {marginTop: 0}]}>
            <Text>Create Simple Note</Text>
          </View>
          <View style={globalStyles.list}>
            <FlatList
              data={notes}
              renderItem={({ item }) => ( 
                <NoteItem note={item} handleSimpSwipe={deleteNote} handleNavigateToEdit={handleNavigateToNoteEditPage}/>
              )}
              // ItemSeparatorComponent={() => <View style={styles.separator} />}
              keyExtractor={({_id}) => _id.toHexString()}
              extraData={notes}
            /> 
          </View>
          <MaterialIcons
            name='add'
            size={24}
            style={globalStyles.modalToggle}
            onPress={() => {
              const newObjectId = addNote();
              console.log("On main screen, newObjectId: " + newObjectId);
              navigateToNoteEditPage(newObjectId.toHexString());
            }}
          />
        </View>
      )}
    </SafeAreaView>    
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row", 
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  content: {
    flex: 1,
    paddingTop: 0,
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
    minWidth: '33%',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.7,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonClose: {
    backgroundColor: '#ee6e73',
  },
});

export default RemindersListScreen;
