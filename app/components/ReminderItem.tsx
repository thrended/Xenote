import React, {memo, useCallback, useDebugValue, useEffect, useState} from 'react';
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
  Switch,
  _Text,
} from 'react-native';

import { format, compareAsc } from 'date-fns'
import addSeconds from 'date-fns/addSeconds';
import { useSwipe } from '../hooks/useSwipe';
import ReminderContext, {Reminder, Subtask} from '../models/Schemas';
import colors from '../styles/colors';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import notifee, 
{ AndroidCategory, AndroidColor, AndroidImportance, AndroidVisibility, 
  AuthorizationStatus, EventType, IntervalTrigger, RepeatFrequency, 
  TimestampTrigger, TimeUnit, TriggerNotification, TriggerType, 
} from '@notifee/react-native';
import {globalStyles } from '../styles/global';
import SwitchSelector from "react-native-switch-selector";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

  const { onTouchStart, onTouchEnd } = 
  useSwipe(onSwipeLeftFunc, onSwipeRight, onSwipeUp, onSwipeDown, 8);
  // can adjust the frequency of pinging notifications here
  // too low values will probably (definitely) impact performance
  let delay = 30000;      // ms
  let lockout = -3333333; // ms
  var [initialized, setInitialized] = useState(false);

  const [isChecked, setIsChecked] = useState(reminder.isComplete);
  const [isAutoRenewSwitchOn, setAutoRenewSwitchOn] = useState(reminder.isAutoRenewOn);
  const [renewFreq, setRenewFreq] = useState(reminder.autoRenewFreq);
  const [renewDate, setRenewDate] = useState(reminder.autoRenewDate);
  const [isExpired, setExpired] = useState(reminder.isExpired);
  const [DT, setDT] = useState(reminder.scheduledDatetime);
  
  const SSOptions = [
    //{ label: "3m", value: "0.05" }, // TEST VALUE
   // { label: "30m", value: "0.5" },
    { label: "1h", value: "1" },
    { label: "2h", value: "2" },
    { label: "4h", value: "4" },
    { label: "12h", value: "12" },
    { label: "1d", value: "24" },
    { label: "2d", value: "48" },
    { label: "3d", value: "72" },
    //{ label: "5d", value: "120" },
    { label: "7d", value: "168" },
    { label: "14d", value: "336" },
    { label: "30d", value: "720" },
    { label: "90d", value: "2160"},
    { label: "1yr", value: "8760"},
  ];
  
  // useEffect(() => {
  //   return () => {
  //     setTimeout(() => {
  //       if(reminder == undefined)
  //       {
  //         clearTimeout(checkReminderRenewalTimer);
  //       }
  //     }, delay);
  //   }
  // }, []);
  
  const expiredCallback = (useCallback(
    (
      reminder: Reminder,
      _isExpired?: boolean,
      _isAutoRenew?: boolean,
    ): void => {
      realm.write(() => {
        reminder.isExpired = ( calcTime (reminder.scheduledDatetime) < lockout );
        reminder.isExpired ? setExpired(() => true) : setExpired(() => false);
      });
    },
    [realm],)

  );

  let initVerifyStatus = (useCallback(
    (
      reminder: Reminder,
      _isExpired: boolean,
      _isComplete: boolean,
      _isAutoRenew?: boolean,
    ): void => {
      realm.write(() => {
        reminder.isExpired = _isExpired;
        reminder.isExpired ? setExpired(() => true) : setExpired(() => false);
        reminder.isExpired ? reminder.isAutoRenewOn = false : {};
        reminder.isAutoRenewOn ? reminder.isAutoRenewOn = !_isExpired && !_isComplete : {};
        reminder.isAutoRenewOn ? setAutoRenewSwitchOn(() => true) : setAutoRenewSwitchOn(() => false);
      });
    },
    [realm],)

  );

  let process_AUTORENEW = useCallback(
    (
      reminder: Reminder,
      _newDate: Date,
      _newRenewDate: Date,
      _isComplete?: boolean,
    ): void => {
      realm.write(() => {
        reminder.scheduledDatetime = _newDate;
        setDT(() => _newDate);
        reminder.autoRenewDate = _newRenewDate;
        setRenewDate(() => _newRenewDate);
        _isComplete ? reminder.isComplete = false : {};
        _isComplete ? setIsChecked(() => false) : {};
      });
    },
    [realm],
  );

  let doAutoRenew = () => {
    let oldSchedDate = reminder.scheduledDatetime;
    let oldRenewDate = reminder.autoRenewDate;
    let interval = reminder.autoRenewFreq;
    process_AUTORENEW(reminder, new Date(addSeconds(oldSchedDate, interval)), new Date(addSeconds(oldRenewDate, interval)));
    Alert.alert(("Autorenew! New scheduled date: " + reminder.scheduledDatetime));
    console.log("Autorenew has regenerated the reminder");
  }
  
  useEffect(() => {

    if(!initialized)
    {
      initVerifyStatus(reminder, isExpired, isChecked);
      setInitialized(initialized => !initialized);
      //console.log("Initialized saved reminder status");
    }
    // useRef value stored in .current property
    let checkReminderRenewalTimer = setTimeout(function tick() {
      //console.log('scanning for autorenewals');
      try{
        !isAutoRenewSwitchOn ? setExpired(() => calcTime (reminder.scheduledDatetime) < lockout ) : checkTimeforRenew();
      }
      catch (e)
      {
        console.log("Error while checking for autorenewals", e);
      }
      checkReminderRenewalTimer = setTimeout(tick, delay);
    }, delay);

    // clear on component unmount
    return () => {
      clearTimeout(checkReminderRenewalTimer);
    };
  }, []);
  

  let checkTimeforRenew = () => {
    
    if ( reminder == undefined || !reminder.isAutoRenewOn && calcTime(reminder.scheduledDatetime) < lockout )
    {
      return;
    }
    if( !reminder.isAutoRenewOn || reminder.isExpired || calcTime(reminder.scheduledDatetime) > delay * 0.5 )
    {
      return;
    }
    doAutoRenew();
  }

  function checkExpiration() {
    setExpired(() => calcTime (reminder.scheduledDatetime) < lockout );
    expiredCallback(reminder);
    isExpired ? clearNonLateNotifications() : {};
    return reminder.isExpired === ( calcTime (reminder.scheduledDatetime) < lockout );
  }
  
  const updateIsCompleted = useCallback(
    (
      reminder: Reminder,
      _isComplete: boolean,
    ): void => {
      realm.write(() => {
        reminder.isComplete = _isComplete;
        _isComplete ? reminder.isAutoRenewOn = false : {};
        _isComplete ? setAutoRenewSwitchOn(() => false) : {};
      });
    },
    [realm],
  );

  const toggleAutoRenew = useCallback(
    (
      _off,
      reminder: Reminder,
      _renewFreq,
      _renewDate,
    ): void => {
      realm.write(() => {
        reminder.isAutoRenewOn = !reminder.isAutoRenewOn;
        setAutoRenewSwitchOn(isAutoRenewSwitchOn => !isAutoRenewSwitchOn);
        reminder.autoRenewFreq = _renewFreq;
        setRenewFreq(_renewFreq);
        reminder.autoRenewDate = _renewDate;
        setRenewDate(new Date(addSeconds(reminder.scheduledDatetime, _renewFreq)));
      });
      console.log(reminder.isAutoRenewOn)
      console.log(reminder.autoRenewFreq)
      console.log(reminder.autoRenewDate)
    },
    [realm],
  );

  const updateAutoRenew = useCallback(
    (
      reminder: Reminder,
      _renewFreq,
      _renewDate,
    ): void => {
      realm.write(() => {
        reminder.autoRenewFreq = _renewFreq;
        setRenewFreq(_renewFreq);
        reminder.autoRenewDate = _renewDate;
        setRenewDate(() => _renewDate);
      });
      console.log(reminder.autoRenewFreq);
      console.log(reminder.autoRenewDate)
    },
    [realm],
  );

  const toggleSwitch = (amt = parseSeconds(SSOptions[0].value)) => {
    checkExpiration()
    if(isExpired) { return; }
    toggleAutoRenew(!isAutoRenewSwitchOn, reminder, amt, new Date(addSeconds(reminder.scheduledDatetime, amt)));
    if(isExpired) { return; }
    console.log("Toggled auto-renew date " + (reminder.isAutoRenewOn ? "set for " + reminder.autoRenewDate.toLocaleString() : "off"));
  }

  const parseSeconds = (val: string) => {
    let value = Number(val);
    return value * 3600;
  }

  const reverseParse = (val: number) => {
    let x = val / 3600;
    //x > 1 ? x = Math.trunc(x): {}; 
    for(var k = 0; k < SSOptions.length; k++){
      if (Number(SSOptions[k].value) == x)
      {
        return k;
      }
    }
    return 0;
  }
  
  const onPressSelSwitch = (value: string) => {
    let s = parseSeconds(value);
    updateAutoRenew(reminder, s, new Date(addSeconds(reminder.scheduledDatetime, s)));
    console.log("New auto-renew date set for ", reminder.autoRenewDate.toLocaleString());
    console.log("s =", s,"seconds");
    console.log("Renewfreq =", reminder.autoRenewFreq,"seconds");
  }
  
  async function refreshNotifications() {
    initVerifyStatus(reminder, isExpired, isChecked);
    if(!reminder.isAutoRenewOn)
    {
      Alert.alert("Auto-renew must be enabled to refresh notifications.");
      return;
    }
    let idStrings = [ reminder._id.toHexString() + '0', reminder._id.toHexString() + '1', reminder._id.toHexString() + '2', 
        reminder._id.toHexString() + '3', reminder._id.toHexString() + '4' ];

    try
    {
      notifee.cancelTriggerNotifications(idStrings);
      onRefreshNotification();
    }
    catch (e)
    {

    }
    finally
    {
      Alert.alert("Refreshed notifications. New date: " + reminder.scheduledDatetime);
      notifee.getTriggerNotificationIds().then(ids => console.log('Renewed notifications. All notification ids: ', ids));
    }
  }

  function clearNonLateNotifications() {
    clearNotifications(1, 4);
    Alert.alert("Cancelled all non-recurring notifications for this reminder");
  }

  function clearNotifications(y = 0, z = 5) {
    if(reminder == undefined)
    {
      return;
    }
    let idStrings = [ reminder._id.toHexString(), reminder._id.toHexString() + '0', reminder._id.toHexString() + '1', 
        reminder._id.toHexString() + '2', reminder._id.toHexString() + '3', reminder._id.toHexString() + '4' ];

    try
    {
      !y ? notifee.cancelTriggerNotifications(idStrings) : notifee.cancelTriggerNotifications(idStrings.slice(y, z));
    }
    catch(e)
    {
      console.log("id does not exist, skipping deletion", e);
    }
    finally
    {
      y ? console.log("clearing non-late notifications") : console.log("All notifications for this reminder have been deleted.");
    }
  }

  function onClearNotifyButton() {
    clearNotifications();
      Alert.alert("Cancelled all notifications for this reminder");
  }

  function onDeleteFunc() {
    toggleSwitch(0);
    //clearTimeout(checkReminderRenewalTimer);
    clearNotifications();
    onDelete();
    
  }
  function onSwipeLeftFunc() {
    toggleSwitch(0);
    //clearTimeout(checkReminderRenewalTimer);
    clearNotifications();
    onSwipeLeft();
  }

  function onSwipeRight() {
    /* don't notify on expired reminders
    *  notification timeout window = 59 minutes
    *  notifications past the current time will not be triggered
    */
    if (calcTime(reminder.scheduledDatetime) < -3550000)
    {
      Alert.alert("Cannot set notifications for an expired reminder past 1 hour.");
      return;
    }
    /* notify function goes here */
    onDisplayNotification();
    onCreateStackTriggerNotification();
    notifee.getTriggerNotificationIds().then(ids => console.log('Created trigger notifications. All scheduled notifications: ', ids));
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
        autoCancel: true,
        channelId,
        importance: AndroidImportance.DEFAULT,
        largeIcon: require('../../images/logo.png'),
        tag: "M gud",
        //chronometerDirection: 'down',
        showTimestamp: true,
        //showChronometer: true,
        timestamp: Date.now() + calcTime(reminder.scheduledDatetime),
      },
    });
    } catch(e)
    {
      //console.log("Reminder is already gone", e);
    }
  }

  async function onRefreshNotification() {

    let trigType = 0;
    let trigInterval = RepeatFrequency.WEEKLY;
    let DT = calcTime(reminder.scheduledDatetime) / 60000;
    
    
    // Create an interval trigger based on auto-renew rate
    const intertrigger: IntervalTrigger = {
      type: TriggerType.INTERVAL,
      interval: reminder.autoRenewFreq,     // MIN = 15
      timeUnit: TimeUnit.SECONDS,
    };
    
    // Create a new channel
    const channelId = await notifee.createChannel({
      id: 'Channel-4',
      name: 'Reminder Refresh',
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
    });

    try 
    {
    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        id: reminder._id.toHexString(),
        title: '<p style="color: #b57edc;"><b>'+reminder.title+'</span></p></b></p> &#128576;',
        subtitle: '<p style="color: #b48395;"><b>'+reminder.isComplete ? 'Recurring - Incomplete' : 'Recurring - Completed'+'</span></p></b></p>&#129395;',
        body: '<p style="color: #008c8d;">'+reminder.scheduledDatetime.toLocaleString()+'</p>',
        android: {
          autoCancel: false,
          channelId,
          category: AndroidCategory.ALARM,
          importance: AndroidImportance.HIGH,
          tag: reminder._id.toHexString(),
          chronometerDirection: 'down',
          showTimestamp: true,
          //showChronometer: true,
          timestamp: Date.now() + calcTime(reminder.scheduledDatetime),
          largeIcon: require('../../images/logo.png'),
          circularLargeIcon: true,
          ongoing: true,
          // actions: [
          //   {
          //     title: 'Swipe',
          //     icon: 'ic_small_icon',
          //     pressAction: {
          //       id: 'reminder',
          //     },
          //   },
          // ],
          fullScreenAction: {
            id: 'default',
          }
        },
      },
      intertrigger,
      );
      //notifee.getTriggerNotificationIds().then(ids => console.log('All trigger notifications: ', ids));
    } 
    catch(e) 
    {
      //console.log("Reminder is already gone", e);
    }
  }

  async function onCreateStackTriggerNotification(a = 0, b = 4, autoCancel = true, ongong = false) {
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
    
    for (let i = a; i <= b; i++) {
      try 
      {
        // Create a trigger notification
        if (i < 3)
        {
          await notifee.createTriggerNotification(
          {
            id: reminder._id.toHexString() + i.toString(),
            title: '<p style="color: #4caf50;"><b>'+reminder.title+'</span></p></b></p> &#128576;',
            body: reminder.scheduledDatetime.toLocaleString(),
            android: {
              autoCancel: true,
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
          //notifee.getTriggerNotificationIds().then(ids => console.log('All trigger notifications: ', ids));
        }
        else
        {
          await notifee.createTriggerNotification(
          {
            id: reminder._id.toHexString() + i.toString(),
            title: '<p style="color: #4caf50;"><b>'+reminder.title+'</span></p></b></p> &#128576;',
            subtitle: '<p style="color: #c9a0dc;"><b>'+reminder.isExpired ? 'Expired' : 'Upcoming' +'</span></p></b></p>&#129395;',
            body: reminder.scheduledDatetime.toLocaleString() + '&#129395;',
            android: {
              autoCancel,
              channelId: 'Channel-1',
              category: AndroidCategory.ALARM,
              importance: AndroidImportance.HIGH,
              largeIcon: require('../../images/logo.png'),
              circularLargeIcon: true,
              ongoing: i == 4 && ongong,
              tag: reminder._id.toHexString(),
              showTimestamp: true,
              timestamp: Date.now() + calcTime(reminder.scheduledDatetime),
              actions: [
                {
                  title: ongong? 'Swipe' : 'Options',
                  icon: 'ic_small_icon',
                  pressAction: {
                    id: 'reminder',
                  },
                  input: {
                    allowFreeFormInput: false, // set to false
                    choices: ongong? ['Swipe away to remove'] : ['Snooze', 'Renew', 'Delete'],
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
          //notifee.getTriggerNotificationIds().then(ids => console.log('All trigger notifications: ', ids));
        }
      }
      catch(e) 
      {
        //console.log("Reminder is already gone", e);
      }
      finally
      {
        
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
      android_ripple={{color: colors.subtle}}
    >
      <View style={styles.dateTimeContainer}>
        <View>
          <Text>{format(reminder.scheduledDatetime, "h:mm b")}</Text>
        </View>
        <View>
          <Text>{format(reminder.scheduledDatetime, "E MMMM d, yyyy")}</Text>
        </View>        
      </View>
      <View style={styles.task}>
        <View style={styles.content}>
          <View style={styles.titleInputContainer}>
            <MaterialIcons
              name='autorenew'
              size={20}
              style={{padding: 0}}
              onPress={() => {
                reminder.isAutoRenewOn ? clearNonLateNotifications() : onClearNotifyButton();
              }}
              onLongPress={() => {
                reminder.isAutoRenewOn ? refreshNotifications() : Alert.alert("This feature requires auto-renew to be on")
              }}
            />
            <View style={{width: 10}}/>
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
          {reminder.subtasks.length === 0 ? <View/> :
            <View style={styles.subtaskListContainer}>
              {reminder.subtasks.map((subtask) => 
                <Text style={styles.textStyle}>{subtask.title} {subtask.isComplete? "✓" : ""}</Text>
              )}
            </View>
          }
        </View>
        <View style={globalStyles.switchContainer}>
            <Text style={{color: (isExpired ? 'brown' : !isExpired && isAutoRenewSwitchOn ? 'green' : 'teal')}}>
              {isExpired ? "Reschedule to enable Auto-Renew" : isAutoRenewSwitchOn ? "Auto-Renew Interval" : "Auto-Renew OFF"}
            </Text>
            <Switch
              disabled = {isExpired}
              trackColor={{ false: "#767577", true: colors.mint }}
              thumbColor={!isExpired && isAutoRenewSwitchOn ? colors.brightteal : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => (isAutoRenewSwitchOn ? toggleSwitch(0) : toggleSwitch()) }
              value={!isExpired && isAutoRenewSwitchOn}
            />
            
        </View>      
        {!isExpired && isAutoRenewSwitchOn && (   // ignore the red lines lol...typescript things
          <SwitchSelector
            options={SSOptions}
            initial={reverseParse(reminder.autoRenewFreq)}
            textColor={colors.amethyst}
            selectedColor={colors.lightyellow}
            buttonColor={colors.heliotrope}
            borderColor={colors.mint}
            onPress={value => 
              onPressSelSwitch(value)
            }
          />
        )}    
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
    backgroundColor: colors.subtle,
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
