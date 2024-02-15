import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import PulsoScreen from './components/PulsoScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={LandingPage} />
          <Stack.Screen name="Signup" component={SignUp} />
          <Stack.Screen name="Inicio" component={Home} />
          <Stack.Screen name="PulsoScreen" component={PulsoScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
  );
}

