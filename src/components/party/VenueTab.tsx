"use client";

import React, { FC } from 'react';
import { 
  Building2, MapPin, DollarSign, Check, 
  Clock, Calendar, Package, Users, Info
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useTheme } from '@/components/ui/ThemeProvider';

interface VenueTabProps {
  attendees: number;
  venueCost: number;
  setVenueCost: (cost: number) => void;
  miscCosts: number;
  setMiscCosts: (cost: number) => void;
}

const VenueTab: FC<VenueTabProps> = ({
  attendees,
  venueCost,
  setVenueCost,
  miscCosts,
  setMiscCosts
}) => {
  const theme = useTheme();
  
  // Calculate total cost
  const totalCost = venueCost + miscCosts;
  
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
  
  const miscItems = [
    "Sistema de música o parlantes",
    "Cables de extensión",
    "Iluminación (si el evento es de noche)",
    "Mesas y sillas (si no los proporciona el local)",
    "Hieleras y conservadores",
    "Bolsas de basura",
    "Papel toalla",
    "Botiquín de primeros auxilios",
    "Destapadores y abrelatas",
    "Utensilios para servir"
  ];
  
  // Common venue types
  const venueTypes = [
    { name: "Terraza", cost: 1500, capacity: 60, hours: 5, features: ["Estacionamiento", "Cocina", "Patio", "Zona de bebidas"] },
    { name: "Salón de eventos", cost: 2000, capacity: 100, hours: 6, features: ["Aire acondicionado", "Sonido", "Estacionamiento", "Personal"] },
    { name: "Casa de Campo", cost: 2500, capacity: 80, hours: 8, features: ["Piscina", "Parrilla", "Jardín", "Estacionamiento"] },
    { name: "Espacio en Azotea", cost: 1200, capacity: 40, hours: 5, features: ["Vista", "Barra", "Iluminación", "Cobertura"] }
  ];

  return (
    <div className="space-y-6">
      {/* Main Venue Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-5 text-white">
          <div className="flex items-center">
            <Building2 className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold">Local y Misceláneos</h2>
          </div>
          
          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Costo del Local</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                <DollarSign size={18} className="mr-2 opacity-70" />
                S/ {venueCost.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Costos Misceláneos</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                <DollarSign size={18} className="mr-2 opacity-70" />
                S/ {miscCosts.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Costo Total</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                <DollarSign size={18} className="mr-2 opacity-70" />
                S/ {totalCost.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-center mt-4 bg-white/10 p-2 rounded-lg">
            El costo por persona para local y misceláneos es <span className="font-bold">S/ {(totalCost / attendees).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Cost Input Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-500 px-4 py-3 text-white">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Costos del Local y Misceláneos</h3>
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Costo del Local</label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">S/</span>
                </div>
                <input 
                  type="number" 
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  value={venueCost}
                  onChange={(e) => setVenueCost(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <p className="mt-2 text-sm text-gray-500">
                Este es el costo base del alquiler del local.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Costos Misceláneos</label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">S/</span>
                </div>
                <input 
                  type="number" 
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  value={miscCosts}
                  onChange={(e) => setMiscCosts(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <p className="mt-2 text-sm text-gray-500">
                Costos adicionales como depósitos, limpieza, seguridad, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Common Venue Types */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-500 px-4 py-3 text-white">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Tipos de Locales Comunes</h3>
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {venueTypes.map((venue, index) => (
              <div key={index} className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                <div className="bg-indigo-500 px-4 py-2 text-white">
                  <div className="font-medium">{venue.name}</div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Costo</span>
                    <span className="font-medium">S/ {venue.cost}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Capacidad</span>
                    <span className="font-medium">{venue.capacity} personas</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Duración</span>
                    <span className="font-medium">{venue.hours} horas</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Características</span>
                    <div className="flex flex-wrap gap-1">
                      {venue.features.map((feature, i) => (
                        <Badge key={i} size="sm" variant="primary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline" 
                    color="primary" 
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setVenueCost(venue.cost)}
                  >
                    Usar este costo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Venue Checklist */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-500 px-4 py-3 text-white">
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Lista de Verificación del Local</h3>
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center text-indigo-800">
                <Building2 className="w-4 h-4 mr-2 text-indigo-600" />
                Antes de Reservar
              </h4>
              <ul className="space-y-2 text-sm">
                {venueChecklist.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded border border-indigo-300 flex items-center justify-center mr-2 mt-0.5">
                      <span className="h-3 w-3 rounded-sm bg-indigo-500"></span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium flex items-center text-indigo-800">
                <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                Día del Evento
              </h4>
              <ul className="space-y-2 text-sm">
                {eventDayChecklist.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded border border-indigo-300 flex items-center justify-center mr-2 mt-0.5">
                      <span className="h-3 w-3 rounded-sm bg-indigo-500"></span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Miscellaneous Items */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-500 px-4 py-3 text-white">
          <div className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Artículos Misceláneos</h3>
          </div>
        </div>
        
        <div className="p-5">
          <div className="bg-indigo-50 rounded-lg p-4 mb-4 flex items-start">
            <Info className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-700">
              No olvides considerar estos artículos adicionales que pueden ser necesarios para el evento. Algunos locales podrían proporcionar algunos de estos elementos, confirma con anticipación.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {miscItems.map((item, index) => (
              <div key={index} className="flex items-center py-2 border-b border-gray-100">
                <Check className="w-4 h-4 text-indigo-500 mr-2" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueTab;