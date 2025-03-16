import React, { useState } from 'react';
import { FileText, Download, Printer, Mail } from 'lucide-react';

interface ExportOptionsProps {
  reportTitle?: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  reportTitle = "Informe Financiero - Party Simulator"
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleExport = (format: 'pdf' | 'excel' | 'print' | 'email') => {
    setShowDropdown(false);
    
    // In a real implementation, these would connect to actual export functionality
    switch (format) {
      case 'pdf':
        alert('Exportando a PDF...');
        break;
      case 'excel':
        alert('Exportando a Excel...');
        break;
      case 'print':
        window.print();
        break;
      case 'email':
        alert('Abriendo ventana de correo...');
        break;
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm print:hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-sm text-gray-700">{reportTitle}</span>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  Exportar como PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  Exportar como Excel
                </button>
                <button
                  onClick={() => handleExport('print')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Printer className="w-4 h-4 mr-2 text-gray-500" />
                  Imprimir
                </button>
                <button
                  onClick={() => handleExport('email')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Enviar por correo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Print optimizations (visible only in print preview) */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ExportOptions;