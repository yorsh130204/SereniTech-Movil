import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Translate from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const PulsoScreen = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-between">
      <Text className="text-4xl">{t("test")}</Text>
      <Text className="items-center">Contenido de pulso</Text>
      <Translate />
    </View>
  );
};

export default PulsoScreen;
