import React from 'react';
import { MapPin } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useTheme } from '@/components/ui/ThemeProvider';

// Venue types data
const venueTypes = [
  { 
    name: "Terraza", 
    cost: 1500, 
    capacity: 60, 
    hours: 5, 
    features: ["Estacionamiento", "Cocina", "Patio", "Zona de bebidas"] 
  },
  { 
    name: "Salón de eventos", 
    cost: 2000, 
    capacity: 100, 
    hours: 6, 
    features: ["Aire acondicionado", "Sonido", "Estacionamiento", "Personal"] 
  },
  { 
    name: "Casa de Campo", 
    cost: 2500, 
    capacity: 80, 
    hours: 8, 
    features: ["Piscina", "Parrilla", "Jardín", "Estacionamiento"] 
  },
  { 
    name: "Espacio en Azotea", 
    cost: 1200, 
    capacity: 40, 
    hours: 5, 
    features: ["Vista", "Barra", "Iluminación", "Cobertura"] 
  }
];

interface VenueOptionsProps {
  setVenueCost: (cost: number) => void;
}

const VenueOptions: React.FC<VenueOptionsProps> = ({ setVenueCost }) => {
  const theme = useTheme();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`${theme.getGradient('success')} px-4 py-3 text-white`}>
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Tipos de Locales Comunes</h3>
        </div>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {venueTypes.map((venue, index) => (
            <div key={index} className="bg-success-light/20 rounded-lg border border-success-light overflow-hidden">
              <div className="bg-success px-4 py-2 text-white">
                <div className="font-medium">{venue.name}</div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Costo</span>
                  <span className="font-medium">S/ {venue.cost}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Capacidad</span>
                  <span className="font-medium">{venue.capacity} personas</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Duración</span>
                  <span className="font-medium">{venue.hours} horas</span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Características</span>
                  <div className="flex flex-wrap gap-1">
                    {venue.features.map((feature, i) => (
                      <Badge key={i} size="sm" variant="success">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button
                  variant="outline" 
                  color="success" 
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setVenueCost(venue.cost)}
                >
                  Usar este costo
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueOptions;