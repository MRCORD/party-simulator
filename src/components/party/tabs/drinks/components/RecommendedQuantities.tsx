import React from 'react';
import { TrendingUp, Wine, Droplet, Info } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';
import { ShoppingItem } from '@/types';

interface RecommendedQuantitiesProps {
  getRecommendedUnits: (category: string, totalDrinks: number) => number;
  drinkRequirements: {
    totalDrinks: number;
  };
  shoppingItems: ShoppingItem[];
}

const RecommendedQuantities: React.FC<RecommendedQuantitiesProps> = ({
  getRecommendedUnits,
  drinkRequirements,
  shoppingItems
}) => {
  const theme = useTheme();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Cantidades Recomendadas</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Liquors Recommendation */}
          <div className="bg-primary-light/20 rounded-lg p-4 border border-primary-light">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-primary text-white">
                <Wine size={16} />
              </div>
              <span className="font-medium">Licores</span>
            </div>
            
            <div className="text-center mt-3">
              <div className="text-3xl font-bold text-primary">
                {getRecommendedUnits('spirits', drinkRequirements.totalDrinks)}
              </div>
              <div className="text-sm text-gray-600">unidades</div>
            </div>
            
            <div className="mt-3 flex justify-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                getRecommendedUnits('spirits', drinkRequirements.totalDrinks) > shoppingItems
                  .filter(i => i.category === 'spirits')
                  .reduce((sum, i) => sum + i.units, 0)
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {getRecommendedUnits('spirits', drinkRequirements.totalDrinks) > shoppingItems
                  .filter(i => i.category === 'spirits')
                  .reduce((sum, i) => sum + i.units, 0)
                  ? 'Necesita más'
                  : 'Completo'}
              </span>
            </div>
          </div>
          
          {/* Mixers Recommendation */}
          <div className="bg-primary-light/20 rounded-lg p-4 border border-primary-light">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-accent-teal text-white">
                <Droplet size={16} />
              </div>
              <span className="font-medium">Mezcladores</span>
            </div>
            
            <div className="text-center mt-3">
              <div className="text-3xl font-bold text-primary">
                {getRecommendedUnits('mixers', drinkRequirements.totalDrinks)}
              </div>
              <div className="text-sm text-gray-600">unidades</div>
            </div>
            
            <div className="mt-3 flex justify-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                getRecommendedUnits('mixers', drinkRequirements.totalDrinks) > shoppingItems
                  .filter(i => i.category === 'mixers')
                  .reduce((sum, i) => sum + i.units, 0)
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {getRecommendedUnits('mixers', drinkRequirements.totalDrinks) > shoppingItems
                  .filter(i => i.category === 'mixers')
                  .reduce((sum, i) => sum + i.units, 0)
                  ? 'Necesita más'
                  : 'Completo'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-primary-light/20 rounded-lg p-4 mt-4 border border-primary-light">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-primary mr-2" />
            <span className="text-sm text-primary-dark">
              Las cantidades recomendadas son calculadas en base al número de asistentes y bebidas por persona.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedQuantities;