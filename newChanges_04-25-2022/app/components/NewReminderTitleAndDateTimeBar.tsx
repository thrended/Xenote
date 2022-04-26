/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {TouchableOpacity, Image} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Reminder} from '../models/Schemas';
import colors from '../styles/colors';

interface NewReminderTitleAndDateTimeBarProps {
  reminder: Reminder;
  updateReminderCallback: (reminder: Reminder, _title?: string, _scheduledDatetime?: Date) => void;
}
function NewReminderTitleAndDateTimeBar({
  reminder: reminder,
  updateReminderCallback: updateReminderCallback,
}: NewReminderTitleAndDateTimeBarProps): JSX.Element {
  const [titleInput, setTitleInput] = useState(reminder.title);

  const updateTitle = (newTitle: string) => {
    setTitleInput(newTitle);
    updateReminderCallback(reminder, newTitle);
  };
 
  const [date, setDate] = useState(reminder.scheduledDatetime);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    updateReminderCallback(reminder, undefined, currentDate);

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
    <View style={styles.titlebar}>
      <View style={styles.row}>
        <TextInput
          value={titleInput}
          onChangeText={updateTitle}
          placeholder="Reminder Title"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.textInput}
        />
        <View>
          <View style={styles.row2}>
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
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  row2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
    padding: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: 350,
    padding: 5,
  },
  container: {
    resizeMode: 'center',
    height: 30,
    width: 50,
  },
  titlebar: {
    width: Dimensions.get('window').width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orchid',
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
  titleTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  titleText: {
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : 0,
    fontSize: 24,
    fontWeight: 'bold',
  },

  icon: {
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
    borderRadius: 6,
  },
});

export default NewReminderTitleAndDateTimeBar;
