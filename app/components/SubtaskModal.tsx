import React, {useState} from 'react';
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

interface SubtaskModalProps {
  onSubmit: (description: string) => void;
}

function SubtaskModal({onSubmit}: SubtaskModalProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit(description);
    setDescription('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
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
                  source={require('../images/calendar.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={showTimepicker}>
                <Image
                  style={styles.container}
                  source={require('../images/clock.png')}
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
              setModalVisible(!modalVisible);
              handleAddSubtask(inputTitle, inputFeature, inputValue,date );
              initializeSubtaskInput();
            }}>
            <Text style={styles.textStyle}>Done ✓</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
});

export default SubtaskModal;
