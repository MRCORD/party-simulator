import React from 'react';
import { Sparkles } from 'lucide-react';
import StatusPills from './StatusPills';

interface ItemRelationship {
  itemId: string;
  relatedItems: string[];
}

interface PartyHeaderProps {
  attendees: number;
  ticketPrice: number;
  isViable: boolean;
  useAdvancedFoodSim: boolean;
  itemRelationships: ItemRelationship[];
  resetAllData: () => void;
}

const PartyHeader: React.FC<PartyHeaderProps> = ({
  attendees,
  ticketPrice,
  isViable,
  useAdvancedFoodSim,
  itemRelationships,
  resetAllData
}) => {
  return (
    <div className="bg-gradient-primary rounded-2xl mb-8 overflow-hidden shadow-lg">
      <div className="px-8 py-6 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/4 translate-y-1/4" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white text-primary p-4 rounded-xl mr-4 shadow-md">
              <Sparkles size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Simulador de Fiestas</h1>
              <p className="text-blue-100 text-lg">Organiza, planifica y visualiza todos los aspectos de tu próxima fiesta</p>
            </div>
          </div>
          
          <button
            onClick={resetAllData}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            title="Reiniciar datos"
          >
            Reiniciar datos
          </button>
        </div>
        
        {/* Status pills */}
        <StatusPills 
          attendees={attendees}
          ticketPrice={ticketPrice}
          isViable={isViable}
          useAdvancedFoodSim={useAdvancedFoodSim}
          itemRelationships={itemRelationships}
        />
      </div>
    </div>
  );
};

export default PartyHeader;