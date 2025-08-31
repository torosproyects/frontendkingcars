// src/components/NotificationCenter.tsx
import React, { useState } from 'react';
import { useAuctionStore } from '@/lib/store/auctions-store';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { AuctionNotification } from '@/lib/types/auction';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const notifications: AuctionNotification[] = useAuctionStore((state) => state.notifications);
  const unreadCount: number = useAuctionStore((state) => state.getUnreadCount());
  const markNotificationRead = useAuctionStore((state) => state.markNotificationRead);
  const clearNotifications = useAuctionStore((state) => state.clearNotifications);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      notifications.forEach((notif) => {
        if (!notif.read) {
          markNotificationRead(notif.id);
        }
      });
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearNotifications();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Icono de Campana con Badge */}
      <button onClick={toggleOpen} className="relative p-2 rounded-full hover:bg-gray-100">
        <svg
          className="w-6 h-6 text-gray-700"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 003 14h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panel Desplegable de Notificaciones */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
          style={{ maxHeight: '80vh' }}
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-800">Notificaciones</h3>
            {notifications.length > 0 && (
              <button onClick={handleClearAll} className="text-sm text-blue-500 hover:text-blue-700">
                Borrar todo
              </button>
            )}
          </div>
          <ul className="divide-y divide-gray-200 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 64px)' }}>
            {notifications.length > 0 ? (
              notifications.map((notif: AuctionNotification) => (
                <li
                  key={notif.id}
                  className={`p-4 ${notif.read ? 'bg-gray-50' : 'bg-blue-50'} hover:bg-gray-100 transition-colors duration-200`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{notif.title}</span>
                    <span className={`text-xs ${notif.read ? 'text-gray-500' : 'text-blue-600'}`}>
                      {formatDistanceToNow(notif.timestamp, { locale: es, addSuffix: true })}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${notif.read ? 'text-gray-600' : 'text-gray-800'}`}>{notif.message}</p>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">No hay notificaciones</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;