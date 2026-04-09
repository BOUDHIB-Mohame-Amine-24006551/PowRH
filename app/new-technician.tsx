import React, { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { styles } from '@/styles/new-technician.styles';
import { useTechnicians, Technician } from '@/context/TechnicianContext';

export default function NewTechnicianScreen() {
  const router = useRouter();
  const { technicians, addTechnician } = useTechnicians();

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const bgColor = useThemeColor({}, 'background');

  const [formData, setFormData] = useState<Omit<Technician, 'id'>>({
    firstName: '',
    lastName: '',
    specialty: '',
    status: 'Disponible',
    radius: 50,
    address: '',
    tjm: 400,
    phone: '',
    email: '',
  });

  const handleSubmit = () => {
    console.log('--- Form Submission ---');
    console.log('Data:', formData);
    if (!formData.firstName || !formData.lastName || !formData.address) {
      alert('Veuillez remplir les champs obligatoires (Nom, Prénom, Adresse)');
      return;
    }

    try {
      addTechnician(formData);
      console.log('Technician successfully added');
      router.push('/');
    } catch (error) {
      console.error('Error adding technician:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ThemedView style={styles.container}>
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
                placeholder="Dupont"
                placeholderTextColor={iconColor}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <ThemedText style={styles.label}>Prénom</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Jean"
                placeholderTextColor={iconColor}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="jean.dupont@powrh.fr"
              placeholderTextColor={iconColor}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Téléphone</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="06 12 34 56 78"
              placeholderTextColor={iconColor}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              blurOnSubmit={true}
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
                placeholder="10 rue de Paris, 75000"
                placeholderTextColor={iconColor}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
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
              placeholder="Ex: Plomberie, Chauffage..."
              placeholderTextColor={iconColor}
              value={formData.specialty}
              onChangeText={(text) => setFormData({ ...formData, specialty: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>TJM (Taux Journalier Moyen)</ThemedText>
            <View style={styles.tjmInputWrapper}>
              <TextInput
                style={[styles.innerInput, { color: textColor, paddingLeft: 12 }]}
                placeholder="400"
                placeholderTextColor={iconColor}
                keyboardType="numeric"
                value={formData.tjm.toString()}
                onChangeText={(text) => setFormData({ ...formData, tjm: Number(text) || 0 })}
              />
              <ThemedText style={styles.tjmCurrency}>€</ThemedText>
            </View>
          </View>


        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Feather name="save" size={20} color="#FFF" />
          <ThemedText style={styles.submitButtonText}>Enregistrer les informations</ThemedText>
        </TouchableOpacity>
      </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}
