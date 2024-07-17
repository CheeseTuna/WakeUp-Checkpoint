// app/backgroundTasks.js
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the background task
TaskManager.defineTask('ALARM_TASK', async () => {
  console.log('Background task ALARM_TASK executed');
  try {
    const soundFiles = {
      emergency: require('../assets/sounds/emergency.wav'),
      beep: require('../assets/sounds/beep.wav'),
      chime: require('../assets/sounds/chime.wav'),
      alarm: require('../assets/sounds/alarm.wav'),
    };

    // Retrieve the alarm sound from storage
    const alarmSound = await AsyncStorage.getItem('alarmSound');
    console.log('Retrieved alarm sound from AsyncStorage:', alarmSound);

    if (alarmSound && soundFiles[alarmSound]) {
      const { sound } = await Audio.Sound.createAsync(soundFiles[alarmSound]);
      console.log('Playing sound:', alarmSound);
      await sound.playAsync();
      console.log('Sound played successfully');
      return BackgroundFetch.Result.NewData;
    } else {
      console.log('No valid alarm sound found or sound file missing.');
      return BackgroundFetch.Result.Failed;
    }
  } catch (error) {
    console.error('Failed to execute ALARM_TASK:', error);
    return BackgroundFetch.Result.Failed;
  }
});

// Register the background task
export const registerBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync('ALARM_TASK', {
      minimumInterval: 1, // 1 minute for testing
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('ALARM_TASK registered successfully');
  } catch (err) {
    console.log('TaskManager registration failed:', err);
  }
};
