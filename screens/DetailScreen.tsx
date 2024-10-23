import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../NavigationTypes';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const DetailScreen = ({ route }: { route: DetailScreenRouteProp }) => {
  // Henter bildeinformasjon fra navigasjonsparametere
  const { photo: image } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: image.url }} style={styles.image} />
      <Text style={styles.descriptionText}>{image.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
});


export default DetailScreen;
