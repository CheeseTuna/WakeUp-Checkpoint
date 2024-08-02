import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, TextInput, Animated, Dimensions, Easing, TouchableWithoutFeedback } from 'react-native';
import images from '../../constants/images';
import addFriendIcon from '../../assets/icons/add_friend.png';
import chatIcon from '../../assets/icons/chat.png';

const Friends = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
                      }}
                    />
                    {/* Removed search results and buttons logic */}
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
    backgroundColor: '#444',
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
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    numberOfLines: 1,
    adjustsFontSizeToFit: true,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
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
    backgroundColor: '#333',
  },
});

export default Friends;
