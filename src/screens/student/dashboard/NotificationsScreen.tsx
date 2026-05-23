import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { colors } from "../../../theme/colors";
import Card from "../../../components/Card";
import { useNotifications, Notification } from "../../../context/NotificationsContext";

export default function NotificationsScreen() {
  const nav = useNavigation<any>();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  return (
    <View style={styles.page}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => nav.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <View style={styles.unreadPill}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        ) : <View style={{ width: 30 }} />}
      </View>

      <View style={{ padding: 14, flex: 1 }}>
        <Card style={{ flex: 1, paddingVertical: 8 }}>
          <Text style={styles.unreadLabel}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </Text>

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
              renderItem={({ item }) => (
                <NotifRow item={item} timeAgo={timeAgo(item.created_at)} onPress={() => markAsRead(item.id)} />
              )}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
          )}

          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markAll} onPress={markAllAsRead} activeOpacity={0.9}>
              <Text style={styles.markAllText}>Mark all as read</Text>
            </TouchableOpacity>
          )}
        </Card>
      </View>
    </View>
  );
}

function NotifRow({ item, timeAgo, onPress }: { item: Notification; timeAgo: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.row, item.is_read && styles.rowRead]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.dot, { backgroundColor: item.is_read ? '#D1D5DB' : colors.primary }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, item.is_read && { color: '#6B7280' }]}>{item.title}</Text>
        {item.body ? <Text style={styles.body}>{item.body}</Text> : null}
        <View style={styles.ageRow}>
          <Ionicons name="time-outline" size={12} color="#9CA3AF" />
          <Text style={styles.ageText}>{timeAgo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F3F4F6" },
  topBar: { height: 56, backgroundColor: "#0B0F14", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14 },
  topTitle: { color: "white", fontWeight: "900" },
  unreadPill: { backgroundColor: colors.primary, borderRadius: 999, minWidth: 22, height: 22, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  unreadText: { fontWeight: "900", color: "#111827", fontSize: 12 },
  unreadLabel: { paddingHorizontal: 10, paddingVertical: 8, color: "#6B7280", fontWeight: "700" },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
  row: { flexDirection: "row", gap: 10, paddingHorizontal: 10, paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  rowRead: { opacity: 0.6 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  title: { fontWeight: "900", color: "#111827" },
  body: { marginTop: 4, color: "#374151", fontSize: 12.5, lineHeight: 18 },
  ageRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  ageText: { color: "#9CA3AF", fontSize: 12 },
  markAll: { marginTop: 8, marginHorizontal: 10, height: 40, borderRadius: 10, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
  markAllText: { fontWeight: "900", color: colors.primary },
});



