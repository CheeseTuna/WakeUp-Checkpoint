import React from 'react';
import images from '../../constants/images';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const Friends = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.scoreboard}>
        <Text style={styles.title}>Scoreboard 🏆</Text>
        <View style={styles.score}>
          <Image style={styles.avatar} source={images.adam} />
          <Text style={styles.name}>Adam</Text>
          <Text style={styles.points}>1,000</Text>
        </View>
        <View style={styles.score}>
          <Image style={styles.avatar} source={images.woman} />
          <Text style={styles.name}>Jenny</Text>
          <Text style={styles.points}>899</Text>
        </View>
        <View style={styles.score}>
          <Image style={styles.avatar} source={images.lee} />
          <Text style={styles.name}>Lee</Text>
          <Text style={styles.points}>340</Text>
        </View>
        <View style={styles.score}>
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
          <Text style={styles.status}>Awake</Text>
        </View>
        <View style={styles.track}>
          <Image style={styles.avatar} source={images.woman} />
          <Text style={styles.name}>Jenny</Text>
          <Text style={styles.status}>Sleeping</Text>
        </View>
        <View style={styles.track}>
          <Image style={styles.avatar} source={images.lee} />
          <Text style={styles.name}>Lee</Text>
          <Text style={styles.status}>Wake Up!</Text>
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
  status: {
    color: 'green',
    fontSize: 18,
  },
});

export default Friends;
