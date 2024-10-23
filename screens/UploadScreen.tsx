import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NavigationProp } from "@react-navigation/native";
import FirebaseImageService from "../FirebaseImageService";

const UploadScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  // Velger et bilde fra enhetens bildegalleri
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Tillatelser nødvendig",
        "Du må gi tillatelse til å få tilgang til dine bilder."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    if (!pickerResult.canceled && pickerResult.assets) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    // Logger URI for bildet som skal lastes opp, nyttig for feilsøking
    console.log("Uploading image with URI:", imageUri); 
    if (imageUri && description) {
      try {
        console.log("Starting upload process...");
        const uploadedImageUrl = await FirebaseImageService.uploadImage(
          imageUri
        );
        console.log("Image uploaded, URL:", uploadedImageUrl);

        if (uploadedImageUrl) {
          await FirebaseImageService.addImageToFirestore(
            uploadedImageUrl,
            description
          );
          Alert.alert("Suksess", "Bildet er lastet opp.", [
            { text: "OK", onPress: () => navigation.navigate("Home") },
          ]);
        } else {
          Alert.alert("Feil", "Kunne ikke laste opp bildet.");
        }
      } catch (e) {
        console.error("Error during upload:", e);
        Alert.alert("Feil", "En feil oppstod under opplasting.");
      }
    } else {
      Alert.alert("Feil", "Både bilde og beskrivelse er nødvendig.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ paddingBottom: 10 }}>Velg bilde og beskrivelse</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Image
            source={require("../assets/square.and.arrow.up.circle.png")}
            style={styles.image}
          />
        )}
      </TouchableOpacity>

      {imageUri && (
        <TextInput
          style={styles.input}
          placeholder="Bildebeskrivelse"
          value={description}
          onChangeText={setDescription}
        />
      )}
      <Button
        title="Last Opp Bilde"
        onPress={handleUpload}
        disabled={!imageUri}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
});

export default UploadScreen;
