import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';


export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View >
          <Image
            source={images.header}
            className="w-[136px] h-[100px] absolute -bottom-20 left-4"
            resizeMode="contain"
          />
        </View>
        
        <View className="w-full justify-center items-center h-full px-4">

          <Text className="text-center text-xl font-bold p-4 text-white">
            Race to silence alarms
          </Text>
          <Text className="text-center text-xl font-bold p-4 text-white">
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
