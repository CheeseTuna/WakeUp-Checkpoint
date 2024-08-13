import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

TaskManager.defineTask('ALARM_TASK', async () => {
  console.log('Background task ALARM_TASK executed');
  try {
    const soundFiles = {
      emergency: require('../assets/sounds/emergency.wav'),
  
    };

  
    const alarmSound = await AsyncStorage.getItem('alarmSound');
    console.log('Retrieved alarm sound from AsyncStorage:', alarmSound);

    if (alarmSound && soundFiles[alarmSound]) {
      console.log('Creating sound object for:', alarmSound);
      const { sound } = await Audio.Sound.createAsync(soundFiles[alarmSound]);
      console.log('Sound object created:', sound);
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


export const registerBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync('ALARM_TASK', {
      minimumInterval: 1, 
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('ALARM_TASK registered successfully');
  } catch (err) {
    console.log('TaskManager registration failed:', err);
  }
};
