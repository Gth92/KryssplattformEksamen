import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import DetailScreen from '../screens/DetailScreen';
import { RootStackParamList } from '../NavigationTypes';

const Stack = createStackNavigator<RootStackParamList>();


// Oppretter Stack.Navigator som omslutter de forskjellige skjermene
const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
