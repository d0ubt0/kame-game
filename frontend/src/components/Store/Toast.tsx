// Toast.tsx
import { useEffect } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="toastContainer">
      <div className="toastContent">
        <div className="toastIcon">✓</div>
        <p className="toastMessage">{message}</p>
      </div>
      <div className="toastProgress" style={{ animationDuration: `${duration}ms` }}></div>
    </div>
  );
}

