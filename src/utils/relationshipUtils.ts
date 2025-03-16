import { ShoppingItem, ItemRelationship } from '@/types/shopping';

/**
 * Calculates the optimal quantities for all items based on their relationships
 * Can be used to suggest quantities when planning for a specific number of servings
 */
export const calculateOptimalQuantities = (
  items: ShoppingItem[],
  relationships: ItemRelationship[],
  requiredServings: number
): Record<string, number> => {
  const result: Record<string, number> = {};
  
  // Initialize with current quantities
  items.forEach(item => {
    result[item.id] = item.units;
  });
  
  // Create a dependency graph
  const dependencyGraph: Record<string, {secondaryId: string, ratio: number}[]> = {};
  
  items.forEach(item => {
    dependencyGraph[item.id] = [];
  });
  
  relationships.forEach(rel => {
    if (dependencyGraph[rel.primaryItemId]) {
      dependencyGraph[rel.primaryItemId].push({
        secondaryId: rel.secondaryItemId,
        ratio: rel.ratio
      });
    }
  });
  
  // Function to update dependent items
  const updateDependents = (itemId: string, quantity: number, visited: Set<string> = new Set()) => {
    // Prevent circular dependencies
    if (visited.has(itemId)) return;
    visited.add(itemId);
    
    // Update this item
    result[itemId] = quantity;
    
    // Update all dependents
    dependencyGraph[itemId].forEach(dep => {
      const newQuantity = quantity * dep.ratio;
      updateDependents(dep.secondaryId, newQuantity, new Set(visited));
    });
  };
  
  // Start with primary items that have relationships
  const primaryItems = items.filter(item => 
    relationships.some(rel => rel.primaryItemId === item.id)
  );
  
  primaryItems.forEach(item => {
    // Calculate required units based on servings
    const requiredUnits = Math.ceil(requiredServings / item.servings);
    updateDependents(item.id, requiredUnits);
  });
  
  return result;
};

/**
 * Detects complementary items based on their names and categories
 * Can be used to suggest potential relationships to the user
 */
export const suggestComplementaryItems = (
  items: ShoppingItem[]
): {primary: ShoppingItem, secondary: ShoppingItem, suggestedRatio: number}[] => {
  const suggestions: {primary: ShoppingItem, secondary: ShoppingItem, suggestedRatio: number}[] = [];
  
  // Common pairs with their typical ratios
  const commonPairs = [
    // Burger combinations
    { primaryCategory: 'meat', primaryKeyword: 'hamburg', secondaryCategory: 'sides', secondaryKeyword: 'pan', ratio: 1 },
    { primaryCategory: 'meat', primaryKeyword: 'burger', secondaryCategory: 'sides', secondaryKeyword: 'bun', ratio: 1 },
    
    // Hot dog combinations
    { primaryCategory: 'meat', primaryKeyword: 'hotdog', secondaryCategory: 'sides', secondaryKeyword: 'pan', ratio: 1 },
    { primaryCategory: 'meat', primaryKeyword: 'salchicha', secondaryCategory: 'sides', secondaryKeyword: 'pan', ratio: 1 },
    
    // Drink combinations
    { primaryCategory: 'spirits', primaryKeyword: 'ron', secondaryCategory: 'mixers', secondaryKeyword: 'cola', ratio: 3 },
    { primaryCategory: 'spirits', primaryKeyword: 'vodka', secondaryCategory: 'mixers', secondaryKeyword: 'jugo', ratio: 3 },
    { primaryCategory: 'spirits', primaryKeyword: 'gin', secondaryCategory: 'mixers', secondaryKeyword: 'tonic', ratio: 3 },
    { primaryCategory: 'spirits', primaryKeyword: 'whisky', secondaryCategory: 'ice', secondaryKeyword: 'hielo', ratio: 2 },
    
    // Generic combinations
    { primaryCategory: 'spirits', secondaryCategory: 'ice', ratio: 2 }, // Any spirit needs ice
    { primaryCategory: 'spirits', secondaryCategory: 'mixers', ratio: 3 }, // Any spirit could use mixers
  ];
  
  // Check each possible pair of items
  for (const primary of items) {
    const primaryName = primary.name.toLowerCase();
    
    for (const pair of commonPairs) {
      // Skip if primary doesn't match the criteria
      if (pair.primaryCategory !== primary.category) continue;
      if (pair.primaryKeyword && !primaryName.includes(pair.primaryKeyword)) continue;
      
      // Find matching secondary items
      for (const secondary of items) {
        if (primary.id === secondary.id) continue;
        
        const secondaryName = secondary.name.toLowerCase();
        
        // Check if secondary matches the criteria
        if (pair.secondaryCategory !== secondary.category) continue;
        if (pair.secondaryKeyword && !secondaryName.includes(pair.secondaryKeyword)) continue;
        
        // Found a potential match
        suggestions.push({
          primary,
          secondary,
          suggestedRatio: pair.ratio
        });
      }
    }
  }
  
  return suggestions;
};

/**
 * Validates if the current item quantities maintain the proper ratios
 * Can be used to highlight potential inventory issues
 */
export const validateComplementaryRatios = (
  items: ShoppingItem[],
  relationships: ItemRelationship[]
): {itemId: string, name: string, issue: string}[] => {
  const issues: {itemId: string, name: string, issue: string}[] = [];
  
  // Check each relationship
  relationships.forEach(rel => {
    const primaryItem = items.find(item => item.id === rel.primaryItemId);
    const secondaryItem = items.find(item => item.id === rel.secondaryItemId);
    
    if (!primaryItem || !secondaryItem) return;
    
    // Calculate the expected quantity of the secondary item
    const expectedQuantity = primaryItem.units * rel.ratio;
    
    // If we have less than expected, flag it
    if (secondaryItem.units < expectedQuantity) {
      const deficit = expectedQuantity - secondaryItem.units;
      issues.push({
        itemId: secondaryItem.id,
        name: secondaryItem.name,
        issue: `Necesitas ${deficit} más unidades para mantener la proporción con ${primaryItem.name}`
      });
    }
  });
  
  return issues;
};

/**
 * Auto-suggest relationships based on items in the shopping list
 */
export const autoSuggestRelationships = (
  items: ShoppingItem[],
  existingRelationships: ItemRelationship[]
): ItemRelationship[] => {
  const suggestions: ItemRelationship[] = [];
  const existingPairs = new Set(
    existingRelationships.map(rel => `${rel.primaryItemId}-${rel.secondaryItemId}`)
  );
  
  // Get potential matches
  const potentialMatches = suggestComplementaryItems(items);
  
  // Filter out any that already exist
  potentialMatches.forEach(match => {
    const pairKey = `${match.primary.id}-${match.secondary.id}`;
    if (!existingPairs.has(pairKey)) {
      suggestions.push({
        primaryItemId: match.primary.id,
        secondaryItemId: match.secondary.id,
        ratio: match.suggestedRatio
      });
    }
  });
  
  return suggestions;
};

/**
 * Makes sure the related items are properly synchronized based on relationships
 */
export const synchronizeRelatedItems = (
  items: ShoppingItem[],
  relationships: ItemRelationship[]
): ShoppingItem[] => {
  // Create a copy of the items to modify
  const updatedItems = [...items];
  
  // Process each relationship
  relationships.forEach(rel => {
    const primaryIndex = updatedItems.findIndex(item => item.id === rel.primaryItemId);
    const secondaryIndex = updatedItems.findIndex(item => item.id === rel.secondaryItemId);
    
    if (primaryIndex !== -1 && secondaryIndex !== -1) {
      const primaryItem = updatedItems[primaryIndex];
      const secondaryItem = updatedItems[secondaryIndex];
      
      // Calculate the expected quantity based on the relationship ratio
      const expectedQuantity = Math.max(1, Math.round(primaryItem.units * rel.ratio));
      
      // Update the secondary item if needed
      if (secondaryItem.units !== expectedQuantity) {
        updatedItems[secondaryIndex] = {
          ...secondaryItem,
          units: expectedQuantity,
          totalCost: secondaryItem.cost * expectedQuantity
        };
      }
    }
  });
  
  return updatedItems;
};