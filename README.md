# group5-reminders1

## Replace the contents of this file to make build work in your environment:

### android/gradle/wrapper/gradle-wrapper.properties


# Local version:

distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=file\:///S:\Installers/gradle-7.4-all.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists


# Replace with:

distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-7.4-all.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists


# Changelog

## Small UI tweaks
- Priority selection now clearly visible
- Can view limited body text, priority of note
- Notes can be toggle flagged with right swipe
- Added bouncy-checkbox as a UI competitor to rounded-checkbox - see subtasks

## Swiping
- Added functionality for up swipe and down swipe if needed
- Right swipe working with subtasks

## Notifications
- Placed reminder and subtask notifications in separate channels

## Bug Fixes
- Fixed a bug where opening the subtask modal also triggers a 'right swipe'
- Now it triggers a down swipe (unbound function)

## TODO
- Checkbox marking should cancel the associated notification(s)
- Intro Page
- UI fixes
- Settings
