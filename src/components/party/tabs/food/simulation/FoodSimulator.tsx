"use client";
import React from 'react';
import { 
  Utensils, Info, ArrowLeft,
  ShoppingBag, AlertCircle
} from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';
import { usePartyStore } from '@/store/usePartyStore';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

// Import simulator components
import ProfileSection from './components/ProfileSection';
import SimulationForm from './components/SimulationForm';
import ResultsSection from './components/ResultsSection';
import ShoppingActions from './components/ShoppingActions';

// Types
import { ShoppingItem } from '@/types/shopping';
import { FoodRequirements } from '@/types/food';

interface FoodSimulatorProps {
  attendees: number;
  foodServingsPerPerson: number;
  shoppingItems: ShoppingItem[];
  calculateFoodRequirements: () => FoodRequirements;
  getCategoryServings: (category: string) => number;
  toggleView: () => void;
  setActiveTab: (tab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports') => void;
  integratedMode?: boolean;
}

const FoodSimulator: React.FC<FoodSimulatorProps> = ({
  attendees,
  foodServingsPerPerson,
  shoppingItems,
  calculateFoodRequirements,
  getCategoryServings,
  toggleView,
  setActiveTab,
  integratedMode = false
}) => {
  const theme = useTheme();
  
  // Get data from store
  const {
    confidenceLevel,
    eaterProfiles,
    simulationCount,
    simulationResults,
    simulationRun,
    
    // Actions
    setConfidenceLevel,
    setSimulationCount,
    updateEaterProfile,
    runFoodSimulation,
    applySimulationRecommendations
  } = usePartyStore();

  return (
    <div className="space-y-6">
      {/* Header with option to return to simple view */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`${theme.getGradient('warning')} px-4 py-3 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Utensils className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Simulación Monte Carlo de Alimentos</h3>
            </div>
            <Button
              variant="outline"
              color="warning"
              size="sm"
              onClick={toggleView}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al Modo Básico
            </Button>
          </div>
        </div>
        
        <div className="p-4 bg-warning-light/20 border-b border-warning-light">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-warning mr-2 flex-shrink-0" />
            <p className="text-sm text-warning-dark">
              Estás usando el simulador Monte Carlo que permite un cálculo más preciso basado en 
              diferentes perfiles de comensales y miles de iteraciones estadísticas.
            </p>
          </div>
        </div>
      </div>
      
      {/* Advanced simulation capabilities callout */}
      <Alert 
        variant="info" 
        className="mb-6"
        title="Simulación Monte Carlo"
      >
        <p className="mb-2">
          La simulación Monte Carlo ejecuta miles de escenarios aleatorios para modelar la variabilidad 
          en el consumo de alimentos, considerando:
        </p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Diferentes perfiles de consumidores (ligero, promedio, pesado)</li>
          <li>Variaciones aleatorias en el consumo individual</li>
          <li>Relaciones entre artículos complementarios</li>
          <li>Niveles de confianza configurable (80-99%)</li>
        </ul>
      </Alert>
      
      {/* Simulator Components */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`${theme.getGradient('warning')} p-5 text-white`}>
          <div className="flex items-center">
            <Utensils className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold">Simulador de Consumo de Alimentos</h2>
          </div>
          
          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">ASISTENTES</div>
              <div className="text-2xl font-bold">{attendees}</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">NIVEL DE CONFIANZA</div>
              <div className="text-2xl font-bold">{confidenceLevel}%</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">SIMULACIONES</div>
              <div className="text-2xl font-bold">{simulationCount.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        {/* Profiles Section */}
        <ProfileSection 
          eaterProfiles={eaterProfiles}
          updateEaterProfile={updateEaterProfile}
        />
        
        {/* Simulation Form */}
        <SimulationForm 
          confidenceLevel={confidenceLevel}
          simulationCount={simulationCount}
          setConfidenceLevel={setConfidenceLevel}
          setSimulationCount={setSimulationCount}
          shoppingItems={shoppingItems}
          runFoodSimulation={runFoodSimulation}
          simulationRun={simulationRun}
        />
      </div>
      
      {/* Results Section - Only shown after simulation is run */}
      {simulationRun && (
        <ResultsSection 
          simulationResults={simulationResults}
          shoppingItems={shoppingItems}
          attendees={attendees}
          applySimulationRecommendations={applySimulationRecommendations}
        />
      )}
      
      {/* Shopping Button */}
      <ShoppingActions setActiveTab={setActiveTab} />
    </div>
  );
};

export default FoodSimulator;