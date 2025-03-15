import React from 'react';
import { Sparkles, ChevronRight, Wine } from 'lucide-react';
import Button from '@/components/ui/Button';

interface DrinkSimulationCalloutProps {
  setUseAdvancedDrinkSim: (value: boolean) => void;
  setActiveTab: (tab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports') => void;
}

const DrinkSimulationCallout: React.FC<DrinkSimulationCalloutProps> = ({
  setUseAdvancedDrinkSim,
  setActiveTab
}) => {
  return (
    <div className="bg-primary-light/20 border border-primary rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <Wine className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-primary-dark mb-1">
              ¿Necesitas una planificación precisa de bebidas?
            </h3>
            <p className="text-sm text-primary-dark/80">
              Activa la simulación Monte Carlo para obtener recomendaciones más precisas basadas en 
              diferentes perfiles de bebedores, fases de la fiesta y análisis estadístico avanzado.
            </p>
          </div>
        </div>
        
        <div className="ml-4">
          <Button
            variant="outline"
            color="primary"
            onClick={() => {
              setUseAdvancedDrinkSim(true);
              setTimeout(() => setActiveTab('drinks'), 300);
            }}
          >
            Activar
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrinkSimulationCallout;