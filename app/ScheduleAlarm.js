// app/ScheduleAlarm.js
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ScheduleAlarm = () => {
  const [date, setDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const scheduleAlarm = async () => {
    const trigger = new Date(date.getTime());

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Alarm!',
        body: 'Your alarm is going off!',
        sound: 'default', // Ensure sound is enabled
      },
      trigger: {
        date: trigger,
      },
    });
  };

  const handleConfirm = (selectedDate) => {
    setShowTimePicker(false);
    setDate(selectedDate || date);
  };

  return (
    <View>
      <Button title="Pick Time" onPress={() => setShowTimePicker(true)} />
      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => setShowTimePicker(false)}
      />
      <Button title="Schedule Alarm" onPress={scheduleAlarm} />
    </View>
  );
};

export default ScheduleAlarm;
