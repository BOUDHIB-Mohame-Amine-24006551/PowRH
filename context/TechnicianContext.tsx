import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import initialTechnicians from '../constants/technicians.json';

export type TechnicianStatus = 'Disponible' | 'Actif' | 'Indisponible' | 'Congés' | 'Inconnu';

export interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  status: TechnicianStatus;
  radius: number;
  address: string;
  tjm: number;
  phone: string;
  email: string;
  currentTask?: string;
}

interface TechnicianContextType {
  technicians: Technician[];
  specialties: string[];
  addTechnician: (tech: Omit<Technician, 'id'>) => void;
  updateTechnician: (id: string, updates: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
  addSpecialty: (specialty: string) => void;
  removeSpecialty: (specialty: string) => void;
}

const TechnicianContext = createContext<TechnicianContextType | undefined>(undefined);

const STORAGE_KEY = '@technicians_it_v2_reset';

export const TechnicianProvider = ({ children }: { children: ReactNode }) => {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians as Technician[]);
  const [specialties, setSpecialties] = useState<string[]>(["Réseaux", "Base de données", "Développement", "DevOps", "SupportIT"]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        const savedSpecs = await AsyncStorage.getItem(STORAGE_KEY + '_specs');
        const initialData = initialTechnicians as Technician[];
        
        const defaultSpecs = ["Réseaux", "Base de données", "DevOps", "Développement Web", "Support IT"];
        const jsonSpecs = Array.from(new Set(initialData.map(t => t.specialty)));
        
        if (savedSpecs) {
          const parsedSpecs = JSON.parse(savedSpecs);
          const merged = Array.from(new Set([...defaultSpecs, ...jsonSpecs, ...parsedSpecs])).sort();
          setSpecialties(merged);
        } else {
          const merged = Array.from(new Set([...defaultSpecs, ...jsonSpecs])).sort();
          setSpecialties(merged);
        }

        if (savedData) {
          const parsedSavedData = JSON.parse(savedData) as Technician[];
          
          const savedIds = new Set(parsedSavedData.map(t => t.id));
          const newFromInitial = initialData.filter(t => !savedIds.has(t.id));
          
          if (newFromInitial.length > 0) {
            const mergedData = [...parsedSavedData, ...newFromInitial];
            setTechnicians(mergedData);
            console.log(`${newFromInitial.length} nouveaux techniciens ajoutés depuis le JSON`);
          } else {
            setTechnicians(parsedSavedData);
            console.log('Données chargées depuis AsyncStorage');
          }
        } else {
          setTechnicians(initialData);
          console.log('Données initiales chargées');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des techniciens:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      if (!isInitialized) return;

      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(technicians));
        await AsyncStorage.setItem(STORAGE_KEY + '_specs', JSON.stringify(specialties));
        console.log('Données sauvegardées dans AsyncStorage');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des techniciens:', error);
      }
    };
    saveData();
  }, [technicians, isInitialized]);



  const addTechnician = (tech: Omit<Technician, 'id'>) => {
    const newTech = {
      ...tech,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTechnicians((prev) => [...prev, newTech]);
    
    if (tech.specialty) {
      addSpecialty(tech.specialty);
    }
  };

  const updateTechnician = (id: string, updates: Partial<Technician>) => {
    setTechnicians((prev) =>
      prev.map((tech) => (tech.id === id ? { ...tech, ...updates } : tech))
    );

    if (updates.specialty) {
      addSpecialty(updates.specialty);
    }
  };

  const deleteTechnician = (id: string) => {
    setTechnicians((prev) => prev.filter((tech) => tech.id !== id));
  };

  const addSpecialty = (specialty: string) => {
    if (specialty) {
      setSpecialties(prev => {
        const cleaned = specialty.trim();
        if (prev.includes(cleaned)) return prev;
        return [...prev, cleaned].sort();
      });
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(prev => prev.filter(s => s !== specialty));
  };

  return (
    <TechnicianContext.Provider value={{ 
      technicians, 
      specialties,
      addTechnician, 
      updateTechnician, 
      deleteTechnician,
      addSpecialty,
      removeSpecialty
    }}>
      {children}
    </TechnicianContext.Provider>
  );
};

export const useTechnicians = () => {
  const context = useContext(TechnicianContext);
  if (context === undefined) {
    throw new Error('useTechnicians must be used within a TechnicianProvider');
  }
  return context;
};

