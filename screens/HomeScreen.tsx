import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { ImageInfo } from "../NavigationTypes";

type RootStackParamList = {
  // Type definisjoner for navigasjonsparametere
  Root: undefined;
  Details: undefined;
  PhotoDetail: { photo: { url: string; description: string } };
};

type HomeNavigationProp = StackNavigationProp<RootStackParamList, "Root">;

const HomeScreen = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const navigation = useNavigation<HomeNavigationProp>();

  // Henter bilder fra Firestore
  const fetchImages = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "images"));
      // Konverterer Firestore-dokumenter til ImageInfo objekter
      const fetchedImages = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            liked: false,
            ...doc.data(),
          } as ImageInfo)
      );
      setImages(fetchedImages);
    } catch (error) {
      console.error("Feil under henting av bilder:", error);
    }
  }, []);

   // Kjører fetchImages når skjermen får fokus
  useFocusEffect(
    useCallback(() => {
      fetchImages();
    }, [fetchImages])
  );
  
  // Kjører fetchImages ved første render
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);


   // Håndterer liker-knappen for hvert bilde
  const toggleLike = useCallback((id: string) => {
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.id === id ? { ...image, liked: !image.liked } : image
      )
    );
  }, []);

  // Renderfunksjon for hvert element i FlatList
  const renderItem = useCallback(
    ({ item }: { item: ImageInfo }) => (
      <Pressable
        style={styles.imageContainer}
        // @ts-ignore
        onPress={() => navigation.navigate('Details', { photo: item })}
      >
        <Image source={{ uri: item.url }} style={styles.image} />
        <Text style={styles.descriptionText}>{item.description}</Text>
        <Pressable
          onPress={() => toggleLike(item.id)}
          style={styles.likeButton}
        >
          <Text style={styles.buttonText}>{item.liked ? "❤️" : "🤍"}</Text>
        </Pressable>
      </Pressable>
    ),
    [toggleLike, navigation]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
  },
  imageContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  likeButton: {
    alignSelf: "flex-start",
    borderRadius: 20,
    padding: 5,
    marginTop: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 5,
  },
});

export default HomeScreen;
