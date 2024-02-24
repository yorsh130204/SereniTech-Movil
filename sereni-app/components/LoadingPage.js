// LoadingPage.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const LoadingPage = ({ navigation }) => {
  useEffect(() => {
    // Simula una carga de 30 segundos (30000 milisegundos)
    const timeout = setTimeout(() => {
      // Navega a la página principal después de la carga
      navigation.navigate('Home');
    }, 2500);

    return () => clearTimeout(timeout); // Limpia el temporizador al desmontar el componente
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo con animación de pulso */}
      <Animatable.Image
        source={require('../assets/favicon.png')}
        style={styles.logo}
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
        duration={800}
      />
      {/* Texto debajo del logo con animación de pulso */}
      <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" duration={800}>
        <Text 
          style={styles.appName}
          className="text-[#246894] text-left font-bold mt-2 mb-2"
        >
          SereniApp
        </Text>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 275, // Ajusta el ancho según tus necesidades
    height: 275, // Ajusta el alto según tus necesidades
  },
  appName: {
    marginTop: 50, // Ajusta el margen superior según tus necesidades
    fontSize: 34, // Ajusta el tamaño de la fuente según tus necesidades
    fontWeight: 'bold',
  },
});

export default LoadingPage;
