import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'


const Profile = () => {
  return (
    
    <SafeAreaView className="bg-primary">
      <FlatList
      data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
      keyExtractor={(item) => item.$id}
      renderItem={({ item })=> (
        <Text className="text-3xl text-white">{item.id}</Text>
      )}
      ListHeaderComponent={() => (
        <View className="my-6 px4 space-y-6">
          <View className="justify-between items-start flex-row mb-6">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back
                </Text>
            </View>
          </View>
        </View>
      )}
      />
    </SafeAreaView>
  )
  
}

export default Profile

const styles = StyleSheet.create({})