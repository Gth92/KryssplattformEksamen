import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import FirebaseImageService from "../FirebaseImageService";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, updateDoc, DocumentData } from "firebase/firestore";
import FirestoreService from "../FirestoreService";

const auth = getAuth();
const db = getFirestore();
const defaultProfilePicture =
  "https://firebasestorage.googleapis.com/v0/b/travel-7d0f7.appspot.com/o/images%2FnoImage.png?alt=media&token=20d3e5ea-9d3d-4caa-8ffe-8face9928e70";

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState({
    image: defaultProfilePicture,
    name: "Anonym Bruker",
    bio: "Elsker Naturen",
    email: auth.currentUser?.email || "Ingen e-post registrert",
  });
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);
  
  // Toggler mellom redigeringsmodus og visningsmodus
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
    // Last inn brukerprofil fra Firestore
  const loadUserProfile = async () => {
    if (!auth.currentUser) {
      Alert.alert("Feil", "Ingen bruker er logget inn.");
      return;
    }

    try {
      const profileData = await FirestoreService.getUserProfile(
        auth.currentUser.uid
      );
      if (profileData) {
        setUserProfile({ ...userProfile, ...profileData });
        setNewName(profileData.name || "");
        setNewBio(profileData.bio || "");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Feil", "Kunne ikke hente brukerdata.");
    }
  };
  
  // Velg et bilde fra enheten og oppdater profilbildet i Firestore
  const pickImageAndUpdateProfile = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Required permissions",
        "You need to grant permission to access your photos."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });

    if (!pickerResult.canceled && pickerResult.assets) {
      try {
        const uri = pickerResult.assets[0].uri;
        const uploadedImageUrl = await FirebaseImageService.uploadImage(uri);
        if (uploadedImageUrl && auth.currentUser?.uid) {
          await FirestoreService.updateUserProfile(auth.currentUser.uid, {
            profilePicture: uploadedImageUrl,
          });
          setUserProfile((prevState) => ({
            ...prevState,
            profilePicture: uploadedImageUrl,
          }));
          Alert.alert("Suksess", "Profilbilde oppdatert.");
        } else {
          Alert.alert("Feil", "Kunne ikke laste opp bildet.");
        }
      } catch (e) {
        console.error(e);
        Alert.alert("Feil", "En feil oppstod under opplasting.");
      }
    }
  };

  // Håndter lagring av endret profil
  const handleSaveProfile = async () => {
    if (auth.currentUser?.uid) {
      const updatedProfile = {
        ...userProfile,
        name: newName,
        bio: newBio,
      };

      try {
        await FirestoreService.updateUserProfile(
          auth.currentUser.uid,
          updatedProfile
        );
        setUserProfile(updatedProfile);
        Alert.alert("Suksess", "Profilen er oppdatert.");
        toggleEditMode();
      } catch (error) {
        console.error(error);
        Alert.alert("Feil", "Kunne ikke oppdatere profilen.");
      }
    }
  };
   
  // Håndter brukerutlogging
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Suksess", "Du er nå logget ut.");
      // Tilleggsfunksjonalitet for å navigere tilbake til innloggingssiden
    } catch (error) {
      console.error(error);
      Alert.alert("Feil", "Kunne ikke logge ut.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: userProfile.image || defaultProfilePicture }}
        style={styles.profilePicture}
      />
      <Button title="Endre Profilbilde" onPress={pickImageAndUpdateProfile} />
      <View style={styles.contentWrapper}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Bio"
              value={newBio}
              onChangeText={setNewBio}
            />
          </>
        ) : (
          <>
            <Text style={styles.text}>Name: {userProfile.name}</Text>
            <Text style={styles.text}>Bio: {userProfile.bio}</Text>
          </>
        )}
        <Text style={styles.text}>Email: {userProfile.email}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={toggleEditMode}>
        <Text style={styles.buttonText}>
          {isEditing ? "Avbryt" : "Rediger"}
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Lagre Endringer</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logg Ut</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  contentWrapper: {
    width: "90%",
    backgroundColor: "white",
    marginTop: 20,
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  input: {
    width: "90%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "white",
  },
  button: {
    width: "90%",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#007bff",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
  },
});

export default ProfileScreen;
