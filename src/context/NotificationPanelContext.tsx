import React, { createContext, useContext, useState } from 'react';

type NotificationPanelContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const NotificationPanelContext = createContext<NotificationPanelContextValue | undefined>(undefined);

export function NotificationPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <NotificationPanelContext.Provider value={{
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen(v => !v),
    }}>
      {children}
    </NotificationPanelContext.Provider>
  );
}

export function useNotificationPanel() {
  const ctx = useContext(NotificationPanelContext);
  if (!ctx) throw new Error('useNotificationPanel must be used within NotificationPanelProvider');
  return ctx;
}
