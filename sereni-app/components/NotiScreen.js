// NotiScreen.js
import React, { useState, useEffect } from 'react';
import { Alert, Platform, RefreshControl, StyleSheet, Dimensions } from 'react-native';
import { View, Text, VStack, ScrollView, KeyboardAvoidingView, WarningOutlineIcon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { ref, get } from 'firebase/database';
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebase'; // Ajusta la ruta de importación según la ubicación de tu archivo de configuración de Firebase
import Translate from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const NotiScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [highPulseData, setHighPulseData] = useState([]);
  const currentUser = FIREBASE_AUTH.currentUser; // Asegúrate de haber importado FIREBASE_AUTH desde tu configuración de Firebase 

  useEffect(() => {
    if (currentUser) {
    loadHighPulseData();
    } else {
      navigation.navigate('Home');
    }
  }, [refreshing, highPulseData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHighPulseData();
    setRefreshing(false);
  };

  const loadHighPulseData = async () => {
    try {
      const pulsesRef = ref(FIREBASE_DB, `users/${currentUser.uid}/pulse`);
      const pulsesSnapshot = await get(pulsesRef);

      if (pulsesSnapshot.exists()) {
        const pulsesData = pulsesSnapshot.val();
        const highPulses = [];

        Object.keys(pulsesData).forEach((key) => {
          const pulseValue = pulsesData[key].valor;
          if (pulseValue > 100) {
            highPulses.push({
              key,
              valor: pulseValue,
              timestamp: pulsesData[key].timestamp,
            });
          }
        });

        // Ordenar las pulsaciones altas por timestamp de forma descendente
        highPulses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setHighPulseData(highPulses);
      } else {
        setHighPulseData([]);
      }
    } catch (error) {
      console.error("Error al cargar los datos de pulsaciones altas", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const renderHighPulseCards = () => {
    return highPulseData.map((pulse) => {
      const valorPulso = pulse.valor || 0;
      const valorMaximo = 200;
      const porcentajeLlenado = (valorPulso / valorMaximo) * 100;

    return (
      <View key={pulse.key} style={styles.pulseCard}
        className="bg-red-200 p-4"
      >
        <View className="flex-row justify-between items-center" style={styles.timestampText}>
              <Text className="text-3xl text-left text-gray-900/70  font-semibold">{pulse.valor}</Text> 
              <View className="w-full p-2">
                <View className="mr-12 mb-3">
                  <Text className="text-right text-gray-500" style={{ marginRight: "10px" }}>
                    {formatTimestamp(pulse.timestamp)}&nbsp;&nbsp;
                    <Tooltip width={windowWidth * 0.73} height={windowHeight * 0.33} popover={
                      <Text className="text-white text-justify p-2">
                        {t("pulse.normalPulseText.intro.text")} <Text style={{ fontWeight: 'bold' }}>{t("pulse.normalPulseText.intro.boldText")}</Text>,&nbsp;
                        {t("pulse.normalPulseText.childrenIntro")} <Text style={{ fontWeight: 'bold' }}>{t("pulse.normalPulseText.childrenBoldText")}</Text>.&nbsp;
                        {t("pulse.normalPulseText.conclusion")}
                      </Text>
                    }>
                      <WarningOutlineIcon size={5} />
                    </Tooltip>
                  </Text>
                </View>
                <View className="ml-4" style={{ width: windowWidth * 0.65, height: 5, backgroundColor: '#e0e0e0', borderRadius: 5 }}>
                  <View className="text-right" style={{ width: `${porcentajeLlenado}%`, height: '100%', backgroundColor: '#ef4444', borderRadius: 5 }} />
                </View>
              </View>
            </View>
      </View>
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <VStack space={4} p={6} bg="#edf3f2" rounded="lg" shadow={4} alignItems="center">
            {renderHighPulseCards()}
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.translateContainer}>
        <Translate refreshing={refreshing} setRefreshing={setRefreshing} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  translateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  pulseCard: {
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    margin: 10,
  },
});

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export default NotiScreen;

