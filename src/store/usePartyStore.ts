import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShoppingItem, ItemRelationship } from '@/types/shopping';
import { Category } from '@/types/party'; 
import { EaterProfile, SimulationResult } from '@/types/simulator';
import { DEFAULT_SHOPPING_ITEMS, DEFAULT_EATER_PROFILES } from '@/components/party/constants/defaults';
import { runMonteCarlo } from '@/utils/simulationUtils';

// Define the store state type
interface PartyState {
  // UI state
  activeTab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports';

  // Shopping items
  shoppingItems: ShoppingItem[];
  newItem: Omit<ShoppingItem, 'id'>;
  editingItem: ShoppingItem | null;

  // Item relationships (new)
  itemRelationships: ItemRelationship[];

  // Basic parameters
  attendees: number;
  ticketPrice: number;
  venueCost: number;
  miscCosts: number;
  drinksPerPerson: number;
  foodServingsPerPerson: number;

  // Financial results (derived values)
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  breakEvenAttendees: number;
  perPersonCost: number;
  isViable: boolean;
  recommendedTicketPrice: number;

  // Shopping categories - these are constant, but included for completeness
  categories: Category[];
  sizeUnits: Record<string, string[]>;

  // Food Simulator State
  confidenceLevel: number;
  eaterProfiles: EaterProfile[];
  simulationCount: number;
  useAdvancedFoodSim: boolean;
  simulationResults: Record<string, SimulationResult>;
  simulationRun: boolean;

  // Actions
  setActiveTab: (tab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports') => void;
  setAttendees: (value: number) => void;
  setTicketPrice: (value: number) => void;
  setVenueCost: (value: number) => void;
  setMiscCosts: (value: number) => void;
  setDrinksPerPerson: (value: number) => void;
  setFoodServingsPerPerson: (value: number) => void;

  // Shopping actions
  addItem: () => void;
  deleteItem: (id: string) => void;
  startEdit: (item: ShoppingItem) => void;
  saveEdit: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

  // Complementary items actions
  addItemRelationship: (relationship: ItemRelationship) => void;
  removeItemRelationship: (index: number) => void;
  updateRelatedItems: (itemId: string, newUnits: number) => void;

  // Computed values for accessing data
  getCategoryTotal: (category: string) => number;
  getCategoryServings: (category: string) => number;
  getItemsByCategory: () => Record<string, ShoppingItem[]>;
  getRecommendedUnits: (category: string, requiredServings: number) => number;

  // Helper functions
  hasEnoughServings: (category: string, requiredServings: number) => boolean;
  calculateDrinkRequirements: () => {
    totalDrinks: number;
    hasEnoughSpirits: boolean;
    hasEnoughMixers: boolean;
    hasEnoughIce: boolean;
    hasEnoughSupplies: boolean;
    spiritsCost: number;
    mixersCost: number;
    iceCost: number;
    suppliesCost: number;
    totalCost: number;
  };
  calculateFoodRequirements: () => {
    totalServings: number;
    hasEnoughMeat: boolean;
    hasEnoughSides: boolean;
    hasEnoughCondiments: boolean;
    meatCost: number;
    sidesCost: number;
    condimentsCost: number;
    totalCost: number;
  };

  // Financial calculation utility
  updateFinancials: () => void;

  // Reset functionality
  resetAllData: () => void;

  // NEW: Food Simulation Actions
  setConfidenceLevel: (level: number) => void;
  setSimulationCount: (count: number) => void;
  updateEaterProfile: (index: number, field: keyof EaterProfile, value: number) => void;
  setUseAdvancedFoodSim: (value: boolean) => void;
  runFoodSimulation: (selectedFoodItems?: string[]) => void;
  applySimulationRecommendations: () => void;
}

// Create the store with persist middleware
export const usePartyStore = create<PartyState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: 'overview',

      // Initial shopping items
      shoppingItems: [
        { id: '1', name: 'Hamburguesas Parrilleras Oregon Foods', category: 'meat', cost: 33.90, units: 1, size: '150', sizeUnit: 'g', servings: 4, totalCost: 33.90, url: 'https://www.wong.pe/hamburguesas-parrilleras-oregon-foods-4un-404812/p' },
        { id: '2', name: 'Pan Hamburguesa Brioche Wong', category: 'sides', cost: 8.90, units: 1, size: '300', sizeUnit: 'g', servings: 4, totalCost: 8.90, url: 'https://www.wong.pe/pan-hamburguesa-brioche-wong-4un-926992/p' },
        { id: '3', name: 'Chorizo Parrillero Zimmermann', category: 'meat', cost: 16.90, units: 1, size: '400', sizeUnit: 'g', servings: 4, totalCost: 16.90, url: 'https://www.wong.pe/chorizo-parrillero-zimmermann-400g-2-2/p' },
        { id: '4', name: 'Twelvepack Cerveza Pilsen Callao', category: 'spirits', cost: 49.90, units: 1, size: '355', sizeUnit: 'ml', servings: 12, totalCost: 49.90, url: 'https://www.wong.pe/twelvepack-cerveza-pilsen-callao-lata-355ml/p' },
        { id: '5', name: 'Ron Cartavio Solera 12 Años', category: 'spirits', cost: 94.90, units: 1, size: '750', sizeUnit: 'ml', servings: 15, totalCost: 94.90, url: 'https://www.wong.pe/ron-cartavio-solera-12-a-os-botella-750ml-46994/p' },
        { id: '6', name: 'Hielo Cuisine&Co', category: 'ice', cost: 6.50, units: 1, size: '3', sizeUnit: 'kg', servings: 15, totalCost: 6.50, url: 'https://www.wong.pe/hielo-cuisine-co-bolsa-3-kg/p' },
        { id: '7', name: 'Twopack Gaseosa Coca Cola Original', category: 'mixers', cost: 20.50, units: 1, size: '3', sizeUnit: 'L', servings: 30, totalCost: 20.50, url: 'https://www.wong.pe/twopack-gaseosa-coca-cola-sabor-original-botella-3l-148354/p' },
        { id: '8', name: 'Vasos Rojos 16oz', category: 'supplies', cost: 29.90, units: 1, size: 'Pack 50 vasos', sizeUnit: 'pack', servings: 50, totalCost: 29.90, url: 'https://www.sodimac.com.pe/sodimac-pe/articulo/135800501/Vasos-para-Fiesta-SET-X-50-UND-Desechable-Descartable-16-OZ-color-Rojo/135800502' },
      ],

      // Initial new item state
      newItem: {
        name: '',
        category: 'spirits',
        cost: 0,
        units: 1,
        size: '',
        sizeUnit: 'unit',
        servings: 0,
        totalCost: 0,
        url: ''
      },

      // Initial editing state
      editingItem: null,

      // Initial item relationships
      itemRelationships: [
        { primaryItemId: '1', secondaryItemId: '2', ratio: 1 } // Example: 1 bun per hamburger
      ],

      // Initial parameters
      attendees: 40,
      ticketPrice: 80,
      venueCost: 1500,
      miscCosts: 600,
      drinksPerPerson: 4,
      foodServingsPerPerson: 1,

      // Initial financial results (will be calculated in useEffect)
      totalRevenue: 0,
      totalCosts: 0,
      netProfit: 0,
      breakEvenAttendees: 0,
      perPersonCost: 0,
      isViable: false,
      recommendedTicketPrice: 0,

      // Shopping categories - constant values
      categories: [
        { value: 'spirits', label: 'Licores' },
        { value: 'mixers', label: 'Mezcladores' },
        { value: 'ice', label: 'Hielo' },
        { value: 'meat', label: 'Carnes' },
        { value: 'sides', label: 'Guarniciones' },
        { value: 'condiments', label: 'Condimentos' },
        { value: 'supplies', label: 'Suministros' },
        { value: 'other', label: 'Otros' }
      ],

      // Size units - constant values
      sizeUnits: {
        spirits: ['ml', 'L'],
        mixers: ['ml', 'L'],
        ice: ['kg', 'lb'],
        meat: ['kg', 'lb', 'g', 'units'],
        sides: ['kg', 'lb', 'g', 'units'],
        condiments: ['units', 'pack', 'g'],
        supplies: ['units', 'oz', 'pack'],
        other: ['units']
      },

      // Food Simulator State
      confidenceLevel: 95,
      simulationCount: 1000,
      eaterProfiles: [
        { name: "Light Eater", percentage: 25, servingsMultiplier: 0.7 },
        { name: "Average Eater", percentage: 50, servingsMultiplier: 1.0 },
        { name: "Heavy Eater", percentage: 25, servingsMultiplier: 1.5 }
      ],
      useAdvancedFoodSim: false,
      simulationResults: {},
      simulationRun: false,

      // UI Actions
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Parameter Actions
      setAttendees: (value) => {
        set({ attendees: value });
        get().updateFinancials();
      },

      setTicketPrice: (value) => {
        set({ ticketPrice: value });
        get().updateFinancials();
      },

      setVenueCost: (value) => {
        set({ venueCost: value });
        get().updateFinancials();
      },

      setMiscCosts: (value) => {
        set({ miscCosts: value });
        get().updateFinancials();
      },

      setDrinksPerPerson: (value) => {
        set({ drinksPerPerson: value });
      },

      setFoodServingsPerPerson: (value) => {
        set({ foodServingsPerPerson: value });
      },

      // Shopping Actions
      addItem: () => {
        const { newItem, shoppingItems } = get();

        if (newItem.name && newItem.cost > 0) {
          const newId = shoppingItems.length > 0
            ? (Math.max(...shoppingItems.map(item => parseInt(item.id))) + 1).toString()
            : '1';

          const totalCost = newItem.cost * newItem.units;
          const updatedItems = [...shoppingItems, { ...newItem, id: newId, totalCost }];

          set({
            shoppingItems: updatedItems,
            newItem: {
              name: '',
              category: 'spirits',
              cost: 0,
              units: 1,
              size: '',
              sizeUnit: 'ml',
              servings: 0,
              totalCost: 0
            }
          });

          get().updateFinancials();
        }
      },

      deleteItem: (id) => {
        // Find any relationships involving this item
        const { itemRelationships } = get();
        const relationshipsToRemove = itemRelationships.filter(
          rel => rel.primaryItemId === id || rel.secondaryItemId === id
        );
          
        // Remove item from shopping list
        set(state => ({
          shoppingItems: state.shoppingItems.filter(item => item.id !== id),
          // Also remove any relationships involving this item
          itemRelationships: state.itemRelationships.filter(
            rel => rel.primaryItemId !== id && rel.secondaryItemId !== id
          )
        }));
        
        get().updateFinancials();
      },

      startEdit: (item) => {
        set({
          editingItem: item,
          newItem: { ...item }
        });
      },

      saveEdit: () => {
        const { editingItem, newItem, shoppingItems } = get();

        if (editingItem && newItem.name && newItem.cost > 0) {
          const totalCost = newItem.cost * newItem.units;
          
          // Check if the units have changed
          const unitsChanged = editingItem.units !== newItem.units;

          set({
            shoppingItems: shoppingItems.map(item =>
              item.id === editingItem.id ? { ...newItem, id: item.id, totalCost } : item
            ),
            editingItem: null,
            newItem: {
              name: '',
              category: 'spirits',
              cost: 0,
              units: 1,
              size: '',
              sizeUnit: 'ml',
              servings: 0,
              totalCost: 0
            }
          });

          // If units changed, update any related items
          if (unitsChanged) {
            get().updateRelatedItems(editingItem.id, newItem.units);
          }

          get().updateFinancials();
        }
      },

      handleInputChange: (e) => {
        const { name, value } = e.target;
        const { newItem, sizeUnits } = get();

        if (name === 'category') {
          // Fix: Proper type-casting for category field
          const categoryValue = value as ShoppingItem['category'];
          set({
            newItem: {
              ...newItem,
              [name]: categoryValue,
              sizeUnit: sizeUnits[categoryValue][0]
            }
          });
        } else {
          set({
            newItem: {
              ...newItem,
              [name]: name === 'cost' || name === 'units' || name === 'servings' || name === 'totalCost' ?
                (value === '' ? 0 : parseFloat(value)) : value,
              // Recalculate totalCost whenever cost or units change
              ...(name === 'cost' || name === 'units' ? {
                totalCost: name === 'cost'
                  ? parseFloat(value || '0') * newItem.units
                  : newItem.cost * parseFloat(value || '0')
              } : {})
            }
          });
        }
      },

      // Complementary items actions 
      addItemRelationship: (relationship) => {
        // Check that both items exist and they're not the same item
        const items = get().shoppingItems;
        const primaryItem = items.find(item => item.id === relationship.primaryItemId);
        const secondaryItem = items.find(item => item.id === relationship.secondaryItemId);
        
        if (!primaryItem || !secondaryItem || primaryItem.id === secondaryItem.id) {
          console.error("Invalid relationship");
          return;
        }
        
        // Check if relationship already exists
        const existingIndex = get().itemRelationships.findIndex(
          rel => rel.primaryItemId === relationship.primaryItemId && 
                 rel.secondaryItemId === relationship.secondaryItemId
        );
        
        if (existingIndex !== -1) {
          // Update existing relationship
          const updatedRelationships = [...get().itemRelationships];
          updatedRelationships[existingIndex] = relationship;
          set({ itemRelationships: updatedRelationships });
        } else {
          // Add new relationship
          set(state => ({ 
            itemRelationships: [...state.itemRelationships, relationship] 
          }));
        }
        
        // Update secondary item quantity based on current primary item quantity
        get().updateRelatedItems(relationship.primaryItemId, primaryItem.units);
      },
      
      removeItemRelationship: (index) => {
        set(state => ({
          itemRelationships: state.itemRelationships.filter((_, i) => i !== index)
        }));
      },
      
      updateRelatedItems: (itemId, newUnits) => {
        // Find all relationships where this item is the primary
        const relationships = get().itemRelationships.filter(
          rel => rel.primaryItemId === itemId
        );
        
        if (relationships.length === 0) return;
        
        // Get the current shopping items
        const items = [...get().shoppingItems];
        let updated = false;
        
        // Update the units of all related secondary items
        relationships.forEach(relation => {
          const secondaryItemIndex = items.findIndex(item => item.id === relation.secondaryItemId);
          
          if (secondaryItemIndex !== -1) {
            // Calculate new units for the secondary item based on the ratio
            const newSecondaryUnits = Math.max(1, Math.round(newUnits * relation.ratio));
            
            // Update secondary item quantity
            items[secondaryItemIndex] = {
              ...items[secondaryItemIndex],
              units: newSecondaryUnits,
              totalCost: items[secondaryItemIndex].cost * newSecondaryUnits
            };
            
            updated = true;
          }
        });
        
        if (updated) {
          set({ shoppingItems: items });
          get().updateFinancials();
        }
      },

      // Computed values / helper functions
      getCategoryTotal: (category) => {
        return get().shoppingItems
          .filter(item => item.category === category)
          .reduce((sum, item) => sum + (item.cost * item.units), 0);
      },

      getCategoryServings: (category) => {
        return get().shoppingItems
          .filter(item => item.category === category)
          .reduce((sum, item) => sum + (item.servings * item.units), 0);
      },

      hasEnoughServings: (category, requiredServings) => {
        const totalServings = get().getCategoryServings(category);
        return totalServings >= requiredServings;
      },

      getItemsByCategory: () => {
        const { shoppingItems, categories } = get();
        const grouped: Record<string, ShoppingItem[]> = {};

        categories.forEach(cat => {
          grouped[cat.value] = shoppingItems.filter(item => item.category === cat.value);
        });

        return grouped;
      },

      getRecommendedUnits: (category, requiredServings) => {
        const items = get().shoppingItems.filter(item => item.category === category);
        if (items.length === 0) return 0;

        // Just use the first item's servings as a simple estimation
        const servingsPerUnit = items[0].servings;
        return Math.ceil(requiredServings / servingsPerUnit);
      },

      calculateDrinkRequirements: () => {
        const { attendees, drinksPerPerson, hasEnoughServings, getCategoryTotal } = get();
        const totalDrinks = attendees * drinksPerPerson;

        const hasEnoughSpirits = hasEnoughServings('spirits', totalDrinks);
        const hasEnoughMixers = hasEnoughServings('mixers', totalDrinks);
        const hasEnoughIce = hasEnoughServings('ice', totalDrinks);
        const hasEnoughSupplies = hasEnoughServings('supplies', totalDrinks);

        return {
          totalDrinks,
          hasEnoughSpirits,
          hasEnoughMixers,
          hasEnoughIce,
          hasEnoughSupplies,
          spiritsCost: getCategoryTotal('spirits'),
          mixersCost: getCategoryTotal('mixers'),
          iceCost: getCategoryTotal('ice'),
          suppliesCost: getCategoryTotal('supplies'),
          totalCost: getCategoryTotal('spirits') + getCategoryTotal('mixers') +
            getCategoryTotal('ice') + getCategoryTotal('supplies')
        };
      },

      calculateFoodRequirements: () => {
        const { attendees, foodServingsPerPerson, hasEnoughServings, getCategoryTotal } = get();
        const totalServings = attendees * foodServingsPerPerson;

        const hasEnoughMeat = hasEnoughServings('meat', totalServings);
        const hasEnoughSides = hasEnoughServings('sides', totalServings);
        const hasEnoughCondiments = hasEnoughServings('condiments', totalServings);

        return {
          totalServings,
          hasEnoughMeat,
          hasEnoughSides,
          hasEnoughCondiments,
          meatCost: getCategoryTotal('meat'),
          sidesCost: getCategoryTotal('sides'),
          condimentsCost: getCategoryTotal('condiments'),
          totalCost: getCategoryTotal('meat') + getCategoryTotal('sides') + getCategoryTotal('condiments')
        };
      },

      // Update financial calculations
      updateFinancials: () => {
        const { attendees, ticketPrice, venueCost, miscCosts, shoppingItems } = get();

        const totalShoppingCosts = shoppingItems.reduce((sum, item) => sum + (item.cost * item.units), 0);
        const calculatedTotalCosts = venueCost + totalShoppingCosts + miscCosts;
        const calculatedTotalRevenue = attendees * ticketPrice;
        const calculatedNetProfit = calculatedTotalRevenue - calculatedTotalCosts;

        const calculatedPerPersonCost = calculatedTotalCosts / attendees;

        // Calculate recommended ticket price with 15% profit margin
        const calculatedRecommendedTicketPrice = Math.ceil(calculatedPerPersonCost * 1.15);

        // Calculate break-even attendees
        const fixedCosts = venueCost + miscCosts;
        const variableCosts = totalShoppingCosts;
        const variableCostPerPerson = variableCosts / attendees;
        const calculatedBreakEvenAttendees = Math.ceil(fixedCosts / (ticketPrice - variableCostPerPerson));

        set({
          totalCosts: calculatedTotalCosts,
          totalRevenue: calculatedTotalRevenue,
          netProfit: calculatedNetProfit,
          perPersonCost: calculatedPerPersonCost,
          breakEvenAttendees: calculatedBreakEvenAttendees,
          isViable: calculatedNetProfit >= 0,
          recommendedTicketPrice: calculatedRecommendedTicketPrice
        });
      },

      // Reset all data
      resetAllData: () => {
        if (typeof window !== 'undefined' &&
          window.confirm('¿Estás seguro de que quieres reiniciar todos los datos? Esta acción no se puede deshacer.')) {
          // Reset to initial state (this will clear the persisted state as well)
          set({
            activeTab: 'overview',
            shoppingItems: [
              { id: '1', name: 'Ron Cartavio Black', category: 'spirits', cost: 45, units: 1, size: 'Botella 750ml', sizeUnit: 'bottle', servings: 15, totalCost: 45 },
              { id: '2', name: 'Coca-Cola Pack', category: 'mixers', cost: 30, units: 1, size: 'Pack 6 botellas 1.5L', sizeUnit: 'pack', servings: 30, totalCost: 30 },
              { id: '3', name: 'Hielo en Bolsa', category: 'ice', cost: 12, units: 1, size: 'Bolsa 5kg', sizeUnit: 'bag', servings: 25, totalCost: 12 },
              { id: '4', name: 'Pollo Entero', category: 'meat', cost: 18, units: 1, size: 'Piezas 1kg', sizeUnit: 'piece', servings: 4, totalCost: 18 },
              { id: '5', name: 'Ensalada de Papa', category: 'sides', cost: 25, units: 1, size: 'Bandeja 1kg', sizeUnit: 'tray', servings: 5, totalCost: 25 },
              { id: '6', name: 'Pack de Salsas BBQ', category: 'condiments', cost: 15, units: 1, size: 'Pack 3 salsas', sizeUnit: 'pack', servings: 10, totalCost: 15 },
              { id: '7', name: 'Vasos Rojos 16oz', category: 'supplies', cost: 15, units: 1, size: 'Pack 50 vasos', sizeUnit: 'pack', servings: 50, totalCost: 15 },
              { id: '8', name: 'Hamburguesas Parrilleras', category: 'meat', cost: 33.90, units: 1, size: 'Pack 4un x 150g', sizeUnit: 'pack', servings: 4, totalCost: 33.90 },
            ],
            newItem: {
              name: '',
              category: 'spirits',
              cost: 0,
              units: 1,
              size: '',
              sizeUnit: 'ml',
              servings: 0,
              totalCost: 0
            },
            editingItem: null,
            itemRelationships: [],
            attendees: 40,
            ticketPrice: 80,
            venueCost: 1500,
            miscCosts: 600,
            drinksPerPerson: 4,
            foodServingsPerPerson: 1,
            confidenceLevel: 95,
            simulationCount: 1000,
            eaterProfiles: [
              { name: "Light Eater", percentage: 25, servingsMultiplier: 0.7 },
              { name: "Average Eater", percentage: 50, servingsMultiplier: 1.0 },
              { name: "Heavy Eater", percentage: 25, servingsMultiplier: 1.5 }
            ],
            useAdvancedFoodSim: false,
            simulationResults: {},
            simulationRun: false
          });
          get().updateFinancials();
        }
      },

      // NEW: Food Simulation Actions
      setConfidenceLevel: (level) => set({ confidenceLevel: level }),
      
      setSimulationCount: (count) => set({ simulationCount: count }),
      
      updateEaterProfile: (index, field, value) => {
        const profiles = [...get().eaterProfiles];
        if (profiles[index]) {
          profiles[index] = { 
            ...profiles[index], 
            [field]: value 
          };
          set({ eaterProfiles: profiles });
        }
      },
      
      setUseAdvancedFoodSim: (value) => set({ useAdvancedFoodSim: value }),
      
      runFoodSimulation: (selectedFoodItems) => {
        const { 
          attendees, 
          eaterProfiles, 
          confidenceLevel, 
          simulationCount,
          shoppingItems,
          itemRelationships
        } = get();
        
        // Filter food items if a specific selection is provided
        let foodItems = shoppingItems.filter(item => 
          ['meat', 'sides', 'condiments'].includes(item.category)
        );
        
        if (selectedFoodItems && selectedFoodItems.length > 0) {
          foodItems = foodItems.filter(item => selectedFoodItems.includes(item.id));
        }
        
        // Filter relationships to only include selected items
        const relevantRelationships = itemRelationships.filter(rel => {
          const isPrimarySelected = foodItems.some(item => item.id === rel.primaryItemId);
          const isSecondarySelected = foodItems.some(item => item.id === rel.secondaryItemId);
          return isPrimarySelected || isSecondarySelected;
        });
        
        // Run the Monte Carlo simulation
        const results = runMonteCarlo({
          attendees,
          eaterProfiles,
          foodItems,
          itemRelationships: relevantRelationships,
          confidenceLevel,
          simulationCount
        });
        
        set({ 
          simulationResults: results,
          simulationRun: true
        });
      },
      
      applySimulationRecommendations: () => {
        const { simulationResults, shoppingItems } = get();
        
        if (Object.keys(simulationResults).length === 0) return;
        
        // Update the units for each item that has a simulation result
        const updatedItems = shoppingItems.map(item => {
          const result = simulationResults[item.id];
          if (!result) return item;
          
          return {
            ...item,
            units: result.recommendedUnits,
            totalCost: result.totalCost
          };
        });
        
        set({ shoppingItems: updatedItems });
        get().updateFinancials();
      }
    }),
    {
      name: 'party-simulator-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);