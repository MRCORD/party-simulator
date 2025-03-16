/**
 * Size units available for each category
 */
export const sizeUnits: Record<string, string[]> = {
    spirits: ['ml', 'L'],
    mixers: ['ml', 'L'],
    ice: ['kg', 'lb'],
    meat: ['kg', 'lb', 'g', 'units'],
    sides: ['kg', 'lb', 'g', 'units'],
    condiments: ['units', 'pack', 'g'],
    supplies: ['units', 'oz', 'pack'],
    other: ['units']
  };
  
  /**
   * Get appropriate size units for a category
   */
  export const getSizeUnitsForCategory = (category: string): string[] => {
    return sizeUnits[category] || ['units'];
  };
  
  /**
   * Get default size unit for a category
   */
  export const getDefaultSizeUnit = (category: string): string => {
    const units = getSizeUnitsForCategory(category);
    return units[0];
  };
  
  /**
   * Format a size with its unit for display
   */
  export const formatSizeWithUnit = (size: string | number, unit: string): string => {
    return `${size} ${unit}`;
  };