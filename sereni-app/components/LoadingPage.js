// LoadingPage.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
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
      {/* Puedes mostrar tu logo de carga o cualquier otro componente */}
      <Image source={require('../assets/favicon.png')} style={styles.logo} />
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
    width: 200, // Ajusta el ancho según tus necesidades
    height: 200, // Ajusta el alto según tus necesidades
  },
});

export default LoadingPage;
