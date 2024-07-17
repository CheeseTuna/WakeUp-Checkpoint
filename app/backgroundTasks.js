// app/backgroundTasks.js
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

TaskManager.defineTask('ALARM_TASK', async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Alarm!',
      body: 'Your alarm is going off!',
      sound: 'default', // Ensure sound is enabled
    },
    trigger: null,
  });
});

export const registerBackgroundTask = async () => {
  try {
    await TaskManager.unregisterAllTasksAsync();
    await TaskManager.registerTaskAsync('ALARM_TASK');
  } catch (err) {
    console.log('TaskManager registration failed:', err);
  }
};
