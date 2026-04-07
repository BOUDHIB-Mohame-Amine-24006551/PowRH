import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActionSheetIOS, Alert, Linking, Modal, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TechnicianStatus, useTechnicians } from '@/context/TechnicianContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { styles } from '@/styles/technician-detail.styles';

export default function TechnicianDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { technicians, updateTechnician } = useTechnicians();

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [isSelectingTask, setIsSelectingTask] = useState(false);
  const [tempTask, setTempTask] = useState('');

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

  const handleStatusChange = (newStatus: TechnicianStatus, task?: string) => {
    const updates: any = { status: newStatus };
    if (newStatus === 'Actif' && task !== undefined) {
      updates.currentTask = task;
    } else if (newStatus !== 'Actif') {
      updates.currentTask = undefined;
    }
    updateTechnician(technician.id, updates);
  };

  const options: TechnicianStatus[] = ['Disponible', 'Actif', 'Indisponible', 'Congés'];

  const showStatusOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', ...options],
          cancelButtonIndex: 0,
          title: 'Changer le statut',
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            const selectedStatus = options[buttonIndex - 1];
            if (selectedStatus === 'Actif') {
              // Bloc système iPhone natif
              Alert.prompt(
                `Tâche affectée à ${technician.firstName} ${technician.lastName}`,
                'Renseigner la tâche à affecter à ce technicien (obligatoire)',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { 
                    text: 'Enregistrer', 
                    onPress: (task: string | undefined) => {
                      if (task && task.trim().length > 0) {
                        handleStatusChange('Actif', task);
                      } else {
                        Alert.alert('Erreur', 'La tâche est obligatoire pour le statut Actif.');
                      }
                    } 
                  }
                ],
                'plain-text',
                technician.currentTask || ''
              );
            } else {
              handleStatusChange(selectedStatus);
            }
          }
        }
      );
    } else {
      // Pour Android, on ouvre notre Modal Material
      setStatusModalVisible(true);
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
            onPress={showStatusOptions}
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

          {technician.status === 'Actif' && (
            <View style={styles.taskInputContainer}>
              <ThemedText style={styles.taskLabelHighlight}>Mission affectée</ThemedText>
              <TextInput
                style={styles.taskInput}
                value={technician.currentTask}
                onChangeText={(text) => handleStatusChange('Actif', text)}
                placeholder="Décrivez la tâche en cours..."
                placeholderTextColor="rgba(155, 161, 166, 0.5)"
                multiline={true}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de sélection de statut universelle (Look Material pour Android) */}
      <Modal
        visible={statusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setStatusModalVisible(false);
          setIsSelectingTask(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setStatusModalVisible(false);
            setIsSelectingTask(false);
          }}
        >
          {!isSelectingTask ? (
            <View style={styles.materialModal}>
              <ThemedText style={styles.materialTitle}>Changer le statut</ThemedText>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.modalOption}
                  onPress={() => {
                    if (opt === 'Actif') {
                      setTempTask(technician.currentTask || '');
                      setIsSelectingTask(true);
                    } else {
                      handleStatusChange(opt);
                      setStatusModalVisible(false);
                    }
                  }}
                >
                  <ThemedText style={{ fontSize: 20 }}>{getStatusIcon(opt)}</ThemedText>
                  <ThemedText style={styles.modalOptionText}>{opt}</ThemedText>
                </TouchableOpacity>
              ))}
              <View style={styles.materialActions}>
                <TouchableOpacity
                  style={styles.materialAction}
                  onPress={() => setStatusModalVisible(false)}
                >
                  <ThemedText style={styles.materialActionText}>Annuler</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.materialModal}>
              <ThemedText style={styles.materialTitle}>
                Tâche affectée à {technician.firstName} {technician.lastName}
              </ThemedText>
              <ThemedText style={styles.materialMessage}>
                Renseigner la tâche à affecter à ce technicien (obligatoire)
              </ThemedText>
              <TextInput
                style={styles.materialInput}
                value={tempTask}
                onChangeText={setTempTask}
                placeholder="Décrivez la mission..."
                placeholderTextColor="rgba(155, 161, 166, 0.5)"
                autoFocus={true}
              />
              <View style={styles.materialActions}>
                <TouchableOpacity
                  style={styles.materialAction}
                  onPress={() => setIsSelectingTask(false)}
                >
                  <ThemedText style={styles.materialActionText}>Précédent</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.materialAction}
                  disabled={tempTask.trim().length === 0}
                  onPress={() => {
                    handleStatusChange('Actif', tempTask);
                    setStatusModalVisible(false);
                    setIsSelectingTask(false);
                  }}
                >
                  <ThemedText style={[
                    styles.materialActionText,
                    { opacity: tempTask.trim().length > 0 ? 1 : 0.5 }
                  ]}>
                    Enregistrer
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}
