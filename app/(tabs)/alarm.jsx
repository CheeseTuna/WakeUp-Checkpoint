import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  Switch,
  Button,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import { Audio } from "expo-av";
import moment from "moment";
import { databases, account } from "../services/appwrite";
import { Query } from "appwrite";

const Alarm = () => {
  const [alarms, setAlarms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState(null);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedSoundDocumentId, setSelectedSoundDocumentId] = useState(
    "66b94f5900329d9d770a"
  ); // Set default value here
  const [selectedSound, setSelectedSound] = useState("Emergency");
  const [activeDays, setActiveDays] = useState([]);
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState("");
  const [playingAlarmIndex, setPlayingAlarmIndex] = useState(null);

  const daysOfWeek = ["M", "Tu", "W", "Th", "F", "S", "Su"];

  useEffect(() => {
    if (sound) {
      return () => {
        sound.unloadAsync();
      };
    }
  }, [sound]);

  const getUserId = async () => {
    try {
      const user = await account.get();
      return user.$id;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAlarms = async () => {
      const userId = await getUserId();
      if (!userId) return;

      try {
        const response = await databases.listDocuments(
          "66797b11000ca7e40dcc",
          "66b93cdd001f6d14a27e",
          [Query.equal("userId", userId)]
        );
        setAlarms(response.documents);
      } catch (error) {
        console.error("Failed to fetch alarms:", error);
      }
    };

    fetchAlarms();
  }, []);

  const playSound = async (soundName, index) => {
    try {
      if (
        isPlaying &&
        currentSound === soundName &&
        playingAlarmIndex === index
      ) {
        await sound.stopAsync();
        setIsPlaying(false);
        setPlayingAlarmIndex(null);
        return;
      }

      let soundFile;
      switch (soundName) {
        case "Emergency":
          soundFile = require("../../assets/sounds/emergency.wav");
          break;
        // Add more cases as needed
        default:
          console.error("Sound file not found for:", soundName);
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
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const addOrEditAlarm = async () => {
    const userId = await getUserId();
    if (!userId) return;
    console.log("Current selectedSoundDocumentId:", selectedSoundDocumentId);
    if (!selectedSoundDocumentId) {
      console.error("soundId is undefined or null.");
      return;
    }

    const newAlarm = {
      time: time.toISOString(),
      soundId: selectedSoundDocumentId,
      active: true,
      days: activeDays,
      userId: userId,
    };

    try {
      if (isEditing) {
        const alarmId = alarms[currentAlarm].$id;
        await databases.updateDocument(
          "66797b11000ca7e40dcc",
          "66b93cdd001f6d14a27e",
          alarmId,
          newAlarm
        );
      } else {
        await databases.createDocument(
          "66797b11000ca7e40dcc",
          "66b93cdd001f6d14a27e",
          "unique()",
          newAlarm
        );
      }

      const response = await databases.listDocuments(
        "66797b11000ca7e40dcc",
        "66b93cdd001f6d14a27e",
        [Query.equal("userId", userId)]
      );
      const updatedAlarms = response.documents;
      setAlarms(updatedAlarms);

      scheduleAlarm(newAlarm, updatedAlarms.length - 1);
    } catch (error) {
      console.error("Failed to save alarm:", error);
    }

    resetModal();
  };

  const deleteAlarm = async (index) => {
    const userId = await getUserId();
    if (!userId) return;

    try {
      const alarmId = alarms[index].$id;
      await databases.deleteDocument(
        "66797b11000ca7e40dcc",
        "66b93cdd001f6d14a27e",
        alarmId
      );
      setAlarms(alarms.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Failed to delete alarm:", error);
    }
  };

  const resetModal = () => {
    setModalVisible(false);
    setIsEditing(false);
    setCurrentAlarm(null);
    setTime(new Date());
    setSelectedSound("Emergency");
    setActiveDays([]);
    setSelectedSoundDocumentId("66b94f5900329d9d770a"); // Reset to default value or null if needed
  };

  const editAlarm = (index) => {
    const alarm = alarms[index];
    setTime(new Date(alarm.time));
    setSelectedSoundDocumentId(alarm.soundId); // Correctly set the selected sound ID when editing
    setActiveDays(alarm.days);
    setCurrentAlarm(index);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleConfirm = (selectedDate) => {
    setShowTimePicker(false);
    setTime(selectedDate || time);
  };

  const toggleAlarm = (index) => {
    setAlarms(
      alarms.map((alarm, i) =>
        i === index ? { ...alarm, active: !alarm.active } : alarm
      )
    );
  };

  const toggleModalDay = (day) => {
    setActiveDays(
      activeDays.includes(day)
        ? activeDays.filter((d) => d !== day)
        : [...activeDays, day]
    );
  };

  const toggleDay = (day, index) => {
    setAlarms(
      alarms.map((alarm, i) =>
        i === index
          ? {
              ...alarm,
              days: alarm.days.includes(day)
                ? alarm.days.filter((d) => d !== day)
                : [...alarm.days, day],
            }
          : alarm
      )
    );
  };

  const scheduleAlarm = async (alarm, index) => {
    const currentTime = new Date().getTime();
    const alarmTime = new Date(alarm.time).getTime();

    if (alarmTime <= currentTime) {
      console.log("Alarm time has already passed.");
      return;
    }

    const timeDifference = alarmTime - currentTime;

    setTimeout(async () => {
      if (alarm.active) {
        try {
          const soundDocument = await databases.getDocument(
            "66797b11000ca7e40dcc",
            "66797ba40026e00acb05",
            alarm.soundId
          );

          const soundName = soundDocument.name;
          playSound(soundName, index);
        } catch (error) {
          console.error("Failed to fetch sound document:", error);
        }
      }
    }, timeDifference);
  };

  const activeAlarmsCount = alarms.filter((alarm) => alarm.active).length;

  const getDisplayDays = (days) => {
    if (days.length === 0) return "Every day";
    const dayNames = {
      M: "Monday",
      Tu: "Tuesday",
      W: "Wednesday",
      Th: "Thursday",
      F: "Friday",
      S: "Saturday",
      Su: "Sunday",
    };
    return days.map((day) => dayNames[day]).join(", ");
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop: 40,
        backgroundColor: "#161622",
      }}
    >
      <Text style={{ fontSize: 24, color: "white", marginBottom: 20 }}>
        Upcoming Alarms ({activeAlarmsCount})
      </Text>
      <FlatList
        data={alarms}
        renderItem={({ item, index }) => (
          <View
            style={{
              padding: 10,
              marginBottom: 10,
              backgroundColor: item.active ? "#222" : "#555",
              borderRadius: 10,
            }}
          >
            <TouchableOpacity onPress={() => editAlarm(index)}>
              <Text style={{ fontSize: 36, color: "white" }}>
                {moment(item.time).format("HH:mm")}
              </Text>
              <Text style={{ color: "gray" }}>{getDisplayDays(item.days)}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                {daysOfWeek.map((day, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => toggleDay(day, index)}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: item.days.includes(day)
                          ? "orange"
                          : "gray",
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: 5,
                      }}
                    >
                      <Text style={{ color: "white" }}>{day}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "white" }}>Alarm sound</Text>
                <Button
                  title={
                    isPlaying &&
                    currentSound === item.sound &&
                    playingAlarmIndex === index
                      ? "Stop"
                      : "Play"
                  }
                  onPress={() => playSound(item.sound, index)}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Switch
                value={item.active}
                onValueChange={() => toggleAlarm(index)}
                thumbColor={item.active ? "orange" : "gray"}
              />
              <Button title="Delete" onPress={() => deleteAlarm(index)} />
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          backgroundColor: "orange",
          width: 100,
          height: 100,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          marginTop: 20,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ fontSize: 24, color: "white" }}>+</Text>
      </TouchableOpacity>

      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={resetModal}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: 300,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                {isEditing ? "Edit Alarm" : "Set Alarm"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={{ marginBottom: 10 }}
              >
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: 10,
                    borderRadius: 5,
                    textAlign: "center",
                  }}
                >
                  {moment(time).format("HH:mm")}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showTimePicker}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={() => setShowTimePicker(false)}
              />
              <Picker
                selectedValue={selectedSoundDocumentId}
                style={{ height: 50, width: 250 }}
                onValueChange={(itemValue) => {
                  console.log("Selected Sound Document ID:", itemValue); // Debugging log
                  setSelectedSoundDocumentId(itemValue);
                }}
              >
                <Picker.Item label="Emergency" value="66b94f5900329d9d770a" />
                {/* <Picker.Item label="Chime" value="soundDocumentId2" /> */}
                {/* Add more Picker.Item elements with actual document IDs */}
              </Picker>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginVertical: 10,
                }}
              >
                {daysOfWeek.map((day, i) => (
                  <TouchableOpacity key={i} onPress={() => toggleModalDay(day)}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: activeDays.includes(day)
                          ? "orange"
                          : "gray",
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: 5,
                      }}
                    >
                      <Text style={{ color: "white" }}>{day}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 10,
                }}
              >
                <Button
                  title={
                    isPlaying &&
                    currentSound === selectedSound &&
                    playingAlarmIndex === null
                      ? "Stop"
                      : "Play"
                  }
                  onPress={() => playSound(selectedSound, null)}
                />
                <Button title="Cancel" onPress={resetModal} />
                <Button
                  title={isEditing ? "Save" : "Add"}
                  onPress={addOrEditAlarm}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Alarm;
