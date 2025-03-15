import { Category } from '@/types';

/**
 * Define all available shopping categories
 */
export const categories: Category[] = [
  { value: 'spirits', label: 'Licores' },
  { value: 'beer', label: 'Cerveza' },
  { value: 'wine', label: 'Vino' },
  { value: 'mixers', label: 'Mezcladores' },
  { value: 'ice', label: 'Hielo' },
  { value: 'meat', label: 'Carnes' },
  { value: 'sides', label: 'Guarniciones' },
  { value: 'condiments', label: 'Condimentos' },
  { value: 'supplies', label: 'Suministros' },
  { value: 'other', label: 'Otros' }
];

/**
 * Get the display label for a category
 */
export const getCategoryLabel = (categoryValue: string): string => {
  const category = categories.find(cat => cat.value === categoryValue);
  return category ? category.label : categoryValue;
};

/**
 * Format a category key for display
 */
export const formatCategory = (category: string): string => {
  switch (category) {
    case 'spirits': return 'Licores';
    case 'beer': return 'Cerveza';
    case 'wine': return 'Vino';
    case 'mixers': return 'Mezcladores';
    case 'ice': return 'Hielo';
    case 'meat': return 'Carnes';
    case 'sides': return 'Guarniciones';
    case 'condiments': return 'Condimentos';
    case 'supplies': return 'Suministros';
    default: return category;
  }
};

/**
 * Get the color class for a category
 */
export const getCategoryColorClass = (category: string): string => {
  switch(category) {
    case 'spirits': return 'bg-primary';
    case 'beer': return 'bg-accent-brown';
    case 'wine': return 'bg-accent-purple';
    case 'mixers': return 'bg-accent-teal';
    case 'ice': return 'bg-primary-light';
    case 'meat': return 'bg-accent-amber';
    case 'sides': return 'bg-success';
    case 'condiments': return 'bg-warning';
    case 'supplies': return 'bg-accent-pink';
    default: return 'bg-gray-400';
  }
};

/**
 * Get the text color class for a category
 */
export const getCategoryTextColorClass = (category: string): string => {
  switch(category) {
    case 'spirits': return 'text-primary';
    case 'beer': return 'text-accent-brown';
    case 'wine': return 'text-accent-purple';
    case 'mixers': return 'text-accent-teal';
    case 'ice': return 'text-primary-light';
    case 'meat': return 'text-accent-amber';
    case 'sides': return 'text-success';
    case 'condiments': return 'text-warning';
    case 'supplies': return 'text-accent-pink';
    default: return 'text-gray-500';
  }
};

/**
 * Food categories
 */
export const foodCategories = ['meat', 'sides', 'condiments'];

/**
 * Drink categories
 */
export const drinkCategories = ['spirits', 'beer', 'wine', 'mixers', 'ice', 'supplies'];

/**
 * Check if a category is a food category
 */
export const isFoodCategory = (category: string): boolean => 
  foodCategories.includes(category);

/**
 * Check if a category is a drink category
 */
export const isDrinkCategory = (category: string): boolean => 
  drinkCategories.includes(category);