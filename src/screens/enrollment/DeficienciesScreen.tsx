import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/colors';
const colors = theme.colors;
import TopBar from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { fetchStudent, isEnrollmentError } from '../../api/enrollment';
import { supabase } from '../../lib/supabase';
import { resolveTerm } from '../../utils/termResolver';

type Deficiency = { subjectCode: string; subjectTitle: string; grade: string; remarks: string };

export default function DeficienciesScreen() {
  const { user } = useAuth();
  const [deficiencies, setDeficiencies] = useState<Deficiency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    const load = async () => {
      const studentResult = await fetchStudent(user.id);
      if (isEnrollmentError(studentResult)) { setLoading(false); return; }

      const termResult = resolveTerm();
      if ('code' in termResult) { setLoading(false); return; }
      const { schoolYear, term } = termResult;

      const { data } = await supabase
        .from('grades')
        .select('final_grade, remarks, subjects!inner(code, title)')
        .eq('student_id', studentResult.id)
        .eq('school_year', schoolYear)
        .eq('term', term)
        .in('remarks', ['Failed', 'Incomplete']);

      if (data) {
        setDeficiencies(data.map((row: any) => ({
          subjectCode: row.subjects?.code ?? '—',
          subjectTitle: row.subjects?.title ?? '—',
          grade: row.final_grade != null ? String(row.final_grade) : '—',
          remarks: row.remarks ?? '—',
        })));
      }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 30 }}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Ionicons name="alert-circle-outline" size={26} color="#F59E0B" />
            <Text style={styles.title}>Deficiencies</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />
          ) : deficiencies.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.iconCircle}>
                <Ionicons name="checkmark" size={34} color="#22C55E" />
              </View>
              <Text style={styles.emptyTitle}>No deficiencies found</Text>
              <Text style={styles.emptySubtitle}>You have met all academic requirements</Text>
            </View>
          ) : (
            <View>
              <View style={styles.irregularHeaderBox}>
                <Text style={styles.irregularHeaderTitle}>Outstanding Deficiencies</Text>
                <Text style={styles.irregularHeaderSub}>
                  The following items must be resolved before full enrollment clearance.
                </Text>
              </View>

              {deficiencies.map((item, index) => (
                <View key={index} style={styles.deficiencyCard}>
                  <View style={styles.deficiencyTopRow}>
                    <Text style={styles.deficiencyTitle}>{item.subjectCode} — {item.subjectTitle}</Text>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusPillText}>{item.remarks}</Text>
                    </View>
                  </View>
                  <Text style={styles.deficiencyDescription}>Grade: {item.grade}</Text>
                </View>
              ))}

              <View style={styles.noticeBox}>
                <Ionicons name="information-circle-outline" size={18} color="#F59E0B" />
                <Text style={styles.noticeText}>
                  Please coordinate with your adviser or registrar to resolve these deficiencies.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E7EB' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', padding: 18, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  title: { fontSize: 18, fontWeight: '600', color: '#111827' },
  emptyState: { backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#22C55E', borderRadius: 20, paddingVertical: 28, paddingHorizontal: 20, alignItems: 'center' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 5, borderColor: '#22C55E', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, fontWeight: '500', color: '#6B7280', textAlign: 'center' },
  irregularHeaderBox: { backgroundColor: '#FEF3C7', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#FCD34D' },
  irregularHeaderTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 6 },
  irregularHeaderSub: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  deficiencyCard: { borderWidth: 1, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', borderRadius: 14, padding: 14, marginBottom: 10 },
  deficiencyTopRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 8 },
  deficiencyTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111827' },
  statusPill: { backgroundColor: '#DC2626', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, alignSelf: 'flex-start' },
  statusPillText: { color: '#FFFFFF', fontSize: 11.5, fontWeight: '600' },
  deficiencyDescription: { fontSize: 13, color: '#6B7280', lineHeight: 19, fontWeight: '500' },
  noticeBox: { marginTop: 8, backgroundColor: '#FFF7ED', borderRadius: 12, borderWidth: 1, borderColor: '#FDBA74', padding: 12, flexDirection: 'row', gap: 8 },
  noticeText: { flex: 1, fontSize: 13, color: '#7C2D12', lineHeight: 19, fontWeight: '500' },
});
