import React, { useEffect, useContext, useState, createContext } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { firebaseConfig } from '../config/firebase'; // Asegúrate de importar la configuración de Firebase

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  // Nueva función para guardar información en la Realtime Database
  async function saveUserDataToDatabase(user, name) {
    try {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);
      await set(userRef, {
        name: name,
        email: user.email,
        uid: user.uid,
      });
    } catch (error) {
      console.error("Error al guardar datos en la base de datos", error);
    }
  }

  const value = {
    currentUser,
    signup: async (email, password, name) => {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserDataToDatabase(userCredential.user, name);
      } catch (error) {
        console.error("Error al crear la cuenta", error);
        throw error; // Re-lanza el error para que pueda ser manejado en el componente SignUp
      }
    },
    login: async (email, password) => {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error al iniciar sesión", error);
        throw error; // Re-lanza el error para que pueda ser manejado en el componente Login
      }
    },
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
