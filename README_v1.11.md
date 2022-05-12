
# Xenote Readme

Latest Version: **V1.11 (_Hello Xenote_ Beta)**

Now formally recognized as "Xenote" by the device, and uses a custom icon.

Now a proper **README** file. The changelog has been moved to _**changelog.md**_. [View this version's changelog](#abridged-changelog)

# **User Manual**

Welcome to Xenote!

## Setup

## System Requirements

At this time, Xenote is only compatible with Android devices.

Make sure your device's OS has been updated to Android 11+ to be able to use SDK Level 30+.

Extremely outdated devices may run into memory or performance issues.

Xenote has been tested and is working on Android emulators, though performance depends on the host machine.

There are some [known issues](#known-issues) regarding program stability and performance.

### Setup React Native Android Environment

1) Follow the React Native CLI Quickstart instructions on [https://reactnative.dev/docs/environment-setup]

    Make sure the Development OS matches your system and the Target OS is set to Android

    Make sure Android Studio is installed and environment variables are set properly

    Prepare the Android device depending on physical or virtual

    Follow the command-line instructions below

### Inside terminal or Administrator Windows PowerShell (elevated permissions required)

cd (your folder with Xenote)

npm i react-native (if not installed)

Open a second terminal window and cd to the same path

Run the following commands:

    First terminal) npm react-native start

    Second terminal) npx react-native run-android

For troubleshooting help, please refer to [Troubleshooting](#troubleshooting)

# Using Xenote

Xenote's main features can be categorized into [Notes](#notes), [Reminders](#reminders) and [Subtasks](#subtasks-screen).

In addition, each makes use of [Swipe Commands](#swipe-commands).

[Notifications](#notifications) can be set for [Reminders](#reminder-notifications) and [Subtasks](#subtask-notifications).

Auto-renew and auto-refresh for reminders is explained [here](#automated-features).

The note search engine is explained [here](#searching-notes).

## **Notifications**

(Android) To view push notifications, you must enable **"Pop on screen"** for each notification channel (5 channels total) in your device's app notification settings for Xenote.

Make sure **"All Xenote notifications"** and **"Allow notification dot"** are enabled.

Notification permissions must also be granted by your device.

You can now respond to notifications with action buttons.

## **Reminders**

### Reminders Screen

To create a new reminder, press the **+** button at the bottom of the screen.

This will bring you to the subtask page for that reminder.

While on the reminders page, subtask titles will show inside each reminder card along with a check mark if the subtask is complete.

A progress bar above each reminder shows the percentage of its subtasks which have been completed. The progress bar refreshes after a few seconds when this value changes.

You can toggle the reminder's own completion status by checking and unchecking the _green circle_ on the right edge of the reminder card.

To toggle showing and hiding completed reminders, click the switch at the top right of the screen.

To cancel notifications for a single reminder, click the _bell_ icon on the left edge of the reminder card.

You can **delete all reminders, subtasks and notifications** at once by pressing the trash can icon and confirming the prompt. **WARNING: this action cannot be undone.** You can also let the app flip a coin to decide whether or delete or not.

#### Automated Features

To toggle auto-renew, click the _auto-renew_ switch at the bottom of the reminder. Note that long-expired reminders (~55+ min) have this option disabled.

The default interval for auto-renew is one hour. You can change the interval by selecting any of the available options. Options range from 1 hour to 1 year.

Press the _auto-refresh_ icon on the left side of the notification to enable auto-refresh. Auto-refresh syncs auto-renewing reminders with auto-renewing notifications by matching their timestamps. Auto-refresh functionality requires auto-renew to be turned on.

#### Reminder Notifications

_Right swipe_ to turn on notifications for a reminder.

The _bell_ icon clears all trigger notifications for a particular reminder when pressed. For more on notifications, see [Notifications](#notifications).

To cancel _all trigger notifications_ for reminders and subtasks, press the clear notification icon at the top left of the screen.

To clear _**all notifications**_ regardless of type, long press (press and hold) the clear notification icon until the alert appears.

### Subtasks Screen

From here you can create new subtasks using the same **+** button.

When you create a subtask, you will be brought to a modal where you can enter fields for title, feature, value and a scheduled date and time. These properties will display on each subtask card after exiting the editing modal.

You can edit a subtask at any time and bring up the edit modal by long pressing the subtask card.

You can also set a title and scheduled date for the reminder using the header bar.

To go back to reminders, click the back arrow at the top left corner **(<-)**.

To toggle the subtask's complete/incomplete status, press the _green circle_ on the right edge of the subtask card.

To toggle whether to hide or show completed subtasks, click the switch at the top above the subtask cards.

#### Subtask Notifications

As with reminders, _right swipe_ to turn on notifications for a subtask.

To cancel notifications for a particular subtask, press the _bell_ icon on the left side of the subtask card.

## **Notes**

From the Reminders page, cick the Notes button at the top of the screen to activate the Notes tab.

You can create a new note with the **+** button at the bottom center-right.

From here you can assign values to each note property. Every field is optional (priority has a default value of 5).

You can add or delete tags one at a time. Do not include the '#' symbol when creating tags unless you want a single tag to display multiple hash symbols. Duplicate tags are also prevented.

You can edit note properties at any time by long pressing the note card.

### Note Commands

To toggle a note's flag status, right swipe the note card.

To pin or unpin the note, click the thumbtack icon on the top right of the Note card. Pinned notes are always shown above unpinned notes.

Notes are sorted by default according to priority. You can adjust this using the "Sort by" dropdown menu, and switch between ascending and descending order. Tag sort is not yet available.

The search bar allows for both general and specific search queries. Refer to the [instructions on searching notes](#searching-notes). [Numerical searching](#number-search) and various [String searching options](#string-search) are both supported.

Tap the trash can icon at the bottom left to view a warning about permanent deletion. Press the trash can icon and confirm your choice to delete all notes. You can also let the app decide whether or delete or save all notes based on random chance.

### Searching Notes

**As of Version 1.10, all search queries except for those beginning with 'case:' or 'EXACT:' are _not_ case-sensitive**.

#### Number Search

To search notes for **priority**, begin the query with '**P:**', followed by a number from **1-10**. Exact matches only

To search notes for **content size**, begin the query with '**S:**', followed by the desired size threshold. Search will return all notes whose body content contains at least this many characters. Note that line breaks and whitespace inside the body content both contribute to this size.

To search notes for **both** of these numerical values at the same time, begin the query with '**N:**'. This is not as useful as either of the individual searches unless note body content size is very small.

#### String Search

To use **hashtag search**, simply begin the query with "**#**". For example, if you want to search for tags named **Gud**, search for "**#Gud**".

To search notes for **ANY** terms, begin the query with '**any:**' followed by at least two whitespace-delimited terms. Search will return all notes whose content matches any of the terms.

To search with **case-sensitive enforcement**, begin the query with '**case:**', followed by the search term or phrase. Search will enforce upper and lower case matching, though not exact matches.

_**Exact match search**_ comes with a case-sensitive sub-option.

For the _case sensitive option_: begin the query with "**EXACT:**" followed by a single keyword.

_Normal option_: begin the query with "**exact:**" (or any non-all-caps) followed by a single keyword.

To use **general search**, type in any word or phrase without beginning the query with any of the above delimiters.

A **search header** at the top of the note cards keeps track of how many search results are found.

## **Swipe Commands**

**Left Swipe** on the card to **delete** the Note / Reminder / Subtask

**Right Swipe:**

For **notes**, _toggles the flag status on/off_ for the note _(can be used as a sorting option)_

For **reminders and subtasks**, _turns notifications on_. This option is not available to reminders or subtasks that expired over an hour ago.

## Troubleshooting

### Known Issues

The app can suddenly crash at random. This typically happens after installing or updating the app. Emulators seem to be more prone to crashing.

Too many automated reminders / notifications may increase the risk of crashing, though this has not been confirmed.

No data is lost but it is annoyingly common behavior that will certainly need to be resolved at some point.

After Xenote has been open a while or reopened a few times it tends to settle down and be more stable.

### Gradle troubleshooting

#### If you get an OutOfMemoryError, try the following fix

Inside [android/gradle.properties](./android/gradle.properties)

Uncomment this line

**#** **org.gradle.jvmargs=-Xmx12048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8**

## Abridged Changelog

For full revision notes, see the [changelog.md](changelog.md)

### What's on the Horizon

Improving app stability by focusing on testing and debugging

Code still in need of cleaning and debugging

Design a better app icon

User Settings

Help Screen

Smart features?

### *** General Update 5-11 (Beta v1.11)

#### Bug Fixes

##### **FIXED THE SUBTASK MODAL BUG**

**Improved syncing of autorenew after the device has been turned off a long time (such as an emulator). Delete / turn off the currently autorenewed reminders and remake them if the app crashes (new reminders won't crash)**.

Duplicate tags are now properly prevented from being added.

**Attached background and foreground notifee event listeners so that warning appear anymore**.

Resolved some typescript error markers.

**Fixed a bug where tag search stopped working**.

#### Feature Enhancements

This part is a side effect of adding the notifee event handlers. Notification actions now work: snoozing, dismissing (deleting), and daily + weekly reminders for subtasks

Progress bar thingy added to reminders

Reminders now display a completion metric based on the % of completed subtasks

Vastly expanded search options and improved accuracy. Full details below

Added a Delete All function to notes and reminders (press the trash can icon and confirm your choice, or let Xenote flip a coin). WARNING: this action cannot be undone.

#### Made search engine more extensible

Can now look up priority and size attributes separately, or both at the same time

Begin query with:

P: priority search (==)

S: size (length) of body content (>= threshold)

N: search both attributes

Returns no results now if matches are not found/thresholds are not met, instead of defaulting to normal search.

Now you can search for numerical phrases within the note's contents without interference.

Added a way to search for any terms in the phrase. Begin the query with "ANY:" followed by whitespace-delimited search terms.

Added a case-sensitive search which behaves the same as general search, but with added case enforcement.

Added a way to search for exact matches. Also has a case-sensitive sub-option.

For the case sensitive option: begin the query with "EXACT:" followed by a single keyword.

Normal option: begin the query with "exact:" followed by a single keyword.

Added a search header to display the number of results found. It shows when the user dismisses the keyboard or presses away from the search bar.

#### Other Odds and Ends

Improved presentation and spacing of the Edit Note UI.

You can now delete tags from notes.

Cleaned up some loose code.

Custom icons added (may need another size for play store).

#### New packages

Progress Bar

npm i react-native-progress --save     or      yarn add react-native-progress

[https://github.com/oblador/react-native-progress]

I didn't install the SVG package which adds pie and circle bars. Try at your own risk
