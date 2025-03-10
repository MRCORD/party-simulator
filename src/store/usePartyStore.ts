import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShoppingItem, Category } from '@/components/party/types';

// Define the store state type
interface PartyState {
  // UI state
  activeTab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports';

  // Shopping items
  shoppingItems: ShoppingItem[];
  newItem: Omit<ShoppingItem, 'id'>;
  editingItem: ShoppingItem | null;

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
}

// Create the store with persist middleware
export const usePartyStore = create<PartyState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: 'overview',
      
      // Initial shopping items
      shoppingItems: [
        { id: '1', name: 'Ron Cartavio', category: 'spirits', cost: 45, units: 1, size: 750, sizeUnit: 'ml', servings: 15, totalCost: 45 },
        { id: '2', name: 'Coca-Cola', category: 'mixers', cost: 30, units: 6, size: 1.5, sizeUnit: 'L', servings: 30, totalCost: 180 },
        { id: '3', name: 'Hielo', category: 'ice', cost: 12, units: 1, size: 5, sizeUnit: 'kg', servings: 25, totalCost: 12 },
        { id: '4', name: 'Pollo', category: 'meat', cost: 180, units: 1, size: 10, sizeUnit: 'kg', servings: 20, totalCost: 180 },
        { id: '5', name: 'Ensalada de Papa', category: 'sides', cost: 120, units: 1, size: 5, sizeUnit: 'kg', servings: 25, totalCost: 120 },
        { id: '6', name: 'Pack de Salsas', category: 'condiments', cost: 60, units: 1, size: 1, sizeUnit: 'pack', servings: 30, totalCost: 60 },
        { id: '7', name: 'Vasos Rojos', category: 'supplies', cost: 15, units: 100, size: 16, sizeUnit: 'oz', servings: 100, totalCost: 1500 },
      ],
      
      // Initial new item state
      newItem: {
        name: '',
        category: 'spirits',
        cost: 0,
        units: 1,
        size: 0,
        sizeUnit: 'ml',
        servings: 0,
        totalCost: 0
      },
      
      // Initial editing state
      editingItem: null,
      
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
        meat: ['kg', 'lb', 'units'],
        sides: ['kg', 'lb', 'units'],
        condiments: ['units', 'pack'],
        supplies: ['units', 'oz', 'pack'],
        other: ['units']
      },
      
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
              size: 0,
              sizeUnit: 'ml',
              servings: 0,
              totalCost: 0
            }
          });
          
          get().updateFinancials();
        }
      },
      
      deleteItem: (id) => {
        set((state) => ({ 
          shoppingItems: state.shoppingItems.filter(item => item.id !== id) 
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
              size: 0,
              sizeUnit: 'ml',
              servings: 0,
              totalCost: 0
            }
          });
          
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
              [name]: name === 'cost' || name === 'units' || name === 'servings' || name === 'size' || name === 'totalCost' ? 
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
              { id: '1', name: 'Ron Cartavio', category: 'spirits', cost: 45, units: 1, size: 750, sizeUnit: 'ml', servings: 15, totalCost: 45 },
              { id: '2', name: 'Coca-Cola', category: 'mixers', cost: 30, units: 6, size: 1.5, sizeUnit: 'L', servings: 30, totalCost: 180 },
              { id: '3', name: 'Hielo', category: 'ice', cost: 12, units: 1, size: 5, sizeUnit: 'kg', servings: 25, totalCost: 12 },
              { id: '4', name: 'Pollo', category: 'meat', cost: 180, units: 1, size: 10, sizeUnit: 'kg', servings: 20, totalCost: 180 },
              { id: '5', name: 'Ensalada de Papa', category: 'sides', cost: 120, units: 1, size: 5, sizeUnit: 'kg', servings: 25, totalCost: 120 },
              { id: '6', name: 'Pack de Salsas', category: 'condiments', cost: 60, units: 1, size: 1, sizeUnit: 'pack', servings: 30, totalCost: 60 },
              { id: '7', name: 'Vasos Rojos', category: 'supplies', cost: 15, units: 100, size: 16, sizeUnit: 'oz', servings: 100, totalCost: 1500 },
            ],
            newItem: {
              name: '',
              category: 'spirits',
              cost: 0,
              units: 1,
              size: 0,
              sizeUnit: 'ml',
              servings: 0,
              totalCost: 0
            },
            editingItem: null,
            attendees: 40,
            ticketPrice: 80,
            venueCost: 1500,
            miscCosts: 600,
            drinksPerPerson: 4,
            foodServingsPerPerson: 1
          });
          get().updateFinancials();
        }
      }
    }),
    {
      name: 'party-simulator-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);