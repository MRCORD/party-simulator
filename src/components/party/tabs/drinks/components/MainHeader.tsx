import React from 'react';
import { Wine, Users } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

interface MainHeaderProps {
  attendees: number;
  drinksPerPerson: number;
  drinkRequirements: {
    totalDrinks: number;
    totalCost: number;
  };
}

const MainHeader: React.FC<MainHeaderProps> = ({
  attendees,
  drinksPerPerson,
  drinkRequirements
}) => {
  const theme = useTheme();
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className={`${theme.getGradient('primary')} p-5 text-white`}>
        <div className="flex items-center">
          <Wine className="w-6 h-6 mr-3" />
          <h2 className="text-xl font-bold">Planificación de Bebidas</h2>
        </div>
        
        {/* Key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide mb-1">Asistentes</div>
            <div className="text-2xl font-bold flex justify-center items-center">
              <Users size={18} className="mr-2 opacity-70" />
              {attendees}
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide mb-1">Bebidas por Persona</div>
            <div className="text-2xl font-bold flex justify-center items-center">
              <Wine size={18} className="mr-2 opacity-70" />
              {drinksPerPerson}
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide mb-1">Total Bebidas</div>
            <div className="text-2xl font-bold">{drinkRequirements.totalDrinks}</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xs uppercase tracking-wide mb-1">Costo Total</div>
            <div className="text-2xl font-bold">S/ {drinkRequirements.totalCost.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="text-sm text-center mt-4 bg-white/10 p-2 rounded-lg">
          El costo por persona para bebidas es aproximadamente <span className="font-bold">S/ {(drinkRequirements.totalCost / attendees).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;