import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { findUserByUid } from "../services/UserService";

const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (name, email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log("profile updated successfully");
      })
      .catch((err) => {
        console.log("error updating profile", err);
      });
    return auth;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {      
        // Llama a la función findUserByUid
        const userData = await findUserByUid(currentUser.uid);
        console.log("userDataaa",userData)
        if (userData) {
          const imageUrl = userData.imageProfile; // Accede a la URL de la imagen
          // Combina la información del usuario
          setUser({ ...currentUser, ...userData, photoURL: imageUrl });
        } else {
          setUser(currentUser); // Si no existe, establece solo el usuario actual
        }
      } else {
        setUser(null); 
      }
      setLoading(false); // Termina la carga
    });


    return () => unsubscribe();
  }, []);

  const updateUserProfile = (newProfileData) => {
    setUser((prevUser) => ({ ...prevUser, ...newProfileData }));
  };

  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        logout,
        loading,
        loginWithGoogle,
        updateUserProfile 
      }}
    >
      {children}
    </authContext.Provider>
  );
}
