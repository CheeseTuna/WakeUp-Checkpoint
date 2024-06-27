import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useGlobalContext } from '../../context/GlobalProvider';
import { getCurrentUser, getUserData } from '../../lib/appwrite';
import images from '../../constants/images';
import { useRouter } from 'expo-router';

const Profile = () => {
  const { isLoggedIn, user, isLoading } = useGlobalContext();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        router.replace('/log-in');
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
        const formattedDate = date.toISOString().split('T')[0];
        setCurrentDate(formattedDate);
      }
    }
  }, [isLoading, isLoggedIn]);

  if (isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={images.profileheader} style={styles.headerBackground}>
        <Text style={styles.profileTitle}>{username}</Text>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image source={images.woman} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraIcon}>
              <FontAwesome name="camera" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <FontAwesome name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statLeft}>
            <Text style={styles.statTitle}>CREDIT </Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
          <View style={styles.statCenter}>
            <Text style={styles.statTitle}>CHECKPOINT </Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
          <View style={styles.statRight}>
            <Text style={styles.statTitle}>SCORE </ Text>
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
            [currentDate]: { selected: true, marked: true, selectedColor: 'orange' },
          }}
          theme={{
            calendarBackground: '#41419F',
            textSectionTitleColor: 'white',
            dayTextColor: 'white',
            todayTextColor: 'orange',
            selectedDayTextColor: 'white',
            monthTextColor: 'white',
            arrowColor: 'white',
            'stylesheet.calendar.header': {
              week: {
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            },
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    padding: 0,
  },
  headerBackground: {
    width: '100%',
    padding: 0,
    alignItems: 'center',
    marginTop: 0,
  },
  profileTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 40,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
  },
  editIcon: {
    position: 'absolute',
    top: -20,
    right: -150,
    backgroundColor: 'transparent',
    padding: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  statLeft: {
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  statCenter: {
    alignItems: 'center',
    flex: 1,
  },
  statRight: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  statTitle: {
    color: 'white',
    fontSize: 16,
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statValueContainer: {
    backgroundColor: '#2F2F6B',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 5,
    borderColor: 'white',
    borderWidth: 1,
  },
  historyTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'left',
  },
  calendar: {
    backgroundColor: '#41419F',
    borderRadius: 10,
    padding: 10,
  },
  contentContainer: {
    padding: 20,
  },
});

export default Profile;

