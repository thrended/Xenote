
# Warning: Although the overwritten gradle files are based on the original repo, backup your folder just incase

## This archive only contains files that were directly modified during the push notification installation

### I included some code snippets below

## Code modifications for Push Notifications in ReminderItem.tsx

import...
...
import PushNotification from "react-native-push-notification";
...

function ReminderItem({..
..
..
}: ReminderItemProps) {

...

  const handleNotification = () => {
    PushNotification.localNotification({
      channelId: "Notif-test-1",
      title: "Test notification succession",
      message: "You clicked on a pressable reminder",
    });
  }

  const scheduleNotification = (item?: any) => {
    handleNotification();
    PushNotification.localNotificationSchedule({
      date: new Date(Date.now() + 10 * 1000),
      allowWhileIdle: true,
      repeatType: 'time',
      repeatTime: 10000,  
      channelId: "Notif-test-1",
      title: "Scheduled notification success",
      message: "This reminder will reappear every 10 seconds",
  });
  }

return (
    <Pressable
      onPress={() => scheduleNotification() }
      onLongPress={() => handleNavigation(reminder)}
      onTouchStart={onTouchStart} 
      onTouchEnd={onTouchEnd}
      hitSlop={{ top: 0, bottom: 0, right: 0, left: 0}}
      android_ripple={{color:'#00f'}}
    >
      <View style={styles.task}>
        <View style={styles.content}>
          <View style={styles.titleInputContainer}>
            <Text style={styles.textTitle}>{reminder.title}</Text>
          </View>
          <View style={styles.subtaskListContainer}>
            {reminder.subtasks.map((subtask) => 
              <Text style={styles.textStyle}>{subtask.title}</Text>
            )}
          </View>
        </View>
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

## Adding a button to RemindersListScreen.tsx to cancel all notifications

imports...
import PushNotification from "react-native-push-notification";

[...other code ]

return (
    <SafeAreaView style={styles.screen}>
      {/* <NewReminderHeaderBar onSubmit={() => {}} /> */}
      <View style={[{flexDirection: 'row', justifyContent: 'space-around', padding: 10}]} >
      <Pressable
        style={[styles.button, styles.buttonClose, {backgroundColor: (window ? '#ee6e73' : '#22E734')}]}
        onPress={() => {
          setWindow(false);
        }}
      >
          <Text style={styles.textStyle}>Notes</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.buttonClose, {backgroundColor: '#77c7cc'}]}
        onPress={() => { 
          PushNotification.getScheduledLocalNotifications(console.log);
          PushNotification.cancelAllLocalNotifications();
        }}
      >
        <Text style={styles.textStyle}>
          Cancel all notifications
        </Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.buttonClose, {backgroundColor: (window ? '#22E734' : '#ee6e73')}]}
        onPress={() => {
          setWindow(true);
        }}
      >
          <Text style={styles.textStyle}>Reminders</Text>
      </Pressable>
      </View>
      [...other code]
