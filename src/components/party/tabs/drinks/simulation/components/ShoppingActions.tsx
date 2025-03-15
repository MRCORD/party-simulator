import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ShoppingActionsProps {
  setActiveTab: (tab: 'overview' | 'shopping' | 'drinks' | 'food' | 'venue' | 'reports') => void;
}

const ShoppingActions: React.FC<ShoppingActionsProps> = ({ setActiveTab }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-primary p-4 text-center">
      <p className="text-gray-700 mb-3">
        Una vez que hayas planificado tus necesidades de bebidas, actualiza tu lista de compras:
      </p>
      <Button 
        variant="gradient" 
        color="primary"
        onClick={() => setActiveTab('shopping')}
      >
        <ShoppingBag className="w-4 h-4 mr-2" />
        Ir a Lista de Compras
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default ShoppingActions;