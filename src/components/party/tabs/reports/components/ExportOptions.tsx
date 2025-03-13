import React from 'react';
import { FileText, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';

const ExportOptions: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
      <span className="text-sm text-gray-600">Exportar informe completo para compartir</span>
      <div className="flex space-x-3">
        <Button
          variant="gradient"
          color="primary"
          size="md"
        >
          <FileText className="w-4 h-4 mr-2" />
          PDF
        </Button>
        <Button
          variant="ghost"
          color="primary"
          size="md"
        >
          <ChevronDown className="w-4 h-4 mr-2" />
          Excel
        </Button>
      </div>
    </div>
  );
};

export default ExportOptions;