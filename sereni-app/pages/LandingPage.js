//LandingPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { FIREBASE_AUTH } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAvoidingView, Platform } from 'react-native';

function LandingPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;
  const login = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      irAInicio();
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const irASignup = () => {
    navigation.navigate('Signup');
  };

  const irAInicio = () => {
    navigation.navigate('Inicio');
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
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
    >
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
            ¡Bienvenido!
          </Text>
          <Text
            className="text-gray-500 text-left"
            style={{ fontSize: 18}}
          >
            Inicia Sesion en tu cuenta
          </Text>
          <TextInput 
            className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
            placeholder="Email: (ejemplo@correo.com)"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput 
            className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
            placeholder="Contraseña: (Minimo 8 caracteres)"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
          <Text 
            className="text-[#042a59] text-center font-bold mt-6"
            style={{ fontSize: 16}}
          >
            ¿No tienes una cuenta?{' '}
            <Text 
              className="text-[#042a59] font-bold mt-1 underline"
              style={{ fontSize: 16}}
              onPress={irASignup}
            >
              Registrate
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          className="w-48 px-8 py-4 bg-gray-500 rounded-md transition duration-300 hover:bg-gray-600 mt-3 mb-3"
          disabled={loading}
          onPress={login}
        >
          <Text className="text-lg font-medium text-center text-white">
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  containerSvg: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
});
