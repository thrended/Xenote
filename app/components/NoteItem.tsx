import * as React from 'react';
import {useCallback, useState} from 'react';

import {   
    Keyboard,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
    TouchableWithoutFeedback,
} from 'react-native';

import SimpleNote from './EditNote';
import { globalStyles } from '../styles/global'
import { useSwipe } from '../hooks/useSwipe';
import NoteContext, {Note} from '../models/Schemas';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const {useRealm, useQuery, RealmProvider} = NoteContext;
interface NoteItemProps {
  note: Note,
  handleSimpSwipe: (note: Note) => void
  handleNavigateToEdit: (note: Note, isNew: boolean) => void
}

function NoteItem({ note: note, handleSimpSwipe, handleNavigateToEdit }: NoteItemProps) {

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, 8);
  const [showPrio, setShowPrio] = useState(note.priority > 5);
  const [flagged, setFlagged] = useState(note.isFlagged);
  const [pinned, setPinned] = useState(note.isPinned);
  const [prio, setPrio] = useState(note.priority);
  const realm = useRealm();

  const toggleFlag = useCallback(
    (
      note: Note,
    ): void => {
      realm.write(() => {
        note.isFlagged = !note.isFlagged;
        setFlagged(previousState => !previousState)
        note.dateAccessed = new Date(Date.now());
      });
    },
    [realm],
  );

  const togglePin = useCallback(
    (
      note: Note,
    ): void => {
      realm.write(() => {
        note.isPinned = !note.isPinned;
        setPinned(previousState => !previousState)
        note.dateAccessed = new Date(Date.now());
      });
    },
    [realm],
  );

  function onSwipeLeft(){
      /* delete the entire note */
      handleSimpSwipe(note);
      console.log('left Swipe performed on note (delete)');
  }

  function onSwipeRight(){
      toggleFlag(note);
      console.log('right Swipe performed on note (toggle flag)');
      
  }

  function onSwipeUp() {
      /* */

  }

  function onSwipeDown() {
      /* */
  }

  function viewDetails(){

  }
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <View style={[globalStyles.content]}>
      <View style={{flex: 5}}>
        <Pressable onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onLongPress={() => handleNavigateToEdit(note, false)}>
          <View style={globalStyles.note}>
            <View style={globalStyles.noteFields}>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                  <Text style={globalStyles.titleText}>{note.title}</Text>
                  { pinned && ( 
                    <Entypo
                      name='pin'
                      size={20}
                        style={{
                          ...globalStyles.modalToggle,
                          ...globalStyles.modalClose,
                          padding: 5
                        }}
                      onPress={() => togglePin(note)}
                    />
                  )}
                  { !pinned && ( 
                    <AntDesign
                      name='pushpino'
                      size={20}
                        style={{
                          ...globalStyles.modalToggle,
                          ...globalStyles.modalClose,
                          padding: 5
                        }}
                      onPress={() => togglePin(note)}
                    />
                  )}
              </View>
              {note.author === ""? <View/> : 
                <Text style={globalStyles.authorText}>{note.author}</Text>
              }
              {note.body === ""? <View/> : 
                <Text>{note.body.slice(0, Math.min(50, note.body.length))}</Text>
              }
              <View style={{flexDirection: 'row', flex: 1, alignItems: "flex-end",justifyContent: "flex-end"}}>
                  { flagged && ( 
                    <FontAwesome5
                      name='flag-checkered'
                      size={16}
                        style={{
                          ...globalStyles.modalToggle,
                          ...globalStyles.modalClose,
                          padding: 5
                        }}
                      onPress={() => {}}
                    />
                  )}
              </View>

              <View style={{alignItems: "flex-end",justifyContent: "flex-end"}}>
                <Text style={{fontWeight: "bold"}}>Priority: {note.priority}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
      <View style = {{flex: 1, alignContent: "center"}}>

      </View>
      {/* <View style = {{flex: 1}}>
      { showPrio && (
        <Text style={globalStyles.note}>
          Priority: {note.priority}
        </Text>
      )}
      </View> */}
    </View>
  )
}

export default NoteItem;