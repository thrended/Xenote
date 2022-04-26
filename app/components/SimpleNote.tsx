import DateTimePickerModal from "react-native-modal-datetime-picker";
import React, {useState, useEffect} from 'react';
import { Formik } from 'formik';
import {
    Alert,
    Button,
    FlatList,
    KeyboardAvoidingView,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    SectionList,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
  } from 'react-native';
  import { globalStyles } from "../styles/global";

interface SimpleNoteProps {
  addNote: (
    values: {
      title: string;
      author: string;
      body: string;
      date: string;
      prio: number;
    }) => void,
    // add more props here, and also add them to the function definition.
} 

function SimpleNote({addNote}: SimpleNoteProps ) {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePickerModal = () => {
      setDatePickerVisibility(true);
    };
    
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
    
    const handleConfirm = (date: Date) => {
      //console.warn("A date has been picked: ", date);
      //alert("A date has been picked: " + date.getHours() +  ' ' + ' ' + date.getDay() + ' ' + date.getMonth() + ' ' + date.getDate() + ' ' + date.getFullYear());
      Alert.alert( "A date has been picked: " + date.toLocaleString() );
      hideDatePicker();
    };

    return(
        <View style={styles.container}>
            <Formik
                initialValues={{ title: '', author: '', body: '', date: new Date().toLocaleString(), prio: 0 }}
                onSubmit={(values, actions) =>  {
                    /* database stuff goes here */
                    Alert.alert(JSON.stringify(values));
                    actions.resetForm();
                    addNote(values);
                }}
            >
              {(props) => (
                <View>
                  <TextInput
                    style={styles.item}
                    placeholder='Title'
                    onChangeText={props.handleChange('title')}
                    value={props.values.title}
                  />

                  <TextInput
                    style={styles.item}
                    placeholder='Author'
                    onChangeText={props.handleChange('author')}
                    value={props.values.author}
                  />

                  <TextInput
                    style={styles.item}
                    multiline
                    numberOfLines={10}
                    // mode="outlined"
                    placeholder='Main body of note goes here'
                    onChangeText={props.handleChange('body')}
                    value={props.values.body}
                  />

                  {/* <Button title="Show DateTime Picker Modal" onPress={showDatePickerModal} />
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    value={props.values.date}
                  /> */}

                  {/* <TextInput
                    style={styles.item}
                    placeholder='Priority'
                    onChangeText={props.handleChange('prio')}
                    value={props.values.prio}
                    keyboardType='numeric'
                  /> */}
                  <View style={[globalStyles.separatorV, {marginVertical: 5}]}/>
                  
                  <View style={globalStyles.multibutton}>
                    <Text style={{paddingRight: 20}}>Priority</Text>
                    <Pressable onPress ={() => props.setFieldValue('prio', 0, false)} style={[globalStyles.buttonprio, {backgroundColor: '#84FFEB'}]} />
                    <Pressable onPress ={() => props.setFieldValue('prio', 1, false)} style={[globalStyles.buttonprio, {backgroundColor: 'cyan'}]} />
                    <Pressable onPress ={() => props.setFieldValue('prio', 2, false)} style={[globalStyles.buttonprio, {backgroundColor: '#3666E9'}]} />
                    <Pressable onPress ={() => props.setFieldValue('prio', 3, false)} style={[globalStyles.buttonprio, {backgroundColor: '#0400FF'}]} />
                    <Pressable onPress ={() => props.setFieldValue('prio', 4, false)} style={[globalStyles.buttonprio, {backgroundColor: '#22E734'}]} />
                    <Pressable onPress ={() => props.setFieldValue('prio', 5, false)} style={[globalStyles.buttonprio, {backgroundColor: '#FBFF00'}]} />
                    <Pressable onPress ={() => props.setFieldValue('prio', 6, false)} style={[globalStyles.buttonprio, {backgroundColor: '#FFBB00'}]} />
                    {/* <Pressable onPress ={() => props.setFieldValue('prio', 6, false)} style={[globalStyles.buttonprio, {backgroundColor: '#DA990F'}]} /> */}
                    <Pressable onPress ={() => props.setFieldValue('prio', 7, false)} style={[globalStyles.buttonprio, {backgroundColor: 'coral'}]} />
                    <Pressable onPress ={() => props.setFieldValue('prio', 8, false)} style={[globalStyles.buttonprio, {backgroundColor: '#E9443E'}]} />
                    <Pressable onPress ={() => props.setFieldValue('prio', 9, false)} style={[globalStyles.buttonprio, {backgroundColor: '#C5184C'}]} />
                    <Pressable onPress ={() => props.setFieldValue('prio', 10, false)} style={[globalStyles.buttonprio, {backgroundColor: '#992323'}]} />
                  </View>

                  <View style={[globalStyles.separatorV, {marginVertical: 20}]}/>
                  <Pressable
                    onPress={props.handleSubmit}
                    hitSlop={{ top: 5, bottom: 5, right: 10, left: 10}}
                    android_ripple={{color:'#00f'}}
                    style={({pressed}) => [
                      { backgroundColor: pressed ? '#1a75ee' : '#0ffdac' },
                    styles.button
                    ]}
                  >
                    <Text style={[styles.button, {alignItems: 'center'}]}>
                      Save Note
                    </Text>
                  </Pressable>

                </View>
              )}
            </Formik>
            
        </View>
    )

  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      marginHorizontal: 16,
    },
    item: {
      backgroundColor: '#a3e7ff',
      padding: 20,
      marginVertical: 8,
      borderRadius: 15,
    },
    header: {
      fontSize: 32,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
    },
    title2: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 15,
        height: 1,
        width: '80%',
    },
    button:  {
      width: 150,
      height: 50,
      fontSize: 30,
      backgroundColor: '#25f2f5',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: 15,
    },
    image :  {
      width: 200,
      height: 200,
      margin: 10,
    },
    modalToggle: {
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#f2f2f2',
      padding: 10,
      borderRadius: 10,
      alignSelf: 'center',
    },
    modalClose: {
      marginTop: 20,
      marginBottom: 0,
    },
    modalContent: {
      flex: 1,
    }
  });
  
  export default SimpleNote;