import React from 'react';

const VenueTab = ({
  attendees,
  venueCost,
  setVenueCost,
  miscCosts, 
  setMiscCosts
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Costos del Local y Misceláneos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Costo del Local (S/)</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={venueCost}
              onChange={(e) => setVenueCost(parseFloat(e.target.value) || 0)}
              min="0"
              step="1"
            />
            <p className="mt-1 text-xs text-gray-500">Incluye todos los costos de alquiler del local, equipos y depósitos de seguridad</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Costos Misceláneos (S/)</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={miscCosts}
              onChange={(e) => setMiscCosts(parseFloat(e.target.value) || 0)}
              min="0"
              step="1"
            />
            <p className="mt-1 text-xs text-gray-500">Incluye decoraciones, música, transporte, limpieza, etc.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Lista de Verificación del Local</h3>
        
        <div className="space-y-4">
          <h4 className="font-medium">Antes de Reservar</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Confirmar capacidad del local (debe ser al menos {attendees} personas)</li>
            <li>Verificar si permiten servir alcohol</li>
            <li>Confirmar si se puede traer comida/bebidas o si es necesario usar su catering</li>
            <li>Preguntar sobre restricciones de ruido y hora de término</li>
            <li>Confirmar disponibilidad de estacionamiento</li>
            <li>Verificar si hay instalaciones para cocinar (para parrilla)</li>
            <li>Verificar si hay costos adicionales por limpieza</li>
          </ul>
          
          <h4 className="font-medium">Día del Evento</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Llegar temprano para la instalación (al menos 2 horas antes)</li>
            <li>Traer artículos de limpieza</li>
            <li>Tener información de contacto del administrador del local</li>
            <li>Conocer las reglas para la devolución del depósito de seguridad</li>
            <li>Tener un plan para la eliminación de basura</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Artículos Misceláneos</h3>
        
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
      </div>
    </div>
  );
};

export default VenueTab;