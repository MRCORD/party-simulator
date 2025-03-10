import { CheckCircle, AlertCircle } from 'lucide-react';

const StatusItem = ({ title, isEnough, currentAmount, requiredAmount }) => (
  <div className={`text-sm flex justify-between items-center p-1 rounded ${isEnough ? 'text-green-800' : 'text-red-800'}`}>
    <span className="font-medium">{title}:</span>
    <div className="flex items-center">
      <span>{currentAmount}/{requiredAmount} porciones</span>
      {isEnough ? (
        <CheckCircle className="w-4 h-4 ml-1 text-green-500" />
      ) : (
        <AlertCircle className="w-4 h-4 ml-1 text-red-500" />
      )}
    </div>
  </div>
);

export default StatusItem;