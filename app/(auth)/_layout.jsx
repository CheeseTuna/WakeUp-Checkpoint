import { View, Text } from 'react-native'
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="log-in"
          options={{
            headerShwon: false
          }}
        />
        <Stack.Screen 
          name="register"
          options={{
            headerShwon: false
          }}
        />

      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  )
}

export default AuthLayout