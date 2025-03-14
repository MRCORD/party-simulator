import { Category } from './party';

/**
 * Base shopping item definition used throughout all components
 */
export interface ShoppingItem {
    id: string;
    name: string;
    url?: string; // Optional URL field
    category: 'spirits' | 'mixers' | 'ice' | 'meat' | 'sides' | 'condiments' | 'supplies' | 'other';
    cost: number;
    units: number;
    size: string;
    sizeUnit: string;
    servings: number;
    totalCost: number;
  }
  
  /**
   * Type for complementary item relationships
   */
  export interface ItemRelationship {
    primaryItemId: string;
    secondaryItemId: string;
    ratio: number; // How many secondary items per one primary item
  }
  
  /**
   * Props for ComplementaryItemsManager component
   */
  export interface ComplementaryItemsProps {
    shoppingItems: ShoppingItem[];
    itemRelationships: ItemRelationship[];
    addItemRelationship: (relationship: ItemRelationship) => void;
    removeItemRelationship: (index: number) => void;
  }

  /**
   * Shopping tab props
   */
  export interface ShoppingTabProps {
    newItem: Omit<ShoppingItem, 'id'>;
    editingItem: ShoppingItem | null;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    addItem: () => void;
    saveEdit: () => void;
    categories: Category[];
    sizeUnits: { [key: string]: string[] };
    shoppingItems: ShoppingItem[];
    getItemsByCategory: () => { [key: string]: ShoppingItem[] };
    startEdit: (item: ShoppingItem) => void;
    deleteItem: (id: string) => void;
    jsonPreview: string;
    itemRelationships?: ItemRelationship[];
  }