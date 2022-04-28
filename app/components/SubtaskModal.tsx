import React, {useCallback, useState} from 'react';
import {
  Image,
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import colors from '../styles/colors';
import RealmContext, {Subtask, Reminder} from '../models/Schemas';
import DateTimePicker from '@react-native-community/datetimepicker';
const {useRealm, useQuery, RealmProvider} = RealmContext;

function SubtaskModal({route, navigation} : any) {
  const {subtaskIndex, reminderId} = route.params;
  const realm = useRealm();
  const reminder : (Reminder & Realm.Object) | undefined = realm?.objectForPrimaryKey("Reminder", new Realm.BSON.ObjectId(reminderId))!;
  console.log(subtaskIndex + " : " + reminderId)
  const subtask = reminder.subtasks[subtaskIndex];

  const [inputTitle, setInputTitle] = useState(subtask.title);
  const [inputFeature, setInputFeature] = useState(subtask.feature);
  const [inputValue, setInputValue] = useState(subtask.value);
  const [date, setDate] = useState(subtask.scheduledDatetime);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const handleModifySubtask = useCallback(
    (
      subtask: Subtask,
      _title?: string,
      _feature?: string,
      _value?: string,
      _scheduledDatetime?: Date,
      _isComplete?: boolean,
    ): void => {
      realm.write(() => {
        _title ? (subtask.title = _title) : {};
        _feature ? (subtask.feature = _feature) : {};
        _value ? (subtask.value = _value) : {};
        _scheduledDatetime ? (subtask.scheduledDatetime = _scheduledDatetime) : {};
        _isComplete !== undefined? (subtask.isComplete = _isComplete) : {};
      });
    },
    [realm],
  );

  const onChange = (event, selectedDate) => {
    const newDate = selectedDate;
    setShow(false);
    setDate(newDate);
    handleModifySubtask(subtask, undefined, undefined, undefined, newDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={styles.modalRow}>
          <Text style={styles.modalText}>Title: </Text>
          <TextInput
            value={inputTitle}
            onChangeText={setInputTitle}
            placeholder="Enter new task title"
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.textInput}
          />
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalText}>Feature: </Text>
          <TextInput
            value={inputFeature}
            onChangeText={setInputFeature}
            placeholder="Add a feature"
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.textInput}
          />
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalText}>Value: </Text>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Add a feature value"
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.textInput}
          />
        </View>

        <View style={{flex: 1, alignItems: 'center'}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <Text>Select Time and Date: </Text>
            <TouchableOpacity onPress={showDatepicker}>
              <Image
                style={styles.container}
                source={require('../../images/calendar.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={showTimepicker}>
              <Image
                style={styles.container}
                source={require('../../images/clock.png')}
              />
            </TouchableOpacity>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={false}
              onChange={onChange}
            />
          )}
        </View>
        <Text>selected: {date.toLocaleString()}</Text>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => {
            handleModifySubtask(subtask, inputTitle, inputFeature, inputValue, date);
            navigation.goBack()
          }}>
          <Text style={styles.textStyle}>Done ✓</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
  container: {
    resizeMode: 'center',
    height: 30,
    width: 50,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalRow: {
    flex: 1,
    flexDirection: 'row',
  },
  modalText: {
    marginBottom: 15,
    // textAlign: "center"
  },
  floatingButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.7,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  // textInput: {
  //   flex: 1,
  //   paddingHorizontal: 15,
  //   paddingVertical: Platform.OS === 'ios' ? 15 : 0,
  //   borderRadius: 5,
  //   backgroundColor: colors.white,
  //   fontSize: 24,
  // },
  floatingButton: {
    // height: '100%',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#ee6e73',
  },
  icon: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textInput: {
    flex: 1,
    // textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
});

export default SubtaskModal;
