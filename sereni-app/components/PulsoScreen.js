// PulsoScreen.js
import React, { useState, useEffect } from 'react';
import { Text, RefreshControl, StyleSheet, View } from 'react-native';
import { get, ref } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Circle, Defs, LinearGradient, Stop, Path, Svg } from 'react-native-svg';

import Translate from './LanguageSwitcher';

const PulsoScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [actualPulse, setActualPulse] = useState(null);

  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    loadActualPulse();
  }, [refreshing]);

  const loadActualPulse = async () => {
    try {
      const pulsesRef = ref(FIREBASE_DB, `users/${currentUser.uid}/pulse`);
      const pulsesSnapshot = await get(pulsesRef);
  
      if (pulsesSnapshot.exists()) {
        const pulsesData = pulsesSnapshot.val();
  
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
  
          // Actualizar el estado con el pulso más reciente
          setActualPulse(latestPulse);
        } else {
          // Si no hay pulsos, puedes manejarlo de alguna manera (por ejemplo, establecer actualPulse en null)
          setActualPulse(null);
        }
      } else {
        setActualPulse(null);
      }
    } catch (error) {
      console.error("Error al cargar el pulso actual", error.message);
    } finally {
      // Finalmente, detener la animación de carga
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadActualPulse();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.cardTitle}>Último pulso</Title>
            <View style={styles.visualContainer}>
              {/* Círculo lleno y animado */}
              <Animatable.View
                animation="pulse"
                easing="ease-out"
                iterationCount="infinite"
                style={styles.circleContainer}
              >
                <Svg height="200" width="200">
                  <Defs>
                    <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <Stop offset="0%" style={{ stopColor: '#4F80E1', stopOpacity: 1 }} />
                      <Stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                    </LinearGradient>
                  </Defs>
                  <Circle cx="100" cy="100" r="95" fill="url(#gradient)" />
                </Svg>
                <View style={styles.pulseContainer}>
                  <Animatable.Text
                    animation="pulse"
                    easing="ease-out"
                    iterationCount="infinite"
                    style={styles.pulseValue}
                  >
                    {actualPulse?.valor || 0}
                  </Animatable.Text>
                </View>
              </Animatable.View>
            </View>
            {/* Ondas animadas debajo del corazón */}
            <Animatable.View animation="fadeIn" easing="linear" iterationCount="infinite">
              <View style={styles.wavesContainer}>
                <Svg height="30" width="200">
                  <Path
                    d="M0 15 Q15 0 30 15 T60 15 T90 15 T120 15 T150 15 T180 15"
                    fill="none"
                    stroke="#FF0000"
                  />
                </Svg>
              </View>
            </Animatable.View>
            <Paragraph style={styles.timestampText}>
              Timestamp: {formatTimestamp(actualPulse?.timestamp)}
            </Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
      <View style={styles.translateContainer}>
        <Translate />
      </View>
    </View>
  );
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  card: {
    width: '90%',
    marginVertical: 16,
    borderRadius: 20,
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  visualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    alignItems: 'center',
  },
  pulseContainer: {
    position: 'absolute',
    top: '35%',
  },
  pulseValue: {
    color: '#000',
    fontSize: 40,
    fontWeight: 'bold',
  },
  wavesContainer: {
    marginTop: 10,
  },
  timestampText: {
    marginTop: 10,
    color: '#666',
  },
  translateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default PulsoScreen;
