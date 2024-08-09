import React, { useEffect, useState, useRef } from "react";
import { account } from "../services/appwrite";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Calendar } from "react-native-calendars";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getCurrentUser } from "../../lib/appwrite";
import images from "../../constants/images";
import { useRouter } from "expo-router";
console.log("Account object: ", account);

const { width, height } = Dimensions.get("window");

const Profile = () => {
  const { isLoggedIn, isLoading } = useGlobalContext();
  const router = useRouter();
  const [reenterp, setReEnterP] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(images.woman);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const updateUsername = async () => {
    try {
      const response = await account.updateName(username);
      console.log("Username updated:", response);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };
  const updateEmail = async () => {
    try {
      const response = await account.updateEmail(email, password); // Include 'password' as the second parameter
      console.log("Email updated:", response);
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const updatePassword = async () => {
    try {
      const response = await account.updatePassword(password);
      console.log("Password updated:", response);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };
  const validateAndSavePassword = async () => {
    if (password === reenterp) {
      await account.updatePassword();
    } else {
      alert("Passwords do not match");
    }
  };
  const handleSave = async () => {
    await updateUsername();
    await updateEmail();
    await validateAndSavePassword();
    alert("Profile saved successfully!");
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        router.replace("/log-in");
      } else {
        const fetchUserData = async () => {
          try {
            const userData = await getCurrentUser();
            setUsername(userData.username);
          } catch (error) {
            console.error(error);
          }
        };

        fetchUserData();

        const date = new Date();
        const formattedDate = date.toISOString().split("T")[0];
        setCurrentDate(formattedDate);
      }
    }
  }, [isLoading, isLoggedIn]);

  const toggleEditProfile = () => {
    setEditVisible(!editVisible);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeEditProfile = () => {
    Animated.timing(slideAnim, {
      toValue: width, // Slide out to the right
      duration: 500,
      useNativeDriver: true,
    }).start(() => setEditVisible(false));
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.uri });
    }
  };

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={images.profileheader}
        style={styles.headerBackground}
      >
        <Text style={styles.profileTitle}>{username}</Text>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image source={profileImage} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
              <FontAwesome name="camera" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.editIcon} onPress={toggleEditProfile}>
            <FontAwesome name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statLeft}>
            <Text style={styles.statTitle}> CREDIT </Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
          <View style={styles.statCenter}>
            <Text style={styles.statTitle}> CHECKPOINT </Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
          <View style={styles.statRight}>
            <Text style={styles.statTitle}> SCORE </Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.contentContainer}>
        <Text style={styles.historyTitle}> WAKEUP HISTORY </Text>
        <View style={styles.calendarContainer}></View>
        <Calendar
          style={styles.calendar}
          current={currentDate}
          markedDates={{
            [currentDate]: {
              selected: true,
              marked: true,
              selectedColor: "orange",
            },
          }}
          theme={{
            calendarBackground: "#41419F",
            textSectionTitleColor: "white",
            dayTextColor: "white",
            todayTextColor: "orange",
            selectedDayTextColor: "white",
            monthTextColor: "white",
            arrowColor: "white",
            "stylesheet.calendar.header": {
              week: {
                marginTop: 5,
                flexDirection: "row",
                justifyContent: "space-between",
              },
            },
          }}
        />
      </View>

      {/* Edit Profile Slide-in */}
      <Modal
        animationType="none"
        transparent={true}
        visible={editVisible}
        onRequestClose={closeEditProfile}
      >
        <TouchableWithoutFeedback onPress={closeEditProfile}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.editProfileContainer,
                  { transform: [{ translateX: slideAnim }] },
                ]}
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ flex: 1 }}
                >
                  <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps="handled"
                  >
                    <View style={styles.editProfileHeaderContainer}>
                      <Text style={styles.editProfileHeader}>Edit Profile</Text>
                      <TouchableOpacity
                        onPress={closeEditProfile}
                        style={styles.backButton}
                      >
                        <Text style={styles.backButtonText}> Back </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Username</Text>
                      <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Current Password</Text>
                      <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>New Password</Text>
                      <TextInput
                        style={styles.input}
                        value={reenterp}
                        onChangeText={setReEnterP}
                        secureTextEntry
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSave}
                    >
                      <Text style={styles.saveButtonText}> Save </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </KeyboardAvoidingView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 0,
  },
  headerBackground: {
    width: "100%",
    padding: 0,
    alignItems: "center",
    marginTop: 0,
  },
  profileTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 40,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
  },
  editIcon: {
    position: "absolute",
    top: -20,
    right: -150,
    backgroundColor: "transparent",
    padding: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  statLeft: {
    alignItems: "flex-start",
    marginLeft: 20,
  },
  statCenter: {
    alignItems: "center",
    flex: 1,
  },
  statRight: {
    alignItems: "flex-end",
    marginRight: 20,
  },
  statTitle: {
    color: "white",
    fontSize: 16,
  },
  statValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  statValueContainer: {
    backgroundColor: "#2F2F6B",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 5,
    borderColor: "white",
    borderWidth: 1,
  },
  historyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
  },
  calendar: {
    backgroundColor: "#41419F",
    borderRadius: 10,
    padding: 10,
  },
  contentContainer: {
    padding: 20,
  },
  editProfileContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#161622",
    zIndex: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    position: "absolute",
    top: 0,
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  editProfileHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  editProfileHeader: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: "100%",
  },
  inputLabel: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#2F2F6B",
    color: "white",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 30,
    alignSelf: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});

export default Profile;
