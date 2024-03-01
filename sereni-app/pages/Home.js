//Home.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { lazy } from 'react';

// Importa las pantallas
const PulsoScreen = lazy(() => import('../components/PulsoScreen'));
const GPSScreen = lazy(() => import('../components/GPSScreen'));
const NotiScreen = lazy(() => import('../components/NotiScreen'));
const CuentaScreen = lazy(() => import('../components/CuentaScreen'));
import Translate from '../components/LanguageSwitcher';

const Tab = createBottomTabNavigator();

const Home = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 62, // Ajusta la altura según tus preferencias
          backgroundColor: '#127cb1', // Color de fondo
          borderTopLeftRadius: 20, // Ajusta la curvatura de la esquina superior izquierda
          borderTopRightRadius: 20, // Ajusta la curvatura de la esquina superior derecha
          overflow: 'hidden', // Oculta el contenido que sobresale de las esquinas redondeadas
        },
        tabBarLabelStyle: {
          fontSize: 12, // Ajusta el tamaño del texto
          paddingBottom: 8, // Ajusta el margen debajo del nombre
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
        header: ({ navigation, route, options }) => {
          const title = route.name;

          return (
            <View className="bg-[#b8d8e8] pt-8 pb-4">
              <Text
                style={{
                  fontSize: 26, // Tamaño del texto del título
                  fontWeight: 'bold', // Peso de la fuente del título
                  color: 'white', // Color del título
                  marginBottom: 4, // Ajusta el margen inferior para hacer visible el texto
                }}
                className="italic text-center"
              >
                {title}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name={t("home.tabs.pulso")}
        component={PulsoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="heartbeat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={t("home.tabs.gps")}
        component={GPSScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marker" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={t("home.tabs.noti")}
        component={NotiScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={t("home.tabs.cuenta")}
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