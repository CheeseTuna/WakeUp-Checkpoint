import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import images from "../../constants/images";
import addFriendIcon from "../../assets/icons/add_friend.png";
import chatIcon from "../../assets/icons/chat.png";
import addIcon from "../../assets/icons/add.png";
import addedIcon from "../../assets/icons/added.png";
import removeIcon from "../../assets/icons/remove.png"; // Import the remove icon
import { Client, Account, Databases, Query, ID } from "appwrite"; // Import necessary Appwrite services
import { debounce } from "lodash"; // Import debounce from lodash

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Set your Appwrite endpoint
  .setProject("667978f100298ba15c44"); // Set your project ID

const account = new Account(client);
const databases = new Databases(client);

const Friends = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]); // State to keep track of added users
  const [sentRequests, setSentRequests] = useState([]); // State to keep track of sent requests
  const [requestsModalVisible, setRequestsModalVisible] = useState(false); // State for requests modal
  const [activeTab, setActiveTab] = useState("suggestions");
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").width)
  ).current;
  const bottomSlideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current; // Animation for bottom slide
  const alarmModalSlideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current; // Animation for the alarm modal

  const [alarmModalVisible, setAlarmModalVisible] = useState(false); // State for alarm modal
  const [friends, setFriends] = useState([
    {
      name: "Adam",
      avatar: images.adam,
      wakeUpTime: "6:30 AM",
      points: 1000,
      status: "Awake",
    },
    {
      name: "Jenny",
      avatar: images.woman,
      wakeUpTime: "7:05 AM",
      points: 899,
      status: "Sleeping",
    },
    {
      name: "Lee",
      avatar: images.lee,
      wakeUpTime: "8:00 AM",
      points: 340,
      status: "Wake Up!",
    },
  ]);

  const handleAddFriend = () => {
    setModalVisible(true);
    setActiveTab("suggestions"); // Automatically select suggestions tab
    fetchRandomUsers(); // Fetch random users for suggestions
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").width,
      duration: 500,
      easing: Easing.in(Easing.exp),
      useNativeDriver: false,
    }).start(() => setModalVisible(false));
  };

  const searchUsers = async (query) => {
    try {
      const response = await databases.listDocuments(
        "66797b11000ca7e40dcc",
        "66797b6f00391798a93b",
        [Query.search("username", query)]
      );
      setSearchResults(response.documents);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const fetchRandomUsers = async () => {
    try {
      const response = await databases.listDocuments(
        "66797b11000ca7e40dcc",
        "66797b6f00391798a93b",
        [Query.limit(10)]
      );
      setSuggestions(response.documents);
    } catch (error) {
      console.error("Error fetching random users:", error);
    }
  };

  const handleAddUser = async (user) => {
    try {
      // Create a friend request document with a pending status
      const request = await databases.createDocument(
        "66797b11000ca7e40dcc",
        "66acd4470023494c7bf4",
        ID.unique(),
        {
          userId: user.$id,
          status: "pending",
        }
      );
      setSentRequests([
        ...sentRequests,
        { ...user, requestId: request.$id, status: "pending" },
      ]);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleRemoveUser = async (request) => {
    try {
      // Delete the friend request document
      await databases.deleteDocument(
        "66797b11000ca7e40dcc",
        "66acd4470023494c7bf4",
        request.requestId
      );
      setSentRequests(
        sentRequests.filter(
          (sentRequest) => sentRequest.requestId !== request.requestId
        )
      );
    } catch (error) {
      console.error("Error removing friend request:", error);
    }
  };

  const fetchRequestsStatus = async () => {
    try {
      const response = await databases.listDocuments(
        "66797b11000ca7e40dcc",
        "66acd4470023494c7bf4",
        [Query.equal("status", "accepted")]
      );
      const acceptedRequests = response.documents;
      setAddedUsers(acceptedRequests.map((req) => req.userId));
    } catch (error) {
      console.error("Error fetching request status:", error);
    }
  };

  // Debounced search function
  const debouncedSearchUsers = useRef(
    debounce((query) => searchUsers(query), 300)
  ).current;

  useEffect(() => {
    if (searchQuery.length > 0) {
      debouncedSearchUsers(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchRequestsStatus();
  }, [sentRequests]);

  const isUserAdded = (userId) => {
    return addedUsers.includes(userId);
  };

  const openRequestsModal = () => {
    setRequestsModalVisible(true);
    Animated.timing(bottomSlideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  };

  const closeRequestsModal = () => {
    Animated.timing(bottomSlideAnim, {
      toValue: Dimensions.get("window").height,
      duration: 500,
      easing: Easing.in(Easing.exp),
      useNativeDriver: false,
    }).start(() => setRequestsModalVisible(false));
  };

  const openAlarmModal = () => {
    setAlarmModalVisible(true);
    Animated.timing(alarmModalSlideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  };

  const closeAlarmModal = () => {
    Animated.timing(alarmModalSlideAnim, {
      toValue: Dimensions.get("window").height,
      duration: 500,
      easing: Easing.in(Easing.exp),
      useNativeDriver: false,
    }).start(() => setAlarmModalVisible(false));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ paddingTop: 20 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Friends</Text>
          <TouchableOpacity onPress={handleAddFriend}>
            <Image style={styles.addFriendIcon} source={addFriendIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.scoreboard}>
            <Text style={styles.title}>SCOREBOARD 🏆</Text>
            {friends.length === 0 ? (
              <Text style={styles.noFriendsText}>
                Wow Empty! Add friends in order to compete!
              </Text>
            ) : (
              friends.map((friend, index) => (
                <View key={index} style={styles.score}>
                  <Text style={styles.rank}>{index + 1}st</Text>
                  <Image style={styles.avatar} source={friend.avatar} />
                  <Text style={styles.name}>{friend.name}</Text>
                  <Text style={styles.points}>{friend.points}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.tracker}>
            <Text style={styles.title}>WAKEUP TRACKER</Text>
            {friends.map((friend, index) => (
              <View key={index} style={styles.track}>
                <Image
                  style={styles.avatar}
                  source={friend.avatar || images.woman}
                />
                <View style={styles.trackText}>
                  <Text style={styles.name}>{friend.name}</Text>
                  <Text style={styles.wakeUpTime}>
                    Wake-up Time: {friend.wakeUpTime}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        friend.status === "Awake"
                          ? "green"
                          : friend.status === "Sleeping"
                          ? "gray"
                          : "red",
                    },
                  ]}
                  onPress={() => {
                    if (friend.status === "Wake Up!") openAlarmModal();
                  }}
                >
                  <Text style={styles.statusText}> {friend.status} </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    styles.modalContainer,
                    { transform: [{ translateX: slideAnim }] },
                  ]}
                >
                  <View style={styles.modalView}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={closeModal}
                    >
                      <Text style={styles.backButtonText}> Back </Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search by username"
                      placeholderTextColor="#aaa"
                      value={searchQuery}
                      onChangeText={(text) => setSearchQuery(text)}
                    />
                    {searchResults.length > 0 && (
                      <View style={styles.searchResults}>
                        {searchResults.map((user, index) => (
                          <View key={index} style={styles.searchResultItem}>
                            <Image
                              style={styles.avatar}
                              source={{ uri: user.avatar || images.woman }}
                            />
                            <Text style={styles.name}>{user.username}</Text>
                            <TouchableOpacity
                              onPress={() => handleAddUser(user)}
                            >
                              <Image
                                style={styles.addIcon}
                                source={
                                  isUserAdded(user.$id) ? addedIcon : addIcon
                                }
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                    <View style={styles.tabContainer}>
                      <TouchableOpacity
                        style={[
                          styles.tabButton,
                          activeTab === "suggestions" && styles.activeTabButton,
                        ]}
                        onPress={() => setActiveTab("suggestions")}
                      >
                        <Text style={styles.tabButtonText}> Suggestions </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.tabButton,
                          activeTab === "added" && styles.activeTabButton,
                        ]}
                        onPress={() => setActiveTab("added")}
                      >
                        <Text style={styles.tabButtonText}> Added </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.tabButton,
                          activeTab === "requests" && styles.activeTabButton,
                        ]}
                        onPress={() => setActiveTab("requests")}
                      >
                        <Text style={styles.tabButtonText}> Requests </Text>
                      </TouchableOpacity>
                    </View>
                    {activeTab === "suggestions" && (
                      <View style={styles.suggestionsContainer}>
                        {suggestions.map((user, index) => (
                          <View key={index} style={styles.suggestionItem}>
                            <Image
                              style={styles.avatar}
                              source={{ uri: user.avatar || images.woman }}
                            />
                            <Text style={styles.name}>{user.username}</Text>
                            <TouchableOpacity
                              onPress={() => handleAddUser(user)}
                            >
                              <Image
                                style={styles.addIcon}
                                source={
                                  isUserAdded(user.$id) ? addedIcon : addIcon
                                }
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                setSuggestions(
                                  suggestions.filter(
                                    (suggestion) => suggestion.$id !== user.$id
                                  )
                                )
                              }
                            >
                              <Image
                                style={styles.removeIcon}
                                source={removeIcon}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                    {activeTab === "added" && (
                      <View style={styles.addedContainer}>
                        <Text style={styles.addedTitle}>
                          MY FRIENDS ({addedUsers.length})
                        </Text>
                        {addedUsers.map((user, index) => (
                          <View key={index} style={styles.addedItem}>
                            <Image
                              style={styles.avatar}
                              source={{ uri: user.avatar || images.woman }}
                            />
                            <Text style={styles.name}>{user.username}</Text>
                            <TouchableOpacity
                              onPress={() => handleRemoveUser(user)}
                            >
                              <Image
                                style={styles.removeIcon}
                                source={removeIcon}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                    {activeTab === "requests" && (
                      <View style={styles.requestsContainer}>
                        <TouchableOpacity onPress={openRequestsModal}>
                          <Text style={styles.sentRequestsButton}>Sent</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={requestsModalVisible}
          onRequestClose={closeRequestsModal}
        >
          <TouchableWithoutFeedback onPress={closeRequestsModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    styles.requestsModalContainer,
                    { transform: [{ translateY: bottomSlideAnim }] },
                  ]}
                >
                  <View style={styles.requestsModalView}>
                    <Text style={styles.requestsTitle}>Sent Requests</Text>
                    {sentRequests.map((request, index) => (
                      <View key={index} style={styles.requestItem}>
                        <Image
                          style={styles.avatar}
                          source={{ uri: request.avatar || images.woman }}
                        />
                        <Text style={styles.name}>{request.username}</Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveUser(request)}
                        >
                          <Image
                            style={styles.removeIcon}
                            source={removeIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={alarmModalVisible}
          onRequestClose={closeAlarmModal}
        >
          <TouchableWithoutFeedback onPress={closeAlarmModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    styles.alarmModalContainer,
                    { transform: [{ translateY: alarmModalSlideAnim }] },
                  ]}
                >
                  <View style={styles.alarmModalView}>
                    <Text style={styles.alarmTitle}>CHOOSE ALARM SOUND</Text>
                    <TouchableOpacity style={styles.alarmOption}>
                      <Text style={styles.alarmOptionText}>Chime</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.alarmOption}>
                      <Text style={styles.alarmOptionText}>Emergency</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.alarmOption}>
                      <Text style={styles.alarmOptionText}>Chicken Toy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.wakeUpButton}
                      onPress={closeAlarmModal}
                    >
                      <Text style={styles.wakeUpButtonText}>WAKE UP!</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#181A20",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  addFriendIcon: {
    width: 21,
    height: 17,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  scoreboard: {
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  score: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rank: {
    color: "white",
    fontSize: 18,
    width: 40,
    textAlign: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    color: "white",
    fontSize: 18,
    flex: 1,
  },
  points: {
    color: "gold",
    fontSize: 18,
    width: 60,
    textAlign: "right",
  },
  noFriendsText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  highlight: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
  },
  tracker: {
    marginTop: 20,
  },
  track: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  trackText: {
    flex: 1,
  },
  wakeUpTime: {
    color: "white",
    fontSize: 16,
    marginTop: 2,
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    minWidth: 120,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  statusText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    numberOfLines: 1,
    adjustsFontSizeToFit: true,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#181A20",
  },
  modalView: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
  },
  searchInput: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    color: "white",
    backgroundColor: "#333",
  },
  searchResults: {
    marginBottom: 10,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addIcon: {
    width: 21,
    height: 17,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 15,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: "#555",
  },
  tabButtonText: {
    color: "white",
    fontSize: 16,
  },
  suggestionsContainer: {
    marginBottom: 10,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addedContainer: {
    marginBottom: 10,
  },
  addedItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addedTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addedIcon: {
    width: 21,
    height: 17,
    marginLeft: 10,
  },
  removeIcon: {
    width: 21,
    height: 17,
    marginLeft: 10,
  },
  requestsContainer: {
    marginBottom: 10,
  },
  sentRequestsButton: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 15,
  },
  requestsModalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "80%",
    backgroundColor: "#181A20",
    padding: 20,
  },
  requestsModalView: {
    flex: 1,
  },
  requestsTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  requestItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  alarmModalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "75%",
    backgroundColor: "#181A20",
    padding: 20,
  },
  alarmModalView: {
    flex: 1,
    justifyContent: "space-between",
  },
  alarmTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  alarmOption: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#333",
    marginBottom: 10,
  },
  alarmOptionText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  wakeUpButton: {
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "red",
  },
  wakeUpButtonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Friends;
