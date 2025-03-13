/**
 * Food-related types
 */
export interface FoodRequirements {
    totalServings: number;
    totalCost: number;
    meatCost: number;
    sidesCost: number;
    condimentsCost: number;
    hasEnoughMeat: boolean;
    hasEnoughSides: boolean;
    hasEnoughCondiments: boolean;
  }
  
  /**
   * Drink-related types
   */
  export interface DrinkRequirements {
    totalDrinks: number;
    totalCost: number;
    spiritsCost: number;
    mixersCost: number;
    iceCost: number;
    suppliesCost: number;
    hasEnoughSpirits: boolean;
    hasEnoughMixers: boolean;
    hasEnoughIce: boolean;
    hasEnoughSupplies: boolean;
  }