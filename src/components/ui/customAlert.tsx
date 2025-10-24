import { useState, useEffect } from 'react';

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function CustomAlert({ message, type = 'info', duration = 3000, onClose }: AlertProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`fixed top-4 right-4 min-w-[300px] p-4 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out z-50 flex items-center ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${
        type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600 border-l-4 border-green-700 text-white' :
        type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 border-l-4 border-red-700 text-white' :
        type === 'warning' ? 'bg-gradient-to-r from-orange-500 to-orange-600 border-l-4 border-orange-700 text-white' :
        'bg-gradient-to-r from-blue-500 to-blue-600 border-l-4 border-blue-700 text-white'
      }`}
    >
      <div className="flex justify-between items-center w-full">
        <span className="flex-1 mr-3 text-sm font-medium leading-relaxed">
          {message}
        </span>
        <button 
          onClick={handleClose}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors duration-200 text-white text-lg font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export function useAlert() {
  const [alerts, setAlerts] = useState<{id: number; message: string; type: 'success' | 'error' | 'warning' | 'info'}[]>([]);

  const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const AlertContainer = () => (
    <>
      {alerts.map(alert => (
        <CustomAlert
          key={alert.id}
          message={alert.message}
          type={alert.type}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </>
  );

  return { showAlert, AlertContainer };
}