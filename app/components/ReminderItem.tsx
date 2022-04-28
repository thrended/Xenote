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
import RoundCheckbox from 'rn-round-checkbox';
import PushNotification, {Importance} from "react-native-push-notification";
import notifee, 
{ AndroidColor, AndroidImportance, AndroidVisibility, EventType, IntervalTrigger, RepeatFrequency, TimestampTrigger, TimeUnit, TriggerNotification, TriggerType }
 from '@notifee/react-native';

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

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRt, 6);
  const [notifsList, setNotifsList] = useState(['']);
  const notifs = new Set();

  const [isChecked, setIsChecked] = useState(reminder.isComplete);

  function onSwipeRt() {
    /* notify function goes here */
    //scheduleNotification(reminder._id, reminder.scheduledDatetime);
    onCreateTriggerNotification();
    // setInputComplete(!inputComplete);
    // onSwipeRight()
    // console.log('right Swipe performed');
  }

  async function onDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'Notifee-1',
      name: 'New Notifee Channel',
      visibility: AndroidVisibility.PUBLIC,
    });

    try 
    {
    // Display a notification
    await notifee.displayNotification({
      title: reminder.title, // required
      body: 'Notifee notification set',
      android: {
        autoCancel: false,
        channelId,
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        tag: "M gud",
        chronometerDirection: 'down',
        showTimestamp: true,
        showChronometer: true,
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
        id: reminder._id.toString(),
        title: reminder.title,
        body: reminder.scheduledDatetime.toLocaleString(),
        android: {
          autoCancel: false,
          channelId: 'Notifee-1',
          importance: AndroidImportance.HIGH,
          tag: reminder._id.toString(),
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

  const handleNotification = () => {
    PushNotification.localNotification({
      channelId: "Notif-test-1",
      title: "Test notification success",
      message: "You clicked on a pressable reminder",
    });
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

  const newNotifsList = (id: any) => { 
    setNotifsList([...notifsList, id]);
  }

  const scheduleNotification = (id = reminder._id.toString(), date = reminder.scheduledDatetime) => {
    let i = notifs.has(id);
    console.log("id ", id, "has index i = ", i)  // DEBUG line
    if(i)   // Notification already exists; turn off
    {             // Turn off DOESN'T WORK
      notifs.delete(id);
      //setNotifsList(notifsList.splice(i, 1));
      toggleCancelNotification();
      console.log("Notification turned off. New notification list: ", notifs);
      return;    
    }
    //handleNotification();
    console.log("Reminder id: ",  id);
    let prio = handlePriority(date);
    PushNotification.localNotificationSchedule({
      priority: handlePriority(date),
      id: id,
      date: new Date(Date.now() + 250),
      allowWhileIdle: true,
      repeatType: handleRepeatType(prio),
      repeatTime: handleRepeatTime(prio), 
      channelId: "Notif-test-1",
      title: reminder.title + " " + reminder.scheduledDatetime.toLocaleString(),
      message: prio.toUpperCase() + " priority scheduled notification \n" 
      + "This reminder will reappear every " 
      + handleRepeatTime(prio) + " " + handleRepeatType(prio) + "s",
      vibrate: (prio == "high" || prio == "max" ? true : false),
    });
    setNotifsList([...notifsList, id]);
    notifs.add(id);
    console.log(reminder._id);
    console.log(notifs, "\n");
    PushNotification.getScheduledLocalNotifications(console.log);

  }

  async function toggleCancelNotification (id = reminder._id.toString()) {
    PushNotification.cancelLocalNotification(id);
  }

  return (
    <Pressable
      onPress={() => onDisplayNotification() }   // Testing purposes
      //onPress={() => scheduleNotification()}
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
            <View/>
            <Text style={styles.textTitle}>{reminder.title}</Text>
            <RoundCheckbox
              backgroundColor='#3CB043'
              size={20}
              checked={isChecked}
              onValueChange={(newValue) => {
                setIsChecked(previousState => !previousState);
                updateIsCompleted(reminder, newValue);
                // console.log("isChecked (local state): " + isChecked + ", subtask.isChecked: " + subtask.isComplete);
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
         onPress={onDelete} 
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
