import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type Notification = {
  id: string;
  title: string;
  message: string | null;
  read: boolean;
  created_at: string;
};

type NotificationsContextValue = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, message, read, created_at')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    if (!error && data) setNotifications(data as Notification[]);
    setLoading(false);
  }, [profile?.id]);

  useEffect(() => {
    fetch();

    if (!profile?.id) return;

    // Real-time subscription
    const channel = supabase
      .channel(`notifications:${profile.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${profile.id}`,
      }, () => { fetch(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile?.id, fetch]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    if (!profile?.id) return;
    await supabase.from('notifications').update({ read: true })
      .eq('user_id', profile.id).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, loading, refresh: fetch, markAsRead, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
