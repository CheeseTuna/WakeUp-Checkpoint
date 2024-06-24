import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router';

import { icons } from '../../constants';

const TabIcon = ({ icon, color, name, focused}) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
        />

        <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }} >
        {name}
      </Text>
    </View>
  )

}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            boarderTopWidth: 1,
            boarderTopColor: '#232533',
            height: 84,
          }
        }}
      
      >
        <Tabs.Screen
          name="alarm"
          options={{
            title: 'Alarm',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={icons.alarm}
                color={color}
                name="Alarm"
                focused={focused}
              />
            )
          }}
          />
          <Tabs.Screen
          name="friends"
          options={{
            title: 'Friends',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={icons.friends}
                color={color}
                name="Friends"
                focused={focused}
              />
            )
          }}
          />
  
          <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={icons.profile_new}
                color={color}
                name="Profile"
                focused={focused}
              />
            )
          }}
          />
          <Tabs.Screen
          name="alerts"
          options={{
            title: 'Alerts',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={icons.bell}
                color={color}
                name="Alerts"
                focused={focused}
              />
            )
          }}
          />
      </Tabs>
    </>
  )
}

export default TabsLayout