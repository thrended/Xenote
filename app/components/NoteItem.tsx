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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const {useRealm, useQuery, RealmProvider} = NoteContext;
interface NoteItemProps {
  note: Note,
  handleSimpSwipe: (note: Note) => void
  handleNavigateToEdit: (note: Note, isNew: boolean) => void
}

function NoteItem({ note: note, handleSimpSwipe, handleNavigateToEdit }: NoteItemProps) {

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, 8);
  const [flagged, setFlagged] = useState(note.isFlagged);
  const [prio, setPrio] = useState(note.priority);
  const realm = useRealm();
  const [showPrio, setShowPrio] = useState(note.priority > 5);

  const toggleFlag = useCallback(
    (
      note: Note,
    ): void => {
      realm.write(() => {
        note.isFlagged = !note.isFlagged;
        setFlagged(previousState => !previousState)
      });
    },
    [realm],
  );

  const changeNoteProps = useCallback(
    (
      note: Note,
      _isFlagged: boolean,
    ): void => {
      realm.write(() => {
        note.isFlagged = _isFlagged;
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
              <Text style={globalStyles.authorText}>{note.author}</Text>
              <Text>{note.body.slice(0, Math.min(50, note.body.length))}</Text>
              <Text style={{fontWeight: "bold"}}>Priority: {note.priority}</Text>
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