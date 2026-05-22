import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { theme } from "../../theme/colors";
const colors = theme.colors;
import { getFontStyle, themeFont } from "../../theme/fonts";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import TopBar from '../../components/TopBar';
import { supabase } from "../../lib/supabase";
import { useNotificationPanel } from "../../context/NotificationPanelContext";

export default function DashboardScreen() {
  const nav = useNavigation<any>();
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();
  const [pressedBtn, setPressedBtn] = React.useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = React.useState(0);
  const [enrolledUnits, setEnrolledUnits] = React.useState(0);

  const firstName = profile?.full_name?.trim().split(' ')[0] ?? 'there';
  const lastName = profile?.full_name?.trim().split(' ').slice(-1)[0] ?? '';
  const displayName = lastName ? `${firstName} ${lastName}` : firstName;

  React.useEffect(() => {
    if (!profile?.id) return;
    const fetchStats = async () => {
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select('class_assignments!inner(subjects!inner(units))')
        .eq('student_id', profile.id)
        .eq('enrollment_status', 'enrolled');

      if (enrollments) {
        setEnrolledCourses(enrollments.length);
        const units = enrollments.reduce((sum: number, e: any) => sum + (e.class_assignments?.subjects?.units ?? 0), 0);
        setEnrolledUnits(units);
      }
    };
    fetchStats();
  }, [profile?.id]);

  return (
    <View style={styles.page}>
      <TopBar />

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 30 }}>
        <Text style={styles.h1}>Dashboard</Text>
        <Text style={styles.sub}>Welcome back, {displayName}</Text>

        {/* Stats grid */}
        <View style={styles.grid}>
          <StatCard icon="albums-outline" value="0" label="Subjects in Cart" iconColor={colors.primary} />
          <StatCard icon="calendar-outline" value="0" label="Cart Units" iconColor="#3B82F6" />
          <StatCard icon="time-outline" value={String(enrolledCourses)} label="Enrolled Courses" iconColor="#22C55E" />
          <StatCard icon="trending-up-outline" value={String(enrolledUnits)} label="Enrolled Units" iconColor="#8B5CF6" />
        </View>

        {/* Enrollment Status */}
        <Card style={styles.darkCard}>
          <Text style={styles.darkTitle}>Enrollment Status</Text>
          <StatusRow left="Current Semester" right="Spring 2026" rightColor="#FFFFFF" />
          <StatusRow left="Enrollment Period" right="Open" rightColor="#22C55E" />
          <StatusRow left="Cart Units" right="0 / 24" rightColor="#F59E0B" />
          <StatusRow left="Enrolled Units" right={String(enrolledUnits)} rightColor="#3B82F6" />
        </Card>

        {/* Quick actions */}
        <Card>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={[styles.secondaryBtn, pressedBtn === 'browse' && { backgroundColor: colors.primary }]}
            activeOpacity={0.9}
            onPressIn={() => setPressedBtn('browse')}
            onPressOut={() => setPressedBtn(null)}
            onPress={() => nav.navigate('Browse Subjects')}
          >
            <Text style={[styles.secondaryBtnText, pressedBtn === 'browse' && styles.primaryBtnTextPressed]}>Browse Subjects</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryBtn, pressedBtn === 'schedule' && { backgroundColor: colors.primary }]}
            activeOpacity={0.9}
            onPressIn={() => setPressedBtn('schedule')}
            onPressOut={() => setPressedBtn(null)}
            onPress={() => nav.navigate('Course Details')}
          >
            <Text style={[styles.secondaryBtnText, pressedBtn === 'schedule' && styles.secondaryBtnTextPressed]}>View My Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryBtn, pressedBtn === 'grades' && { backgroundColor: colors.primary }]}
            activeOpacity={0.9}
            onPressIn={() => setPressedBtn('grades')}
            onPressOut={() => setPressedBtn(null)}
            onPress={() => nav.navigate("View Semestral Grades")}
          >
            <Text style={[styles.secondaryBtnText, pressedBtn === 'grades' && styles.secondaryBtnTextPressed]}>Check Grades</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, value, label, iconColor = colors.primary }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string; iconColor?: string }) {
  return (
    <Card style={styles.statCard}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function StatusRow({ left, right, rightColor }: { left: string; right: string; rightColor: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLeft}>{left}</Text>
      <Text style={[styles.rowRight, { color: rightColor }]}>{right}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F3F4F6" },
  topBar: { height: 56, backgroundColor: "#0B0F14", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14 },
  topTitle: { fontSize: 13.5 },
  topIcons: { flexDirection: "row", alignItems: "center" },
  badge: { position: "absolute", right: -8, top: -6, backgroundColor: "#EF4444", borderRadius: 999, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  badgeText: { color: "white", fontSize: 10, fontWeight: "900" },
  h1: { fontSize: 20, ...getFontStyle('extraBold'), color: "#111827" },
  sub: { marginTop: 4, color: "#6B7280", fontSize: 12.5 },
  grid: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between" },
  statCard: { width: "48%", alignItems: "flex-start", gap: 4 },
  statValue: { fontSize: 18, ...getFontStyle('semiBold'), color: "#111827", marginTop: 4 },
  statLabel: { fontSize: 12.2, color: "#6B7280" },
  darkCard: { backgroundColor: "#0B1220" },
  darkTitle: { color: "white", fontWeight: "900", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  rowLeft: { color: "#D1D5DB", ...getFontStyle('bold'), fontSize: 12.5 },
  rowRight: { color: "#E5E7EB", ...getFontStyle('semiBold'), fontSize: 12.5 },
  cardTitle: { ...getFontStyle('semiBold'), color: "#111827", marginBottom: 10 },
  primaryBtn: { height: 42, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  primaryBtnPressed: { backgroundColor: "#9CA3AF" },
  primaryBtnText: { fontWeight: "600", color: "#111827" },
  primaryBtnTextPressed: { color: "#111827" },
  secondaryBtn: { marginTop: 10, height: 42, borderRadius: 10, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
  secondaryBtnPressed: { backgroundColor: "#9CA3AF" },
  secondaryBtnText: { fontWeight: "600", color: "#111827" },
  secondaryBtnTextPressed: { color: "#111827" },
});
