import React from 'react';
import { Info, Target, Wine, Utensils, Sparkles } from 'lucide-react';
import StatusRow from '@/components/party/shared/status/StatusRow';
import { useTheme } from '@/components/ui/ThemeProvider';

interface StatusSectionProps {
  attendees: number;
  breakEvenAttendees: number;
  ticketPrice: number;
  recommendedTicketPrice: number;
  isViable: boolean;
  drinkRequirements: {
    totalDrinks: number;
    hasEnoughSpirits: boolean;
    hasEnoughMixers: boolean;
    hasEnoughIce: boolean;
    hasEnoughSupplies: boolean;
  };
  foodRequirements: {
    totalServings: number;
    hasEnoughMeat: boolean;
    hasEnoughSides: boolean;
    hasEnoughCondiments: boolean;
  };
  getCategoryServings: (category: string) => number;
  useAdvancedFoodSim: boolean;
  useAdvancedDrinkSim: boolean;
  setUseAdvancedFoodSim: (value: boolean) => void;
  setUseAdvancedDrinkSim: (value: boolean) => void;
  setActiveTab: (tab: "overview" | "drinks" | "food" | "shopping" | "reports") => void;
}

const StatusSection: React.FC<StatusSectionProps> = ({
  attendees,
  breakEvenAttendees,
  ticketPrice,
  recommendedTicketPrice,
  isViable,
  drinkRequirements,
  foodRequirements,
  getCategoryServings,
  useAdvancedFoodSim,
  useAdvancedDrinkSim,
  setUseAdvancedFoodSim,
  setUseAdvancedDrinkSim,
  setActiveTab,
}) => {
  const theme = useTheme();
  
  // Calculate status percentages
  const ticketPricePercentage = Math.min(100, (ticketPrice / recommendedTicketPrice) * 100);
  const attendancePercentage = Math.min(100, (attendees / breakEvenAttendees) * 100);
  const viabilityPercentage = isViable ? 100 : 
    Math.min(100, ((ticketPricePercentage + attendancePercentage) / 2));
  
  const handleDrinkSimClick = () => {
    setUseAdvancedDrinkSim(!useAdvancedDrinkSim);
    setActiveTab('drinks');
  };

  const handleFoodSimClick = () => {
    setUseAdvancedFoodSim(!useAdvancedFoodSim);
    setActiveTab('food');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center mb-4">
        <Info className="w-5 h-5 text-primary mr-2" />
        <h2 className="text-base font-medium text-primary">Estado General</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Drinks Status */}
        <div className="rounded overflow-hidden border border-gray-200">
          <div 
            className={`${useAdvancedDrinkSim 
              ? theme.getGradient('primary') 
              : theme.getGradient('primary')
            } text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:opacity-90`}
            onClick={handleDrinkSimClick}
          >
            <div className="flex items-center">
              <Wine className="w-4 h-4 mr-2" />
              <span className="font-medium">Estado de Bebidas</span>
            </div>
            {useAdvancedDrinkSim && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Monte Carlo
              </span>
            )}
          </div>
          <div className="p-3">
            <StatusRow 
              key="spirits"
              title="Licores" 
              current={getCategoryServings('spirits')} 
              total={drinkRequirements.totalDrinks} 
              isOk={drinkRequirements.hasEnoughSpirits} 
            />
            <StatusRow 
              key="mixers"
              title="Mezcladores" 
              current={getCategoryServings('mixers')} 
              total={drinkRequirements.totalDrinks} 
              isOk={drinkRequirements.hasEnoughMixers} 
            />
            <StatusRow 
              key="ice"
              title="Hielo" 
              current={getCategoryServings('ice')} 
              total={drinkRequirements.totalDrinks} 
              isOk={drinkRequirements.hasEnoughIce} 
            />
            <StatusRow 
              key="supplies"
              title="Suministros" 
              current={getCategoryServings('supplies')} 
              total={drinkRequirements.totalDrinks} 
              isOk={drinkRequirements.hasEnoughSupplies} 
            />
            {useAdvancedDrinkSim && (
              <div className="mt-2 bg-primary-light/50 p-2 rounded text-xs text-primary-dark">
                <div className="flex items-center">
                  <Sparkles className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span>La simulación Monte Carlo está activa. Ver pestaña Bebidas.</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Food Status */}
        <div className="rounded overflow-hidden border border-gray-200">
          <div 
            className={`${useAdvancedFoodSim 
              ? theme.getGradient('warning') 
              : theme.getGradient('success')
            } text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:opacity-90`}
            onClick={handleFoodSimClick}
          >
            <div className="flex items-center">
              <Utensils className="w-4 h-4 mr-2" />
              <span className="font-medium">Estado de Comida</span>
            </div>
            {useAdvancedFoodSim && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Monte Carlo
              </span>
            )}
          </div>
          <div className="p-3">
            <StatusRow 
              key="meat"
              title="Carnes" 
              current={getCategoryServings('meat')} 
              total={foodRequirements.totalServings} 
              isOk={foodRequirements.hasEnoughMeat} 
            />
            <StatusRow 
              key="sides"
              title="Guarniciones" 
              current={getCategoryServings('sides')} 
              total={foodRequirements.totalServings} 
              isOk={foodRequirements.hasEnoughSides} 
            />
            <StatusRow 
              key="condiments"
              title="Condimentos" 
              current={getCategoryServings('condiments')} 
              total={foodRequirements.totalServings} 
              isOk={foodRequirements.hasEnoughCondiments} 
            />
            {useAdvancedFoodSim && (
              <div className="mt-2 bg-warning-light/50 p-2 rounded text-xs text-warning-dark">
                <div className="flex items-center">
                  <Sparkles className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span>La simulación Monte Carlo está activa. Ver pestaña Comida.</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="rounded overflow-hidden border border-gray-200 md:col-span-1">
          <div className={`${theme.getGradient('primary')} text-white px-3 py-2 flex items-center`}>
            <Target className="w-4 h-4 mr-2" />
            <span className="font-medium">Recomendaciones</span>
          </div>
          <div className="p-3">
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Precio de Entrada</span>
                <span className={ticketPrice >= recommendedTicketPrice ? "text-green-600" : "text-red-600"}>
                  {ticketPrice >= recommendedTicketPrice ? "Bueno" : "Muy bajo"}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500" 
                  style={{ width: `${ticketPricePercentage}%`, height: '100%' }}
                ></div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Asistencia</span>
                <span className={attendees >= breakEvenAttendees ? "text-green-600" : "text-yellow-600"}>
                  {attendees >= breakEvenAttendees ? "Suficiente" : "Insuficiente"}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="bg-yellow-500" 
                  style={{ width: `${attendancePercentage}%`, height: '100%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Viabilidad Global</span>
                <span className={isViable ? "text-green-600" : "text-red-600"}>
                  {isViable ? "Viable" : "No viable"}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500" 
                  style={{ width: `${viabilityPercentage}%`, height: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSection;