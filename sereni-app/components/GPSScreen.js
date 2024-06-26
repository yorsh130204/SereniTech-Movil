import React, { useState, useEffect, useCallback } from 'react';
import { RefreshControl, StyleSheet, Linking, Dimensions, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ScrollView, View, Button } from 'native-base';
import { ref, onValue, off } from 'firebase/database';
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebase';
import { VStack } from 'native-base';
import Translate from './LanguageSwitcher';
import i18next from 'i18next';
import { t } from 'i18next';
import * as Location from 'expo-location';

const windowHeight = Dimensions.get('window').height;

const GPSScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [highLocalizationData, setHighLocalizationData] = useState([]);
  const currentUser = FIREBASE_AUTH.currentUser;
  const [isComponentActive, setIsComponentActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const permisoLocalizacion = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Se denegó el permiso para acceder a la ubicación');
      return;
    }
  };

  const loadHighLocalizationData = useCallback(async () => {
    try {
      if (currentUser && isComponentActive) {
        const localizationRef = ref(FIREBASE_DB, `users/${currentUser.uid}/localization`);
        const unsubscribe = onValue(localizationRef, (snapshot) => {
          if (snapshot.exists()) {
            const localizationData = snapshot.val();

            if (localizationData) {
              // Obtener las claves locales y ordenarlas por timestamp
              const localKeys = Object.keys(localizationData).sort((a, b) => {
                const timestampA = new Date(localizationData[a].timestamp);
                const timestampB = new Date(localizationData[b].timestamp);
                return timestampB - timestampA;
              });

              // Obtener el último elemento ordenado
              const latestLocalizationKey = localKeys[0];
              const latestLocalization = localizationData[latestLocalizationKey];

              // Obtener la ubicación correspondiente al timestamp más reciente
              const localizationValue = latestLocalization.link;
              const [latitude, longitude] = extractLatLongFromLink(localizationValue);

              // Actualizar el estado con la ubicación más reciente
              setHighLocalizationData([
                {
                  key: latestLocalizationKey,
                  link: localizationValue,
                  latitude,
                  longitude,
                  timestamp: latestLocalization.timestamp,
                },
              ]);
            } else {
              setHighLocalizationData([]);
            }
          } else {
            setHighLocalizationData([]);
          }
          setRefreshing(false);
        });

        // Limpiar el evento de escucha cuando el componente se desmonta o desactiva
        return () => {
          off(localizationRef, 'value', unsubscribe);
        };
      }
    } catch (error) {
      console.error(
        'Error al cargar los datos de localización alta',
        error.message
      );
    } finally {
      setRefreshing(false);
    }
  }, [currentUser, isComponentActive]);

  const extractLatLongFromLink = (link) => {
    const match = link.match(/place\/([-0-9.]+),([-0-9.]+)/);
    if (match) {
      const latitude = parseFloat(match[1]);
      const longitude = parseFloat(match[2]);
      return [latitude, longitude];
    }
    return [0, 0];
  };

  const renderHighLocalizationMarkers = () => {
    return highLocalizationData.map((localization) => {
      const title = t('ubication.title');
      const description = `${t("ubication.date")} ${formatTimestamp(localization.timestamp)}`;
  
      return (
        <Marker
          key={localization.key}
          coordinate={{
            latitude: localization.latitude,
            longitude: localization.longitude,
          }}
          title={title}
          description={description}
        />
      );
    });
  };
  

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const openMapInExternalApp = () => {
    const { latitude, longitude } = highLocalizationData[0] || {};
    if (latitude !== undefined && longitude !== undefined) {
      const url = `https://www.google.com/maps/place/${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  useEffect(() => {
    setIsComponentActive(true);

    // Solicitar permiso de localización
    permisoLocalizacion();

    // Limpiar el estado cuando el componente se desmonta o desactiva
    return () => {
      setIsComponentActive(false);
    };
  }, []);

  useEffect(() => {
    const languageChangeListener = () => {
      console.log("Language changed. Updating component...");
      handleRefresh();
    };
  
    i18next.on('languageChanged', languageChangeListener);
  
    // Limpiar el listener al desmontar el componente
    return () => {
      i18next.off('languageChanged', languageChangeListener);
    };
  }, [handleRefresh]);

  useEffect(() => {
    if (isComponentActive) {
      setRefreshing(true);
      loadHighLocalizationData();
    }
  }, [isComponentActive, loadHighLocalizationData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHighLocalizationData();
    setRefreshing(false);
  };
  
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <VStack space={4} p={6} bg="#edf3f2" rounded="lg" shadow={4} alignItems="center">
          {/* Mapa */}
          <MapView
            className="mb-4"
            style={styles.map}
            region={{
              latitude: highLocalizationData[0]?.latitude || 0,
              longitude: highLocalizationData[0]?.longitude || 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            {/* Marcadores de la ubicación del usuario */}
            {renderHighLocalizationMarkers()}
          </MapView>
          <View style={styles.buttonContainer}>
            <Button
              className="bg-gray-400 hover:bg-gray-200 transition duration-300 w-auto h-auto rounded-3xl shadow-xl"
              onPress={openMapInExternalApp}
              colorScheme="info"
            >
              <Text className="text-white text-lg p-1">{t('ubication.googleMaps')}</Text>
            </Button>
          </View>
        </VStack>
      </ScrollView>
      <View style={styles.translateContainer}>
        <Translate refreshing={refreshing} setRefreshing={setRefreshing} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    height: windowHeight * 0.60,
    width: '95%',
    borderRadius: 15,
    borderColor: '#8BC34A',  // Cambia el color del borde a verde
    borderWidth: 2,        // Ajusta el ancho del borde según tus preferencias
  },
  translateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default GPSScreen;
