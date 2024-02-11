import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

function Signup() {
  const navigation = useNavigation();
  
  const irAHome = () => {
    // Aquí puedes navegar a la pantalla de signup
    navigation.navigate('Home'); // Ajusta el nombre de la pantalla según tu configuración de React Navigation
  };

  function SvgTop(){
    return (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={375}
        height={273}
        fill="none"
      >
        <Path
          fill="#0B4B7D"
          d="M0 0h375v246.594c-165.105 90.314-298.103-87.185-375 0V0Z"
        />
        <Path
          fill="#0B4B7D"
          fillOpacity={0.5}
          d="M375 5.408H0V246.71c165.105 88.377 298.103-85.314 375 0V5.408Z"
        />
        <Path fill="url(#a)" d="M98 37.854h179v183.864H98z" />
      </Svg>
    )
  }

  return (
    <ScrollView className="bg-gray-200">
    <View className="items-center bg-gray-200 dark:bg-gray-800" style={{ flex: 1 }}>
      <View style={styles.containerSvg}>
          <SvgTop />
          <Image
            className="absolute top-10"
            source={require('../assets/favicon.png')}
            style={{ width: 200, height: 200 }}
          />
      </View>
      <View className="items-center justify-center">
        <Text 
          className="text-[#042a59] text-left font-bold mt-2 mb-2"
          style={{ fontSize: 50}}
        >
          ¡Registrate!
        </Text>
        <Text
          className="text-gray-500 text-left"
          style={{ fontSize: 18}}
        >
          Registrate para crear una cuenta
        </Text>
        <TextInput 
          className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
          placeholder="Correo: (ejemplo@correo.com)"
        />
        <TextInput 
          className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
          placeholder="Contraseña: (Minimo 8 caracteres)"
        />
        <TextInput 
          className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
          placeholder="Confirmar contraseña: (Minimo 8 caracteres)"
        />
        <Text 
          className="text-[#042a59] text-center font-bold mt-6"
          style={{ fontSize: 16}}
        >
          ¿Ya tienes una cuenta?{' '}
          <Text 
            className="text-[#042a59] font-bold mt-1 underline"
            style={{ fontSize: 16}}
            onPress={irAHome}
          >
            Iniciar Sesión
          </Text>
        </Text>
      </View>
      <TouchableOpacity
        className="w-48 px-8 py-4 bg-gray-500 rounded-md transition duration-300 hover:bg-gray-600 mt-3 mb-10"
      >
        <Text className="text-lg font-medium text-center text-white">
          Registratarse
        </Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  containerSvg: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
});
