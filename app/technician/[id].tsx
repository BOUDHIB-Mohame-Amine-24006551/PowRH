import { View, ScrollView, TouchableOpacity, Linking, Platform, Alert, ActionSheetIOS } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Gardé pour compatibilité Android si besoin, ou supprimé

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { styles } from '@/styles/technician-detail.styles';
import { useTechnicians, TechnicianStatus } from '@/context/TechnicianContext';

export default function TechnicianDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { technicians, updateTechnician } = useTechnicians();

  const technician = technicians.find((t) => t.id === id);

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const bgColor = useThemeColor({}, 'background');

  if (!technician) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Technicien introuvable.</ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={{ color: '#2563EB', marginTop: 10 }}>Retour à l'annuaire</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const handleCall = () => {
    if (technician.phone) {
      Linking.openURL(`tel:${technician.phone.replace(/\s/g, '')}`);
    } else {
      Alert.alert('Erreur', 'Aucun numéro de téléphone disponible.');
    }
  };

  const handleSms = () => {
    if (technician.phone) {
      Linking.openURL(`sms:${technician.phone.replace(/\s/g, '')}`);
    } else {
      Alert.alert('Erreur', 'Aucun numéro de téléphone disponible.');
    }
  };

  const handleEmail = () => {
    if (technician.email) {
      Linking.openURL(`mailto:${technician.email}`);
    } else {
      Alert.alert('Erreur', "Aucune adresse e-mail disponible.");
    }
  };

  const handleStatusChange = (newStatus: TechnicianStatus) => {
    updateTechnician(technician.id, { status: newStatus });
  };

  const showStatusPicker = () => {
    const options: TechnicianStatus[] = ['Disponible', 'Actif', 'Indisponible', 'Congés'];
    
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', ...options],
          cancelButtonIndex: 0,
          title: 'Changer le statut',
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            handleStatusChange(options[buttonIndex - 1]);
          }
        }
      );
    } else {
      // Pour Android, on pourrait garder le Picker ou utiliser une autre méthode.
      // Mais pour la cohérence, on peut utiliser Alert si on veut éviter le Picker buggé.
      Alert.alert(
        'Changer le statut',
        'Choisissez un nouveau statut :',
        options.map(opt => ({
          text: opt,
          onPress: () => handleStatusChange(opt)
        })),
        { cancelable: true }
      );
    }
  };

  const getStatusIcon = (status: TechnicianStatus) => {
    switch (status) {
      case 'Disponible': return '🟢';
      case 'Actif': return '🔵';
      case 'Indisponible': return '🔴';
      case 'Congés': return '🟠';
      default: return '⚪';
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Configuration du titre dynamique et du bouton modifier dans la barre de navigation */}
      <Stack.Screen 
        options={{ 
          title: `${technician.firstName} ${technician.lastName}`,
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 8 }}>
              <Feather name="edit-3" size={22} color="#2563EB" />
            </TouchableOpacity>
          )
        }} 
      />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarContainer, { backgroundColor: 'rgba(37, 99, 235, 0.05)' }]}>
              <Feather name="user" size={60} color="#2563EB" />
            </View>
            <View style={styles.statusBadge}>
              <ThemedText style={styles.statusBadgeText}>
                {technician.status}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.name}>{technician.firstName} {technician.lastName}</ThemedText>
          <ThemedText style={styles.specialty}>{technician.specialty}</ThemedText>
          <ThemedText style={styles.tjm}>TJM : {technician.tjm} €/jour</ThemedText>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.callButton]} onPress={handleCall}>
              <Feather name="phone" size={24} color="#2563EB" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.messageButton]} onPress={handleSms}>
              <Feather name="message-square" size={24} color="#10B981" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.mailButton]} onPress={handleEmail}>
              <Feather name="mail" size={24} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Localisation & Mobilité */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Localisation & Mobilité</ThemedText>
          
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={18} color={iconColor} />
            <ThemedText style={styles.infoText}>{technician.address}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Feather name="briefcase" size={18} color={iconColor} />
            <ThemedText style={styles.infoText}>
              Mobile dans un rayon de <ThemedText style={styles.highlight}>{technician.radius} km</ThemedText>
            </ThemedText>
          </View>
        </View>

        {/* Gestion du Statut */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Gestion du statut</ThemedText>
          <ThemedText style={styles.label}>Statut actuel</ThemedText>
          
          <TouchableOpacity 
            style={styles.customPickerButton} 
            onPress={showStatusPicker}
            activeOpacity={0.7}
          >
            <View style={styles.statusInfo}>
              <ThemedText style={styles.statusDot}>{getStatusIcon(technician.status)}</ThemedText>
              <ThemedText style={[styles.pickerText, { color: '#FFFFFF' }]}>
                {technician.status}
              </ThemedText>
            </View>
            <Feather name="chevron-down" size={20} color="#FFFFFF" opacity={0.6} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
