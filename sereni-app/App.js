import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import PulsoScreen from './components/PulsoScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <React.Fragment>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={LandingPage} />
          <Stack.Screen name="Signup" component={SignUp} />
          <Stack.Screen name="Inicio" component={Home} />
          <Stack.Screen name="PulsoScreen" component={PulsoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </React.Fragment>
  );
}
