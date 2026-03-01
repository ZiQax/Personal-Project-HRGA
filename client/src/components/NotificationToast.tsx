import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notif) => (
          <ToastItem key={notif.id} notif={notif} onRemove={() => removeNotification(notif.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ notif, onRemove }: { notif: any, onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 5000);
    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: <CheckCircle className="text-emerald-500" />,
    error: <AlertCircle className="text-red-500" />,
    warning: <AlertTriangle className="text-amber-500" />,
    info: <Info className="text-blue-500" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex gap-4 items-start"
    >
      <div className="mt-1">{icons[notif.type as keyof typeof icons]}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{notif.message}</p>
      </div>
      <button onClick={onRemove} className="text-slate-300 hover:text-slate-500 p-1">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

