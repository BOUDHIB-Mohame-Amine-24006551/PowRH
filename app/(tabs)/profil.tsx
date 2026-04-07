import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { styles } from '@/styles/profil.styles';

export default function ProfilScreen() {
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={[styles.avatarContainer, { borderColor: backgroundColor }]}>
          <Feather name="user" size={48} color="#0a7ea4" />
        </View>
        <ThemedText type="title" style={styles.nameText}>
          Admin
        </ThemedText>
        <ThemedText style={styles.emailText}>admin@powrh.fr</ThemedText>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <ThemedText style={styles.actionText}>Paramètres du compte</ThemedText>
          <Feather name="settings" size={20} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <ThemedText style={styles.logoutText}>Déconnexion</ThemedText>
          <Feather name="log-out" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
