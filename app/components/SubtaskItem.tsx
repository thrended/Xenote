import React, {memo, useDebugValue, useCallback, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
  StyleSheet,
  _Text,
} from 'react-native';

import { format, compareAsc } from 'date-fns'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import RoundCheckbox from 'rn-round-checkbox';
import { useSwipe } from '../hooks/useSwipe';
import SubtaskContext, {Subtask} from '../models/Schemas';
import SubtaskModal from '../components/SubtaskModal';
import colors from '../styles/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import notifee, 
{ AndroidCategory, AndroidColor, AndroidImportance, AndroidVisibility, 
  AuthorizationStatus, EventType, IntervalTrigger, RepeatFrequency, 
  TimestampTrigger, TimeUnit, TriggerNotification, TriggerType, 
} from '@notifee/react-native';

const {useRealm, useQuery, RealmProvider} = SubtaskContext;

interface SubtaskItemProps {
  subtask: Subtask;
  handleModifySubtask: (
    subtask: Subtask,
    _title?: string,
    _feature?: string,
    _value?: string,
    _scheduledDatetime?: Date,
    _isComplete?: boolean,
  ) => void;
  onDelete: () => void;
  onSwipeLeft: () => void
}

function SubtaskItem({
  subtask: subtask,
  handleModifySubtask,
  onDelete,
  onSwipeLeft,
}: SubtaskItemProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(subtask.isComplete);


  function clearNotifications() {
    let b = true;
    try
    {
      notifee.cancelTriggerNotification(subtask._id.toHexString());
    }
    catch(e)
    {
      b = false;
      console.log("This subtask has no associated notifications, skipping deletion", e);
    }
    finally
    {
      (b ? console.log("Subtask notification has been deleted") : {});
     // (b ? Alert.alert("Subtask notification cancelled") : {});
    }
  }

  async function lowerNotificationImportance() {
    let x = true;
    try
    {
      await notifee.createChannel({
        id: 'Channel-3',
        name: 'Subtasks',
        importance: AndroidImportance.DEFAULT ? AndroidImportance.LOW : AndroidImportance.MIN,
      });
    }
    catch(e)
    {
      x = false;
      console.log("Channel does not exist", e);
    }
    finally
    {
      console.log(x ? "Channel notification importance level has been lowered" : {});
      (x ? Alert.alert("Channel notification importance level has been lowered") : {});
    }
  }

  function onDeleteFunc() {
    clearNotifications();
    onDelete();
  }
  function onSwipeLeftFunc() {
    clearNotifications();
    onSwipeLeft();
  }

  const closeModal = () => {
    if (modalVisible) {
      setModalVisible(previousState => !previousState);
    }
  }

  const openModal = () => {
    if (!modalVisible) {
      setModalVisible(previousState => !previousState);
    }
  }

  // const initializeSubtaskInput = () => {
  //   setInputTitle(title); setInputFeature(feature); setInputValue(value);
  // }

  const realm = useRealm();
  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeftFunc, onSwipeRight, onSwipeUp, onSwipeDown, 8);

  function onSwipeRight() {
    /* 59 minute grace period to turn on notification anyway */
    if (calcTime(subtask.scheduledDatetime) < -3550000)
    {
      Alert.alert("Cannot set notifications for a expired subtask past 1 hour.");
      return;
    }
    /* flag or complete function goes here */
    onDisplayNotification();
    onCreateSubtaskTriggerNotification();
  }

  function onSwipeUp() {

  }

  function onSwipeDown() {

  }

  function calcTime(date: any) {
    let now = Date.now();
    let end = date;
    let diff = (end - now);
    return diff;
  }

  async function onDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'Channel-2',
      name: 'Subtask Initial Notifications',
      visibility: AndroidVisibility.PRIVATE,
      importance: AndroidImportance.DEFAULT,
    });

    try 
    {
    // Display a notification
    await notifee.displayNotification({
      title: subtask.title, // required
      body: 'Subtask notification set for ' + subtask.scheduledDatetime.toLocaleString(),
      android: {
        autoCancel: true,
        channelId,
        importance: AndroidImportance.LOW,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        tag: "M gud",
        //chronometerDirection: 'down',
        showTimestamp: true,
        //showChronometer: true,
        timestamp: Date.now() + calcTime(subtask.scheduledDatetime),
      },
    });
    } catch(e)
    {
      console.log("Subtask is already gone", e);
    }
  }

  async function onCreateSubtaskTriggerNotification() {

    let trigType = 0;
    let trigInterval = RepeatFrequency.WEEKLY;
    let DT = calcTime(subtask.scheduledDatetime) / 60000;
    // switch(handlePriority(subtask.scheduledDatetime))
    // {
      
    //   case "min":
    //     break;
    //   case "low":
    //     trigInterval = RepeatFrequency.DAILY;
    //     break;
    //   case "default":
    //     //trigInterval = Math.max(Math.round(DT/120), 1);
    //     trigInterval = RepeatFrequency.HOURLY;
    //     break;
    //   default:
    //     trigType = 1;
    //     break;
    // }

    // Create a time-based trigger
    const trigger1: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now(),
      repeatFrequency: trigInterval,
      //alarmManager: true,
      alarmManager: {
      allowWhileIdle: true,
      },
    };
    
    // Create an interval trigger if time is short
    const trigger2: IntervalTrigger = {
      type: TriggerType.INTERVAL,
      interval: 15,     // MIN = 15
      timeUnit: TimeUnit.MINUTES,
    };
    
    const channelId = await notifee.createChannel({
      id: 'Channel-3',
      name: 'Subtasks',
      visibility: AndroidVisibility.PRIVATE,
      importance: AndroidImportance.DEFAULT,
    });

    try 
    {
    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        id: subtask._id.toHexString(),
        title: subtask.title,
        body: subtask.scheduledDatetime.toLocaleString(),
        android: {
          autoCancel: false,
          channelId: 'Channel-3',
          category: AndroidCategory.EVENT,
          importance: AndroidImportance.DEFAULT,
          largeIcon: require('../../images/clock.png'),
          circularLargeIcon: true,
          ongoing: true,
          tag: subtask._id.toHexString(),
          chronometerDirection: 'down',
          showTimestamp: true,
          showChronometer: false,
          timestamp: Date.now() + calcTime(subtask.scheduledDatetime),
          actions: [
            {
              title: 'Actions',
                icon: 'ic_small_icon',
                pressAction: {
                  id: 'subtask',
                },
                input: {
                  allowFreeFormInput: false, // set to false
                  choices: ['Snooze', 'Renew', 'Delete'],
                  placeholder: 'placeholder',
                },
            },
          ],
        },
      },
      (trigType ? trigger1 : trigger2),
      );
      console.log("trigger type = ", trigType);
      notifee.getTriggerNotificationIds().then(ids => console.log('All trigger notifications: ', ids));
    } catch(e) 
    {
      console.log("Subtask is already gone", e);
    }
  }

  const updateIsCompleted = useCallback(
    (
      subtask: Subtask,
      _isComplete: boolean,
    ): void => {
      realm.write(() => {
        subtask.isComplete = _isComplete;
      });
    },
    [realm],
  );

  return (
    <View>
      <Pressable
        onLongPress={openModal}
        onTouchStart={onTouchStart} 
        onTouchEnd={onTouchEnd}
        hitSlop={{ top: 0, bottom: 0, right: 0, left: 0}}
        android_ripple={{color: colors.subtle}}
      >
        <View style={styles.dateTimeContainer}>
          <View>
            <Text>{format(subtask.scheduledDatetime, "h:mm b")}</Text>
          </View>
          <View>
            <Text>{format(subtask.scheduledDatetime, "E MMMM d, yyyy")}</Text>
          </View>        
        </View>
        <View style={styles.task}>
          <View style={styles.content}>
            <View style={styles.titleInputContainer}>
              <View style={{width: 30}}/>
              <Text style={styles.textTitle}>{subtask.title}</Text>
              <BouncyCheckbox
                isChecked={isChecked}
                size={25}
                fillColor="#3CB043"
                unfillColor="#FFFFFF"
                iconStyle={{ borderColor: "#3CB043" }}
                textStyle={{ fontFamily: "JosefinSans-Regular" }}
                disableText={true}
                onPress={(isChecked: boolean) => {
                  setIsChecked(isChecked => !isChecked);
                  updateIsCompleted(subtask, isChecked);
                  isChecked ? clearNotifications() : {};
                }}
              />
            </View>
            {subtask.feature === "" && subtask.value === ""? <View/> :             
            <View style={styles.featureInputContainer}>
              <Text style={styles.textFeature}>{subtask.feature}</Text>
              <Text style={styles.textValue}>{subtask.value}</Text>
            </View>}
          </View>
          {/* <Pressable onPress={onDeleteFunc} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable> */}
        </View>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SubtaskModal 
          onSubmit={() => {}}
          handleAddSubtask={() => {}}
          handleModifySubtask={handleModifySubtask}
          isNew={false}
          closeModal={closeModal}
          subtask={subtask}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  timeanddatestyle:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
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
  dateTimeContainer: {
    marginTop: 8,
    flexDirection : "row",
    justifyContent : "space-between"
    
  },
  task: {
    marginVertical: 8,
    backgroundColor: colors.subtle,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.black,
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    // textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.subtle,
    fontSize: 24,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featureInputContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  textFeature: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    fontSize: 24,
  },
  textTitle: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    fontSize: 24,
  },
  textValue: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    fontSize: 24,
  },
  titleInputContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: "space-between",
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  // status: {
  //   width: 50,
  //   height: '100%',
  //   justifyContent: 'center',
  //   borderTopLeftRadius: 5,
  //   borderBottomLeftRadius: 5,
  //   backgroundColor: colors.gray,
  // },
  // completed: {
  //   backgroundColor: colors.purple,
  // },
  deleteButton: {
    justifyContent: 'center',
  },
  deleteText: {
    marginVertical: 10,
    color: colors.gray,
    fontSize: 16,
  },
  // icon: {
  //   color: colors.white,
  //   textAlign: 'center',
  //   fontSize: 17,
  //   fontWeight: 'bold',
  // },
  modalRow: {
    flex: 1,
    flexDirection: 'row',
  },
  modalText: {
    marginBottom: 15,
    // textAlign: "center"
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
});

// We want to make sure only tasks that change are rerendered
const shouldNotRerender = (
  prevProps: SubtaskItemProps,
  nextProps: SubtaskItemProps,
) =>
  prevProps.subtask.title === nextProps.subtask.title &&
  prevProps.subtask.feature === nextProps.subtask.feature &&
  prevProps.subtask.value === nextProps.subtask.value;

export default memo(SubtaskItem, shouldNotRerender);
