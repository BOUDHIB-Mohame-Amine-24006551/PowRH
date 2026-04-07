import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TechnicianStatus = 'Disponible' | 'Actif' | 'Indisponible' | 'Congés' | 'Inconnu';

export interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  status: TechnicianStatus;
  radius: number; // in km
  address: string;
  tjm: number; // Taux Journalier Moyen
  phone: string;
  email: string;
  currentTask?: string; // Only if 'Actif'
}

interface TechnicianContextType {
  technicians: Technician[];
  addTechnician: (tech: Omit<Technician, 'id'>) => void;
  updateTechnician: (id: string, updates: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
}

const mockTechnicians: Technician[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Dubois',
    specialty: 'Plomberie',
    status: 'Disponible',
    radius: 30,
    address: '12 Rue de la Paix, Paris',
    tjm: 450,
    phone: '06 12 34 56 78',
    email: 'alice.dubois@powrh.fr',
  },
  {
    id: '2',
    firstName: 'Bernard',
    lastName: 'Lefebvre',
    specialty: 'Électricité',
    status: 'Actif',
    radius: 50,
    address: '45 Avenue de la République, Lyon',
    tjm: 500,
    phone: '06 98 76 54 32',
    email: 'bernard.l@powrh.fr',
    currentTask: 'Chantier Gare Part-Dieu',
  },
];

const TechnicianContext = createContext<TechnicianContextType | undefined>(undefined);

export const TechnicianProvider = ({ children }: { children: ReactNode }) => {
  const [technicians, setTechnicians] = useState<Technician[]>(mockTechnicians);

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
