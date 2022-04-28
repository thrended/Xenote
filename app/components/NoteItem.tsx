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
  handleNavigateToEdit: (note: Note) => void
}

function NoteItem({ note: note, handleSimpSwipe, handleNavigateToEdit }: NoteItemProps) {

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, 8);
  const [flagged, setFlagged] = useState(false);
  const [prio, setPrio] = useState(note.priority);
  const realm = useRealm();
  const [showPrio, setShowPrio] = useState(note.priority > 5);

  const toggleFlag = useCallback(
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
      /* flag function goes here */
      setFlagged(flagged => !flagged);
      toggleFlag(note, flagged);
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
    <View style={[globalStyles.content, {flexDirection: 'row'} ]}>
      <View style={{flex: 6.5}}>
      <Pressable onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onLongPress={() => handleNavigateToEdit(note)}>
        <Text style={globalStyles.note}>
            {note.title}    {note.body.slice(0, Math.min(50, note.body.length))}            Priority: {note.priority}
        </Text>
      </Pressable>
      </View>
      <View style = {{flex: 1}}>
      { flagged && ( 
        <FontAwesome5
          name='flag-checkered'
          size={24}
            style={{
              ...globalStyles.modalToggle,
              ...globalStyles.modalClose,
            }}
          onPress={() => {}}
        />
      )}
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