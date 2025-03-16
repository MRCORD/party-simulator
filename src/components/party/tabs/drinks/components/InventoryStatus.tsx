import React from 'react';
import { CheckCircle, Wine, Droplet, Snowflake, Package, AlertCircle } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/components/ui/ThemeProvider';

interface InventoryStatusProps {
  getCategoryServings: (category: string) => number;
  drinkRequirements: {
    totalDrinks: number;
    hasEnoughSpirits: boolean;
    hasEnoughMixers: boolean;
    hasEnoughIce: boolean;
    hasEnoughSupplies: boolean;
  };
}

const InventoryStatus: React.FC<InventoryStatusProps> = ({
  getCategoryServings,
  drinkRequirements
}) => {
  const theme = useTheme();
  
  // Define inventory status items
  const inventoryStatus = [
    { 
      category: 'spirits', 
      label: 'Licores',
      current: getCategoryServings('spirits'), 
      required: drinkRequirements.totalDrinks, 
      isEnough: drinkRequirements.hasEnoughSpirits,
      icon: <Wine className="w-5 h-5" strokeWidth={2.5} />
    },
    { 
      category: 'mixers', 
      label: 'Mezcladores',
      current: getCategoryServings('mixers'), 
      required: drinkRequirements.totalDrinks, 
      isEnough: drinkRequirements.hasEnoughMixers,
      icon: <Droplet className="w-5 h-5" strokeWidth={2.5} />
    },
    { 
      category: 'ice', 
      label: 'Hielo',
      current: getCategoryServings('ice'), 
      required: drinkRequirements.totalDrinks, 
      isEnough: drinkRequirements.hasEnoughIce,
      icon: <Snowflake className="w-5 h-5" strokeWidth={2.5} />
    },
    { 
      category: 'supplies', 
      label: 'Suministros',
      current: getCategoryServings('supplies'), 
      required: drinkRequirements.totalDrinks, 
      isEnough: drinkRequirements.hasEnoughSupplies,
      icon: <Package className="w-5 h-5" strokeWidth={2.5} />
    }
  ];
  
  // Get category color
  const getCategoryColor = (category: string): string => {
    switch(category) {
      case 'spirits': return 'bg-primary';
      case 'mixers': return 'bg-accent-teal';
      case 'ice': return 'bg-primary-light';
      case 'supplies': return 'bg-accent-pink';
      default: return 'bg-gray-400';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${theme.getGradient('primary')} px-4 py-3 text-white`}>
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Estado del Inventario</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {inventoryStatus.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${getCategoryColor(item.category)}`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{item.current}</span>/{item.required} porciones
              </div>
            </div>
            
            {/* Progress bar */}
            <ProgressBar
              value={Math.min(100, (item.current / item.required) * 100)}
              max={100}
              color={item.isEnough ? "success" : "error"}
              showLabel={false}
            />
            
            {/* Status indicator */}
            <div className="flex justify-end">
              {item.isEnough ? (
                <Badge variant="success" size="sm" icon={<CheckCircle className="w-3 h-3 mr-1" />}>
                  Suficiente
                </Badge>
              ) : (
                <Badge variant="error" size="sm" icon={<AlertCircle className="w-3 h-3 mr-1" />}>
                  Necesita {item.required - item.current} más
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryStatus;