//SignUp.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

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

      if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
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
        width={windowWidth}
        height={windowWidth * 323 / 355}
        fill="none"
      >
        <Path
          fill="#3d79a0"
          d={`M0 0h${windowWidth}v306.594c-105.105 90.314-298.103-87.185-${windowWidth} 0V0Z`}
        />
        <Path
          fill="#246894"
          fillOpacity={0.5}
          d={`M${windowWidth} 5.408H0V306.71c165.105 88.377 298.103-85.314 ${windowWidth} 0V5.408Z`}
        >
        </Path>
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
            <SvgTop 
              style={{ height: windowHeight * 0.3}}
            />            
            <Animatable.Image
              className="absolute top-10"
              source={require('../assets/favicon.png')}
              style={{ width: 250, height: 250 }}
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              duration={800}
            />
        </View>
        <View className="items-center justify-center mt-4">
          <Text 
            className="text-[#042a59] text-left font-bold mt-2 mb-2"
            style={{ fontSize: 50, fontFamily:"Inter-Regular"}}
          >
            ¡Registrate!
          </Text>
          <Text
            className="text-gray-500 text-left"
            style={{ fontSize: 18, fontFamily:"Inter-Regular"}}
          >
            Registrate para crear una cuenta
          </Text>
          <TextInput
            className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
            placeholder="Nombre: (Ejemplo: Juan)"
            value={name}
            onChangeText={(text) => setName(text)}
            style={{ fontFamily: 'Inter-Regular'}}
          />
          <TextInput 
            className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
            placeholder="Correo: (ejemplo@correo.com)"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={{ fontFamily: 'Inter-Regular'}}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput 
              className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
              placeholder="Contraseña: (Minimo 8 caracteres)"
              secureTextEntry={passwordVisibility}
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{ fontFamily: 'Inter-Regular'}}
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
              placeholder="Confirmar: (Minimo 8 caracteres)"
              secureTextEntry={confirmPasswordVisibility}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              style={{ fontFamily: 'Inter-Regular'}}
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
            style={{ fontSize: 16, fontFamily:"Inter-Regular"}}
          >
            ¿Ya tienes una cuenta?{' '}
            <Text 
              className="text-[#042a59] font-bold mt-1 underline"
              style={{ fontSize: 16, fontFamily:"Inter-Regular"}}
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
          <Text className="text-lg font-medium text-center text-white" style={{ fontFamily:"Inter-Regular" }}>
            Registrarse
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
