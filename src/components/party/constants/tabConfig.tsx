import React, { ReactElement } from 'react';
import { 
  Users, Wine, Utensils, MapPin, 
  FileBarChart, ShoppingBag
} from 'lucide-react';

type IconProps = {
  size?: number;
}

// Tab configuration type
export interface TabConfig {
  key: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports';
  label: string;
  icon: (props?: IconProps) => ReactElement;
}

// Tab mapping
export const tabConfigs: TabConfig[] = [
  { 
    key: 'overview',
    label: 'Resumen', 
    icon: ({ size = 18 }: IconProps = {}) => <Users size={size} />
  },
  { 
    key: 'shopping',
    label: 'Compras', 
    icon: ({ size = 18 }: IconProps = {}) => <ShoppingBag size={size} />
  },
  { 
    key: 'drinks',
    label: 'Bebidas', 
    icon: ({ size = 18 }: IconProps = {}) => <Wine size={size} />
  },
  { 
    key: 'food',
    label: 'Comida', 
    icon: ({ size = 18 }: IconProps = {}) => <Utensils size={size} />
  },
  { 
    key: 'venue',
    label: 'Local', 
    icon: ({ size = 18 }: IconProps = {}) => <MapPin size={size} />
  },
  { 
    key: 'reports',
    label: 'Informes', 
    icon: ({ size = 18 }: IconProps = {}) => <FileBarChart size={size} />
  }
];

// Map tab keys to their index for handling active tab
export const tabKeyToIndex: { [key in TabConfig['key']]: number } = {
  overview: 0,
  shopping: 1,
  drinks: 2, 
  food: 3,
  venue: 4,
  reports: 5
};

// Convert a tab key to its index
export const getIndexFromTabKey = (key: TabConfig['key']): number => {
  return tabKeyToIndex[key] || 0;
};

// Convert an index to its tab key
export const getTabKeyFromIndex = (index: number): TabConfig['key'] => {
  const orderedKeys: TabConfig['key'][] = ['overview', 'shopping', 'drinks', 'food', 'venue', 'reports'];
  return orderedKeys[index] || 'overview';
};