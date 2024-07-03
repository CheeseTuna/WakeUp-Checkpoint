import React, { useState } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, Switch, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

const Alarm = () => {
  const initialAlarms = [
    { time: new Date().setHours(8, 0, 0, 0), sound: '', active: false, days: [] },
    { time: new Date().setHours(9, 0, 0, 0), sound: '', active: false, days: [] },
    { time: new Date().setHours(10, 0, 0, 0), sound: '', active: false, days: [] }
  ];

  const [alarms, setAlarms] = useState(initialAlarms);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState(null);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedSound, setSelectedSound] = useState('');
  const [activeDays, setActiveDays] = useState([]);

  const daysOfWeek = ['M', 'T', 'W', 'Th', 'Fr', 'S', 'Su'];

  const addOrEditAlarm = () => {
    const newAlarm = { time, sound: selectedSound, active: true, days: activeDays };
    if (isEditing) {
      setAlarms(alarms.map((alarm, index) => (index === currentAlarm ? newAlarm : alarm)));
    } else {
      setAlarms([...alarms, newAlarm]);
    }
    resetModal();
  };

  const resetModal = () => {
    setModalVisible(false);
    setIsEditing(false);
    setCurrentAlarm(null);
    setTime(new Date());
    setSelectedSound('');
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

  const toggleDay = (day) => {
    setActiveDays(activeDays.includes(day) ? activeDays.filter(d => d !== day) : [...activeDays, day]);
  };

  const activeAlarmsCount = alarms.filter(alarm => alarm.active).length;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#161622' }}>
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
              <Text style={{ color: 'gray' }}>Every day</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                {daysOfWeek.map((day, i) => (
                  <Text key={i} style={{
                    color: item.days.includes(day) ? 'orange' : 'gray',
                    marginHorizontal: 5
                  }}>{day}</Text>
                ))}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: 'white' }}>Alarm sound</Text>
                <Button title="Play" onPress={() => playSound(item.sound)} />
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
      <Button title="Add Alarm" onPress={() => setModalVisible(true)} />

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
                <Picker.Item label="Select Sound" value="" />
                <Picker.Item label="Beep" value="beep" />
                <Picker.Item label="Chime" value="chime" />
                <Picker.Item label="Alarm" value="alarm" />
              </Picker>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                {daysOfWeek.map((day, i) => (
                  <TouchableOpacity key={i} onPress={() => toggleDay(day)}>
                    <Text style={{
                      color: activeDays.includes(day) ? 'orange' : 'gray',
                      fontSize: 18,
                      marginHorizontal: 5
                    }}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Button title={isEditing ? 'Save Alarm' : 'Set Alarm'} onPress={addOrEditAlarm} />
              <Button title="Cancel" onPress={resetModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Alarm;
