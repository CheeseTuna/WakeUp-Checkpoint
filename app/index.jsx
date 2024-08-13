import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  LogBox,
} from "react-native";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { registerBackgroundTask } from "./backgroundTasks";
import ScheduleAlarm from "./ScheduleAlarm";
import * as Notifications from "expo-notifications";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";
import { images } from "../constants";

LogBox.ignoreLogs([
  "Support for defaultProps will be removed from memo components in a future major release.",
]);

const configureNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("You need to enable notifications for the alarm to work.");
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  useEffect(() => {
    configureNotifications();
    registerBackgroundTask();
  }, []);

  if (!isLoading && isLoggedIn) return <Redirect href="/profile" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View
          className="w-full flex justify-center items-center min-h[85vh] px-4"
          style={{ marginTop: 20 }}
        >
          <Image
            source={images.header}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          <Image
            source={images.landingscreen}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-2xl text-white font-bold text-center">
              Race to Silence Alarms{"\n"}
              with WakeUp <Text className="text-secondary-200">CheckPoint</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-xl font-pregular text-gray-100 mt-7 text-center">
            Survive hilarious wake-up calls from friends!
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("log-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
