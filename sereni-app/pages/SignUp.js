import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function Signup() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);
  const [passwordRightIcon, setPasswordRightIcon] = useState('eye');
  const [confirmPasswordRightIcon, setConfirmPasswordRightIcon] = useState('eye');

  const auth = FIREBASE_AUTH;
  const signup = async () => {
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
  
      // Create user in authentication
      const authResponse = await createUserWithEmailAndPassword(auth, email, password);
  
      // Save additional user information in the Realtime Database
      const userId = authResponse.user.uid;
      const userRef = ref(FIREBASE_DB, `users/${userId}`);
      await set(userRef, {
        name: name,
        email: email,
        uid: userId,
        // Other properties you want to store
      });
  
      console.log('Usuario creado exitosamente');
      irAHome();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const irAHome = () => {
    // Aquí puedes navegar a la pantalla de signup
    navigation.navigate('Inicio'); // Ajusta el nombre de la pantalla según tu configuración de React Navigation
  };

  const irALogin = () => {
    // Aquí puedes navegar a la pantalla de login
    navigation.navigate('Home'); // Ajusta el nombre de la pantalla según tu configuración de React Navigation
  };

  const handlePasswordVisibility = () => {
    setPasswordRightIcon((prevIcon) => (prevIcon === 'eye' ? 'eye-slash' : 'eye'));
    setPasswordVisibility(!passwordVisibility);
  };

  const handleConfirmPasswordVisibility = () => {
    setConfirmPasswordRightIcon((prevIcon) => (prevIcon === 'eye' ? 'eye-slash' : 'eye'));
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
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
            placeholder="Nombre: (Ejemplo: Juan)"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput 
            className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
            placeholder="Correo: (ejemplo@correo.com)"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput 
              className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
              placeholder="Contraseña: (Minimo 8 caracteres)"
              secureTextEntry={passwordVisibility}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={{ marginLeft: -30, marginTop: 20 }} 
              onPress={handlePasswordVisibility}
            >
              <Icon name={passwordRightIcon} size={25} color="#042a59"/>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput 
              className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
              placeholder="Confirmar contraseña: (Minimo 8 caracteres)"
              secureTextEntry={confirmPasswordVisibility}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <TouchableOpacity
              style={{ marginLeft: -30, marginTop: 20 }}  
              onPress={handleConfirmPasswordVisibility}
            >
              <Icon name={confirmPasswordRightIcon} size={25} color="#042a59"/>
            </TouchableOpacity>
          </View>
          {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
          <Text 
            className="text-[#042a59] text-center font-bold mt-6"
            style={{ fontSize: 16}}
          >
            ¿Ya tienes una cuenta?{' '}
            <Text 
              className="text-[#042a59] font-bold mt-1 underline"
              style={{ fontSize: 16}}
              onPress={irALogin}
            >
              Iniciar Sesión
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          className="w-48 px-8 py-4 bg-gray-500 rounded-md transition duration-300 hover:bg-gray-600 mt-3 mb-10"
          disabled={loading}
          onPress={signup}
        >
          <Text className="text-lg font-medium text-center text-white">
            Registratarse
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  containerSvg: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
});
