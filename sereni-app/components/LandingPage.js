import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

function LandingPage() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-500">
      <Image
        source={require('../assets/favicon.png')}
        className="w-40 h-40 mb-4"
        resizeMode="contain"
      />
      <Text className="text-blue text-3xl font-bold mb-4">
        ¡Bienvenido a la Landing Page!
      </Text>
      <TouchableOpacity
        className="bg-white p-4 rounded w-80 mb-2"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-blue-500 font-bold text-lg text-center">
          Iniciar Sesión
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-white p-4 rounded w-80"
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text className="text-blue-500 font-bold text-lg text-center">
          Registrarse
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LandingPage;
