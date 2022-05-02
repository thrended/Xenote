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
import SelectDropdown from "react-native-select-dropdown";
import SimpleNote from '../app/components/EditNote';
import NoteItem from '../app/components/NoteItem';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {globalStyles } from '../app/styles/global';
import Entypo from 'react-native-vector-icons/Entypo';
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
  const [field1, setField1] = useState("priority");
  const [field2, setField2] = useState("isPinned");
  const [field3, setField3] = useState("");
  const [order1, setOrder1] = useState(true);
  const [order2, setOrder2] = useState(true);
  const [order3, setOrder3] = useState(true);
  const [sortOption, setSortOption] = useState("priority");
  const [sortOrder, setSortOrder] = useState(true);

  const dropdownOptions = [ 
    "Priority (Default)", "Title", "Subject", "Contents", "Size", "Flag on/off",
    "Date Created", "Date Modified", "Date Accessed", "Category", "Tags", 
  ];

  const dropdownEffects = [
    "default", "title", "author", "body", "size", "isFlagged", 
    "dateCreated", "dateModified", "dateAccessed", "category", "tags", 
  ];

  [
    { label: "Default (Priority)", value: "priority" }, // default sort
    { label: "Title", value: "title" },
    { label: "Subject", value: "author" },
    { label: "Contents", value: "body"},
    { label: "Size", value: "size" },
    { label: "Flag", value: "isFlagged" },
    { label: "Date Created", value: "dateCreated" },
    { label: "Date Modified", value: "dateModified" },
    { label: "Date Accessed", value: "dateAccessed" },
    { label: "Category", value: "category" },
    { label: "Tags", value: "tags"},
  ];

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
      //setNotesResult(notesResult.sorted('priority', true));
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

  const sortNotes = () => {
   console.log ( realm.objects(Note).sorted('priority', true) );
   return ( realm.objects(Note).sorted('priority', true) );
  }

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
    (note: Note, isNew: boolean): void => {
      navigateToNoteEditPage(note._id.toHexString(), isNew);
    },
    [realm],
  );

  const navigateToNoteEditPage = 
    (noteId: string, isNew: boolean): void => {
      navigation.navigate("EditNoteScreen", {noteId: noteId, isNew: isNew} );
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

  let handleNoteSortAlg = (sortOption = "priority", sortOrder = true, field2 = "isPinned", order2 = true) => {
    
    // if(field2 == undefined || field2 == "")
    // {
    //   return realm.objects(Note).sorted(field1, order1);
    // }
    return realm.objects(Note).sorted(sortOption, sortOrder).sorted(field2, order2);
  }

  let processNoteSortSelection = (choice = "default") => {
    switch (choice)
    {
      case "tags":
        Alert.alert("Coming soon");
        break;
      case "category":
        Alert.alert("Coming soon");
        break;
      case "default":
        setSortOption(() => "priority");
        setSortOrder(() => true);
        break;
      default:
        setSortOption(() => choice);
        //setSortOrder(() => true);
        break;
    }
    
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
                backgroundColor: window ? colors.subtle : colors.strong,
                borderColor: window ? colors.strong : colors.strong,
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
            { color : window? colors.dark : colors.subtle}
          ]}>Notes</Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.button,
            styles.buttonClose,
            {
              backgroundColor: !window ? colors.subtle : colors.strong,
              borderColor: !window ? colors.strong : colors.strong,
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
            { color : !window? colors.dark : colors.subtle}
          ]}>Reminders</Text>
        </Pressable>
      </View>
      { window && (
      <View style={styles.content}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <MaterialCommunityIcons
            name='notification-clear-all'
            size={28}
            style={{...globalStyles.modalToggle, ...globalStyles.modalIcon, padding: 5}}
            onPress={() => { 
              Alert.alert("Cancelled all trigger push notifications.");
              console.log(notifee.getTriggerNotifications());
              notifee.cancelTriggerNotifications();
            }}
            onLongPress={() => {
              Alert.alert("Cancelled all active push notifications.");
              console.log(notifee.getDisplayedNotifications());
              notifee.cancelAllNotifications();
            }}
          />
          <View style={styles.switchContainer}>
            <Text>{hideSwitchIsEnabled ? "Show Completed" : "Hide Completed"}</Text>
            <Switch
              trackColor={{ false: "#767577", true: colors.medium }}
              thumbColor={hideSwitchIsEnabled ? colors.strong : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={hideSwitchIsEnabled}
            />
          </View>
        </View>
        {reminders.length === 0 ? (
          <ReminderListDefaultText />
        ) : (
          <RemindersListContent
            reminders={
              !hideSwitchIsEnabled? reminders.sorted('scheduledDatetime', false) 
              : reminders.filter(reminder => !reminder.isComplete)}
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
        <View style={[styles.content]}>          
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <SelectDropdown
            data={dropdownOptions}
            defaultButtonText="Sort by:"
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              console.log(dropdownEffects[index]);
              let choice = dropdownEffects[index];
              processNoteSortSelection(choice);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return "Sort by: " + selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item
            }}
          />
          {/* <SelectDropdown
            data={['increasing', 'decreasing']}
            defaultButtonText="Order"
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              console.log(dropdownEffects[index]);
              let choice = (selectedItem == 'decreasing');
              choice != sortOrder ? setSortOrder(prev => !prev) : {};
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return "Sort by: " + selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item
            }}
          /> */}
          <View style={styles.switchContainer}>
            <Text>{!sortOrder ? "Increasing" : "Decreasing"}</Text>
            <Switch
              trackColor={{ false: "#767577", true: colors.medium }}
              thumbColor={!sortOrder ? colors.strong : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(selectedItem) => {
                console.log(selectedItem);
                selectedItem == sortOrder ? setSortOrder(prev => !prev) : {};
              }}
              value={!sortOrder}
            />
          </View>
          </View>
        <View style={[styles.content, {marginBottom: 50}]}>
          {/* <Text>Notes Tab</Text> */}
          <View style={[styles.centeredView, {marginTop: 0}]}>
            <Text style={{fontSize: 16, color: "green"}}>Use the "+" button to create a simple note.</Text>
          </View>
          <View style={globalStyles.list}>
            <FlatList
              data={handleNoteSortAlg(sortOption, sortOrder, "isPinned", true)}
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
            style={[globalStyles.modalToggle, {marginBottom: 0}]}
            onPress={() => {
              const newObjectId = addNote();
              console.log("On main screen, newObjectId: " + newObjectId);
              navigateToNoteEditPage(newObjectId.toHexString(), true);
            }}
          />
      </View>
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
    fontSize: 16
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '40%',
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
