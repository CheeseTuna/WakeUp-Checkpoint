import React, { useState } from 'react';
import { View, Text, Button, FlatList, Modal, TouchableOpacity, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const AlarmPage = () => {
  const [alarms, setAlarms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState(null);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedSound, setSelectedSound] = useState('');

  const addOrEditAlarm = () => {
    if (isEditing) {
      setAlarms(alarms.map((alarm, index) => (index === currentAlarm ? { time, sound: selectedSound } : alarm)));
    } else {
      setAlarms([...alarms, { time, sound: selectedSound }]);
    }
    resetModal();
  };

  const resetModal = () => {
    setModalVisible(false);
    setIsEditing(false);
    setCurrentAlarm(null);
    setTime(new Date());
    setSelectedSound('');
  };

  const editAlarm = (index) => {
    const alarm = alarms[index];
    setTime(new Date(alarm.time));
    setSelectedSound(alarm.sound);
    setCurrentAlarm(index);
    setIsEditing(true);
    setModalVisible(true);
  };

  const deleteAlarm = (index) => {
    setAlarms(alarms.filter((_, i) => i !== index));
  };

  const handleConfirm = (selectedDate = new Date()) => {
    setShowTimePicker(false);
    setTime(selectedDate || time);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Upcoming Alarms ({alarms.length})</Text>
      <FlatList
        data={alarms}
        renderItem={({ item, index }) => (
          <View style={{ padding: 10, marginBottom: 10, backgroundColor: '#222', borderRadius: 10 }}>
            <TouchableOpacity onPress={() => editAlarm(index)}>
              <Text style={{ fontSize: 36, color: 'white' }}>{moment(item.time).format('HH:mm')}</Text>
              <Text style={{ color: 'gray' }}>Every day</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: 'white' }}>Pause alarm</Text>
                <Switch value={true} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: 'white' }}>Alarm sound</Text>
                <Button title="Play" onPress={() => playSound(item.sound)} />
              </View>
            </TouchableOpacity>
            <Button title="Delete" onPress={() => deleteAlarm(index)} />
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
              <Button title={isEditing ? 'Save Alarm' : 'Set Alarm'} onPress={addOrEditAlarm} />
              <Button title="Cancel" onPress={resetModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default AlarmPage;
