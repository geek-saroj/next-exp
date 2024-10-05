"use client";
import React, { useEffect, useState } from 'react';

const OnlineStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <div className="flex items-center">
      <div
        className={`w-3 h-3 rounded-full mr-2 ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className="text-sm">
        {isOnline ? 'User is Online' : 'User is Offline'}
      </span>
    </div>
  );
};

export default OnlineStatus;
