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
  addTechnician: (tech: Omit<Technician, 'id'>) => void;
  updateTechnician: (id: string, updates: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
}

const TechnicianContext = createContext<TechnicianContextType | undefined>(undefined);

const STORAGE_KEY = '@technicians_it_v1';

export const TechnicianProvider = ({ children }: { children: ReactNode }) => {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians as Technician[]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setTechnicians(JSON.parse(savedData));
          console.log('Données chargées depuis AsyncStorage');
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
  };

  const updateTechnician = (id: string, updates: Partial<Technician>) => {
    setTechnicians((prev) =>
      prev.map((tech) => (tech.id === id ? { ...tech, ...updates } : tech))
    );
  };

  const deleteTechnician = (id: string) => {
    setTechnicians((prev) => prev.filter((tech) => tech.id !== id));
  };

  return (
    <TechnicianContext.Provider value={{ technicians, addTechnician, updateTechnician, deleteTechnician }}>
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

