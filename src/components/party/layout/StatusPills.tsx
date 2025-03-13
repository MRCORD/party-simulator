import React from 'react';
import { Users, CheckCircle, AlertCircle, Utensils, Link } from 'lucide-react';

interface StatusPillsProps {
  attendees: number;
  ticketPrice: number;
  isViable: boolean;
  useAdvancedFoodSim: boolean;
  itemRelationships: any[];
}

const StatusPills: React.FC<StatusPillsProps> = ({
  attendees,
  ticketPrice,
  isViable,
  useAdvancedFoodSim,
  itemRelationships
}) => {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {/* Attendees pill */}
      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
        <Users size={16} className="mr-2 text-blue-100" />
        <span>{attendees} Asistentes</span>
      </div>
      
      {/* Ticket price pill */}
      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
        <span>S/ {ticketPrice} Entrada</span>
      </div>
      
      {/* Viability pill */}
      <div className={`px-4 py-2 rounded-full flex items-center ${isViable ? 'bg-success/80' : 'bg-error/80'}`}>
        {isViable ? 
          <CheckCircle size={16} className="mr-2" /> : 
          <AlertCircle size={16} className="mr-2" />
        }
        <span>{isViable ? 'Viable' : 'No Viable'}</span>
      </div>
      
      {/* Advanced food simulation pill - conditionally shown */}
      {useAdvancedFoodSim && (
        <div className="bg-warning/80 px-4 py-2 rounded-full flex items-center">
          <Utensils size={16} className="mr-2" />
          <span>Simulación de Comida Avanzada</span>
        </div>
      )}
      
      {/* Complementary items pill - conditionally shown */}
      {itemRelationships.length > 0 && (
        <div className="bg-indigo-500/80 px-4 py-2 rounded-full flex items-center">
          <Link size={16} className="mr-2 text-white" />
          <span>{itemRelationships.length} Artículos Complementarios</span>
        </div>
      )}
    </div>
  );
};

export default StatusPills;