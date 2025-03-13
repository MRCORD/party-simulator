import React from 'react';
import { Package, Info, Check } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

const MiscItemsSection: React.FC = () => {
  const theme = useTheme();
  
  // Miscellaneous items list
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
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${theme.getGradient('success')} px-4 py-3 text-white`}>
        <div className="flex items-center">
          <Package className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Artículos Misceláneos</h3>
        </div>
      </div>
      
      <div className="p-5">
        <div className="bg-success-light rounded-lg p-4 mb-4 flex items-start">
          <Info className="w-5 h-5 text-success-dark mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-success-dark">
            No olvides considerar estos artículos adicionales que pueden ser necesarios para el evento. Algunos locales podrían proporcionar algunos de estos elementos, confirma con anticipación.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {miscItems.map((item, index) => (
            <div key={index} className="flex items-center py-2 border-b border-gray-100">
              <Check className="w-4 h-4 text-success mr-2" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiscItemsSection;