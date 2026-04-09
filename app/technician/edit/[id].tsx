import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Platform, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { styles } from '@/styles/technician-edit.styles';
import { useTechnicians, Technician } from '@/context/TechnicianContext';

export default function EditTechnicianScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { technicians, updateTechnician } = useTechnicians();

  const technician = technicians.find((t) => t.id === id);

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const bgColor = useThemeColor({}, 'background');

  const [formData, setFormData] = useState<Partial<Technician>>({});

  useEffect(() => {
    if (technician) {
      setFormData(technician);
    }
  }, [technician]);

  if (!technician) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Technicien introuvable.</ThemedText>
      </ThemedView>
    );
  }

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.address) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires (Nom, Prénom, Adresse)');
      return;
    }

    try {
      updateTechnician(technician.id, formData);
      Alert.alert('Succès', 'Le profil a été mis à jour avec succès.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating technician:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Modifier le profil' }} />
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Identité</ThemedText>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.label}>Nom</ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  value={formData.lastName}
                  onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                  placeholder="Nom"
                  placeholderTextColor={iconColor}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.label}>Prénom</ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                  placeholder="Prénom"
                  placeholderTextColor={iconColor}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="email@exemple.com"
                placeholderTextColor={iconColor}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Téléphone</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
                placeholder="06 00 00 00 00"
                placeholderTextColor={iconColor}
              />
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Localisation</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Adresse</ThemedText>
              <View style={styles.inputWithIcon}>
                <Feather name="map-pin" size={18} color={iconColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.innerInput, { color: textColor }]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Adresse complète"
                  placeholderTextColor={iconColor}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.sliderHeader}>
                <ThemedText style={styles.label}>Rayon d'action</ThemedText>
                <ThemedText style={styles.sliderValue}>{formData.radius} km</ThemedText>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={200}
                step={5}
                value={formData.radius}
                onValueChange={(value) => setFormData({ ...formData, radius: value })}
                minimumTrackTintColor="#2563EB"
                maximumTrackTintColor="rgba(150, 150, 150, 0.3)"
                thumbTintColor="#2563EB"
              />
              <View style={styles.sliderLabels}>
                <ThemedText style={styles.sliderLabelText}>0 km</ThemedText>
                <ThemedText style={styles.sliderLabelText}>200 km</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Activité</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Spécialité</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={formData.specialty}
                onChangeText={(text) => setFormData({ ...formData, specialty: text })}
                placeholder="Ex: Plomberie, Chauffage..."
                placeholderTextColor={iconColor}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>TJM (Taux Journalier Moyen)</ThemedText>
              <View style={styles.tjmInputWrapper}>
                <TextInput
                  style={[styles.innerInput, { color: textColor, paddingLeft: 12 }]}
                  value={formData.tjm?.toString()}
                  onChangeText={(text) => setFormData({ ...formData, tjm: Number(text) || 0 })}
                  keyboardType="numeric"
                  placeholder="450"
                  placeholderTextColor={iconColor}
                />
                <ThemedText style={styles.tjmCurrency}>€</ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <Feather name="save" size={20} color="#FFF" />
            <ThemedText style={styles.submitButtonText}>Enregistrer les modifications</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}
