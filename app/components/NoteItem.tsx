import * as React from 'react';
import {useState} from 'react';

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
//import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSwipe } from '../hooks/useSwipe';
//import SwipeGesture from '../hooks/SwipeGesture';
import {Note} from '../models/Schemas';

interface NoteItemProps {
  note: Note,
  handleSimpSwipe: (note: Note) => void
  handleNavigateToEdit: (note: Note) => void
}

function NoteItem({ note: note, handleSimpSwipe, handleNavigateToEdit }: NoteItemProps) {

    const { onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 6)

    function onSwipeLeft(){
        handleSimpSwipe(note);
        console.log('left Swipe performed');
    }

    function onSwipeRight(){
        /* flag function goes here */
        console.log('right Swipe performed');
    }

    function viewDetails(){

    }
    const [modalOpen, setModalOpen] = useState(false);
    /*const onSwipePerformed = (action: string) => {

        switch(action){
              case 'left':{
                console.log('left Swipe performed');
                handleSimpPress(item.key);
                break;
              }
               case 'right':{
                console.log('right Swipe performed');
                break;
              }
               case 'up':{
                console.log('up Swipe performed');
                break;
              }
               case 'down':{
                console.log('down Swipe performed');
                break;
              }
               default : {
               console.log('Undeteceted action');
               }

        }
    }*/

    return (
      <View>
        <Pressable onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onLongPress={() => handleNavigateToEdit(note)}>
          <Text style={globalStyles.note}>
              {note.title}
          </Text>
        </Pressable>
      </View>
    )
}

export default NoteItem;