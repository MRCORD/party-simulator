"use client";

import React, { FC } from 'react';
import { Building2, DollarSign } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

// Import sub-components
import VenueOptions from './components/VenueOptions';
import ChecklistSection from './components/ChecklistSection';
import MiscItemsSection from './components/MiscItemsSection';

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

  return (
    <div className="space-y-6">
      {/* Main Venue Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`${theme.getGradient('success')} p-5 text-white`}>
          <div className="flex items-center">
            <Building2 className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold">Local y Misceláneos</h2>
          </div>
          
          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Costo del Local</div>
              <div className="text-2xl font-bold">
                S/ {venueCost.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Costos Misceláneos</div>
              <div className="text-2xl font-bold">
                S/ {miscCosts.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Costo Total</div>
              <div className="text-2xl font-bold">
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
        <div className={`${theme.getGradient('success')} px-4 py-3 text-white`}>
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Costos del Local y Misceláneos</h3>
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Costo del Local</label>
              <div className="flex rounded shadow-sm">
                <span className="inline-flex items-center rounded-l border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">S/</span>
                <input 
                  type="number" 
                  className="block w-full rounded-r border border-gray-300 py-2 pl-1 pr-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
              <div className="flex rounded shadow-sm">
                <span className="inline-flex items-center rounded-l border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">S/</span>
                <input 
                  type="number" 
                  className="block w-full rounded-r border border-gray-300 py-2 pl-1 pr-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
      
      {/* Venue Types */}
      <VenueOptions 
        setVenueCost={setVenueCost} 
      />
      
      {/* Venue Checklist */}
      <ChecklistSection 
        attendees={attendees} 
      />
      
      {/* Miscellaneous Items */}
      <MiscItemsSection />
    </div>
  );
};

export default VenueTab;