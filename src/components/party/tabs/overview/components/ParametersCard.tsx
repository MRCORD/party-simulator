import React from 'react';
import { Users, Wine, Utensils, ChevronRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ParametersCardProps {
  attendees: number;
  ticketPrice: number;
  drinksPerPerson: number;
  foodServingsPerPerson: number;
  setAttendees: (value: number) => void;
  setTicketPrice: (value: number) => void;
  setDrinksPerPerson: (value: number) => void;
  setFoodServingsPerPerson: (value: number) => void;
  useAdvancedFoodSim: boolean;
  setUseAdvancedFoodSim: (value: boolean) => void;
  setActiveTab: (tab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports') => void;
}

const ParametersCard: React.FC<ParametersCardProps> = ({
  attendees,
  ticketPrice,
  drinksPerPerson,
  foodServingsPerPerson,
  setAttendees,
  setTicketPrice,
  setDrinksPerPerson,
  setFoodServingsPerPerson,
  useAdvancedFoodSim,
  setUseAdvancedFoodSim,
  setActiveTab
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 text-primary mr-2" />
        <h2 className="text-base font-medium text-primary">Parámetros Básicos</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-primary mb-1">Asistentes</label>
          <div className="relative">
            <input
              type="number"
              className="block w-full rounded border border-gray-300 py-2 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={attendees}
              onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
              min="1"
              step="1"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-primary mb-1">Precio de Entrada (S/)</label>
          <div className="relative">
            <div className="flex rounded shadow-sm">
              <span className="inline-flex items-center rounded-l border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">S/</span>
              <input
                type="number"
                className="block w-full rounded-r border border-gray-300 py-2 pl-1 pr-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(parseFloat(e.target.value) || 0)}
                min="0"
                step="1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-primary mb-1 flex items-center">
            <Wine className="w-4 h-4 mr-1 text-blue-600" /> Bebidas por Persona
          </label>
          <div className="flex rounded shadow-sm">
            <Button
              variant="outline"
              color="primary"
              size="sm"
              onClick={() => setDrinksPerPerson(Math.max(1, drinksPerPerson - 1))}
              className="rounded-r-none"
            >
              -
            </Button>
            <input
              type="text"
              className="block w-full min-w-0 flex-1 text-center border-y border-gray-300 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={drinksPerPerson}
              readOnly
            />
            <Button
              variant="outline"
              color="primary"
              size="sm"
              onClick={() => setDrinksPerPerson(drinksPerPerson + 1)}
              className="rounded-l-none"
            >
              +
            </Button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-primary mb-1 flex items-center">
            <Utensils className="w-4 h-4 mr-1 text-blue-600" /> Porciones/Persona
          </label>
          <div className="relative">
            <div className="flex rounded shadow-sm">
              <Button
                variant="outline"
                color="primary"
                size="sm"
                onClick={() => setFoodServingsPerPerson(Math.max(1, foodServingsPerPerson - 1))}
                className="rounded-r-none"
              >
                -
              </Button>
              <input
                type="text"
                className="block w-full min-w-0 flex-1 text-center border-y border-gray-300 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={foodServingsPerPerson}
                readOnly
                aria-label="Porciones por persona"
              />
              <Button
                variant="outline"
                color="primary"
                size="sm"
                onClick={() => setFoodServingsPerPerson(foodServingsPerPerson + 1)}
                className="rounded-l-none"
              >
                +
              </Button>
            </div>
            
            {/* Monte Carlo Simulation Button - Enhanced with Sparkles icon */}
            <div className="mt-3">
              <Button
                variant={useAdvancedFoodSim ? "gradient" : "outline"}
                color="warning"
                size="sm"
                className="w-full"
                onClick={() => {
                  setUseAdvancedFoodSim(!useAdvancedFoodSim);
                  if (!useAdvancedFoodSim) {
                    // When enabling advanced sim, navigate to food tab
                    setTimeout(() => setActiveTab('food'), 300);
                  }
                }}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                {useAdvancedFoodSim ? 'Simulación Monte Carlo Activa' : 'Activar Simulación Monte Carlo'} 
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametersCard;