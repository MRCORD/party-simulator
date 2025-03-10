"use client";

import React from 'react';
import Card from '@/components/ui/Card';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Building2, Check, Clock, Calendar, Package } from 'lucide-react';

const VenueTab = ({
  attendees,
  venueCost,
  setVenueCost,
  miscCosts, 
  setMiscCosts
}) => {
  const theme = useTheme();
  
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header 
          title="Costos del Local y Misceláneos" 
          icon={<Building2 className="w-5 h-5 text-primary" />}
        />
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Costo del Local (S/)</label>
              <input
                type="number"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-primary ${theme.getFocusRing()}`}
                value={venueCost}
                onChange={(e) => setVenueCost(parseFloat(e.target.value) || 0)}
                min="0"
                step="1"
              />
              <p className="mt-1 text-xs">Incluye todos los costos de alquiler del local, equipos y depósitos de seguridad</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium">Costos Misceláneos (S/)</label>
              <input
                type="number"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-primary ${theme.getFocusRing()}`}
                value={miscCosts}
                onChange={(e) => setMiscCosts(parseFloat(e.target.value) || 0)}
                min="0"
                step="1"
              />
              <p className="mt-1 text-xs">Incluye decoraciones, música, transporte, limpieza, etc.</p>
            </div>
          </div>
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Header 
          title="Lista de Verificación del Local" 
          icon={<Check className="w-5 h-5 text-success" />}
        />
        <Card.Content>
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              Antes de Reservar
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Confirmar capacidad del local (debe ser al menos {attendees} personas)</li>
              <li>Verificar si permiten servir alcohol</li>
              <li>Confirmar si se puede traer comida/bebidas o si es necesario usar su catering</li>
              <li>Preguntar sobre restricciones de ruido y hora de término</li>
              <li>Confirmar disponibilidad de estacionamiento</li>
              <li>Verificar si hay instalaciones para cocinar (para parrilla)</li>
              <li>Verificar si hay costos adicionales por limpieza</li>
            </ul>
            
            <h4 className="font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              Día del Evento
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Llegar temprano para la instalación (al menos 2 horas antes)</li>
              <li>Traer artículos de limpieza</li>
              <li>Tener información de contacto del administrador del local</li>
              <li>Conocer las reglas para la devolución del depósito de seguridad</li>
              <li>Tener un plan para la eliminación de basura</li>
            </ul>
          </div>
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Header 
          title="Artículos Misceláneos" 
          icon={<Package className="w-5 h-5 text-warning" />}
        />
        <Card.Content>
          <div className="space-y-2">
            <h4 className="font-medium">No Olvidar</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Sistema de música o parlantes</li>
              <li>Cables de extensión</li>
              <li>Iluminación (si el evento es de noche)</li>
              <li>Mesas y sillas (si no los proporciona el local)</li>
              <li>Hieleras y conservadores</li>
              <li>Bolsas de basura</li>
              <li>Papel toalla</li>
              <li>Botiquín de primeros auxilios</li>
              <li>Destapadores y abrelatas</li>
              <li>Utensilios para servir</li>
            </ul>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default VenueTab;