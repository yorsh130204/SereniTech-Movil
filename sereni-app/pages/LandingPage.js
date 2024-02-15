import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock } from 'react-feather';

function LandingPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setError('');

      // Check if the password is at least 8 characters
      if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres.');
      }

      setLoading(true);
      await login(email, password);
      irAInicio();
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      setError(error.message || "Error al iniciar sesión");
      Alert.alert('Error', error.message || "Error al iniciar sesión");
    }

    setLoading(false);
  };
  
  const irASignup = () => {
    // Aquí puedes navegar a la pantalla de signup
    navigation.navigate('Signup'); // Ajusta el nombre de la pantalla según tu configuración de React Navigation
  };

  const irAInicio = () => {
    // Aquí puedes navegar a la pantalla de signup
    navigation.navigate('Inicio'); // Ajusta el nombre de la pantalla según tu configuración de React Navigation
  }

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
          ref={emailRef}
        />
        <TextInput 
          className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
          placeholder="Contraseña: (Minimo 8 caracteres)"
          ref={passwordRef}
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
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-lg font-medium text-center text-white">
          Iniciar Sesión
        </Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  containerSvg: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
});
