import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, Switch, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { Audio } from 'expo-av';
import moment from 'moment';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerBackgroundTask } from '../backgroundTasks';

const Alarm = () => {
  const initialAlarms = [
    { time: new Date().setHours(8, 0, 0, 0), sound: 'emergency', active: false, days: [] },
    { time: new Date().setHours(9, 0, 0, 0), sound: 'emergency', active: false, days: [] },
    { time: new Date().setHours(10, 0, 0, 0), sound: 'emergency', active: false, days: [] }
  ];

  const [alarms, setAlarms] = useState(initialAlarms);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState(null);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedSound, setSelectedSound] = useState('emergency');
  const [activeDays, setActiveDays] = useState([]);
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState('');
  const [playingAlarmIndex, setPlayingAlarmIndex] = useState(null);

  const daysOfWeek = ['M', 'Tu', 'W', 'Th', 'F', 'S', 'Su'];

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async (soundName, index) => {
    if (isPlaying && currentSound === soundName && playingAlarmIndex === index) {
      await sound.stopAsync();
      setIsPlaying(false);
      setPlayingAlarmIndex(null);
      return;
    }

    let soundFile;
    switch (soundName) {
      case 'emergency':
        soundFile = require('../../assets/sounds/emergency.wav');
        break;
      default:
        return;
    }

    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    setCurrentSound(soundName);
    setIsPlaying(true);
    setPlayingAlarmIndex(index);
    await newSound.playAsync();
  };

  const addOrEditAlarm = async () => {
    const newAlarm = { time, sound: selectedSound, active: true, days: activeDays };
    if (isEditing) {
      setAlarms(alarms.map((alarm, index) => (index === currentAlarm ? newAlarm : alarm)));
    } else {
      setAlarms([...alarms, newAlarm]);
    }
    await AsyncStorage.setItem('alarmSound', selectedSound);
    scheduleAlarm(newAlarm);
    resetModal();
  };

  const scheduleAlarm = async (alarm) => {
    const now = new Date();
    const trigger = new Date(alarm.time);
    if (trigger > now) {
      const delay = trigger.getTime() - now.getTime();
      console.log('Scheduling alarm to trigger in:', delay, 'milliseconds');
      setTimeout(() => {
        console.log('Triggering alarm immediately for testing');
        registerBackgroundTask();
      }, delay);
    }
  };

  const resetModal = () => {
    setModalVisible(false);
    setIsEditing(false);
    setCurrentAlarm(null);
    setTime(new Date());
    setSelectedSound('emergency');
    setActiveDays([]);
  };

  const editAlarm = (index) => {
    const alarm = alarms[index];
    setTime(new Date(alarm.time));
    setSelectedSound(alarm.sound);
    setActiveDays(alarm.days);
    setCurrentAlarm(index);
    setIsEditing(true);
    setModalVisible(true);
  };

  const deleteAlarm = (index) => {
    setAlarms(alarms.filter((_, i) => i !== index));
  };

  const handleConfirm = (selectedDate) => {
    setShowTimePicker(false);
    setTime(selectedDate || time);
  };

  const toggleAlarm = (index) => {
    setAlarms(alarms.map((alarm, i) => (i === index ? { ...alarm, active: !alarm.active } : alarm)));
  };

  const toggleModalDay = (day) => {
    setActiveDays(activeDays.includes(day) ? activeDays.filter(d => d !== day) : [...activeDays, day]);
  };

  const toggleDay = (day, index) => {
    setAlarms(alarms.map((alarm, i) =>
      i === index ? { ...alarm, days: alarm.days.includes(day) ? alarm.days.filter(d => d !== day) : [...alarm.days, day] } : alarm
    ));
  };

  const activeAlarmsCount = alarms.filter(alarm => alarm.active).length;

  const getDisplayDays = (days) => {
    if (days.length === 0) return 'Every day';
    const dayNames = {
      'M': 'Monday',
      'Tu': 'Tuesday',
      'W': 'Wednesday',
      'Th': 'Thursday',
      'F': 'Friday',
      'S': 'Saturday',
      'Su': 'Sunday'
    };
    return days.map(day => dayNames[day]).join(', ');
  };

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 40, backgroundColor: '#161622' }}>
      <Text style={{ fontSize: 24, color: 'white', marginBottom: 20 }}>Upcoming Alarms ({activeAlarmsCount})</Text>
      <FlatList
        data={alarms}
        renderItem={({ item, index }) => (
          <View style={{
            padding: 10,
            marginBottom: 10,
            backgroundColor: item.active ? '#222' : '#555',
            borderRadius: 10
          }}>
            <TouchableOpacity onPress={() => editAlarm(index)}>
              <Text style={{ fontSize: 36, color: 'white' }}>{moment(item.time).format('HH:mm')}</Text>
              <Text style={{ color: 'gray' }}>{getDisplayDays(item.days)}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                {daysOfWeek.map((day, i) => (
                  <TouchableOpacity key={i} onPress={() => toggleDay(day, index)}>
                    <View style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: item.days.includes(day) ? 'orange' : 'gray',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 5
                    }}>
                      <Text style={{ color: 'white' }}>{day}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: 'white' }}>Alarm sound</Text>
                <Button title={isPlaying && currentSound === item.sound && playingAlarmIndex === index ? "Stop" : "Play"} onPress={() => playSound(item.sound, index)} />
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Switch
                value={item.active}
                onValueChange={() => toggleAlarm(index)}
                thumbColor={item.active ? 'orange' : 'gray'}
              />
              <Button title="Delete" onPress={() => deleteAlarm(index)} />
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'orange',
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 20
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ fontSize: 24, color: 'white' }}>+</Text>
      </TouchableOpacity>

      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={resetModal}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>{isEditing ? 'Edit Alarm' : 'Set Alarm'}</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{ marginBottom: 10 }}>
                <Text style={{ borderWidth: 1, borderColor: 'gray', padding: 10, borderRadius: 5, textAlign: 'center' }}>
                  {moment(time).format('HH:mm')}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showTimePicker}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={() => setShowTimePicker(false)}
              />
              <Picker
                selectedValue={selectedSound}
                style={{ height: 50, width: 250 }}
                onValueChange={(itemValue) => setSelectedSound(itemValue)}
              >
                <Picker.Item label="Emergency" value="emergency" />
              </Picker>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                {daysOfWeek.map((day, i) => (
                  <TouchableOpacity key={i} onPress={() => toggleModalDay(day)}>
                    <View style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: activeDays.includes(day) ? 'orange' : 'gray',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 5
                    }}>
                      <Text style={{ color: 'white' }}>{day}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <Button title={isPlaying && currentSound === selectedSound && playingAlarmIndex === null ? "Stop" : "Play"} onPress={() => playSound(selectedSound, null)} />
                <Button title="Cancel" onPress={resetModal} />
                <Button title={isEditing ? "Save" : "Add"} onPress={addOrEditAlarm} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Alarm;
