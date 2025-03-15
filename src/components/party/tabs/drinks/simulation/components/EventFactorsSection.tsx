import React, { useState } from 'react';
import { Calendar, Thermometer, Clock, ChevronDown } from 'lucide-react';
import { EventFactors, TimePeriod } from '@/types/drinks';
import Button from '@/components/ui/Button';

interface EventFactorsSectionProps {
  eventFactors: EventFactors;
  timePeriods: TimePeriod[];
  updateEventFactors: (factors: Partial<EventFactors>) => void;
  updateTimePeriod: (index: number, field: keyof TimePeriod, value: number) => void;
}

const EventFactorsSection: React.FC<EventFactorsSectionProps> = ({
  eventFactors,
  timePeriods,
  updateEventFactors,
  updateTimePeriod
}) => {
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  
  // Calculate total percentage to ensure it's 100%
  const totalPercentage = timePeriods.reduce((sum, period) => sum + period.durationPercentage, 0);
  
  // Color schemes for time periods
  const periodColors = ["#4f86f7", "#14b8a6", "#f59e0b"];
  
  // Handle event type selection
  const handleEventTypeChange = (type: EventFactors['eventType']) => {
    updateEventFactors({ eventType: type });
  };
  
  // Handle temperature selection
  const handleTemperatureChange = (temp: EventFactors['temperature']) => {
    updateEventFactors({ temperature: temp });
  };
  
  // Handle outdoor toggle
  const handleOutdoorToggle = () => {
    updateEventFactors({ isOutdoor: !eventFactors.isOutdoor });
  };
  
  // Handle duration change
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = parseFloat(e.target.value);
    if (!isNaN(duration) && duration > 0) {
      updateEventFactors({ duration });
    }
  };
  
  // Handle time period percentage change
  const handlePeriodPercentageChange = (index: number, value: number) => {
    // Don't allow values below 5%
    if (value < 5) value = 5;
    
    // Calculate current total without this period
    const otherPeriodsTotal = timePeriods.reduce((sum, period, i) => 
      i !== index ? sum + period.durationPercentage : sum, 0);
    
    // Max allowed is what keeps total at 100%
    const maxAllowed = 100 - otherPeriodsTotal;
    if (value > maxAllowed) value = maxAllowed;
    
    // Update the period
    updateTimePeriod(index, 'durationPercentage', value);
    
    // Ensure total is exactly 100% by adjusting the last period (if it's not the one being changed)
    const newTotal = timePeriods.reduce((sum, period, i) => 
      i !== index && i !== timePeriods.length - 1 ? sum + period.durationPercentage : sum, 0) + value;
    
    if (index !== timePeriods.length - 1) {
      updateTimePeriod(timePeriods.length - 1, 'durationPercentage', 100 - newTotal);
    }
  };
  
  // Handle time period consumption factor change
  const handleConsumptionFactorChange = (index: number, value: number) => {
    updateTimePeriod(index, 'consumptionFactor', value);
  };
  
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-gray-800 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-gray-600" />
          Factores del Evento
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left column - Event type & Temperature */}
        <div className="space-y-6">
          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Evento
            </label>
            <div className="flex space-x-2">
              <Button
                variant={eventFactors.eventType === 'formal' ? 'gradient' : 'outline'}
                color="primary"
                onClick={() => handleEventTypeChange('formal')}
                className="flex-1"
              >
                Formal
              </Button>
              <Button
                variant={eventFactors.eventType === 'casual' ? 'gradient' : 'outline'}
                color="primary"
                onClick={() => handleEventTypeChange('casual')}
                className="flex-1"
              >
                Casual
              </Button>
              <Button
                variant={eventFactors.eventType === 'party' ? 'gradient' : 'outline'}
                color="primary"
                onClick={() => handleEventTypeChange('party')}
                className="flex-1"
              >
                Fiesta
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              El tipo de evento afecta los patrones de consumo. Las fiestas tienden a tener mayor consumo de alcohol.
            </p>
          </div>
          
          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperatura
            </label>
            <div className="flex space-x-2">
              <Button
                variant={eventFactors.temperature === 'cool' ? 'gradient' : 'outline'}
                color="primary"
                onClick={() => handleTemperatureChange('cool')}
                className="flex-1"
              >
                Fresca
              </Button>
              <Button
                variant={eventFactors.temperature === 'moderate' ? 'gradient' : 'outline'}
                color="primary"
                onClick={() => handleTemperatureChange('moderate')}
                className="flex-1"
              >
                Moderada
              </Button>
              <Button
                variant={eventFactors.temperature === 'hot' ? 'gradient' : 'outline'}
                color="primary"
                onClick={() => handleTemperatureChange('hot')}
                className="flex-1"
              >
                Calurosa
              </Button>
            </div>
            <div className="flex items-center mt-3">
              <Thermometer className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-xs text-gray-500">
                Las temperaturas altas aumentan el consumo de bebidas.
              </span>
            </div>
          </div>
        </div>
        
        {/* Right column - Duration & Outdoor */}
        <div className="space-y-6">
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración del Evento (horas)
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max="24"
                  step="0.5"
                  value={eventFactors.duration}
                  onChange={handleDurationChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  color="primary"
                  onClick={() => updateEventFactors({ duration: Math.max(1, eventFactors.duration - 0.5) })}
                >
                  -
                </Button>
                <Button
                  variant="outline"
                  color="primary"
                  onClick={() => updateEventFactors({ duration: Math.min(24, eventFactors.duration + 0.5) })}
                >
                  +
                </Button>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Eventos más largos tienen diferentes patrones de consumo.
            </p>
          </div>
          
          {/* Outdoor Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación del Evento
            </label>
            <div className="flex space-x-2">
              <Button
                variant={!eventFactors.isOutdoor ? 'gradient' : 'outline'}
                color="primary"
                onClick={() => updateEventFactors({ isOutdoor: false })}
                className="flex-1"
              >
                Interior
              </Button>
              <Button
                variant={eventFactors.isOutdoor ? 'gradient' : 'outline'}
                color="primary"
                onClick={() => updateEventFactors({ isOutdoor: true })}
                className="flex-1"
              >
                Exterior
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Los eventos al aire libre generalmente tienen mayor consumo de bebidas.
            </p>
          </div>
        </div>
      </div>
      
      {/* Timeline Section (expandable) */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <button
          onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-primary mr-2" />
            <h4 className="font-medium text-primary">Períodos de Tiempo del Evento</h4>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-500 transform transition-transform ${isTimelineExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        {isTimelineExpanded && (
          <div className="mt-4 border rounded-lg p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Distribución del Tiempo (Total: {totalPercentage}%)</span>
                <span className="text-gray-500">Duración Total: {eventFactors.duration} horas</span>
              </div>
              
              {/* Visual timeline representation */}
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden mt-2 flex">
                {timePeriods.map((period, index) => (
                  <div
                    key={index}
                    className="h-full"
                    style={{
                      width: `${period.durationPercentage}%`,
                      backgroundColor: periodColors[index % periodColors.length]
                    }}
                    title={`${period.name}: ${period.durationPercentage}%`}
                  />
                ))}
              </div>
            </div>
            
            {/* Time period configuration */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              {timePeriods.map((period, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center mb-2">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: periodColors[index % periodColors.length] }}
                    />
                    <h5 className="font-medium">{period.name}</h5>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Duration percentage */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Porcentaje de Duración ({period.durationPercentage}%)
                      </label>
                      <div className="relative">
                        <input
                          type="range"
                          min="5"
                          max="90"
                          value={period.durationPercentage}
                          onChange={(e) => handlePeriodPercentageChange(index, parseInt(e.target.value))}
                          className="w-full h-2 appearance-none rounded-full bg-gray-200 focus:outline-none"
                          style={{
                            background: `linear-gradient(to right, ${periodColors[index % periodColors.length]} 0%, ${periodColors[index % periodColors.length]} ${period.durationPercentage}%, #e5e7eb ${period.durationPercentage}%, #e5e7eb 100%)`,
                            '--thumb-color': periodColors[index % periodColors.length]
                          } as React.CSSProperties}
                          disabled={index === timePeriods.length - 1} // Last period is auto-calculated
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{(period.durationPercentage / 100 * eventFactors.duration).toFixed(1)} horas</span>
                        <span>{period.durationPercentage}%</span>
                      </div>
                    </div>
                    
                    {/* Consumption factor */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Factor de Consumo ({period.consumptionFactor}x)
                      </label>
                      <div className="relative">
                        <input
                          type="range"
                          min="0.5"
                          max="1.5"
                          step="0.1"
                          value={period.consumptionFactor}
                          onChange={(e) => handleConsumptionFactorChange(index, parseFloat(e.target.value))}
                          className="w-full h-2 appearance-none rounded-full bg-gray-200 focus:outline-none"
                          style={{
                            background: `linear-gradient(to right, ${periodColors[index % periodColors.length]} 0%, ${periodColors[index % periodColors.length]} ${(period.consumptionFactor - 0.5) / 1 * 100}%, #e5e7eb ${(period.consumptionFactor - 0.5) / 1 * 100}%, #e5e7eb 100%)`,
                            '--thumb-color': periodColors[index % periodColors.length]
                          } as React.CSSProperties}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Bajo (0.5x)</span>
                        <span>Alto (1.5x)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Los factores de consumo determinan la intensidad de consumo en cada periodo.
              Por ejemplo, la fase inicial suele tener menor consumo que la fase pico.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFactorsSection;