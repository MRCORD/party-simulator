import React from 'react';
import { Check, Building2, Calendar } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

interface ChecklistSectionProps {
  attendees: number;
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({ attendees }) => {
  const theme = useTheme();
  
  // Checklist items
  const venueChecklist = [
    `Confirmar capacidad del local (debe ser al menos ${attendees} personas)`,
    "Verificar si permiten servir alcohol",
    "Confirmar si se puede traer comida/bebidas o si es necesario usar su catering",
    "Preguntar sobre restricciones de ruido y hora de término",
    "Confirmar disponibilidad de estacionamiento",
    "Verificar si hay instalaciones para cocinar (para parrilla)",
    "Verificar si hay costos adicionales por limpieza"
  ];
  
  const eventDayChecklist = [
    "Llegar temprano para la instalación (al menos 2 horas antes)",
    "Traer artículos de limpieza",
    "Tener información de contacto del administrador del local",
    "Conocer las reglas para la devolución del depósito de seguridad",
    "Tener un plan para la eliminación de basura"
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${theme.getGradient('success')} px-4 py-3 text-white`}>
        <div className="flex items-center">
          <Check className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Lista de Verificación del Local</h3>
        </div>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center text-success-dark">
              <Building2 className="w-4 h-4 mr-2 text-success" />
              Antes de Reservar
            </h4>
            <ul className="space-y-2 text-sm">
              {venueChecklist.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded border border-success-dark flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-3 w-3 rounded-sm bg-success"></span>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium flex items-center text-success-dark">
              <Calendar className="w-4 h-4 mr-2 text-success" />
              Día del Evento
            </h4>
            <ul className="space-y-2 text-sm">
              {eventDayChecklist.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded border border-success-dark flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-3 w-3 rounded-sm bg-success"></span>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistSection;