import React, { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { styles } from '@/styles/index.styles';
import { useTechnicians } from '@/context/TechnicianContext';

export default function DirectoryScreen() {
  const router = useRouter();
  const { technicians, specialties, addSpecialty, removeSpecialty } = useTechnicians();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [activeSpecialty, setActiveSpecialty] = useState('Toutes spécialités');

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const filters = ['Disponible', 'Actif', 'Indisponible', 'Congés'];
  const allFilters = ['Tous', ...filters];
  
  const specialtyFilters = [
    'Toutes spécialités',
    ...specialties
  ];

  const handleAddSpecialty = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        "Nouvelle spécialité",
        "Entrez le nom de la spécialité à ajouter aux filtres",
        [
          { text: "Annuler", style: "cancel" },
          { 
            text: "Ajouter", 
            onPress: (text) => {
              if (text) {
                addSpecialty(text);
                setActiveSpecialty(text);
              }
            } 
          }
        ]
      );
    } else {
      Alert.alert(
        "Nouvelle spécialité", 
        "Entrez le nom de la spécialité (Simulé pour Android)",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Ajouter DevOps Pro", onPress: () => {
              addSpecialty("DevOps Pro");
              setActiveSpecialty("DevOps Pro");
          }}
        ]
      );
    }
  };

  const handleRemoveSpecialty = () => {
    if (specialties.length === 0) {
      Alert.alert("Information", "Il n'y a aucune spécialité à supprimer.");
      return;
    }

    Alert.alert(
      "Supprimer une spécialité",
      "Quelle spécialité souhaitez-vous supprimer ?",
      [
        { text: "Annuler", style: "cancel" },
        ...specialties.map(spec => ({
          text: spec,
          style: 'destructive' as const,
          onPress: () => {
            removeSpecialty(spec);
            if (activeSpecialty === spec) {
              setActiveSpecialty('Toutes spécialités');
            }
          }
        }))
      ]
    );
  };

  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = `${tech.firstName} ${tech.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = activeFilter === 'Tous' || tech.status === activeFilter;
    const matchesSpecialty = activeSpecialty === 'Toutes spécialités' || tech.specialty === activeSpecialty;

    return matchesSearch && matchesStatus && matchesSpecialty;
  });


  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <ThemedText type="title" style={[styles.title, { marginBottom: 0 }]}>Pow'RH</ThemedText>
          <TouchableOpacity 
            onPress={() => router.push('/new-technician')}
            style={{ 
              backgroundColor: '#2563EB', 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >
            <Feather name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Feather name="search" size={20} color={iconColor} />
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              placeholder="Chercher un technicien..."
              placeholderTextColor={iconColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="sliders" size={20} color={iconColor} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {allFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterChip,
                activeFilter === filter ? styles.activeFilterChip : styles.inactiveFilterChip
              ]}
            >
              <ThemedText 
                style={[
                  styles.filterChipText,
                  activeFilter === filter ? styles.activeFilterChipText : undefined
                ]}
              >
                {filter}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={[styles.filterScroll, { marginTop: 8 }]}
        >
          <TouchableOpacity
            onPress={handleAddSpecialty}
            style={[
              styles.filterChip,
              { backgroundColor: 'rgba(37, 99, 235, 0.1)', borderStyle: 'dotted', borderWidth: 1, borderColor: '#2563EB', marginRight: 8 }
            ]}
          >
            <Feather name="plus" size={14} color="#2563EB" style={{ marginRight: 4 }} />
            <ThemedText style={{ color: '#2563EB', fontSize: 13, fontWeight: '600' }}>Ajouter</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRemoveSpecialty}
            style={[
              styles.filterChip,
              { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderStyle: 'dotted', borderWidth: 1, borderColor: '#EF4444', marginRight: 8 }
            ]}
          >
            <Feather name="trash-2" size={14} color="#EF4444" style={{ marginRight: 4 }} />
            <ThemedText style={{ color: '#EF4444', fontSize: 13, fontWeight: '600' }}>Supprimer</ThemedText>
          </TouchableOpacity>
          {specialtyFilters.map((spec) => (
            <TouchableOpacity
              key={spec}
              onPress={() => setActiveSpecialty(spec)}
              style={[
                styles.filterChip,
                activeSpecialty === spec ? styles.activeFilterChip : styles.inactiveFilterChip,
                { backgroundColor: activeSpecialty === spec ? '#10B981' : 'rgba(150, 150, 150, 0.1)' }
              ]}
            >
              <ThemedText 
                style={[
                  styles.filterChipText,
                  activeSpecialty === spec ? styles.activeFilterChipText : undefined
                ]}
              >
                {spec}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredTechnicians.length > 0 ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16 }}>
          {filteredTechnicians.map((tech) => (
            <TouchableOpacity 
              key={tech.id} 
              onPress={() => router.push({ pathname: '/technician/[id]', params: { id: tech.id } })}
              style={{ 
                flexDirection: 'row', 
                backgroundColor: 'rgba(150, 150, 150, 0.05)', 
                borderRadius: 16, 
                padding: 12,
                alignItems: 'center',
                gap: 12
              }}
            >
              <View style={{ 
                width: 50, 
                height: 50, 
                borderRadius: 25, 
                backgroundColor: 'rgba(150, 150, 150, 0.1)',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Feather name="user" size={28} color={iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontWeight: 'bold', fontSize: 16 }}>{tech.firstName} {tech.lastName}</ThemedText>
                <ThemedText style={{ color: iconColor, fontSize: 14 }}>{tech.specialty} • {tech.tjm}€/j</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <View style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: 4, 
                    backgroundColor: tech.status === 'Disponible' ? '#10B981' : tech.status === 'Actif' ? '#3B82F6' : '#EF4444' 
                  }} />
                  <ThemedText 
                    style={{ fontSize: 12, color: iconColor }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {tech.status}
                    {tech.status === 'Actif' && tech.currentTask ? ` : ${tech.currentTask}` : ''}
                  </ThemedText>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={iconColor} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIconWrapper}>
            <Feather name="search" size={32} color={iconColor} />
          </View>
          <ThemedText style={styles.emptyStateText}>Aucun technicien trouvé.</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}
