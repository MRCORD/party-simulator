import React from 'react';
import { useTheme } from '@/components/ui/ThemeProvider';
import { drinkTips } from '@/components/party/constants';

const CostSavingTips: React.FC = () => {
  const theme = useTheme();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${theme.getGradient('success')} px-4 py-3 text-white`}>
        <h3 className="font-medium">Ideas para Ahorrar Costos</h3>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {drinkTips.costSavingTips.map((tip, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 flex items-start mt-0.5">
                <div className="flex-shrink-0 w-6 h-6 bg-success text-white rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </div>
              </div>
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CostSavingTips;