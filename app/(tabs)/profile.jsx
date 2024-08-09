import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  TextInput, // <- Import TextInput
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getCurrentUser } from "../../lib/appwrite";
import images from "../../constants/images";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const Profile = () => {
  const { isLoggedIn, isLoading } = useGlobalContext();
  const router = useRouter();
  const [reenterp, setReEnterP] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(width))[0];

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
      toValue: editVisible ? width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeEditProfile = () => {
    setEditVisible(false);
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start();
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
            <Image source={images.woman} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraIcon}>
              <FontAwesome name="camera" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.editIcon} onPress={toggleEditProfile}>
            <FontAwesome name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statLeft}>
            <Text style={styles.statTitle}>CREDIT</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
          <View style={styles.statCenter}>
            <Text style={styles.statTitle}>CHECKPOINT</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
          <View style={styles.statRight}>
            <Text style={styles.statTitle}>SCORE</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.contentContainer}>
        <Text style={styles.historyTitle}>WAKEUP HISTORY</Text>
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
      {editVisible && (
        <Animated.View
          style={[
            styles.editProfileContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <View style={styles.editProfileHeaderContainer}>
            <Text style={styles.editProfileHeader}>Edit Profile</Text>
            <TouchableOpacity
              onPress={closeEditProfile}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Back</Text>
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
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Re-enter Password</Text>
            <TextInput
              style={styles.input}
              value={reenterp}
              onChangeText={setReEnterP}
            />
          </View>
        </Animated.View>
      )}
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
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#161622",
    paddingTop: 40, // <- Add padding at the top
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
});

export default Profile;
