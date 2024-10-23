import { app } from "./FirebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const db = getFirestore(app);

const FirestoreService = {
  addUserProfile: async (userId, profileData) => {
    try {
      // Bruker setDoc til å opprette eller overskrive et dokument med det spesifiserte userId
      await setDoc(doc(db, "userProfiles", userId), {
        ...profileData,
      });
      console.log("Profil lagret for bruker ID: ", userId);
    } catch (error) {
      console.error("Feil under lagring av brukerprofil: ", error);
    }
  },

  updateUserProfile: async (userId, profileData) => {
    try {
      const userDocRef = doc(db, "userProfiles", userId);
      await updateDoc(userDocRef, profileData);
    } catch (error) {
      console.error("Feil under oppdatering av brukerprofil: ", error);
    }
  },

  // Andre metoder i FirestoreService

  getUserProfile: async (userId) => {
    try {
      const docRef = doc(db, "userProfiles", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data(); 
      } else {
        console.log("Ingen brukerprofil funnet!");
        return null; 
      }
    } catch (error) {
      console.error("Feil under henting av brukerprofil: ", error);
      throw error; 
    }
  },

  addImageInfo: async (imageUrl, description) => {
    try {
      const docRef = await addDoc(collection(db, "images"), {
        url: imageUrl,
        description,
      });
      console.log("Bilde lagret med ID: ", docRef.id);
    } catch (error) {
      console.error("Feil under lagring av bildeinformasjon: ", error);
    }
  },

  getImages: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "images"));
      const images = [];
      querySnapshot.forEach((doc) => {
        images.push({ id: doc.id, ...doc.data() });
      });
      return images;
    } catch (error) {
      console.error("Feil under henting av bilder: ", error);
      return [];
    }
  },
};

export default FirestoreService;
