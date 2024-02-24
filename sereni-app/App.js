// App.js
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { NativeBaseProvider } from 'native-base';
import { FIREBASE_AUTH } from './firebase';  // Importa la instancia de autenticación

import LoadingPage from './components/LoadingPage';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import PulsoScreen from './components/PulsoScreen';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-VariableFont_slnt,wght.ttf'),
    // Agrega otras variantes si las necesitas (Bold, Italic, etc.)
  });

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Maneja el estado del usuario
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = FIREBASE_AUTH.onAuthStateChanged(onAuthStateChanged);
    return () => subscriber(); // desuscribirse al finalizar
  }, []);

  if (!fontsLoaded || initializing) {
    return <LoadingPage />; // Muestra un indicador de carga mientras se cargan las fuentes o se inicializa la autenticación
  }

  return (
    <>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoadingPage" component={LoadingPage} />
            <Stack.Screen name="Home" component={user ? Home : LandingPage} />
            <Stack.Screen name="Signup" component={SignUp} />
            <Stack.Screen name="Inicio" component={Home} />
            <Stack.Screen name="PulsoScreen" component={PulsoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </NativeBaseProvider>
    </>
  );
}
