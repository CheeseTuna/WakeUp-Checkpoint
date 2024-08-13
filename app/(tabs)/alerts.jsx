import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const Alerts = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Wake Lee Up!",
      body: "Go send Lee an alarm sound to wake him up!",
    },
    {
      id: "2",
      title: "Friend Request",
      body: "You have a friend request",
    },
    {
      id: "3",
      title: "Wake-up Tracker",
      body: "Adam has successfully waken up",
    },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alerts ({notifications.length})</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationBody}>{item.body}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Alerts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
    right: 0,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notification: {
    backgroundColor: "#222",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  notificationTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notificationBody: {
    color: "gray",
    fontSize: 16,
  },
});
