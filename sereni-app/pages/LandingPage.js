//LandingPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, RefreshControl, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { FIREBASE_AUTH } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { useTranslation } from 'react-i18next';
import Translate from '../components/LanguageSwitcher';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

function LandingPage() {
  const { t } = useTranslation();

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [passwordRightIcon, setPasswordRightIcon] = useState('eye');
  const [refreshing, setRefreshing] = useState(false);

  const login = async () => {
    setRefreshing(true);
    try {
      const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log(response);
      irAInicio();
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setRefreshing(false);
    }
  }

  const irASignup = () => {
    navigation.navigate('Signup');
  };

  const irAInicio = () => {
    navigation.navigate('Inicio');
  };

  const handlePasswordVisibility = () => {
    setPasswordRightIcon((prevIcon) => (prevIcon === 'eye' ? 'eye-slash' : 'eye'));
    setPasswordVisibility(!passwordVisibility);
  };

  function SvgTop(){
    return (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={windowWidth}
        height={windowWidth * 333 / 355}
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
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      >
        <ScrollView className="bg-gray-200" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {}} />}>
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
          <View className="items-center justify-center mt-1">
            <Text 
              className="text-[#042a59] text-left font-bold mt-2 mb-2"
              style={{ fontSize: 50, fontFamily: 'Inter-Regular'}}
            >
              {t("welcome.title")}
            </Text>
            <Text
              className="text-gray-500 text-left"
              style={{ fontSize: 18, fontFamily: 'Inter-Regular'}}
            >
              {t("welcome.subtitle")}
            </Text>
            <TextInput 
              className="bg-white border-2 border-white w-80 h-12 mt-7 p-3 rounded-2xl"
              placeholder={t("welcome.emailPlaceholder")}
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{ fontFamily: 'Inter-Regular'}}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput 
                className="bg-white border-2 border-white w-80 h-12 mt-5 p-3 rounded-2xl"
                placeholder={t("welcome.passwordPlaceholder")}
                secureTextEntry={passwordVisibility}
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={{ fontFamily: 'Inter-Regular'}}
              />
              <TouchableOpacity
                style={{ marginLeft: -30, marginTop: 20, marginRight: 8}} 
                onPress={handlePasswordVisibility}
              >
                <Icon name={passwordRightIcon} size={22} color="#042a59"/>
              </TouchableOpacity>
            </View>
            {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
            <Text 
              className="text-[#042a59] text-center font-bold mt-6"
              style={{ fontSize: 16, fontFamily:"Inter-Regular"}}
            >
              {t("welcome.noAccount")}{' '}
              <Text 
                className="text-[#042a59] font-bold mt-1 underline"
                style={{ fontSize: 16, fontFamily:"Inter-Regular"}}
                onPress={irASignup}
              >
                {t("welcome.registerLink")}
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            className="w-auto px-8 py-4 bg-gray-500 rounded-md transition duration-300 hover:bg-gray-600 mt-6 mb-6"
            disabled={loading}
            onPress={login}
          >
            <Text className="text-lg font-medium text-center text-white" style={{ fontFamily:"Inter-Regular" }}>
              {t("buttons.login")}
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.translateContainer}>
        <Translate refreshing={refreshing} setRefreshing={setRefreshing} />
      </View>
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  containerSvg: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  translateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});
