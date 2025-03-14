import React from 'react';
import { Users, Info } from 'lucide-react';

// Define the EaterProfile type
interface EaterProfile {
  name: string;
  percentage: number;
  servingsMultiplier: number;
}

interface ProfileSectionProps {
  eaterProfiles: EaterProfile[];
  updateEaterProfile: (index: number, field: keyof EaterProfile, value: number) => void;
}

const ProfileSection = ({ eaterProfiles, updateEaterProfile }: ProfileSectionProps) => {
  // Profile colors - one distinct color per profile type
  const PROFILE_COLORS = ['#10b981', '#4f86f7', '#f59e0b'];
  
  // Handle profile percentage change with automatic adjustment of other profiles
  const handleProfilePercentageChange = (index: number, newValue: number) => {
    // Don't allow values below 1% or above 98%
    if (newValue < 1) newValue = 1;
    if (newValue > 98) newValue = 98;
    
    // Get current profiles and the one being changed
    const originalValue = eaterProfiles[index].percentage;
    const difference = newValue - originalValue;
    
    if (difference === 0) return;
    
    // Calculate how much we need to adjust other profiles
    const otherProfilesTotal = 100 - originalValue;
    
    // Update the current profile
    updateEaterProfile(index, 'percentage', newValue);
    
    // Adjust other profiles proportionally
    eaterProfiles.forEach((profile, i) => {
      if (i !== index) {
        // Calculate new percentage proportionally
        const adjustmentFactor = (100 - newValue) / otherProfilesTotal;
        const adjustedPercentage = Math.round(profile.percentage * adjustmentFactor);
        
        // Ensure we don't go below 1%
        const finalPercentage = Math.max(1, adjustedPercentage);
        updateEaterProfile(i, 'percentage', finalPercentage);
      }
    });
    
    // Ensure percentages sum to 100% by adjusting the last profile
    let total = 0;
    eaterProfiles.forEach((profile, i) => {
      if (i !== eaterProfiles.length - 1) {
        total += (i === index) ? newValue : profile.percentage;
      }
    });
    
    // Adjust the last profile if it's not the one being changed
    if (index !== eaterProfiles.length - 1) {
      const lastProfilePercentage = Math.max(1, 100 - total);
      updateEaterProfile(eaterProfiles.length - 1, 'percentage', lastProfilePercentage);
    }
  };
  
  // Handle profile multiplier change
  const handleProfileMultiplierChange = (index: number, value: number) => {
    updateEaterProfile(index, 'servingsMultiplier', value);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
        <Users className="w-6 h-6 mr-2 text-gray-600" />
        Perfiles de Consumo
      </h3>
      
      {/* Profile cards in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {eaterProfiles.map((profile, index) => {
          const color = PROFILE_COLORS[index % PROFILE_COLORS.length];
          
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
                <span className="text-xl font-bold" style={{ color }}>
                  {profile.percentage}%
                </span>
              </div>
              
              {/* Percentage slider section */}
              <div className="mb-6">
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
              
              {/* Multiplier slider section */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Multiplicador de Consumo
                  </label>
                  <span className="text-lg font-bold" style={{ color }}>
                    {profile.servingsMultiplier}x
                  </span>
                </div>
                
                <div className="relative">
                  <input 
                    type="range" 
                    min="0.5" 
                    max="3.0" 
                    step="0.1" 
                    value={profile.servingsMultiplier} 
                    onChange={(e) => handleProfileMultiplierChange(index, parseFloat(e.target.value))}
                    className="w-full h-2 appearance-none rounded-full bg-gray-200 focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, ${color} 0%, ${color} ${((profile.servingsMultiplier - 0.5) / 2.5) * 100}%, #e5e7eb ${((profile.servingsMultiplier - 0.5) / 2.5) * 100}%, #e5e7eb 100%)`,
                      '--thumb-color': color
                    } as React.CSSProperties}
                  />
                </div>
                
                {/* Min/max labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x</span>
                  <span>3.0x</span>
                </div>
                
                {/* Description text */}
                <p className="mt-2 text-sm text-gray-600">
                  {profile.servingsMultiplier < 1 
                    ? "Consume menos que el promedio" 
                    : profile.servingsMultiplier > 1 
                      ? "Consume más que el promedio" 
                      : "Consumo promedio"
                  }
                </p>
              </div>
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

export default ProfileSection;