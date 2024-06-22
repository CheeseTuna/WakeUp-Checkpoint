import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';


export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View className="w-full justify-center items-center h-full px-4">

          <Image
            source={images.header}
            className="max-w-[100px] w-full h-[100px]"
            resizeMode="contain"
          />

          <Text className="text-center text-lg font-bold p-4 text-white">
            Race to silence alarms
          </Text>
          <Text className="text-center text-lg font-bold p-4 text-white">
            Survive hilarious wake-up calls from friends!
          </Text>
          
          <Image
            source={images.landingscreen}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
            
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
