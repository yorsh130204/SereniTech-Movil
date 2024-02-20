// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
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

  if (!fontsLoaded) {
    return null; // Muestra un indicador de carga mientras se cargan las fuentes
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoadingPage" component={LoadingPage} />
          <Stack.Screen name="Home" component={LandingPage} />
          <Stack.Screen name="Signup" component={SignUp} />
          <Stack.Screen name="Inicio" component={Home} />
          <Stack.Screen name="PulsoScreen" component={PulsoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}
