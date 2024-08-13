import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  Switch,
  Button,
  Image,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import { Audio } from "expo-av";
import moment from "moment";
import { databases, account } from "../services/appwrite";
import { Query, ID } from "appwrite";
import { Pedometer } from "expo-sensors";
import { TextInput } from "react-native";

const Alarm = () => {
  const [alarms, setAlarms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState(null);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedSoundDocumentId, setSelectedSoundDocumentId] = useState(
    "66b94f5900329d9d770a"
  );
  const [selectedSound, setSelectedSound] = useState("Emergency");
  const [activeDays, setActiveDays] = useState([]);
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState("");
  const [playingAlarmIndex, setPlayingAlarmIndex] = useState(null);
  const [triggeredAlarm, setTriggeredAlarm] = useState(null);
  const [alarmTriggerModalVisible, setAlarmTriggerModalVisible] =
    useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [stepGoal, setStepGoal] = useState(0);

  const daysOfWeek = ["M", "Tu", "W", "Th", "F", "S", "Su"];

  const toggleDay = (day, index) => {
    const updatedAlarms = alarms.map((alarm, i) => {
      if (i === index) {
        if (alarm.days.includes(day)) {
          return {
            ...alarm,
            days: alarm.days.filter((d) => d !== day),
          };
        } else {
          return {
            ...alarm,
            days: [...alarm.days, day],
          };
        }
      }
      return alarm;
    });

    setAlarms(updatedAlarms);
  };

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
    let subscribe;

    const startStepCount = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      console.log("Pedometer available:", isAvailable);

      if (isAvailable) {
        subscribe = Pedometer.watchStepCount((result) => {
          console.log("Steps counted:", result.steps);
          setStepCount(result.steps);
        });
      } else {
        alert("Pedometer not available on this device.");
      }
    };

    startStepCount();

    return () => {
      if (subscribe) {
        subscribe.remove();
      }
    };
  }, []);

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

  const playSound = async (name, index, showModal = true) => {
    try {
      if (isPlaying && currentSound === name && playingAlarmIndex === index) {
        await sound.stopAsync();
        setIsPlaying(false);
        setPlayingAlarmIndex(null);
        setAlarmTriggerModalVisible(false);
        return;
      }

      let soundFile;
      switch (name) {
        case "Emergency":
          soundFile = require("../../assets/sounds/emergency.wav");
          break;
        case "chicken_toy":
          soundFile = require("../../assets/sounds/chicken_toy.mp3");
          break;

        default:
          console.error("Sound file not found for:", name);
          return;
      }

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(soundFile, {
        isLooping: true,
      });
      setSound(newSound);
      setCurrentSound(name);
      setIsPlaying(true);
      setPlayingAlarmIndex(index);
      await newSound.playAsync();

      if (showModal) {
        setTriggeredAlarm(index);
        setAlarmTriggerModalVisible(true);
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const addOrEditAlarm = async () => {
    const userId = await getUserId();
    if (!userId) return;

    const validStepCount = Math.min(Math.max(parseInt(stepGoal, 10), 0), 5000);

    try {
      let newAlarm;

      const alarmData = {
        time: time.toISOString(),
        soundId: selectedSoundDocumentId,
        active: true,
        days: activeDays,
        userId: userId,
        stepCount: validStepCount,
      };

      console.log("Alarm data being saved:", alarmData);

      if (isEditing) {
        const alarmId = alarms[currentAlarm].$id;
        await databases.updateDocument(
          "66797b11000ca7e40dcc",
          "66b93cdd001f6d14a27e",
          alarmId,
          alarmData
        );
        newAlarm = { ...alarms[currentAlarm], ...alarmData };
      } else {
        const response = await databases.createDocument(
          "66797b11000ca7e40dcc",
          "66b93cdd001f6d14a27e",
          ID.unique(),
          alarmData
        );
        newAlarm = response;
      }

      const updatedAlarms = await databases.listDocuments(
        "66797b11000ca7e40dcc",
        "66b93cdd001f6d14a27e",
        [Query.equal("userId", userId)]
      );
      setAlarms(updatedAlarms.documents);

      scheduleAlarm(newAlarm, updatedAlarms.documents.length - 1);

      const subscribe = Pedometer.watchStepCount((result) => {
        setStepCount(result.steps);
      });

      return () => subscribe.remove();
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
      console.log(`Deleting alarm with ID: ${alarmId}`);

      if (alarmTimeouts[alarmId]) {
        clearTimeout(alarmTimeouts[alarmId]);
        delete alarmTimeouts[alarmId];
        console.log(`Cancelled scheduled alarm with ID: ${alarmId}`);
      }

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
    setSelectedSoundDocumentId("66b94f5900329d9d770a");
  };

  const editAlarm = (index) => {
    const alarm = alarms[index];
    setTime(new Date(alarm.time));
    setSelectedSoundDocumentId(alarm.soundId);
    setActiveDays(alarm.days);
    setCurrentAlarm(index);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleConfirm = (selectedDate) => {
    setShowTimePicker(false);
    setTime(selectedDate || time);
  };

  const alarmTimeouts = {};

  const toggleAlarm = async (index) => {
    const alarm = alarms[index];
    const updatedAlarm = {
      time: alarm.time,
      soundId: alarm.soundId,
      active: !alarm.active,
      days: alarm.days,
      userId: alarm.userId,
    };

    try {
      if (!alarm.$id) {
        console.error("Missing documentId for alarm.");
        return;
      }

      console.log(
        `Toggling alarm with ID: ${alarm.$id}, new state: ${
          updatedAlarm.active ? "active" : "inactive"
        }`
      );

      await databases.updateDocument(
        "66797b11000ca7e40dcc",
        "66b93cdd001f6d14a27e",
        alarm.$id,
        updatedAlarm
      );

      console.log(
        `Alarm with ID: ${alarm.$id} has been ${
          updatedAlarm.active ? "activated" : "deactivated"
        }.`
      );

      if (!updatedAlarm.active && alarmTimeouts[alarm.$id]) {
        clearTimeout(alarmTimeouts[alarm.$id]);
        delete alarmTimeouts[alarm.$id];
        console.log(`Cancelled scheduled alarm with ID: ${alarm.$id}`);
      }

      setAlarms(
        alarms.map((a, i) =>
          i === index ? { ...a, active: updatedAlarm.active } : a
        )
      );

      if (updatedAlarm.active) {
        scheduleAlarm(updatedAlarm, index);
      } else {
        if (index === triggeredAlarm) {
          stopAlarm();
        }
      }
    } catch (error) {
      console.error("Failed to toggle alarm:", error);
    }
  };

  const stopAlarm = async () => {
    if (stepCount >= stepGoal) {
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
        setPlayingAlarmIndex(null);
        setTriggeredAlarm(null);
        setAlarmTriggerModalVisible(false);
        console.log("Alarm stopped after reaching step count.");
      }
    } else {
      alert(
        `Please complete ${stepGoal - stepCount} more steps to stop the alarm!`
      );
      console.log(`Step goal not reached: ${stepCount}/${stepGoal}`);
    }
  };

  const scheduleAlarm = async (alarm, index) => {
    const currentTime = new Date().getTime();
    const alarmTime = new Date(alarm.time).getTime();

    if (alarmTime <= currentTime) {
      console.log("Alarm time has already passed.");
      return;
    }

    const timeDifference = alarmTime - currentTime;
    console.log(
      `Countdown for alarm with ID: ${alarm.$id} has begun. Time left: ${
        timeDifference / 1000
      } seconds`
    );

    alarmTimeouts[alarm.$id] = setTimeout(async () => {
      const latestAlarms = await databases.listDocuments(
        "66797b11000ca7e40dcc",
        "66b93cdd001f6d14a27e",
        [Query.equal("$id", alarm.$id)]
      );
      const latestAlarm = latestAlarms.documents[0];

      if (latestAlarm && latestAlarm.active) {
        try {
          const soundDocument = await databases.getDocument(
            "66797b11000ca7e40dcc",
            "66797ba40026e00acb05",
            alarm.soundId
          );

          const soundName = soundDocument.name;
          console.log(
            `Alarm with ID: ${
              alarm.$id
            } is triggered at ${new Date().toLocaleTimeString()}`
          );
          playSound(soundName, index);
        } catch (error) {
          console.error("Failed to fetch sound document:", error);
        }
      } else {
        console.log(
          `Alarm with ID: ${alarm.$id} was cancelled or deactivated before triggering.`
        );
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
                    currentSound === selectedSound &&
                    playingAlarmIndex !== null
                      ? "Stop"
                      : "Play"
                  }
                  onPress={() =>
                    playSound(
                      selectedSound,
                      triggeredAlarm || playingAlarmIndex,
                      false
                    )
                  }
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
      <Modal
        animationType="slide"
        transparent={false}
        visible={alarmTriggerModalVisible}
        onRequestClose={() => {
          setAlarmTriggerModalVisible(false);
          stopAlarm();
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            padding: 20,
          }}
        >
          <Image
            source={require("../../assets/images/alarm.gif")}
            style={{ width: 350, height: 350, marginBottom: 40 }}
            resizeMode="contain"
          />

          <Text style={{ color: "white", fontSize: 24, marginBottom: 20 }}>
            Taken Steps: {stepCount > 0 ? stepCount : 0}{" "}
          </Text>
          <Text style={{ color: "white", fontSize: 24, marginBottom: 40 }}>
            Target Steps: {stepGoal > 0 ? stepGoal : 0}{" "}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "95%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                stopAlarm();
                const snoozeTime = new Date(new Date().getTime() + 5 * 60000);
                const snoozedAlarm = {
                  ...alarms[triggeredAlarm],
                  time: snoozeTime.toISOString(),
                };
                scheduleAlarm(snoozedAlarm, triggeredAlarm);
                setAlarmTriggerModalVisible(false);
              }}
              style={{
                backgroundColor: "purple",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 15,
                marginRight: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 24 }}> Snooze </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                stopAlarm();
                setAlarmTriggerModalVisible(false);
              }}
              style={{
                backgroundColor: "red",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 15,
              }}
            >
              <Text style={{ color: "white", fontSize: 24 }}> Turn off </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                  setSelectedSoundDocumentId(itemValue);
                  switch (itemValue) {
                    case "66b94f5900329d9d770a":
                      setSelectedSound("Emergency");
                      break;
                    case "66baa3ff00095a263d79":
                      setSelectedSound("chicken_toy");
                      break;
                  }
                }}
              >
                <Picker.Item label="Emergency" value="66b94f5900329d9d770a" />
                <Picker.Item label="Chicken Toy" value="66baa3ff00095a263d79" />
              </Picker>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 10,
                }}
              >
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: 10,
                    borderRadius: 5,
                    textAlign: "center",
                    marginVertical: 10,
                  }}
                  placeholder="Enter Step Goal"
                  keyboardType="numeric"
                  value={stepGoal.toString()}
                  onChangeText={(text) => setStepGoal(parseInt(text) || 0)}
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
