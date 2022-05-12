import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import colors from '../styles/colors';
import ReminderListDefaultText from '../components/ReminderListDefaultText';
import RemindersListContent from '../components/RemindersListContent';
import AddReminderButton from '../components/AddReminderButton';
import RealmContext, {Note, Reminder, Subtask} from '../models/Schemas';
import SelectDropdown from "react-native-select-dropdown";
import NoteItem from '../components/NoteItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {globalStyles } from '../styles/global';
import Entypo from 'react-native-vector-icons/Entypo';
import notifee from '@notifee/react-native';
import SearchBar from "../components/SearchBar";

const {useRealm, useQuery, RealmProvider} = RealmContext;

const RemindersListScreen = ({route, navigation} : any) => {

  const realm = useRealm();
  const [window, setWindow] = useState(true);
  const [hideSwitchIsEnabled, setHideSwitchIsEnabled] = useState(false);
  const toggleSwitch = () => setHideSwitchIsEnabled(previousState => !previousState);

  const [notesResult, setNotesResult] = useState(useQuery(Note));
  const notes = useMemo(() => notesResult, [notesResult]);
  const [sortOption, setSortOption] = useState("priority");
  const [sortOrder, setSortOrder] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  var y = 0, z = "s";    // number of search results (don't re-render as state)

  // Sorting dropdown stuff
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
  
  const Search_Header = () => {
    if (!searching || !searchTerm || clicked)
    {
      return null;
    }
    z = (y==1 ? '' : 's');
    return (
      <View style={{
        height: 45,
        width: "100%",
        backgroundColor: "#00B8D4",
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 24, color: 'white' }}> Search found {y} result{z}. </Text>
      </View>
    );
  }

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

  const deleteAllNotes = useCallback(
    (): void => {
      realm.write(() => {
        realm.delete(realm.objects(Note));
      });
    },
    [realm],
  );
  
  const deleteAllReminders = useCallback(
    (): void => {
      realm.write(() => {
        realm.delete(realm.objects(Reminder));
        notifee.cancelAllNotifications();
      });
    },
    [realm],
  );
  
  const alertDeleteNotes = () =>
  Alert.alert(
    "Confirm Deletion of All Notes",
    "Delete all Notes?\n\nWARNING: This action cannot be undone!\n\nSelect the middle option to flip a coin.",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancelled delete all notes"),
      },
      {
        text: "Coinflip",
        onPress: () => {
          let w = Math.random();
          console.log("Rolled", w);
          let x = Math.round(w);
          Alert.alert("Coin flipped "+(x? '"heads"' : '"tails"'), (x? "Permanently wiped all existing notes." : "Preserving notes"));
          x ? deleteAllNotes() : {};
        },
      },
      {
        text: "Confirm",
        onPress: () => {
          deleteAllNotes();
          Alert.alert("Deleted all existing notes permanently.");
        },
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        console.log(
          "This alert was dismissed by tapping outside of the alert dialog."
        ),
    }
  );

  const alertDeleteReminders = () =>
  Alert.alert(
    "Confirm Delete of ALL Reminders",
    "Delete all Reminders and Subtasks?\n\nWARNING: this action will wipe ALL existing reminders, subtasks and notifications and is irreversible!\n\nSelect the middle option to flip a coin.",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancelled delete all reminders"),
      },
      {
        text: "Coinflip",
        onPress: () => {
          let m = Math.random();
          console.log("Rolled", m);
          let n = Math.round(m);
          Alert.alert("Coin flipped "+(n? '"heads"' : '"tails"'), (n? "Permanently wiped all reminders, subtasks and notifications." : "Preserving all notifications"));
          n ? deleteAllReminders() : {};
        },
      },
      {
        text: "Confirm",
        onPress: () => {
          deleteAllReminders();
          Alert.alert("Deleted all existing reminders, subtasks and notifications permanently.",
          "All existing reminders, subtasks and their notifications have been erased.");
        },
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        console.log(
          "This alert was dismissed by tapping outside of the alert dialog."
        ),
    }
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
    finally
    {}
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

  let handleNoteSortAlg = (sortOption = "priority", sortOrder = true, field2 = "isPinned", order2 = true, search = false, query = "") => {

    if (query !== "")
    {
      let sortedItems = realm.objects(Note).sorted(sortOption, sortOrder).sorted(field2, order2);
      /* Hashtag-Specific Search
      *  begin query with '#'
      *  exact matches only
      *  not case-sensitive
      */
      if (query[0] === "#" && query.trim().length > 1)
      {
        let normalizeLC = query.slice(1).toLowerCase();
        let searchResults = sortedItems.filter(note => [...note.tags].find(item => item.toLowerCase() === normalizeLC));
        y = searchResults.length;
        return searchResults;
      }
      /* Scan if the search is for a numeric attribute 
      *  P = priority, S = size, N = both
      *  second char must be colon ':'
      *  must have at least 1 character after the ':'
      *  equal value search for priority
      *  >= search for size (character length of text body)
      */
      if (query.trim().length > 2 && (query[0] === 'N' || query[0] === 'P' || query[0] === 'S') && query[1] === ':')
      {
        let newQuery = query.slice(2).trim();
        //console.log(newQuery);
        if (!isNaN(+newQuery)) {
          let searchResults = sortedItems.filter(note => note.priority === +newQuery || note.size >= +newQuery);
          switch(query[0])
          {
            case 'P': // priority search
              searchResults = searchResults.filter(note => note.priority === +newQuery);
            case 'S':
              searchResults = searchResults.filter(note => note.size >= +newQuery);
            default:
              y = searchResults.length;
              return searchResults;
          }
        }
      }
      /*
      * Search For ANY Terms in a Phrase
      * Begin query with 'any:' (or "ANY:") followed by at least 2 terms separated by spaces
      * Non-case-sensitive
      * Finds partial and exact matches for any string terms (exact only for tags)
      * Whitespace delimited
      */
      if (query.trim().length >=7 && query.slice(0, 4).toUpperCase().trim() == "ANY:") {
        let terms = new Set(query.slice(4).toLowerCase().trim().split(' '));
        //console.log([terms]);
        let searchResults = new Set<Note>();
        let dynamicList = sortedItems;
        terms.forEach((term) => {
          //dynamicList.forEach((M) => {console.log(M._id)});
          let iterFind = dynamicList.filter(note => note.title.toLowerCase().includes(term) 
          || note.author.toLowerCase().includes(term) || note.body.toLowerCase().includes(term) 
          || note.category.toLowerCase().includes(term) || [...note.tags].find(item => item.toLowerCase() === term));
          if(iterFind)
          {
            iterFind.forEach((M) => {
              !searchResults.has(M) ? safeAdd(searchResults, M) : {};
            });
            dynamicList = setReduce(dynamicList, iterFind);
          }
        })
        //searchResults.forEach((M) => {console.log(M._id)});
        y = searchResults.size;
        return [...searchResults];
      }
      /*
      *  Case-Sensitive Search
      *  Begin query with 'case:' (or "CASE:") followed by at least 1 character to search
      *  Locates string matches among note properties:
      *  Title, Subject, Body, Category, Tag
      *  Tag searching also becomes case-sensitive
      */
      if (query.trim().length > 5 && query.slice(0, 5).toUpperCase().trim() == "CASE:") {
        let terms = query.slice(5).trim();
        let searchResults = sortedItems.filter(note => note.title.includes(terms) 
        || note.author.includes(terms) || note.body.includes(terms) 
        || note.category.includes(terms) || [...note.tags].find(item => item === terms));
        y = searchResults.length;
        return searchResults;
      }
      /*
      *  Exact match search
      *  Begin query with all caps "EXACT:" followed by the search term to enforce case-sensitive strictness
      *  Otherwise, begin query with "exact:" (or any non-all-caps combination) followed by the search term
      *  Searches all string properties for the exact term only
      *  Only use one term and no space, otherwise it makes no sense
      */
      if (query.trim().length > 6 && query.slice(0, 6).toUpperCase().trim() == "EXACT:") {
        let term = query.slice(6).trim();
        // If query began with "EXACT:", make case-sensitive too
        if (query.slice(0, 6).trim() === "EXACT:") {
          let searchResults = sortedItems.filter(note => note.title.split(' ').includes(term) 
          || note.author.split(' ').includes(term) || note.body.split(' ').includes(term) 
          || note.category.split(' ').includes(term) || [...note.tags].find(item => item === term));
          y = searchResults.length;
          return searchResults;
        }
        // Else do normal exact match search
        term = term.toLowerCase().trim();
        let searchResults = sortedItems.filter(note => note.title.toLowerCase().split(' ').includes(term) 
        || note.author.toLowerCase().split(' ').includes(term) || note.body.toLowerCase().split(' ').includes(term) 
        || note.category.toLowerCase().split(' ').includes(term) || [...note.tags].find(item => item.toLowerCase() === term));
        y = searchResults.length;
        return searchResults;
      } 
      /* General Search
      *  Locates string matches among note properties:
      *  Title, Subject, Body, Category, Tag
      *  Tag uses the same algorithm as the hashtag search (exact matches only) 
      *  Case-insensitive
      *  Whitespace-sensitive */
      let normalizeLC = query.toLowerCase().trim();
      let searchResults = sortedItems.filter(note => note.title.toLowerCase().includes(normalizeLC) 
      || note.author.toLowerCase().includes(normalizeLC) || note.body.toLowerCase().includes(normalizeLC) 
      || note.category.toLowerCase().includes(normalizeLC) || [...note.tags].find(item => item.toLowerCase() === normalizeLC));
      //let test = sortedItems.filtered("title CONTAINS $0 OR author CONTAINS $1 OR body CONTAINS $2 OR category CONTAINS $3", query, query, query, query);
      y = searchResults.length;
      return searchResults;
    }
    return realm.objects(Note).sorted(sortOption, sortOrder).sorted(field2, order2);
  }

  let processNoteSortSelection = (choice = "default") => {
    switch (choice)
    {
      case "tags":
        // need a new prop to keep track of tag array size or something
        Alert.alert("Coming soon");
        break;
      case "default":
        setSortOption(() => "priority");
        !sortOrder? setSortOrder(() => true) : {};
        break;
      default:
        setSortOption(() => choice);
        //setSortOrder(() => true);
        break;
    }
    
  }

  let processNoteSearchSelection = (query = "") => {
    setSearching(query !== "" ? () => true : () => false);
    setSearchTerm(() => query);
  }

  let setReduce = (list1: any, list2: any) => {
    return list1.filter((item: any) => list2.indexOf(item) == -1);
  }

  let safeAdd = (list: any, note: Note) => {
    let safe = true;
    if(list.size > 0)
    {
      list.forEach((n: Note) => {
        n.title == note.title ? safe = false : {};
      });
    }
    safe ? list.add(note) : {};
    return list;
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
          <MaterialIcons
            name='delete-forever'
            size={20}
            style={[globalStyles.modalToggle, {marginBottom: 0}]}
            onPress={() => {
              alertDeleteReminders();
            }}
            onLongPress={() => {
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
        <View style={{ marginVertical: 10}}/>
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
            onFocus={() => setClicked(false)}
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
            <Text>{!sortOrder ? "Ascending" : "Descending"}</Text>
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
          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={(term: string) => {
              setSearchPhrase(term);
              processNoteSearchSelection(term);
            }}
            clicked={clicked}
            setClicked={setClicked}
        />
        <View style={[styles.content, {marginBottom: 50}]}>
          {/* <Text>Notes Tab</Text> */}
          <View style={[styles.centeredView, {marginTop: 0}]}>
            <Text style={{fontSize: 16, color: "green"}}>Use the "+" button to create a simple note.</Text>
          </View>
          <View
            style={globalStyles.list}
            onStartShouldSetResponder={() => {
              setClicked(false);
              return true;
            }}
          >
            <FlatList
              data={handleNoteSortAlg(sortOption, sortOrder, "isPinned", true, searching, searchTerm)}
              renderItem={({ item }) => ( 
                <NoteItem note={item} handleSimpSwipe={deleteNote} handleNavigateToEdit={handleNavigateToNoteEditPage}/>
              )}
              // ItemSeparatorComponent={() => <View style={styles.separator} />}
              keyExtractor={({_id}) => _id.toHexString()}
              extraData={notes}
              onTouchMove={() => setClicked(() => false)}
              onTouchStart={() => setClicked(() => false)}
              ListHeaderComponent={Search_Header}
              stickyHeaderIndices={[0]}
            /> 
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Entypo
            name='trash'
            size={24}
            style={[globalStyles.modalToggle, {marginBottom: 0}]}
            onPress={() => {
              alertDeleteNotes();
            }}
            onLongPress={() => {
            }}
          />
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
      </View>
      )}
    </SafeAreaView>    
  );
};

const styles = StyleSheet.create({
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
  switchContainer: {
    flexDirection: "row", 
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center"
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16
  },
});

export default RemindersListScreen;
