import React, { useState } from 'react';
import images from '../../constants/images';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import addFriendIcon from '../../assets/icons/add_friend.png';

const Friends = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddFriend = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSearch = () => {
    // Implement search functionality here
    console.log(`Searching for: ${searchQuery}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity onPress={handleAddFriend}>
          <Image style={styles.addFriendIcon} source={addFriendIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.scoreboard}>
          <Text style={styles.title}>Scoreboard 🏆</Text>
          <View style={styles.score}>
            <Text style={styles.rank}>1st</Text>
            <Image style={styles.avatar} source={images.adam} />
            <Text style={styles.name}>Adam</Text>
            <Text style={styles.points}>1,000</Text>
          </View>
          <View style={styles.score}>
            <Text style={styles.rank}>2nd</Text>
            <Image style={styles.avatar} source={images.woman} />
            <Text style={styles.name}>Jenny</Text>
            <Text style={styles.points}>899</Text>
          </View>
          <View style={styles.score}>
            <Text style={styles.rank}>3rd</Text>
            <Image style={styles.avatar} source={images.lee} />
            <Text style={styles.name}>Lee</Text>
            <Text style={styles.points}>340</Text>
          </View>
          <View style={styles.score}>
            <Text style={styles.rank}>4th</Text>
            <Image style={styles.avatar} source={images.woman} />
            <Text style={styles.name}>You</Text>
            <Text style={styles.points}>240</Text>
          </View>
        </View>

        <View style={styles.tracker}>
          <Text style={styles.title}>WAKEUP TRACKER</Text>
          <View style={styles.track}>
            <Image style={styles.avatar} source={images.adam} />
            <View style={styles.trackText}>
              <Text style={styles.name}>Adam</Text>
              <Text style={styles.wakeUpTime}>Wake-up Time: 6:30 AM</Text>
            </View>
            <TouchableOpacity style={[styles.statusButton, { backgroundColor: 'green' }]}>
              <Text style={styles.statusText}>Awake</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.track}>
            <Image style={styles.avatar} source={images.woman} />
            <View style={styles.trackText}>
              <Text style={styles.name}>Jenny</Text>
              <Text style={styles.wakeUpTime}>Wake-up Time: 7:05 AM</Text>
            </View>
            <TouchableOpacity style={[styles.statusButton, { backgroundColor: 'gray' }]}>
              <Text style={styles.statusText}>Sleeping</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.track}>
            <Image style={styles.avatar} source={images.lee} />
            <View style={styles.trackText}>
              <Text style={styles.name}>Lee</Text>
              <Text style={styles.wakeUpTime}>Wake-up Time: 8:00 AM</Text>
            </View>
            <TouchableOpacity style={[styles.statusButton, { backgroundColor: 'red' }]}>
              <Text style={styles.statusText}>Wake Up!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by username"
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Button title="Search" onPress={handleSearch} />
            <Button title="Close" onPress={handleCloseModal} color="red" />
          </View>
        </View>
      </Modal>
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
    width: 32,
    height: 32,
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
    padding: 5,
    borderRadius: 5,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    color: 'black',
  },
});

export default Friends;
