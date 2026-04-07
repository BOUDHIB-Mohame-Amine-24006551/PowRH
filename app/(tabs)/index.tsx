import React, { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { styles } from '@/styles/index.styles';
import { useTechnicians } from '@/context/TechnicianContext';

export default function DirectoryScreen() {
  const router = useRouter();
  const { technicians } = useTechnicians();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const filters = ['Tous', 'Disponibles', 'Plomberie', 'Électricité', 'Autour de moi'];

  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = `${tech.firstName} ${tech.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'Tous') return matchesSearch;
    if (activeFilter === 'Disponibles') return matchesSearch && tech.status === 'Disponible';
    return matchesSearch && tech.specialty === activeFilter;
  });

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
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
        
        {/* Search Bar */}
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

        {/* Filter Bar */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterChip,
                activeFilter === filter ? styles.activeFilterChip : styles.inactiveFilterChip
              ]}
            >
              {filter === 'Autour de moi' && (
                <Feather 
                  name="map-pin" 
                  size={14} 
                  color={activeFilter === filter ? '#FFFFFF' : textColor} 
                  style={{ marginRight: 6 }} 
                />
              )}
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
      </View>

      {/* List / Empty State */}
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
