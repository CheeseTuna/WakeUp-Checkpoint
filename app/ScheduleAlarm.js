// app/ScheduleAlarm.js
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ScheduleAlarm = ({ date = new Date(), showTimePicker = false }) => {
  const [selectedDate, setSelectedDate] = useState(date);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(showTimePicker);

  const scheduleAlarm = async () => {
    const trigger = new Date(date.getTime());

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Alarm!',
        body: 'Your alarm is going off!',
        sound: 'default', 
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
