import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { Redirect, router} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';


export default function App() {
  return (
    
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%'}}>
      <View className="w-full flex justify-center items-center min-h[85vh] px-4">
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
              with WakeUp{" "}
              <Text className="text-secondary-200">CheckPoint</Text>
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
            handlePress={() => router.push('log-in')}
            containerStyles="w-full mt-7"
          />
          
          
        </View>
        
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light'/>
    </SafeAreaView>
  );
}
