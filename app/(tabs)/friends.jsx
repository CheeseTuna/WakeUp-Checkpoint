import React from 'react';
import images from '../../constants/images';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

const Friends = () => {
  return (
    <ScrollView style={styles.container}>
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
          <Text style={styles.name}>Adam</Text>
          <Text style={styles.wakeUpTime}>Wake-up Time: 6:30 AM</Text>
          <TouchableOpacity style={[styles.statusButton, { backgroundColor: 'green' }]}>
            <Text style={styles.statusText}>Awake</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.track}>
          <Image style={styles.avatar} source={images.woman} />
          <Text style={styles.name}>Jenny</Text>
          <Text style={styles.wakeUpTime}>Wake-up Time: 7:05 AM</Text>
          <TouchableOpacity style={[styles.statusButton, { backgroundColor: 'gray' }]}>
            <Text style={styles.statusText}>Sleeping</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.track}>
          <Image style={styles.avatar} source={images.lee} />
          <Text style={styles.name}>Lee</Text>
          <Text style={styles.wakeUpTime}>Wake-up Time: 8:00 AM</Text>
          <TouchableOpacity style={[styles.statusButton, { backgroundColor: 'red' }]}>
            <Text style={styles.statusText}>Wake Up!</Text>
          </TouchableOpacity>
        </View>
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
    marginRight: 10,
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
  },
  tracker: {
    marginTop: 20,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  wakeUpTime: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  statusButton: {
    padding: 5,
    borderRadius: 5,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Friends;
