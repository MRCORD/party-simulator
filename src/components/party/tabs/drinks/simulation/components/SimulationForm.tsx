import React, { useState } from 'react';
import { 
  ChevronDown, Sliders, 
  Activity, Wine
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { ShoppingItem, ItemRelationship } from '@/types';

interface SimulationFormProps {
  confidenceLevel: number;
  simulationCount: number;
  setConfidenceLevel: (level: number) => void;
  setSimulationCount: (count: number) => void;
  shoppingItems: ShoppingItem[];
  runDrinkSimulation: (selectedDrinkItems?: string[]) => void;
  simulationRun: boolean;
  showRunButton?: boolean;
  itemRelationships?: ItemRelationship[];
}

const SimulationForm: React.FC<SimulationFormProps> = ({
  confidenceLevel,
  simulationCount,
  setConfidenceLevel,
  setSimulationCount,
  runDrinkSimulation,
  showRunButton = false
}) => {
  const [isSimulating, setIsSimulating] = useState(false);

  // Confidence level options for the dropdown
  const confidenceLevelOptions = [
    { value: 80, label: "Mínimo para una estimación básica" },
    { value: 90, label: "Recomendado para planificación normal" },
    { value: 95, label: "Recomendado para planificación cuidadosa" },
    { value: 99, label: "Nivel máximo de seguridad en la estimación" }
  ];

  // Simulation count options for the dropdown
  const simulationOptions = [
    { value: 100, label: "Rápido pero menos preciso" },
    { value: 500, label: "Balance entre velocidad y precisión" },
    { value: 1000, label: "Precisión buena" },
    { value: 5000, label: "Precisión muy alta" }
  ];

  // Handle confidence level change
  const handleConfidenceLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfidenceLevel(Number.parseInt(e.target.value));
  };

  // Handle simulation count change
  const handleSimulationsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSimulationCount(Number.parseInt(e.target.value));
  };

  // Run the simulation
  const runSimulation = () => {
    runDrinkSimulation();
  };

  // Wrap the runSimulation function to handle loading state
  const handleSimulation = async () => {
    setIsSimulating(true);
    try {
      await runSimulation();
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <>
      {/* Confidence Level and Simulation Count Section */}
      <div className="px-6 py-4 bg-primary-light/20 border-b border-primary-light">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Confidence Level Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Sliders className="w-4 h-4 mr-1 text-primary" /> Nivel de Confianza
            </label>
            <div className="relative">
              <select
                value={confidenceLevel}
                onChange={handleConfidenceLevelChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none text-gray-700"
              >
                {confidenceLevelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.value}% - {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Un nivel de confianza más alto requerirá más unidades pero reducirá el riesgo de quedarse sin provisiones.
            </p>
          </div>

          {/* Simulation Count Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Activity className="w-4 h-4 mr-1 text-primary" /> Número de Simulaciones
            </label>
            <div className="relative">
              <select
                value={simulationCount}
                onChange={handleSimulationsChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none text-gray-700"
              >
                {simulationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.value.toLocaleString()} - {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Más simulaciones producen resultados más precisos pero requieren más tiempo de cálculo.
            </p>
          </div>
        </div>
        
        {/* Run Simulation Button - Show only if showRunButton is true */}
        {showRunButton && (
          <div className="flex justify-center mt-6">
            <Button
              variant="gradient"
              color="primary"
              size="lg"
              onClick={handleSimulation}
              className="px-6"
              isLoading={isSimulating}
            >
              <Wine className="w-5 h-5 mr-2" />
              Ejecutar Simulación Monte Carlo
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default SimulationForm;