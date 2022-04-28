import React, {memo, useCallback, useDebugValue, useState} from 'react';
import {
  Alert,
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

import { useSwipe } from '../hooks/useSwipe';
import ReminderContext, {Reminder, Subtask} from '../models/Schemas';
import colors from '../styles/colors';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import notifee, 
{ AndroidCategory, AndroidColor, AndroidImportance, AndroidVisibility, 
  AuthorizationStatus, EventType, IntervalTrigger, RepeatFrequency, 
  TimestampTrigger, TimeUnit, TriggerNotification, TriggerType, 
} from '@notifee/react-native';

 const {useRealm, useQuery, RealmProvider} = ReminderContext;
interface ReminderItemProps {
  reminder: Reminder;
  handleModifyReminder: (
    reminder: Reminder,
    _title?: string,
    _subtasks?: Subtask[]
  ) => void;
  onDelete: () => void;
  onSwipeLeft: () => void
  handleNavigation: (reminder: Reminder) => void;
}

function ReminderItem({
  reminder: reminder,
  handleModifyReminder,
  onDelete,
  onSwipeLeft,
  handleNavigation,
}: ReminderItemProps) {

  const realm = useRealm();
  const updateIsCompleted = useCallback(
    (
      reminder: Reminder,
      _isComplete: boolean,
    ): void => {
      realm.write(() => {
        reminder.isComplete = _isComplete;
      });
    },
    [realm],
  );

  const { onTouchStart, onTouchEnd } = 
  useSwipe(onSwipeLeftFunc, onSwipeRight, onSwipeUp, onSwipeDown, 8);
  const [notifsList, setNotifsList] = useState(['']);
  const notifs = new Set();

  const [isChecked, setIsChecked] = useState(reminder.isComplete);
  

  function clearNotifications() {
    let idStrings = [ reminder._id.toHexString(), reminder._id.toHexString() + '1', 
    reminder._id.toHexString() + '2', reminder._id.toHexString() + '3', reminder._id.toHexString() + '4' ];

    try
    {
      notifee.cancelTriggerNotifications(idStrings);
    }
    catch(e)
    {
      console.log("id does not exist, skipping deletion", e);
    }
    finally
    {
      console.log("All notifications for this reminder have been deleted.");
      Alert.alert("Cancelled all notifications for this reminder");
    }
  }

  // function setNotificationImportance() {
  //   let idStrings = [ reminder._id.toHexString(), reminder._id.toHexString() + '1', 
  //   reminder._id.toHexString() + '2', reminder._id.toHexString() + '3', reminder._id.toHexString() + '4' ];
    
  //   for (const id in idStrings) {
  //     try
  //     {
  //       notifee.cancelTriggerNotifications(idStrings);
  //     }
  //     catch(e)
  //     {
  //       console.log("Reminder id does not exist, skipping deletion", e);
  //     }
  //     finally
  //     {
  //       console.log("All notifications for this reminder have been deleted.");
  //       (x ? Alert.alert("Cancelled all notifications for this reminder") : {});
  //     }
  //   }
  // }

  function onClearButton() {
    clearNotifications();
      Alert.alert("Cancelled all notifications for this reminder");
  }

  function onDeleteFunc() {
    clearNotifications();
    onDelete();
  }
  function onSwipeLeftFunc() {
    clearNotifications();
    onSwipeLeft();
  }

  function onSwipeRight() {
    /* notify function goes here */
    onDisplayNotification();
    onCreateStackTriggerNotification();
    // console.log('right Swipe performed');
  }

  function onSwipeUp() {

  }

  function onSwipeDown() {

  }

  async function onDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'Channel-0',
      name: 'Reminder initial notifications',
      visibility: AndroidVisibility.SECRET,
      importance: AndroidImportance.DEFAULT,
    });

    try 
    {
    // Display a notification
    await notifee.displayNotification({
      title: reminder.title, // required
      body: 'Reminder notification set for ' + reminder.scheduledDatetime.toLocaleString(),
      android: {
        autoCancel: false,
        channelId,
        importance: AndroidImportance.DEFAULT,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        tag: "M gud",
        //chronometerDirection: 'down',
        showTimestamp: true,
        //showChronometer: true,
        timestamp: Date.now() + calcTime(reminder.scheduledDatetime),
      },
    });
    } catch(e)
    {
      console.log("Reminder is already gone", e);
    }
  }

  async function onCreateTriggerNotification() {

    let trigType = 0;
    let trigInterval = RepeatFrequency.WEEKLY;
    let DT = calcTime(reminder.scheduledDatetime) / 60000;
    switch(handlePriority(reminder.scheduledDatetime))
    {
      
      case "min":
        break;
      case "low":
        trigInterval = RepeatFrequency.DAILY;
        break;
      case "default":
        //trigInterval = Math.max(Math.round(DT/120), 1);
        trigInterval = RepeatFrequency.HOURLY;
        break;
      default:
        trigType = 1;
        break;
    }

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
    
    // Create a new channel
    const channelId = await notifee.createChannel({
      id: 'Channel-1',
      name: 'Reminders',
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
    });

    try 
    {
    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        id: reminder._id.toHexString(),
        title: reminder.title,
        body: reminder.scheduledDatetime.toLocaleString(),
        android: {
          autoCancel: false,
          channelId,
          category: AndroidCategory.ALARM,
          importance: AndroidImportance.HIGH,
          tag: reminder._id.toHexString(),
          chronometerDirection: 'down',
          showTimestamp: true,
          showChronometer: true,
          timestamp: Date.now() + calcTime(reminder.scheduledDatetime),
          actions: [
            {
              title: 'Options',
              icon: 'ic_small_icon',
              pressAction: {
                id: 'reminder',
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
      notifee.getTriggerNotificationIds().then(ids => console.log('All trigger notifications: ', ids));
    } 
    catch(e) 
    {
      console.log("Reminder is already gone", e);
    }
  }

  async function onCreateStackTriggerNotification() {
    const enddate = Date.now() + calcTime(reminder.scheduledDatetime);
    const lateNotif = enddate + 3600000;
    const thirdNotif = enddate - 900000;
    const secondNotif = enddate - 1800000;
    const firstNotif = enddate - 3600000;

    let trigType = 0;
    let trigInterval = RepeatFrequency.WEEKLY;
    let DT = calcTime(reminder.scheduledDatetime) / 60000;
    switch(handlePriority(reminder.scheduledDatetime))
    {
      
      case "min":
        break;
      case "low":
        trigInterval = RepeatFrequency.DAILY;
        break;
      case "default":
        //trigInterval = Math.max(Math.round(DT/120), 1);
        trigInterval = RepeatFrequency.HOURLY;
        break;
      default:
        trigInterval = RepeatFrequency.HOURLY;
        trigType = 1;
        break;
    }

    // Create time-based triggers

    const trigger1: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: firstNotif,    // 1 hr before
      //alarmManager: true,
      alarmManager: {
      allowWhileIdle: true,
      },
    };

    const trigger2: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: secondNotif,   // 30 min before
      //alarmManager: true,
      alarmManager: {
      allowWhileIdle: true,
      },
    };

    const trigger3: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: thirdNotif,    // 15 min before
      //repeatFrequency: trigInterval,
      //alarmManager: true,
      alarmManager: {
      allowWhileIdle: true,
      },
    };

    const trigger4: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: enddate,       // at reminder time
      //repeatFrequency: RepeatFrequency.HOURLY,
      //alarmManager: true,
      alarmManager: {
      allowWhileIdle: true,
      },
    };

    const trigger5: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: lateNotif,     // 1 hour late reminder repeats hourly until cancelled
      repeatFrequency: RepeatFrequency.HOURLY,
      //alarmManager: true,
      alarmManager: {
      allowWhileIdle: true,
      },
    };

    // Create a new channel
    const channelId = await notifee.createChannel({
      id: 'Channel-1',
      name: 'Reminders',
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
    });
    
    const triggerlist = [ trigger1, trigger2, trigger3, trigger4, trigger5 ];
    const importanceList = [AndroidImportance.MIN, AndroidImportance.LOW, AndroidImportance.DEFAULT];
    
    for (let i = 0; i <= 4; i++) {
      try 
      {
        // Create a trigger notification
        if (i < 3)
        {
          await notifee.createTriggerNotification(
          {
            id: reminder._id.toHexString() + i.toString(),
            title: reminder.title,
            body: reminder.scheduledDatetime.toLocaleString(),
            android: {
              autoCancel: false,
              channelId,
              category: AndroidCategory.REMINDER,
              importance: importanceList[i],
              ongoing: false,
              tag: reminder._id.toHexString(),
              chronometerDirection: 'down',
              showTimestamp: true,
              showChronometer: (i == 2 || i == 3 ? true : false),   // show countdown on second and third notifs
              timestamp: Date.now() + calcTime(reminder.scheduledDatetime),
              actions: [
                {
                  title: 'Options',
                  icon: 'ic_small_icon',
                  pressAction: {
                    id: 'reminder',
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
          (triggerlist[i]),
          );
          notifee.getTriggerNotificationIds().then(ids => console.log('All trigger notifications: ', ids));
        }
        else
        {
          await notifee.createTriggerNotification(
          {
            id: (i == 4 ? reminder._id.toHexString() : reminder._id.toHexString() + i.toString()),
            title: '<p style="color: #4caf50;"><b>reminder.title</span></p></b></p> &#128576;',
            subtitle: '&#129395;',
            body: reminder.scheduledDatetime.toLocaleString() + '&#129395;',
            android: {
              autoCancel: false,
              channelId: 'Channel-1',
              category: AndroidCategory.ALARM,
              importance: AndroidImportance.HIGH,
              largeIcon: require('../../images/clock.png'),
              circularLargeIcon: true,
              ongoing: i == 4,
              tag: reminder._id.toHexString(),
              showTimestamp: true,
              timestamp: Date.now() + calcTime(reminder.scheduledDatetime),
              actions: [
                {
                  title: 'Options',
                  icon: 'ic_small_icon',
                  pressAction: {
                    id: 'reminder',
                  },
                  input: {
                    allowFreeFormInput: false, // set to false
                    choices: ['Snooze', 'Renew', 'Delete'],
                    placeholder: 'placeholder',
                  },
                },
              ],
              fullScreenAction: {
                id: 'timer',
              }
            },
          },
          (triggerlist[i]),
          );
          notifee.getTriggerNotificationIds().then(ids => console.log('All trigger notifications: ', ids));
        }
      }
      catch(e) 
      {
        console.log("Reminder is already gone", e);
      }
    };
  }
  
  // notifee.onBackgroundEvent(async ({ type, detail }) => {
  //   if (type === EventType.ACTION_PRESS && detail.action.id === 'reply') {
  //    //await updateChat(detail.notification.data.chatId, detail.action.input);
  //     await notifee.cancelNotification(detail.notification.id);
  //   }
  // });

  async function cancel(notifId : string, tag?: any) {
    await notifee.cancelNotification(notifId, tag);
  }

  function calcTime(date: any) {
    let now = Date.now();
    let end = date;
    let diff = (end - now);
    return diff;
  }
  
  const handlePriority = (date?: any) => {
    let startTime = Date.now();
    let endTime = date;
    let seconds = (endTime - startTime) / 1000;
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let weeks = Math.floor(days / 7);
    let months = Math.floor(weeks / 4.25); 
    if (months)
    {
      return "min";
    }
    if (weeks)
    {
      return "low";
    }
    if (days)
    {
      return "default";
    }
    if (hours)
    {
      return "high";
    }
    return "max";
  }

  const handleRepeatTime = (prio: any) => {
    switch (prio)
    {
      case "min":
        return 1;
      case "low":
        return 3;
      case "default":
        return 12;
      case "high":
        return 30;
      case "max":
        return 1;
      default:
        return 10;
    }
  }

  const handleRepeatType = (prio: any) => {
    switch (prio)
    {
      case "min":
        return "week";
      case "low":
        return "day";
      case "default":
        return "hour";
      case "high":
        return "minute";
      case "max":
        return "minute";
      default:
        return "time";
    }
  }

  return (
    <Pressable
      //onPress={() => onDisplayNotification() }   // Testing purposes
      onLongPress={() => handleNavigation(reminder)}
      onTouchStart={onTouchStart} 
      onTouchEnd={onTouchEnd}
      hitSlop={{ top: 10, bottom: 10, right: 100, left: 100}}
      android_ripple={{color:'#00f'}}
    >
      <View style={styles.dateTimeContainer}>
        <View>
          <Text>{reminder.scheduledDatetime.toLocaleTimeString('en-US')}</Text>
        </View>
        <View>
          <Text>{reminder.scheduledDatetime.toLocaleDateString('en-US')}</Text>
        </View>        
      </View>
      <View style={styles.task}>
        <View style={styles.content}>
          <View style={styles.titleInputContainer}>
            <View style={{width: 30}}/>
            <Text style={styles.textTitle}>{reminder.title}</Text>
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
                updateIsCompleted(reminder, isChecked);
                isChecked ? clearNotifications() : {};
              }}
            />
          </View>
          <View style={styles.subtaskListContainer}>
            {reminder.subtasks.map((subtask) => 
              <Text style={styles.textStyle}>{subtask.title}</Text>
            )}
          </View>
        </View>
        <Pressable
         onPress={onDeleteFunc} 
         style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </Pressable>
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
  dateTimeContainer: {
    marginTop: 8,
    flexDirection : "row",
    justifyContent : "space-between"
  },
  task: {
    marginVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 2,
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
  subtaskListContainer: {
    flex: 1,
    flexDirection: "column",
    borderColor: "black",
    borderRadius: 2,
  },
  textInput: {
    flex: 1,
    // textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16
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
    backgroundColor: colors.white,
    fontSize: 24,
  },
  textTitle: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  textValue: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
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
  },
});

// We want to make sure only tasks that change are rerendered
const shouldNotRerender = (
  prevProps: ReminderItemProps,
  nextProps: ReminderItemProps,
) => {};
  // prevProps.reminder.title === nextProps.reminder.title;
  // prevProps.reminder.title === nextProps.reminder.title &&
  // prevProps.reminder.subtasks === nextProps.reminder.subtasks;

export default memo(ReminderItem);
