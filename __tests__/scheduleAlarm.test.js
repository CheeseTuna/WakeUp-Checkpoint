import { scheduleAlarm, cancelAlarm } from '../app/ScheduleAlarm';
import * as Notifications from 'expo-notifications';

jest.mock('expo-notifications');

describe('Schedule Alarm', () => {
  test('should schedule an alarm with correct time', async () => {
    const alarmTime = new Date('2024-08-06T08:00:00');
    await scheduleAlarm(alarmTime);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  test('should cancel an alarm', async () => {
    await cancelAlarm();

    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
  });
});
