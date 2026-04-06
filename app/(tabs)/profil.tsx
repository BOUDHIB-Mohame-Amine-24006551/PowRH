import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E6F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: '#6B7280',
  },
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.15)',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
  },
});
