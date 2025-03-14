import { ReactNode } from 'react';
import { 
  Users, Wine, Utensils, MapPin, 
  FileBarChart, ShoppingBag
} from 'lucide-react';

// Tab configuration type
export interface TabConfig {
  key: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports';
  label: string;
  icon: (props?: { size?: number }) => ReactNode;
}

// Tab mapping
export const tabConfigs: TabConfig[] = [
  { 
    key: 'overview',
    label: 'Resumen', 
    icon: (props) => Users({ size: props?.size || 18 })
  },
  { 
    key: 'shopping',
    label: 'Compras', 
    icon: (props) => ShoppingBag({ size: props?.size || 18 })
  },
  { 
    key: 'drinks',
    label: 'Bebidas', 
    icon: (props) => Wine({ size: props?.size || 18 })
  },
  { 
    key: 'food',
    label: 'Comida', 
    icon: (props) => Utensils({ size: props?.size || 18 })
  },
  { 
    key: 'venue',
    label: 'Local', 
    icon: (props) => MapPin({ size: props?.size || 18 })
  },
  { 
    key: 'reports',
    label: 'Informes', 
    icon: (props) => FileBarChart({ size: props?.size || 18 })
  },
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