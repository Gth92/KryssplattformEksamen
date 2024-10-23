import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "./FirebaseConfig";

const db = getFirestore(app);
const storage = getStorage(app);

const FirebaseImageService = {
  uploadImage: async (imageUri) => {
    try {
      // Genererer et filnavn basert på URI og forbereder en referanse i Firebase Storage
      const fileName = `images/${imageUri.split("/").pop()}`;
      const reference = ref(storage, fileName);

      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(reference, blob);
      
       // Henter og returnerer nedlastings-URL for det opplastede bildet
      const downloadURL = await getDownloadURL(reference);
      return downloadURL;
    } catch (error) {
      console.error("Feil under opplasting av bilde:", error);
      return null;
    }
  },

  addImageToFirestore: async (imageUrl, description, location) => {
    try {
      const docRef = await addDoc(collection(db, "images"), {
        url: imageUrl,
        description,
      });
      console.log("Bilde lagret i Firestore med ID:", docRef.id);
    } catch (error) {
      console.error("Feil under lagring til Firestore:", error);
    }
  },

  
};

export default FirebaseImageService;
