import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
} from "react-native";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../FirebaseConfig";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../NavigationTypes";
import FirestoreService from "../FirestoreService";

const AuthenticationScreen = () => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Root">>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Håndterer innlogging med e-post og passord
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log("Logget inn med:", userCredentials.user.email);
        navigation.navigate("Root", { screen: "Profile" });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  // Håndterer opprettelse av ny brukerkonto
  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log("Registrert med:", userCredentials.user.email);

   // Legger til brukerprofil i Firestore etter vellykket registrering     
        FirestoreService.addUserProfile(userCredentials.user.uid, {
          name: "Navn",
          email: userCredentials.user.email,
          image: "",
          bio: "",
        });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <ImageBackground
      source={require("../assets/TravelSnap.png")}
      style={styles.backgroundImage}
      blurRadius={10}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="E-post"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Passord"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Logg Inn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>Registrer</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  input: {
    width: "80%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "white",
  },
  button: {
    width: "80%",
    padding: 15,
    marginVertical: 8,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  registerButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AuthenticationScreen;
