import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../theme/colors";
import { shadows } from "../../../theme/shadows";
const colors = theme.colors;
import { getFontStyle } from "../../../theme/fonts";
import TopBar from '../../../components/TopBar';
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";

type EnrollmentRow = {
  id: string;
  status: string;
  total_units: number;
  school_year: string;
  term: string;
  created_at: string;
};

export default function BalancePaymentScreen() {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = React.useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!profile?.id) { setLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from('class_enrollments')
        .select(`
          id,
          enrollment_status,
          enrolled_at,
          class_assignments!inner(
            subjects!inner(code, name, units)
          )
        `)
        .eq('student_id', profile.id)
        .order('enrolled_at', { ascending: false });

      if (data) setEnrollments(data.map((e: any) => ({
        id: e.id,
        status: e.enrollment_status,
        total_units: e.class_assignments?.subjects?.units ?? 0,
        school_year: '2025-2026',
        term: '1st Semester',
        created_at: e.enrolled_at,
      })));
      setLoading(false);
    };
    fetch();
  }, [profile?.id]);

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Balance Payment</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Enrollment Summary</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Ionicons name="cash-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.summaryHeaderText}>Account Summary</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Enrollments</Text>
                  <Text style={styles.summaryValue}>{enrollments.length}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Active</Text>
                  <Text style={styles.summaryPaid}>{enrollments.filter(e => e.status !== 'cancelled').length}</Text>
                </View>
              </View>

              {enrollments.length === 0 ? (
                <Text style={{ textAlign: 'center', color: '#6B7280', paddingVertical: 20 }}>No enrollment records found.</Text>
              ) : (
                <View style={styles.breakdownCard}>
                  <Text style={styles.breakdownTitle}>Enrollment History</Text>
                  {enrollments.map((e) => (
                    <View key={e.id} style={styles.breakdownRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.breakdownLabel}>{e.term} — {e.school_year}</Text>
                        <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>{formatDate(e.created_at)}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.breakdownValue}>{e.total_units} units</Text>
                        <View style={{ backgroundColor: e.status === 'approved' || e.status === 'paid' ? '#DCFCE7' : '#FEF3C7', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 }}>
                          <Text style={{ fontSize: 11, fontWeight: '700', color: e.status === 'approved' || e.status === 'paid' ? '#16A34A' : '#D97706' }}>{e.status}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.payButton} activeOpacity={0.9}>
                <Ionicons name="card-outline" size={20} color="#FFFFFF" />
                <Text style={styles.payButtonText}>Pay Balance</Text>
              </TouchableOpacity>
              <Text style={styles.noteText}>You can pay online using credit card, debit card, or online banking.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Payment Options</Text>
              <View style={styles.optionCard}>
                <View style={[styles.optionIconWrap, { backgroundColor: "#3B82F6" }]}><Ionicons name="card-outline" size={22} color="#FFFFFF" /></View>
                <View style={styles.optionTextWrap}><Text style={styles.optionTitle}>Credit/Debit Card</Text><Text style={styles.optionSubtitle}>Visa, Mastercard, JCB</Text></View>
              </View>
              <View style={styles.optionCard}>
                <View style={[styles.optionIconWrap, { backgroundColor: "#22C55E" }]}><Ionicons name="cash-outline" size={22} color="#FFFFFF" /></View>
                <View style={styles.optionTextWrap}><Text style={styles.optionTitle}>Online Banking</Text><Text style={styles.optionSubtitle}>BPI, BDO, Metrobank, UnionBank</Text></View>
              </View>
              <View style={styles.optionCard}>
                <View style={[styles.optionIconWrap, { backgroundColor: "#EAB308" }]}><Ionicons name="cash-outline" size={22} color="#FFFFFF" /></View>
                <View style={styles.optionTextWrap}><Text style={styles.optionTitle}>Over-the-Counter</Text><Text style={styles.optionSubtitle}>7-Eleven, Cebuana, MLhuillier</Text></View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#E5E7EB" },
  topBar: { height: 56, backgroundColor: "#0B0F14", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14 },
  topTitle: { fontSize: 14, ...getFontStyle('semiBold') },
  topAccent: { color: colors.primary },
  topWhite: { color: "#FFFFFF" },
  container: { padding: 16, paddingBottom: 28 },
  pageTitle: { fontSize: 20, ...getFontStyle('semiBold'), color: "#111827", marginBottom: 14 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#D1D5DB", ...shadows.card },
  sectionTitle: { fontSize: 16, ...getFontStyle('semiBold'), color: "#111827", marginBottom: 16 },
  summaryCard: { backgroundColor: "#374151", borderRadius: 18, padding: 20, marginBottom: 16 },
  summaryHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 10 },
  summaryHeaderText: { color: "#FFFFFF", fontSize: 16, ...getFontStyle('semiBold') },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  summaryLabel: { color: "#F3F4F6", fontSize: 15, ...getFontStyle('semiBold') },
  summaryValue: { color: "#FFFFFF", fontSize: 15, ...getFontStyle('semiBold') },
  summaryPaid: { color: "#22C55E", fontSize: 15, ...getFontStyle('semiBold') },
  balanceLabel: { color: "#FFFFFF", fontSize: 16, ...getFontStyle('semiBold') },
  balanceValue: { color: "#FFFFFF", fontSize: 18, ...getFontStyle('semiBold') },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.18)" },
  dueDateCard: { backgroundColor: "#FEF3C7", borderWidth: 1, borderColor: "#F59E0B", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  dueDateText: { color: "#374151", fontSize: 15, ...getFontStyle('semiBold') },
  dueDateBold: { ...getFontStyle('semiBold'), color: "#111827" },
  breakdownCard: { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16, marginBottom: 16 },
  breakdownTitle: { fontSize: 15, ...getFontStyle('semiBold'), color: "#111827", marginBottom: 16 },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  breakdownLabel: { color: "#6B7280", fontSize: 15, ...getFontStyle('semiBold') },
  breakdownValue: { color: "#111827", fontSize: 15, ...getFontStyle('semiBold') },
  payButton: { backgroundColor: "#F59E0B", borderRadius: 16, height: 58, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 },
  payButtonText: { color: "#FFFFFF", fontSize: 16, ...getFontStyle('semiBold') },
  noteText: { textAlign: "center", color: "#6B7280", fontSize: 14, lineHeight: 20, ...getFontStyle('semiBold') },
  optionCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 12 },
  optionIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  optionTextWrap: { flex: 1 },
  optionTitle: { color: "#111827", fontSize: 15, ...getFontStyle('semiBold'), marginBottom: 2 },
  optionSubtitle: { color: "#6B7280", fontSize: 14, ...getFontStyle('semiBold') },
});


