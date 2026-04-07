import React, { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { styles } from '@/styles/index.styles';

export default function DirectoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const filters = ['Tous', 'Disponibles', 'Plomberie', 'Électricité', 'Autour de moi'];

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Pow'RH</ThemedText>
        
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
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyStateIconWrapper}>
          <Feather name="search" size={32} color={iconColor} />
        </View>
        <ThemedText style={styles.emptyStateText}>Aucun technicien trouvé.</ThemedText>
      </View>
    </ThemedView>
  );
}
