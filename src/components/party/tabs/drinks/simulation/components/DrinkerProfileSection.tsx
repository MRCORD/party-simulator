import React, { useState } from 'react';
import { Users, Info, ChevronDown } from 'lucide-react';
import { DrinkerProfile } from '@/types/drinks';

interface DrinkerProfileSectionProps {
  drinkerProfiles: DrinkerProfile[];
  updateDrinkerProfile: (index: number, field: keyof DrinkerProfile, value: number | boolean) => void;
  attendees: number;
}

const DrinkerProfileSection = ({ 
  drinkerProfiles, 
  updateDrinkerProfile, 
  attendees 
}: DrinkerProfileSectionProps) => {
  // Profile colors - one distinct color per profile type
  const PROFILE_COLORS = ['#4f86f7', '#10b981', '#f59e0b', '#ef4444'];
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAllProfiles = () => {
    setIsExpanded(prev => !prev);
  };

  // Handle profile percentage change with automatic adjustment of other profiles
  const handleProfilePercentageChange = (index: number, newValue: number) => {
    // Don't allow values below 1% or above 98%
    if (newValue < 1) newValue = 1;
    if (newValue > 98) newValue = 98;
    
    // Get current profiles and the one being changed
    const originalValue = drinkerProfiles[index].percentage;
    const difference = newValue - originalValue;
    
    if (difference === 0) return;
    
    // Calculate how much we need to adjust other profiles
    const otherProfilesTotal = 100 - originalValue;
    
    // Update the current profile
    updateDrinkerProfile(index, 'percentage', newValue);
    
    // Adjust other profiles proportionally
    drinkerProfiles.forEach((profile, i) => {
      if (i !== index) {
        // Calculate new percentage proportionally
        const adjustmentFactor = (100 - newValue) / otherProfilesTotal;
        const adjustedPercentage = Math.round(profile.percentage * adjustmentFactor);
        
        // Ensure we don't go below 1%
        const finalPercentage = Math.max(1, adjustedPercentage);
        updateDrinkerProfile(i, 'percentage', finalPercentage);
      }
    });
    
    // Ensure percentages sum to 100% by adjusting the last profile
    let total = 0;
    drinkerProfiles.forEach((profile, i) => {
      if (i !== drinkerProfiles.length - 1) {
        total += (i === index) ? newValue : profile.percentage;
      }
    });
    
    // Adjust the last profile if it's not the one being changed
    if (index !== drinkerProfiles.length - 1) {
      const lastProfilePercentage = Math.max(1, 100 - total);
      updateDrinkerProfile(drinkerProfiles.length - 1, 'percentage', lastProfilePercentage);
    }
  };
  
  // Handle profile multiplier change
  const handleProfileMultiplierChange = (index: number, field: 'alcoholicDrinksMultiplier' | 'nonAlcoholicDrinksMultiplier', value: number) => {
    updateDrinkerProfile(index, field, value);
  };

  // Toggle a preference boolean field
  const togglePreference = (index: number, field: 'prefersBeer' | 'prefersSpirits' | 'prefersWine') => {
    const currentValue = drinkerProfiles[index][field] || false;
    updateDrinkerProfile(index, field, !currentValue as boolean);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-gray-800 flex items-center">
          <Users className="w-6 h-6 mr-2 text-gray-600" />
          Perfiles de Consumidores
        </h3>
        <button
          onClick={toggleAllProfiles}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className="text-sm">{isExpanded ? 'Colapsar Todo' : 'Expandir Todo'}</span>
          <ChevronDown 
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      
      {/* Profile cards in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drinkerProfiles.map((profile, index) => {
          const color = PROFILE_COLORS[index % PROFILE_COLORS.length];
          // Calculate exact number of attendees for this profile
          const exactAttendees = (profile.percentage / 100) * attendees;
          // Round to closest whole number
          const profileAttendees = Math.round(exactAttendees);
          
          return (
            <div 
              key={index} 
              className="border rounded-lg p-4"
              style={{ borderColor: color }}
            >
              {/* Header with profile name and percentage */}
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-medium" style={{ color }}>
                  {profile.name}
                </h4>
                <div className="text-right">
                  <span className="text-xl font-bold" style={{ color }}>
                    {profile.percentage}%
                  </span>
                  <span className="text-sm text-gray-500 block">
                    ({profileAttendees} asistentes)
                  </span>
                </div>
              </div>
              
              {/* Percentage slider section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porcentaje en el Evento
                </label>
                
                <div className="relative">
                  <input 
                    type="range" 
                    min="1" 
                    max="98" 
                    value={profile.percentage} 
                    onChange={(e) => handleProfilePercentageChange(index, parseInt(e.target.value))}
                    className="w-full h-2 appearance-none rounded-full bg-gray-200 focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, ${color} 0%, ${color} ${profile.percentage}%, #e5e7eb ${profile.percentage}%, #e5e7eb 100%)`,
                      '--thumb-color': color
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Description text */}
              <p className="text-sm text-gray-600 mb-4">
                {profile.alcoholicDrinksMultiplier === 0 
                  ? "No consume bebidas alcohólicas" 
                  : profile.alcoholicDrinksMultiplier < 1 
                    ? "Consume menos alcohol que el promedio" 
                    : profile.alcoholicDrinksMultiplier > 1 
                      ? "Consume más alcohol que el promedio" 
                      : "Consumo de alcohol promedio"
                }
              </p>

              {/* Collapsible multiplier section */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Consumo de Bebidas Alcohólicas
                      </label>
                      <span className="text-lg font-bold" style={{ color }}>
                        {profile.alcoholicDrinksMultiplier}x
                      </span>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="range" 
                        min="0" 
                        max="3.0" 
                        step="0.1" 
                        value={profile.alcoholicDrinksMultiplier} 
                        onChange={(e) => handleProfileMultiplierChange(index, 'alcoholicDrinksMultiplier', parseFloat(e.target.value))}
                        className="w-full h-2 appearance-none rounded-full bg-gray-200 focus:outline-none"
                        style={{
                          background: `linear-gradient(to right, ${color} 0%, ${color} ${(profile.alcoholicDrinksMultiplier / 3) * 100}%, #e5e7eb ${(profile.alcoholicDrinksMultiplier / 3) * 100}%, #e5e7eb 100%)`,
                          '--thumb-color': color
                        } as React.CSSProperties}
                      />
                    </div>
                    
                    {/* Min/max labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0x</span>
                      <span>3.0x</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Consumo de Bebidas No Alcohólicas
                      </label>
                      <span className="text-lg font-bold" style={{ color }}>
                        {profile.nonAlcoholicDrinksMultiplier}x
                      </span>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="range" 
                        min="0.5" 
                        max="3.0" 
                        step="0.1" 
                        value={profile.nonAlcoholicDrinksMultiplier} 
                        onChange={(e) => handleProfileMultiplierChange(index, 'nonAlcoholicDrinksMultiplier', parseFloat(e.target.value))}
                        className="w-full h-2 appearance-none rounded-full bg-gray-200 focus:outline-none"
                        style={{
                          background: `linear-gradient(to right, ${color} 0%, ${color} ${((profile.nonAlcoholicDrinksMultiplier - 0.5) / 2.5) * 100}%, #e5e7eb ${((profile.nonAlcoholicDrinksMultiplier - 0.5) / 2.5) * 100}%, #e5e7eb 100%)`,
                          '--thumb-color': color
                        } as React.CSSProperties}
                      />
                    </div>
                    
                    {/* Min/max labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.5x</span>
                      <span>3.0x</span>
                    </div>
                  </div>
                  
                  {/* Preferences section */}
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Preferencias de Bebidas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => togglePreference(index, 'prefersBeer')}
                        className={`px-3 py-1 text-xs rounded-full ${
                          profile.prefersBeer 
                            ? `bg-${color.replace('#', '')} text-white` 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Cerveza
                      </button>
                      <button
                        onClick={() => togglePreference(index, 'prefersSpirits')}
                        className={`px-3 py-1 text-xs rounded-full ${
                          profile.prefersSpirits 
                            ? `bg-${color.replace('#', '')} text-white` 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Licores
                      </button>
                      <button
                        onClick={() => togglePreference(index, 'prefersWine')}
                        className={`px-3 py-1 text-xs rounded-full ${
                          profile.prefersWine 
                            ? `bg-${color.replace('#', '')} text-white` 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Vino
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Info footer */}
      <div className="mt-4 text-xs text-gray-500 flex items-center">
        <Info className="w-4 h-4 mr-1 text-gray-400" />
        <span>
          Los perfiles definen cómo se distribuyen los participantes y cuánto consume cada grupo.
          El total siempre suma 100%.
        </span>
      </div>
    </div>
  );
};

export default DrinkerProfileSection;