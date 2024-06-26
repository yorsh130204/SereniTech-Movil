// PulsoScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { Text, RefreshControl, StyleSheet, Dimensions } from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import * as Animatable from 'react-native-animatable';
import { VStack, ScrollView, View, FavouriteIcon, WarningOutlineIcon } from 'native-base';
import Translate from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PulsoScreen = () => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [actualPulse, setActualPulse] = useState(null);
  const [pulseDuration, setPulseDuration] = useState(0);
  const [isComponentActive, setIsComponentActive] = useState(false);
  const [porcentajeLlenado, setPorcentajeLlenado] = useState(0); // Agregado estado para porcentajeLlenado

  const currentUser = FIREBASE_AUTH.currentUser;

  const pulseRanges = [
    { min: 0, max: 10, duration: 1800 },
    { min: 10, max: 20, duration: 1600 },
    { min: 20, max: 30, duration: 1400 },
    { min: 30, max: 40, duration: 1200 },
    { min: 40, max: 50, duration: 1000 },
    { min: 50, max: 60, duration: 900 },
    { min: 60, max: 70, duration: 800 },
    { min: 70, max: 80, duration: 700 },
    { min: 80, max: 100, duration: 600 },
    { min: 100, max: 120, duration: 500 },
    { min: 120, max: 140, duration: 400 },
    { min: 140, max: 160, duration: 300 },
    { min: 160, max: 180, duration: 200 },
    { min: 180, max: 200, duration: 100 },
  ];

  const loadActualPulse = useCallback(() => {
    if (currentUser && isComponentActive) {
      const pulsesRef = ref(FIREBASE_DB, `users/${currentUser.uid}/pulse`);
      const unsubscribe = onValue(pulsesRef, (snapshot) => {
        const pulsesData = snapshot.val();

        if (pulsesData) {
          // Obtener las claves de los pulsos
          const pulseKeys = Object.keys(pulsesData);

          if (pulseKeys.length > 0) {
            // Ordenar las claves de pulsos por timestamp de forma descendente
            pulseKeys.sort((a, b) => {
              const timestampA = new Date(pulsesData[a].timestamp);
              const timestampB = new Date(pulsesData[b].timestamp);
              return timestampB - timestampA;
            });

            // Obtener el pulso más reciente
            const latestPulseKey = pulseKeys[0];
            const latestPulse = pulsesData[latestPulseKey];

            const stringValue = latestPulse.valor.toString(); // Convertir a cadena

            if (stringValue.length === 1) {
              latestPulse.valor = "00" + stringValue;
            } else if (stringValue.length === 2) {
              latestPulse.valor = "0" + stringValue;
            }
            // No es necesario hacer nada si ya tiene tres dígitos

            // Actualizar el estado con el pulso más reciente
            setActualPulse(latestPulse);

            const pulseDuration = pulseRanges.find(
              range => latestPulse.valor >= range.min && latestPulse.valor <= range.max
            )?.duration || 0;

            setPulseDuration(pulseDuration);
            
            // Calcular porcentaje de llenado
            const nuevoPorcentajeLlenado = (latestPulse.valor / 200) * 100;
            setPorcentajeLlenado(nuevoPorcentajeLlenado);
          } else {
            // Si no hay pulsos, puedes manejarlo de alguna manera (por ejemplo, establecer actualPulse en null)
            setActualPulse(null);
          }
        } else {
          setActualPulse(null);
        }

        setRefreshing(false);
      });

      // Limpiar el evento de escucha cuando el componente se desmonta o desactiva
      return () => {
        off(pulsesRef, 'value', unsubscribe);
      };
    }
  }, [currentUser, isComponentActive]);

  useEffect(() => {
    setIsComponentActive(true);

    // Limpiar el estado cuando el componente se desmonta o desactiva
    return () => {
      setIsComponentActive(false);
    };
  }, []);

  useEffect(() => {
    if (isComponentActive) {
      setRefreshing(true);
      loadActualPulse();
    }
  }, [isComponentActive, loadActualPulse]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadActualPulse();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <VStack space={4} p={6} bg="#edf3f2" rounded="lg" shadow={4} alignItems="center">
          <View className="items-center justify-center">
            <Animatable.View
              className="rounded-full border-[#a6e0cd] w-72 h-72 mb-2 mt-6"
              style={{ borderWidth: 16 }}
            >
              <View className="items-center justify-center flex-row h-full">
                <View>
                  <PulseValue value={actualPulse?.valor || 0} duration={pulseDuration} />
                </View>
                <View className="justify-center items-center">
                  <PulseIcon duration={pulseDuration} />
                  <Text className="text-center text-3xl mt-2 font-light">BPM</Text>
                </View>
              </View>
            </Animatable.View>
          </View>
          <View className="w-full mb-7 mt-8">
            <Text className="text-left text-gray-600 text-2xl font-light mb-3">{t("pulse.title")}</Text>
            <View className="flex-row justify-between items-center bg-gray-50 p-4 shadow-xl" style={styles.pulseCard}>
              <Text className="text-3xl text-center text-gray-500 font-semibold">{actualPulse?.valor || 0}</Text>
              <View className="w-full p-4">
                <View className="mr-10 mb-3">
                  <Text className="text-right text-gray-500" style={{ marginRight: "10px" }}>
                    {formatTimestamp(actualPulse?.timestamp)}&nbsp;&nbsp;
                    <Tooltip width={windowWidth * 0.70} height={windowHeight * 0.40} popover={
                      <Text className="text-white p-2 text-justify">
                        {t("pulse.normalPulseText.intro.text")} <Text style={{ fontWeight: 'bold' }}>{t("pulse.normalPulseText.intro.boldText")}</Text>,&nbsp;
                        {t("pulse.normalPulseText.childrenIntro")} <Text style={{ fontWeight: 'bold' }}>{t("pulse.normalPulseText.childrenBoldText")}</Text>.&nbsp;
                        {t("pulse.normalPulseText.conclusion")}
                      </Text>
                    }>
                      <WarningOutlineIcon size={5} />
                    </Tooltip>
                  </Text>
                </View>
                <View className="ml-2 mr-10" style={{ width: 'auto', height: 5, backgroundColor: '#e0e0e0', borderRadius: 5 }}>
                  <View className="text-right" style={{ width: `${porcentajeLlenado}%`, height: '100%', backgroundColor: '#ef4444', borderRadius: 5 }} />
                </View>
              </View>
            </View>
          </View>
        </VStack>
      </ScrollView>
      <View style={styles.translateContainer}>
        <Translate refreshing={refreshing} setRefreshing={setRefreshing} />
      </View>
    </View>
  );
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const PulseValue = ({ value, duration }) => (
  <Animatable.Text
    className="text-center text-7xl mr-5"
    animation="pulse"
    easing="ease-out"
    iterationCount="infinite"
    duration={duration}  // Cambiado de pulseDuration a duration
  >
    {value}
  </Animatable.Text>
);

const PulseIcon = ({ duration }) => (
  <Animatable.View
    style={{ marginBottom: 2 }}
    animation="pulse"
    easing="ease-out"
    iterationCount="infinite"
    duration={duration}  // Cambiado de pulseDuration a duration
  >
    <FavouriteIcon size={45} color={"#ef4444"} />
  </Animatable.View>
);

const styles = StyleSheet.create({
  translateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  pulseCard: {
    marginVertical:12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    margin: 1,
  },
});

export default PulsoScreen;
