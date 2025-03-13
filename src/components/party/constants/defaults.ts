import { ShoppingItem, EaterProfile } from '../types';

/**
 * Default values for new shopping items
 */
export const DEFAULT_NEW_ITEM: Omit<ShoppingItem, 'id'> = {
  name: '',
  category: 'spirits',
  cost: 0,
  units: 1,
  size: '',
  sizeUnit: 'ml',
  servings: 0,
  totalCost: 0,
  url: ''
};

/**
 * Default eater profiles for food simulation
 */
export const DEFAULT_EATER_PROFILES: EaterProfile[] = [
  { name: "Light Eater", percentage: 25, servingsMultiplier: 0.7 },
  { name: "Average Eater", percentage: 50, servingsMultiplier: 1.0 },
  { name: "Heavy Eater", percentage: 25, servingsMultiplier: 1.5 }
];

/**
 * Confidence level options for Monte Carlo simulation
 */
export const CONFIDENCE_LEVEL_OPTIONS = [
  { value: 80, label: "Mínimo para una estimación básica" },
  { value: 90, label: "Recomendado para planificación normal" },
  { value: 95, label: "Recomendado para planificación cuidadosa" },
  { value: 99, label: "Nivel máximo de seguridad en la estimación" }
];

/**
 * Simulation count options for Monte Carlo simulation
 */
export const SIMULATION_COUNT_OPTIONS = [
  { value: 100, label: "Rápido pero menos preciso" },
  { value: 500, label: "Balance entre velocidad y precisión" },
  { value: 1000, label: "Precisión buena" },
  { value: 5000, label: "Precisión muy alta" }
];

/**
 * Default initial shopping items
 */
export const DEFAULT_SHOPPING_ITEMS: Omit<ShoppingItem, 'id'>[] = [
  { name: 'Hamburguesas Parrilleras Oregon Foods', category: 'meat', cost: 33.90, units: 1, size: '150', sizeUnit: 'g', servings: 4, totalCost: 33.90, url: 'https://www.wong.pe/hamburguesas-parrilleras-oregon-foods-4un-404812/p' },
  { name: 'Pan Hamburguesa Brioche Wong', category: 'sides', cost: 8.90, units: 1, size: '300', sizeUnit: 'g', servings: 4, totalCost: 8.90, url: 'https://www.wong.pe/pan-hamburguesa-brioche-wong-4un-926992/p' },
  { name: 'Chorizo Parrillero Zimmermann', category: 'meat', cost: 16.90, units: 1, size: '400', sizeUnit: 'g', servings: 4, totalCost: 16.90, url: 'https://www.wong.pe/chorizo-parrillero-zimmermann-400g-2-2/p' },
  { name: 'Twelvepack Cerveza Pilsen Callao', category: 'spirits', cost: 49.90, units: 1, size: '355', sizeUnit: 'ml', servings: 12, totalCost: 49.90, url: 'https://www.wong.pe/twelvepack-cerveza-pilsen-callao-lata-355ml/p' },
  { name: 'Ron Cartavio Solera 12 Años', category: 'spirits', cost: 94.90, units: 1, size: '750', sizeUnit: 'ml', servings: 15, totalCost: 94.90, url: 'https://www.wong.pe/ron-cartavio-solera-12-a-os-botella-750ml-46994/p' },
  { name: 'Hielo Cuisine&Co', category: 'ice', cost: 6.50, units: 1, size: '3', sizeUnit: 'kg', servings: 15, totalCost: 6.50, url: 'https://www.wong.pe/hielo-cuisine-co-bolsa-3-kg/p' },
  { name: 'Twopack Gaseosa Coca Cola Original', category: 'mixers', cost: 20.50, units: 1, size: '3', sizeUnit: 'L', servings: 30, totalCost: 20.50, url: 'https://www.wong.pe/twopack-gaseosa-coca-cola-sabor-original-botella-3l-148354/p' },
  { name: 'Vasos Rojos 16oz', category: 'supplies', cost: 29.90, units: 1, size: 'Pack 50 vasos', sizeUnit: 'pack', servings: 50, totalCost: 29.90, url: 'https://www.sodimac.com.pe/sodimac-pe/articulo/135800501/Vasos-para-Fiesta-SET-X-50-UND-Desechable-Descartable-16-OZ-color-Rojo/135800502' }
];

/**
 * Default app parameters
 */
export const DEFAULT_PARAMETERS = {
  attendees: 40,
  ticketPrice: 80,
  venueCost: 1500,
  miscCosts: 600,
  drinksPerPerson: 4,
  foodServingsPerPerson: 1
};