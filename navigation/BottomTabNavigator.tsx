import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthenticationScreen from '../screens/AuthenticationScreen';
import { getAuth } from 'firebase/auth';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  // Henter Firebase-autentisering
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <Tab.Navigator>
      {user ? (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Upload" component={UploadScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <Tab.Screen name="Log In" component={AuthenticationScreen} />
      )}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
