import React, { useState } from 'react';
import { Bot, X, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { usePartyStore } from '@/store/usePartyStore';

export default function PartyAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    attendees,
    ticketPrice,
    netProfit,
    isViable,
    perPersonCost,
    recommendedTicketPrice,
    breakEvenAttendees,
    shoppingItems,
    drinksPerPerson,
    foodServingsPerPerson,
    calculateDrinkRequirements,
    calculateFoodRequirements,
    getCategoryServings
  } = usePartyStore();

  // Generate insights based on the current party data
  const drinkReqs = calculateDrinkRequirements();
  const foodReqs = calculateFoodRequirements();

  const getAssistantInsights = () => {
    const insights = [];

    // Financial insights
    if (!isViable) {
      insights.push({
        type: 'warning',
        message: `Tu fiesta no es viable financieramente. Considera aumentar el precio de entrada a S/ ${recommendedTicketPrice} o reducir costos.`
      });
    }

    if (netProfit > 0 && ticketPrice > recommendedTicketPrice + 10) {
      insights.push({
        type: 'info',
        message: `El precio de entrada podría ser muy alto. Podrías reducirlo a S/ ${recommendedTicketPrice} y seguir siendo rentable.`
      });
    }

    if (attendees < breakEvenAttendees) {
      insights.push({
        type: 'warning',
        message: `Necesitas al menos ${breakEvenAttendees} asistentes para cubrir costos. Actualmente tienes ${attendees}.`
      });
    }

    // Beverage insights
    if (!drinkReqs.hasEnoughSpirits) {
      insights.push({
        type: 'warning',
        message: `No hay suficiente licor para ${attendees} personas con ${drinksPerPerson} bebidas por persona.`
      });
    }

    if (!drinkReqs.hasEnoughMixers) {
      insights.push({
        type: 'warning',
        message: `No hay suficientes mezcladores para preparar ${drinkReqs.totalDrinks} bebidas.`
      });
    }

    // Food insights
    if (!foodReqs.hasEnoughMeat) {
      insights.push({
        type: 'warning',
        message: `No hay suficiente comida principal para ${attendees} personas.`
      });
    }

    if (!foodReqs.hasEnoughSides) {
      insights.push({
        type: 'warning',
        message: `Faltan guarniciones para complementar la comida.`
      });
    }

    // Supply insights
    if (!drinkReqs.hasEnoughSupplies) {
      insights.push({
        type: 'warning',
        message: `No hay suficientes suministros (vasos, servilletas, etc) para todos los invitados.`
      });
    }

    // General insights
    if (isViable && insights.length === 0) {
      insights.push({
        type: 'success',
        message: `¡Tu fiesta parece estar bien planificada! El costo por persona es S/ ${perPersonCost.toFixed(2)}.`
      });
    }

    return insights;
  };

  const insights = getAssistantInsights();

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-primary text-white rounded-full p-3 shadow-lg hover:opacity-90 transition-all z-50"
      >
        <Bot size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-lg overflow-hidden z-50 animate-fadeIn">
      {/* Header */}
      <div className={`${isViable ? 'bg-gradient-primary' : 'bg-gradient-to-r from-red-500 to-red-600'} px-4 py-3 text-white flex justify-between items-center`}>
        <div className="flex items-center">
          <Bot size={20} className="mr-2" />
          <h3 className="font-medium">Asistente de Fiesta</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className={`p-4 ${isExpanded ? 'max-h-96' : 'max-h-40'} overflow-y-auto transition-all duration-300`}>
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <div 
              key={index} 
              className={`mb-3 p-3 rounded-lg flex items-start ${
                insight.type === 'warning' ? 'bg-amber-50 text-amber-800 border-l-4 border-amber-400' : 
                insight.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-400' : 
                'bg-blue-50 text-blue-800 border-l-4 border-blue-400'
              }`}
            >
              <Lightbulb size={18} className="mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm">{insight.message}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>No hay recomendaciones en este momento.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {insights.length > 2 && (
        <div className="border-t border-gray-100 p-2 text-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center w-full"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                Ver más recomendaciones
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
