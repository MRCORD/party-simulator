import React from 'react';
import { Users, Info } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import Badge from '@/components/ui/Badge';
import { EaterProfile } from '@/components/party/types';

interface ProfileSectionProps {
  eaterProfiles: EaterProfile[];
  updateEaterProfile: (index: number, field: keyof EaterProfile, value: number) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  eaterProfiles,
  updateEaterProfile
}) => {
  // Profile distribution chart data
  const profileChartData = eaterProfiles.map(profile => ({
    name: profile.name,
    value: profile.percentage,
    multiplier: profile.servingsMultiplier
  }));
  
  const PROFILE_COLORS = ['#10b981', '#6366f1', '#f59e0b'];
  
  // Handle profile percentage change with automatic adjustment of other profiles
  const handleProfilePercentageChange = (index: number, newValue: number) => {
    // Don't allow values below 1% or above 98%
    if (newValue < 1) newValue = 1;
    if (newValue > 98) newValue = 98;
    
    // Get current profiles and the one being changed
    const currentProfiles = [...eaterProfiles];
    const originalValue = currentProfiles[index].percentage;
    const difference = newValue - originalValue;
    
    if (difference === 0) return;
    
    // Calculate how much we need to adjust other profiles
    const otherProfilesTotal = 100 - originalValue;
    
    // Update the current profile
    updateEaterProfile(index, 'percentage', newValue);
    
    // Adjust other profiles proportionally
    currentProfiles.forEach((profile, i) => {
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
    currentProfiles.forEach((profile, i) => {
      if (i !== currentProfiles.length - 1) {
        total += (i === index) ? newValue : profile.percentage;
      }
    });
    
    // Adjust the last profile if it's not the one being changed
    if (index !== currentProfiles.length - 1) {
      const lastProfilePercentage = Math.max(1, 100 - total);
      updateEaterProfile(currentProfiles.length - 1, 'percentage', lastProfilePercentage);
    }
  };
  
  // Handle profile multiplier change
  const handleProfileMultiplierChange = (index: number, value: number) => {
    updateEaterProfile(index, 'servingsMultiplier', value);
  };

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Users className="w-4 h-4 mr-2 text-warning" />
          Perfiles de Consumo
        </h4>
        
        {/* Profile Distribution Chart */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={profileChartData}
                layout="vertical"
                barSize={20}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => {
                    const { multiplier } = props.payload;
                    return [`${value}% (${multiplier}x consumo)`, 'Distribución'];
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {profileChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PROFILE_COLORS[index % PROFILE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Profile Configuration Controls */}
        <div className="space-y-4">
          {eaterProfiles.map((profile, index) => (
            <div key={index} className="border rounded-lg p-3" style={{ borderColor: PROFILE_COLORS[index % PROFILE_COLORS.length] }}>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium" style={{ color: PROFILE_COLORS[index % PROFILE_COLORS.length] }}>{profile.name}</h5>
                <Badge 
                  variant="success" 
                  size="sm"
                  style={{ 
                    backgroundColor: PROFILE_COLORS[index % PROFILE_COLORS.length] + '20',
                    color: PROFILE_COLORS[index % PROFILE_COLORS.length]
                  }}
                >
                  {profile.percentage}% de asistentes
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Percentage Slider */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Porcentaje en el Evento</label>
                  <div className="flex items-center">
                    <input 
                      type="range" 
                      min="1" 
                      max="98" 
                      value={profile.percentage} 
                      onChange={(e) => handleProfilePercentageChange(index, parseInt(e.target.value))}
                      className="w-full mr-3"
                    />
                    <span className="w-10 text-center text-sm">{profile.percentage}%</span>
                  </div>
                </div>
                
                {/* Multiplier Slider */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Multiplicador de Consumo
                  </label>
                  <div className="flex items-center">
                    <input 
                      type="range" 
                      min="0.5" 
                      max="3" 
                      step="0.1" 
                      value={profile.servingsMultiplier} 
                      onChange={(e) => handleProfileMultiplierChange(index, parseFloat(e.target.value))}
                      className="w-full mr-3"
                    />
                    <span className="w-10 text-center text-sm">{profile.servingsMultiplier}x</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-1 text-xs text-gray-500">
                {profile.servingsMultiplier < 1 
                  ? "Consume menos que el promedio" 
                  : profile.servingsMultiplier > 1 
                    ? "Consume más que el promedio" 
                    : "Consumo promedio"
                }
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <Info className="w-3 h-3 mr-1 text-gray-400" />
          <span>
            Los perfiles definen cómo se distribuyen los participantes y cuánto consume cada grupo.
            El total siempre suma 100%.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;