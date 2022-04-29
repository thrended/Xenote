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

import { format, compareAsc } from 'date-fns'
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
  useSwipe(onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, 8);
  const [notifsList, setNotifsList] = useState(['']);
  const notifs = new Set();

  const [isChecked, setIsChecked] = useState(reminder.isComplete);

  function onSwipeRight() {
    /* notify function goes here */
    onDisplayNotification();
    onCreateStackTriggerNotification();
    // setInputComplete(!inputComplete);
    // onSwipeRight()
    // console.log('right Swipe performed');
  }

  function onSwipeUp() {

  }

  function onSwipeDown() {

  }

  async function onDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'Notifee-1',
      name: 'Notifee Reminder Channel',
      visibility: AndroidVisibility.PUBLIC,
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
        importance: AndroidImportance.HIGH,
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
    const date = new Date(Date.now());
    date.setHours(11);
    date.setMinutes(10);

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
          channelId: 'Notifee-1',
          category: AndroidCategory.ALARM,
          importance: AndroidImportance.HIGH,
          tag: reminder._id.toHexString(),
          chronometerDirection: 'down',
          showTimestamp: true,
          showChronometer: true,
          timestamp: Date.now() + calcTime(reminder.scheduledDatetime),
          actions: [
            {
              title: 'Turn off',
              icon: 'https://my-cdn.com/icons/reply.png',
              pressAction: {
                id: 'default',
              },
              input: {
                allowFreeFormInput: false, // set to false
                choices: ['Yes', 'No', 'Maybe'],
                placeholder: 'placeholder',
              },
            },
          ],
        },
      },
      (trigType ? trigger1 : trigger2),
      );
      notifee.getTriggerNotificationIds().then(ids => console.log('All trigger notifications: ', ids));
    } catch(e) 
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
    
    const triggerlist = [ trigger1, trigger2, trigger3, trigger4, trigger5 ];
    
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
              channelId: 'Notifee-1',
              category: AndroidCategory.REMINDER,
              importance: AndroidImportance.HIGH,
              ongoing: false,
              tag: reminder._id.toHexString(),
              chronometerDirection: 'down',
              showTimestamp: true,
              showChronometer: (i == 2 || i == 3 ? true : false),
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
            title: reminder.title,
            body: reminder.scheduledDatetime.toLocaleString(),
            android: {
              autoCancel: false,
              channelId: 'Notifee-1',
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
          <Text>{format(reminder.scheduledDatetime, "K:hh b")}</Text>
        </View>
        <View>
          <Text>{format(reminder.scheduledDatetime, "MMMM dd, yyyy")}</Text>
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
              }}
            />
          </View>
          <View style={styles.subtaskListContainer}>
            {reminder.subtasks.map((subtask) => 
              <Text style={styles.textStyle}>{subtask.title}</Text>
            )}
          </View>
        </View>
        {/* <Pressable
         onPress={onDelete} 
         style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable> */}
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
  subtaskListContainer: {
    flex: 1,
    flexDirection: "column",
    borderColor: "black",
    borderRadius: 2,
    marginBottom: 8,
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
