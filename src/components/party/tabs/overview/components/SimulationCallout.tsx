import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useTheme } from '@/components/ui/ThemeProvider';

interface SimulationCalloutProps {
  setUseAdvancedFoodSim: (value: boolean) => void;
  setActiveTab: (tab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports') => void;
}

const SimulationCallout: React.FC<SimulationCalloutProps> = ({
  setUseAdvancedFoodSim,
  setActiveTab
}) => {
  const theme = useTheme();
  
  return (
    <div className="bg-warning-light/20 border border-warning rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <Sparkles className="w-5 h-5 text-warning mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-warning-dark mb-1">
              ¿Necesitas una planificación más precisa?
            </h3>
            <p className="text-sm text-warning-dark/80">
              Activa la simulación Monte Carlo para obtener recomendaciones más precisas basadas en 
              diferentes perfiles de comensales y análisis estadístico avanzado.
            </p>
          </div>
        </div>
        
        <div className="ml-4">
          <Button
            variant="outline"
            color="warning"
            onClick={() => {
              setUseAdvancedFoodSim(true);
              setTimeout(() => setActiveTab('food'), 300);
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

export default SimulationCallout;