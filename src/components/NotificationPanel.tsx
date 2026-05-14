import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  ActivityIndicator, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { useNotifications, Notification } from '../context/NotificationsContext';
import { useNotificationPanel } from '../context/NotificationPanelContext';

const colors = theme.colors;
const SCREEN_W = Dimensions.get('window').width;
const PANEL_W = Math.min(SCREEN_W * 0.85, 340);

export default function NotificationPanel() {
  const { isOpen, close } = useNotificationPanel();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const translateX = React.useRef(new Animated.Value(PANEL_W)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : PANEL_W,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Slide-in panel from right — no backdrop, page stays interactive */}
      <Animated.View style={[styles.panel, { transform: [{ translateX }] }]} pointerEvents="box-none">
        <View style={styles.header} pointerEvents="auto">
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerRight}>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead} hitSlop={8} style={{ marginRight: 14 }}>
                <Text style={styles.markAll}>Mark all read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={close} hitSlop={10}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View pointerEvents="auto" style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : notifications.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="notifications-off-outline" size={40} color="#D1D5DB" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(x) => x.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.row, item.read && styles.rowRead]}
                  onPress={() => markAsRead(item.id)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.dot, { backgroundColor: item.read ? '#D1D5DB' : colors.primary }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.title, item.read && styles.titleRead]}>{item.title}</Text>
                    {item.message ? <Text style={styles.body}>{item.message}</Text> : null}
                    <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0,
    width: PANEL_W,
    backgroundColor: '#fff',
    ...shadows.fab,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#1F2937',
    backgroundColor: '#0B0F14',
  },
  headerTitle: { fontWeight: '700', color: '#fff', fontSize: 16 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  markAll: { color: colors.primary, fontWeight: '600', fontSize: 12 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
  row: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  rowRead: { backgroundColor: '#FAFAFA' },
  dot: { width: 9, height: 9, borderRadius: 5, marginTop: 5, flexShrink: 0 },
  title: { fontWeight: '700', color: '#111827', fontSize: 13.5 },
  titleRead: { color: '#6B7280', fontWeight: '500' },
  body: { color: '#6B7280', fontSize: 12.5, marginTop: 3, lineHeight: 18 },
  time: { color: '#9CA3AF', fontSize: 11.5, marginTop: 5 },
});
