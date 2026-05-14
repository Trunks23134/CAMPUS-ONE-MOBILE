import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme/colors';
import TopBar from '../../../components/TopBar';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { fetchStudent, isEnrollmentError } from '../../../api/enrollment';

const colors = theme.colors;

type GradeRow = {
  subjectCode: string;
  subjectTitle: string;
  units: number;
  grade: number;
  remarks: string;
  schoolYear: string;
  term: string;
};

type HonorsInfo = {
  label: string;
  color: string;
  bg: string;
  border: string;
  emoji: string;
  message: string;
};

function getHonors(gwa: number): HonorsInfo | null {
  if (gwa <= 1.20) return {
    label: 'Summa Cum Laude',
    color: '#92400E', bg: '#FEF3C7', border: '#F59E0B',
    emoji: '🏆',
    message: "You're graduating as Summa Cum Laude! Outstanding academic excellence.",
  };
  if (gwa <= 1.45) return {
    label: 'Magna Cum Laude',
    color: '#1E3A8A', bg: '#DBEAFE', border: '#3B82F6',
    emoji: '🎖️',
    message: "You're graduating as Magna Cum Laude! Exceptional academic achievement.",
  };
  if (gwa <= 1.75) return {
    label: 'Cum Laude',
    color: '#14532D', bg: '#DCFCE7', border: '#22C55E',
    emoji: '🎓',
    message: "You're graduating as Cum Laude! Great academic performance.",
  };
  return null;
}

export default function GraduationScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [studentName, setStudentName] = useState('');
  const [program, setProgram] = useState('');
  const [yearLevel, setYearLevel] = useState<number | null>(null);
  const [isFinalYear, setIsFinalYear] = useState(false);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    const load = async () => {
      const studentResult = await fetchStudent(user.id);
      if (isEnrollmentError(studentResult)) { setLoading(false); return; }

      setStudentName(`${studentResult.firstName ?? ''} ${studentResult.lastName ?? ''}`.trim());
      setProgram(studentResult.program ?? '');
      setYearLevel(studentResult.yearLevel);

      // Detect final year: year_level >= 4 for most programs (adjust as needed)
      setIsFinalYear((studentResult.yearLevel ?? 0) >= 4);

      // Fetch all grades
      const { data } = await supabase
        .from('grades')
        .select('final_grade, remarks, school_year, term, subjects!inner(code, title, units)')
        .eq('student_id', studentResult.id)
        .not('final_grade', 'is', null);

      if (data) {
        setGrades(data.map((row: any) => ({
          subjectCode: row.subjects?.code ?? '—',
          subjectTitle: row.subjects?.title ?? '—',
          units: row.subjects?.units ?? 0,
          grade: parseFloat(row.final_grade),
          remarks: row.remarks ?? '—',
          schoolYear: row.school_year,
          term: row.term,
        })));
      }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const passedGrades = grades.filter((g) => g.remarks !== 'Failed' && !isNaN(g.grade));
  const totalUnits = passedGrades.reduce((s, g) => s + g.units, 0);
  const weightedSum = passedGrades.reduce((s, g) => s + g.grade * g.units, 0);
  const gwa = totalUnits > 0 ? weightedSum / totalUnits : null;
  const honors = gwa !== null ? getHonors(gwa) : null;

  // Group grades by school year + term
  const grouped = grades.reduce<Record<string, GradeRow[]>>((acc, g) => {
    const key = `${g.schoolYear} — ${g.term}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(g);
    return acc;
  }, {});

  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
        ) : (
          <View style={styles.wrap}>

            {/* Hero banner */}
            <View style={styles.hero}>
              <Text style={styles.heroEmoji}>🎓</Text>
              <Text style={styles.heroTitle}>Graduation Status</Text>
              <Text style={styles.heroName}>{studentName || 'Student'}</Text>
              <Text style={styles.heroProgram}>{program}</Text>
              {yearLevel && (
                <View style={styles.yearBadge}>
                  <Text style={styles.yearBadgeText}>Year {yearLevel}</Text>
                </View>
              )}
            </View>

            {/* Honors card — only show if final year */}
            {isFinalYear && gwa !== null ? (
              honors ? (
                <View style={[styles.honorsCard, { backgroundColor: honors.bg, borderColor: honors.border }]}>
                  <Text style={styles.honorsEmoji}>{honors.emoji}</Text>
                  <Text style={[styles.honorsLabel, { color: honors.color }]}>{honors.label}</Text>
                  <Text style={[styles.honorsMessage, { color: honors.color }]}>{honors.message}</Text>
                  <View style={[styles.gwaBadge, { backgroundColor: honors.border }]}>
                    <Text style={styles.gwaBadgeText}>GWA: {gwa.toFixed(2)}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.noHonorsCard}>
                  <Ionicons name="school-outline" size={32} color="#6B7280" />
                  <Text style={styles.noHonorsTitle}>Graduating Student</Text>
                  <Text style={styles.noHonorsMsg}>
                    Congratulations on completing your program! Your GWA of {gwa.toFixed(2)} does not qualify for Latin Honors, but your achievement is still worth celebrating.
                  </Text>
                  <View style={styles.gwaBadgeGray}>
                    <Text style={styles.gwaBadgeGrayText}>GWA: {gwa.toFixed(2)}</Text>
                  </View>
                </View>
              )
            ) : !isFinalYear ? (
              <View style={styles.notYetCard}>
                <Ionicons name="time-outline" size={28} color="#F59E0B" />
                <Text style={styles.notYetTitle}>Not Yet Eligible</Text>
                <Text style={styles.notYetMsg}>
                  Graduation eligibility is determined in your final year. Keep up the great work!
                </Text>
                {gwa !== null && (
                  <View style={styles.gwaBadgeGray}>
                    <Text style={styles.gwaBadgeGrayText}>Current GWA: {gwa.toFixed(2)}</Text>
                  </View>
                )}
              </View>
            ) : null}

            {/* GWA summary */}
            {gwa !== null && (
              <View style={styles.summaryRow}>
                <SummaryCard label="GWA" value={gwa.toFixed(2)} color={colors.primary} />
                <SummaryCard label="Subjects" value={String(passedGrades.length)} color="#3B82F6" />
                <SummaryCard label="Total Units" value={String(totalUnits)} color="#22C55E" />
              </View>
            )}

            {/* Latin Honors scale */}
            <View style={styles.scaleCard}>
              <Text style={styles.scaleTitle}>Latin Honors Scale</Text>
              <ScaleRow label="Summa Cum Laude" range="GWA ≤ 1.20" color="#F59E0B" active={honors?.label === 'Summa Cum Laude'} />
              <ScaleRow label="Magna Cum Laude" range="GWA 1.21 – 1.45" color="#3B82F6" active={honors?.label === 'Magna Cum Laude'} />
              <ScaleRow label="Cum Laude" range="GWA 1.46 – 1.75" color="#22C55E" active={honors?.label === 'Cum Laude'} />
            </View>

            {/* Grade history */}
            {Object.keys(grouped).length > 0 && (
              <View style={styles.historyCard}>
                <Text style={styles.historyTitle}>Grade History</Text>
                {Object.entries(grouped).map(([period, rows]) => (
                  <View key={period} style={styles.periodBlock}>
                    <Text style={styles.periodLabel}>{period}</Text>
                    {rows.map((g, i) => (
                      <View key={i} style={styles.gradeRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.gradeCode}>{g.subjectCode}</Text>
                          <Text style={styles.gradeTitle} numberOfLines={1}>{g.subjectTitle}</Text>
                        </View>
                        <Text style={styles.gradeUnits}>{g.units}u</Text>
                        <View style={[styles.gradePill, { backgroundColor: g.remarks === 'Failed' ? '#FEE2E2' : '#DCFCE7' }]}>
                          <Text style={[styles.gradePillText, { color: g.remarks === 'Failed' ? '#DC2626' : '#16A34A' }]}>
                            {g.grade.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {grades.length === 0 && (
              <View style={styles.emptyCard}>
                <Ionicons name="document-outline" size={36} color="#D1D5DB" />
                <Text style={styles.emptyText}>No grade records found yet.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.summaryCard, { borderTopColor: color }]}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function ScaleRow({ label, range, color, active }: { label: string; range: string; color: string; active: boolean }) {
  return (
    <View style={[styles.scaleRow, active && { backgroundColor: '#F9FAFB' }]}>
      <View style={[styles.scaleBar, { backgroundColor: color }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.scaleLabel, active && { fontWeight: '900' }]}>{label}</Text>
        <Text style={styles.scaleRange}>{range}</Text>
      </View>
      {active && <Ionicons name="checkmark-circle" size={18} color={color} />}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F3F4F6' },
  wrap: { padding: 14 },

  hero: { backgroundColor: '#0B0F14', borderRadius: 18, padding: 24, alignItems: 'center', marginBottom: 14 },
  heroEmoji: { fontSize: 40, marginBottom: 8 },
  heroTitle: { color: '#9CA3AF', fontSize: 13, fontWeight: '600', letterSpacing: 1 },
  heroName: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 4 },
  heroProgram: { color: '#9CA3AF', fontSize: 13, marginTop: 4 },
  yearBadge: { marginTop: 10, backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5 },
  yearBadgeText: { color: '#111827', fontWeight: '700', fontSize: 12 },

  honorsCard: { borderRadius: 16, borderWidth: 2, padding: 20, alignItems: 'center', marginBottom: 14 },
  honorsEmoji: { fontSize: 44, marginBottom: 8 },
  honorsLabel: { fontSize: 22, fontWeight: '900', textAlign: 'center' },
  honorsMessage: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  gwaBadge: { marginTop: 14, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6 },
  gwaBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  noHonorsCard: { backgroundColor: '#F9FAFB', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 20, alignItems: 'center', marginBottom: 14 },
  noHonorsTitle: { fontSize: 18, fontWeight: '900', color: '#111827', marginTop: 10 },
  noHonorsMsg: { color: '#6B7280', fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  gwaBadgeGray: { marginTop: 12, backgroundColor: '#E5E7EB', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5 },
  gwaBadgeGrayText: { color: '#374151', fontWeight: '700', fontSize: 12 },

  notYetCard: { backgroundColor: '#FFFBEB', borderRadius: 16, borderWidth: 1, borderColor: '#FCD34D', padding: 20, alignItems: 'center', marginBottom: 14 },
  notYetTitle: { fontSize: 16, fontWeight: '900', color: '#92400E', marginTop: 8 },
  notYetMsg: { color: '#78350F', fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 20 },

  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  summaryCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center', borderTopWidth: 3, elevation: 1 },
  summaryValue: { fontSize: 22, fontWeight: '900' },
  summaryLabel: { color: '#6B7280', fontSize: 12, marginTop: 4 },

  scaleCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, elevation: 1 },
  scaleTitle: { fontWeight: '900', color: '#111827', fontSize: 15, marginBottom: 12 },
  scaleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 10, marginBottom: 4 },
  scaleBar: { width: 4, height: 36, borderRadius: 2 },
  scaleLabel: { color: '#111827', fontSize: 13.5, fontWeight: '600' },
  scaleRange: { color: '#6B7280', fontSize: 12, marginTop: 2 },

  historyCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, elevation: 1 },
  historyTitle: { fontWeight: '900', color: '#111827', fontSize: 15, marginBottom: 12 },
  periodBlock: { marginBottom: 14 },
  periodLabel: { color: colors.primary, fontWeight: '700', fontSize: 12.5, marginBottom: 8 },
  gradeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  gradeCode: { fontWeight: '700', color: '#111827', fontSize: 12.5 },
  gradeTitle: { color: '#6B7280', fontSize: 12, marginTop: 1 },
  gradeUnits: { color: '#9CA3AF', fontSize: 12, minWidth: 24, textAlign: 'center' },
  gradePill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  gradePillText: { fontWeight: '700', fontSize: 12 },

  emptyCard: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
});



