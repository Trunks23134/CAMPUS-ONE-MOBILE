import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/colors';
const colors = theme.colors;
import { useNotifications } from '../context/NotificationsContext';
import { useNotificationPanel } from '../context/NotificationPanelContext';
import CampusPortalBrand from './CampusPortalBrand';

type Props = {
  title?: string;
};

export default function TopBar({ title }: Props) {
  const nav = useNavigation<any>();
  const { unreadCount } = useNotifications();
  const { toggle } = useNotificationPanel();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => nav.dispatch(DrawerActions.openDrawer())}
          style={styles.iconButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="menu" size={22} color="white" />
        </TouchableOpacity>

        <CampusPortalBrand containerStyle={styles.topTitleWrap} titleStyle={styles.topTitle} />

        <TouchableOpacity
          onPress={toggle}
          style={[styles.iconButton, styles.bellWrap]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="notifications" size={18} color="white" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0B0F14',
  },
  topBar: {
    height: 56,
    backgroundColor: '#0B0F14',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { color: 'white', fontWeight: '800' },
  topTitleWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
