import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, TextInput, Animated, Dimensions, Easing, TouchableWithoutFeedback } from 'react-native';
import images from '../../constants/images';
import addFriendIcon from '../../assets/icons/add_friend.png';
import removeIcon from '../../assets/icons/remove.png';
import chatIcon from '../../assets/icons/chat.png';
import addIcon from '../../assets/icons/add.png';
import { databases } from '../services/appwrite'; // Import Appwrite databases
import { Query } from 'appwrite'; // Correctly import Query from appwrite

const Friends = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [addedFriends, setAddedFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [tab, setTab] = useState('suggestions');
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  const [friends, setFriends] = useState([
    { name: 'Adam', avatar: images.adam, wakeUpTime: '6:30 AM', points: 1000, status: 'Awake' },
    { name: 'Jenny', avatar: images.woman, wakeUpTime: '7:05 AM', points: 899, status: 'Sleeping' },
    { name: 'Lee', avatar: images.lee, wakeUpTime: '8:00 AM', points: 340, status: 'Wake Up!' },
  ]);

  const handleAddFriend = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').width,
      duration: 500,
      easing: Easing.in(Easing.exp),
      useNativeDriver: false,
    }).start(() => setModalVisible(false));
  };

  const removeFriend = async (name) => {
    setFriends(friends.filter(friend => friend.name !== name));
    setAddedFriends(addedFriends.filter(friend => friend.name !== name));

    try {
      // Remove friend from database
      const response = await databases.deleteDocument('66797b11000ca7e40dcc', 'friendsCollectionId', name);
      console.log('Friend removed:', response);
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const openChat = (name) => {
    console.log(`Opening chat with: ${name}`);
  };

  const searchUsers = async (query) => {
    try {
      console.log('Searching for users with username:', query); // Log the search query
      const response = await databases.listDocuments('66797b11000ca7e40dcc', '66797b6f00391798a93b', [
        Query.equal('username', query)
      ]);
      console.log('Search response:', response); // Log the response
      setSearchResults(response.documents);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const addFriend = async (user) => {
    // Add user to the addedFriends list
    setAddedFriends([...addedFriends, user]);
    setSearchResults(searchResults.filter(result => result.$id !== user.$id));

    try {
      // Add friend to database with status 'added'
      const response = await databases.createDocument('66797b11000ca7e40dcc', 'friendsCollectionId', user.$id, {
        ...user,
        status: 'added'
      });
      console.log('Friend added:', response);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const fetchRandomUsers = async () => {
    try {
      const response = await databases.listDocuments('66797b11000ca7e40dcc', '66797b6f00391798a93b');
      const users = response.documents;
      const randomUsers = users.sort(() => 0.5 - Math.random()).slice(0, 3);
      setSuggestions(randomUsers);
    } catch (error) {
      console.error('Error fetching random users:', error);
    }
  };

  const fetchAddedFriends = async () => {
    try {
      // Fetch added friends from database
      const response = await databases.listDocuments('66797b11000ca7e40dcc', 'friendsCollectionId', [
        Query.equal('status', 'added')
      ]);
      setAddedFriends(response.documents);
    } catch (error) {
      console.error('Error fetching added friends:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      // Fetch friend requests from database
      const response = await databases.listDocuments('66797b11000ca7e40dcc', 'friendsCollectionId', [
        Query.equal('status', 'requested')
      ]);
      setFriendRequests(response.documents);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  useEffect(() => {
    if (tab === 'suggestions') {
      fetchRandomUsers();
    } else if (tab === 'added') {
      fetchAddedFriends();
    } else if (tab === 'requests') {
      fetchRequests();
    }
  }, [tab]);

  const approveFriend = async (friendId) => {
    try {
      // Update friend status to 'added'
      const response = await databases.updateDocument('66797b11000ca7e40dcc', 'friendsCollectionId', friendId, {
        status: 'added'
      });
      console.log('Friend approved:', response);
      fetchRequests();
      fetchAddedFriends();
    } catch (error) {
      console.error('Error approving friend:', error);
    }
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
            <Text style={styles.title}>Scoreboard 🏆</Text>
            {friends.length === 0 ? (
              <Text style={styles.noFriendsText}>Add friends in order to compete!</Text>
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
                <Image style={styles.avatar} source={friend.avatar} />
                <View style={styles.trackText}>
                  <Text style={styles.name}>{friend.name}</Text>
                  <Text style={styles.wakeUpTime}>Wake-up Time: {friend.wakeUpTime}</Text>
                </View>
                <TouchableOpacity style={[styles.statusButton, { backgroundColor: friend.status === 'Awake' ? 'green' : friend.status === 'Sleeping' ? 'gray' : 'red' }]}>
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
                <Animated.View style={[styles.modalContainer, { transform: [{ translateX: slideAnim }] }]}>
                  <View style={styles.modalView}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search by username"
                      placeholderTextColor="#aaa"
                      value={searchQuery}
                      onChangeText={(text) => {
                        setSearchQuery(text);
                        searchUsers(text);
                      }}
                    />
                    {tab === 'suggestions' && suggestions.length > 0 && (
                      <View style={styles.searchResults}>
                        {suggestions.map((user, index) => (
                          <View key={index} style={styles.searchResultItem}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            <Text style={styles.name}>{user.username}</Text>
                            <TouchableOpacity onPress={() => addFriend(user)}>
                              <Image style={styles.addIcon} source={addIcon} />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                    {tab === 'added' && addedFriends.length > 0 && (
                      <View style={styles.searchResults}>
                        {addedFriends.map((user, index) => (
                          <View key={index} style={styles.searchResultItem}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            <Text style={styles.name}>{user.username}</Text>
                            <TouchableOpacity onPress={() => removeFriend(user.$id)}>
                              <Image style={styles.icon} source={removeIcon} />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                    {tab === 'requests' && friendRequests.length > 0 && (
                      <View style={styles.searchResults}>
                        {friendRequests.map((user, index) => (
                          <View key={index} style={styles.searchResultItem}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            <Text style={styles.name}>{user.username}</Text>
                            <TouchableOpacity onPress={() => approveFriend(user.$id)}>
                              <Text style={styles.approveButton}>Approve</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                    <View style={styles.tabContainer}>
                      <TouchableOpacity onPress={() => setTab('suggestions')} style={[styles.tabButton, tab === 'suggestions' && styles.tabButtonActive]}>
                        <Text style={styles.tabButtonText}> Suggestions </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setTab('added')} style={[styles.tabButton, tab === 'added' && styles.tabButtonActive]}>
                        <Text style={styles.tabButtonText}> Added </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setTab('requests')} style={[styles.tabButton, tab === 'requests' && styles.tabButtonActive]}>
                        <Text style={styles.tabButtonText}> Requests </Text>
                      </TouchableOpacity>
                    </View>
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
    backgroundColor: '#181A20',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
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
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rank: {
    color: 'white',
    fontSize: 18,
    width: 40,
    textAlign: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    color: 'white',
    fontSize: 18,
    flex: 1,
  },
  points: {
    color: 'gold',
    fontSize: 18,
    width: 60,
    textAlign: 'right',
  },
  noFriendsText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  highlight: {
    backgroundColor: '#444',  // Change this color as needed for highlighting
    padding: 10,
    borderRadius: 10,
  },
  tracker: {
    marginTop: 20,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trackText: {
    flex: 1,
  },
  wakeUpTime: {
    color: 'white',
    fontSize: 16,
    marginTop: 2,
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    minWidth: 120, // Ensures the button is wide enough to accommodate the text
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    numberOfLines: 1, // Ensures the text is confined to a single line
    adjustsFontSizeToFit: true, // Adjusts the font size to fit within the button
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%', // Change the width to 100% of the screen
    height: '100%',
    backgroundColor: '#181A20',
  },
  modalView: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    color: 'white',
    backgroundColor: '#333',  // Background color for the input to match the theme
  },
  searchResults: {
    marginBottom: 10,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  approveButton: {
    color: 'green',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#444',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderColor: 'white',
  },
  tabButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Friends;
