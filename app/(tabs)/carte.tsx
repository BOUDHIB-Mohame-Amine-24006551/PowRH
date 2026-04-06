import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { styles } from '@/styles/carte.styles';

export default function CarteScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Feather name="map-pin" size={40} color="#0066FF" />
        </View>
        <ThemedText type="title" style={styles.title}>
          Carte des interventions
        </ThemedText>
        <ThemedText style={styles.description}>
          Cette vue affichera bientôt la position de tous les techniciens sur le terrain en temps réel.
        </ThemedText>
      </View>
    </ThemedView>
  );
}
