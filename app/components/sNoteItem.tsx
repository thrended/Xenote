import * as React from 'react';
import {   
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
} from 'react-native';;
import { globalStyles } from '../styles/global'
//import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSwipe } from '../hooks/useSwipe';
//import SwipeGesture from '../hooks/SwipeGesture';

export default function NoteItem({ item, handleSimpSwipe }: any) {

    const { onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 6)

    function onSwipeLeft(){
        handleSimpSwipe(item.key);
        console.log('left Swipe performed');
    }

    function onSwipeRight(){
        /* flag function goes here */
        console.log('right Swipe performed');
    }

    function viewDetails(){

    }

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
    //   <View style={globalStyles.containerdefault}>  
    //     <SwipeGesture gestureStyle={globalStyles.swipesGestureContainer}
    //         onSwipePerformed={onSwipePerformed}>
    //         <Text style={globalStyles.note}>
    //             {item.title}
    //         </Text>
    //     </SwipeGesture>
    //   </View>  
        // //<Pressable onLongPress={() => handleSimpSwipe(item.key)}>
          <Pressable onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <Text style={globalStyles.note}>
                {item.title}
            </Text>
          </Pressable>
        //   //</ScrollView>
        // //</Pressable>
    )

}