import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { theme } from '../theme/colors';
const colors = theme.colors;
import { useNotifications } from '../context/NotificationsContext';
import { useNotificationPanel } from '../context/NotificationPanelContext';

type Props = {
  title?: string;
};

export default function TopBar({ title }: Props) {
  const nav = useNavigation<any>();
  const { unreadCount } = useNotifications();
  const { toggle } = useNotificationPanel();

  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => nav.dispatch(DrawerActions.openDrawer())}>
        <Ionicons name="menu" size={22} color="white" />
      </TouchableOpacity>

      <Text style={styles.topTitle}>
        <Text style={styles.campusText}>CAMPUS</Text>
        {title ? ` ${title}` : ' Portal'}
      </Text>

      <TouchableOpacity onPress={toggle} style={styles.bellWrap}>
        <Ionicons name="notifications" size={18} color="white" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 56,
    backgroundColor: '#0B0F14',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  topTitle: { color: 'white', fontWeight: '800' },
  campusText: { color: colors.primary },
  bellWrap: { position: 'relative' },
  badge: {
    position: 'absolute',
    right: -8, top: -6,
    backgroundColor: '#EF4444',
    borderRadius: 999,
    minWidth: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: 'white', fontSize: 9, fontWeight: '900' },
});
