"use client";

import React, { FC } from 'react';
import { 
  Building2, MapPin, DollarSign, Check, 
  Clock, Calendar, Package, Users, Info
} from 'lucide-react';

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
                <Building2 size={18} className="mr-2 opacity-70" />
                S/ {venueCost.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Misceláneos</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                <Package size={18} className="mr-2 opacity-70" />
                S/ {miscCosts.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Asistentes</div>
              <div className="text-2xl font-bold flex justify-center items-center">
                <Users size={18} className="mr-2 opacity-70" />
                {attendees}
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
              <label className="block text-sm font-medium mb-1">Costo del Local (S/)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 pl-10 pr-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={venueCost}
                  onChange={(e) => setVenueCost(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Incluye todos los costos de alquiler del local, equipos y depósitos de seguridad</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Costos Misceláneos (S/)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 pl-10 pr-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={miscCosts}
                  onChange={(e) => setMiscCosts(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Incluye decoraciones, música, transporte, limpieza, etc.</p>
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
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100">
                  <h4 className="font-medium text-indigo-800">{venue.name}</h4>
                </div>
                <div className="p-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Costo aproximado:</span>
                    <span className="font-medium">S/ {venue.cost}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Capacidad:</span>
                    <span className="font-medium">{venue.capacity} personas</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-600">Duración típica:</span>
                    <span className="font-medium">{venue.hours} horas</span>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-xs font-medium text-gray-600 block mb-2">Características comunes:</span>
                    <div className="flex flex-wrap gap-1">
                      {venue.features.map((feature, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
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
                <Clock className="w-4 h-4 mr-2 text-indigo-600" />
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
            <p className="text-sm text-indigo-800">
              No olvides incluir estos artículos en tu planificación. Algunos pueden estar disponibles en el local, pero es mejor verificar con anticipación.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {miscItems.map((item, index) => (
              <div key={index} className="flex items-center py-2 border-b border-gray-100">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                </div>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueTab;