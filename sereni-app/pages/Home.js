import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from 'react-native';

// Importa las pantallas
import PulsoScreen from '../components/PulsoScreen';
import GPSScreen from '../components/GPSScreen';
import NotiScreen from '../components/NotiScreen';
import CuentaScreen from '../components/CuentaScreen';

const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 56, // Ajusta la altura según tus preferencias
          backgroundColor: '#127cb1', // Color de fondo
        },
        tabBarLabelStyle: {
          fontSize: 12, // Ajusta el tamaño del texto
          paddingBottom: 5, // Ajusta el margen debajo del nombre
        },
        tabBarTabStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          marginBottom: 1,
          marginTop: 6,
        },
        tabBarActiveTintColor: 'white', // Color del icono y texto activo
        tabBarInactiveTintColor: '#93e3d3', // Color del icono y texto inactivo
        headerTitle: ({ focused, color }) => (
          <Text className="italic text-lg text-[#0b4b7d]">
            {route.name}
          </Text>
        ),
      })}
    >
      <Tab.Screen
        name="Pulso" 
        component={PulsoScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="heartbeat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="GPS" 
        component={GPSScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marker" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Notificaciones" 
        component={NotiScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cuenta" 
        component={CuentaScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
