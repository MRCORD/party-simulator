"use client";
import React, { useState } from 'react';
import { 
  Wine, Info, ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';
import { usePartyStore } from '@/store/usePartyStore';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

// Import simulator components
import SimulationForm from './components/SimulationForm';
import DrinkerProfileSection from './components/DrinkerProfileSection';
import DrinkSelectionSection from './components/DrinkSelectionSection';
import EventFactorsSection from './components/EventFactorsSection';
import ResultsSection from './components/ResultsSection';
import ShoppingActions from './components/ShoppingActions';

// Types
import { ShoppingItem } from '@/types';

interface DrinkSimulatorProps {
  attendees: number;
  shoppingItems: ShoppingItem[];
  toggleView: () => void;
  setActiveTab: (tab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports') => void;
  integratedMode?: boolean;
  drinkerProfiles: DrinkerProfile[];
  drinkConfidenceLevel: number;
  drinkSimulationCount: number;
  eventFactors: EventFactors;
  timePeriods: TimePeriod[];
  drinkSimulationResults: Record<string, DrinkSimulationResult>;
  setDrinkConfidenceLevel: (level: number) => void;
  setDrinkSimulationCount: (count: number) => void;
  updateDrinkerProfile: (index: number, field: keyof DrinkerProfile, value: number | boolean) => void;
  updateEventFactors: (factors: Partial<EventFactors>) => void;
  updateTimePeriod: (index: number, field: keyof TimePeriod, value: number) => void;
  runDrinkSimulation: (selectedItems?: string[]) => void;
  applyDrinkSimulationRecommendations: () => void;
}

const DrinkSimulator: React.FC<DrinkSimulatorProps> = ({
  attendees,
  shoppingItems,
  toggleView,
  setActiveTab,
  drinkerProfiles,
  drinkConfidenceLevel,
  drinkSimulationCount,
  eventFactors,
  timePeriods,
  drinkSimulationResults,
  setDrinkConfidenceLevel,
  setDrinkSimulationCount,
  updateDrinkerProfile,
  updateEventFactors,
  updateTimePeriod,
  runDrinkSimulation,
  applyDrinkSimulationRecommendations
}) => {
  const theme = useTheme();
  const { itemRelationships, drinkSimulationRun } = usePartyStore();
  
  // Local state for selected drink items
  const [selectedDrinkItems, setSelectedDrinkItems] = useState<string[]>([]);

  // Function to run the simulation with selected drink items
  const runSimulation = () => {
    if (selectedDrinkItems.length === 0) {
      alert('Por favor selecciona al menos una bebida para simular');
      return;
    }
    runDrinkSimulation(selectedDrinkItems);
  };

  return (
    <div className="space-y-6">
      {/* Header with option to return to simple view */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wine className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Simulación Monte Carlo de Bebidas</h3>
            </div>
            <Button
              variant="outline"
              color="primary"
              size="sm"
              onClick={toggleView}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al Modo Básico
            </Button>
          </div>
        </div>
        
        <div className="p-4 bg-primary-light/20 border-b border-primary-light">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
            <p className="text-sm text-primary-dark">
              Estás usando el simulador Monte Carlo para bebidas que permite un cálculo más preciso basado en 
              diferentes perfiles de consumidores y análisis estadístico que considera el tiempo y tipo de evento.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced simulation capabilities callout */}
      <Alert 
        variant="info" 
        className="mb-6"
        title="Simulación Monte Carlo para Bebidas"
      >
        <p className="mb-2">
          La simulación Monte Carlo ejecuta miles de escenarios aleatorios para modelar la variabilidad 
          en el consumo de bebidas, considerando:
        </p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Diferentes perfiles de consumidores (no bebedores, ocasionales, sociales, intensos)</li>
          <li>Patrones de consumo basados en el tiempo del evento</li>
          <li>Factores ambientales como temperatura y tipo de evento</li>
          <li>Relaciones entre bebidas alcohólicas y mezcladores</li>
          <li>Niveles de confianza configurables (80-99%)</li>
        </ul>
      </Alert>
      
      {/* Simulator Components */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`${theme.getGradient('primary')} p-5 text-white`}>
          <div className="flex items-center">
            <Wine className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold">Simulador de Consumo de Bebidas</h2>
          </div>
          
          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">ASISTENTES</div>
              <div className="text-2xl font-bold">{attendees}</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">NIVEL DE CONFIANZA</div>
              <div className="text-2xl font-bold">{drinkConfidenceLevel}%</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">SIMULACIONES</div>
              <div className="text-2xl font-bold">{drinkSimulationCount.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        {/* Simulation Form - Dropdowns Only */}
        <SimulationForm 
          confidenceLevel={drinkConfidenceLevel}
          simulationCount={drinkSimulationCount}
          setConfidenceLevel={setDrinkConfidenceLevel}
          setSimulationCount={setDrinkSimulationCount}
          shoppingItems={shoppingItems}
          runDrinkSimulation={runDrinkSimulation}
          simulationRun={drinkSimulationRun}
          showItemSelection={false}
          showRunButton={false}
          itemRelationships={itemRelationships}
        />
        
        {/* Event Factors Section */}
        <EventFactorsSection 
          eventFactors={eventFactors}
          timePeriods={timePeriods}
          updateEventFactors={updateEventFactors}
          updateTimePeriod={updateTimePeriod}
        />
        
        {/* Profiles Section */}
        <DrinkerProfileSection 
          drinkerProfiles={drinkerProfiles}
          updateDrinkerProfile={updateDrinkerProfile}
          attendees={attendees}
        />

        {/* Drink Selection Section */}
        <DrinkSelectionSection
          shoppingItems={shoppingItems}
          selectedDrinkItems={selectedDrinkItems}
          setSelectedDrinkItems={setSelectedDrinkItems}
          itemRelationships={itemRelationships}
        />

        {/* Run Simulation Button - After the drink selection */}
        <div className="flex justify-center py-6 bg-primary-light/10 border-t border-primary-light/20">
          <Button
            variant="gradient"
            color="primary"
            size="lg"
            onClick={runSimulation}
            className="px-6"
            disabled={selectedDrinkItems.length === 0}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Ejecutar Simulación Monte Carlo
          </Button>
        </div>
      </div>
      
      {/* Results Section - Only shown after simulation is run */}
      {drinkSimulationRun && (
        <ResultsSection 
          simulationResults={drinkSimulationResults}
          shoppingItems={shoppingItems}
          attendees={attendees}
          applySimulationRecommendations={applyDrinkSimulationRecommendations}
          confidenceLevel={drinkConfidenceLevel}
          eventFactors={eventFactors}
          simulationCount={drinkSimulationCount}
        />
      )}
      
      {/* Shopping Button */}
      <ShoppingActions setActiveTab={setActiveTab} />
    </div>
  );
};

export default DrinkSimulator;