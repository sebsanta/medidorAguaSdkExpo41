import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function ProfileScreen() {
  
  const { user } = route.params;
  console.log("user from google", user);
  return (
    <View>
      <Text>Profile Screen</Text>
      <Text>Welcome {user.name} !</Text>
    </View>
    );
};

const styles = StyleSheet.create({})
