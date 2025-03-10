const StatusBar = ({ title, isEnough, currentAmount, requiredAmount }) => {
  const percentage = Math.min(100, (currentAmount / requiredAmount) * 100);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <span className="text-sm font-medium text-gray-700">
          {currentAmount}/{requiredAmount} servings
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${isEnough ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs mt-1 text-right">
        {isEnough ? (
          <span className="text-green-600">Sufficient</span>
        ) : (
          <span className="text-red-600">Need {requiredAmount - currentAmount} more servings</span>
        )}
      </div>
    </div>
  );
};

export default StatusBar;