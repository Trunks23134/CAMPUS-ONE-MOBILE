import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { resolveTerm, TermResult } from '../../utils/termResolver';

const colors = theme.colors;

import TopBar from '../../components/TopBar';

type GradeRow = {
  code: string;
  subject: string;
  units: number;
  grade: string;
  remarks: string;
};

export default function ViewSemestralGradesScreen() {
  const nav = useNavigation<any>();
  const { profile } = useAuth();
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const [grades, setGrades] = React.useState<GradeRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  const termResult = resolveTerm();
  const currentTerm = !('code' in termResult)
    ? `${(termResult as TermResult).term}, AY ${(termResult as TermResult).schoolYear}`
    : 'AY 2025-2026';

  React.useEffect(() => {
    if (!profile?.id) { setLoading(false); return; }
    const fetch = async () => {
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', profile.id)
        .maybeSingle();
      if (!studentData) { setLoading(false); return; }

      const termResult = resolveTerm();
      if ('code' in termResult) { setLoading(false); return; }
      const { schoolYear, term } = termResult as TermResult;

      const { data } = await supabase
        .from('grades')
        .select('final_grade, remarks, subjects!inner(code, title, units)')
        .eq('student_id', studentData.id)
        .eq('school_year', schoolYear)
        .eq('term', term);

      if (data) {
        setGrades(data.map((row: any) => ({
          code: row.subjects?.code ?? '—',
          subject: row.subjects?.title ?? '—',
          units: row.subjects?.units ?? 0,
          grade: row.final_grade != null ? String(row.final_grade) : '—',
          remarks: row.remarks ?? '—',
        })));
      }
      setLoading(false);
    };
    fetch();
  }, [profile?.id]);

  const totalUnitsThisSemester = grades.reduce((sum, item) => sum + item.units, 0);
  const gwa = grades.length > 0
    ? (grades.reduce((s, g) => s + parseFloat(g.grade || '0'), 0) / grades.length).toFixed(2)
    : '—';

  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.screenWrap}>
          <Text style={styles.pageTitle}>View Semestral Grades</Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="ribbon-outline" size={20} color="#FFFFFF" />
              <Text style={styles.summaryHeaderText}>Student Summary</Text>
            </View>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Student Name</Text>
                <Text style={styles.summaryValue}>{profile?.full_name ?? '—'}</Text>
              </View>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Program</Text>
                <Text style={styles.summaryValue}>{profile?.program ?? '—'}</Text>
              </View>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Year Level</Text>
                <Text style={styles.summaryValue}>—</Text>
              </View>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Semester</Text>
                <Text style={styles.summaryValue}>{currentTerm}</Text>
              </View>
            </View>
          </View>

          <View style={styles.whiteCard}>
            <Text style={styles.cardTitle}>Semestral Grades</Text>

            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />
            ) : grades.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#6B7280', paddingVertical: 20 }}>No grades available yet.</Text>
            ) : (
              <>
                <View style={styles.tableHeader}>
                  <View style={styles.codeCol}><Text style={[styles.tableHeaderText, styles.leftHeaderText]}>Code</Text></View>
                  <View style={styles.nameCol}><Text style={[styles.tableHeaderText, styles.leftHeaderText]}>Subject</Text></View>
                  <View style={styles.unitsCol}><Text style={[styles.tableHeaderText, styles.centerHeaderText]}>Units</Text></View>
                  <View style={styles.gradeCol}><Text style={[styles.tableHeaderText, styles.centerHeaderText]}>Grade</Text></View>
                  <View style={styles.remarksCol}><Text style={[styles.tableHeaderText, styles.centerHeaderText]}>Remarks</Text></View>
                </View>

                {grades.map((item, index) => (
                  <View key={index} style={[styles.tableRow, index === grades.length - 1 && { borderBottomWidth: 1 }]}>
                    <View style={styles.codeCol}><Text style={[styles.tableCellText, styles.codeText]}>{item.code}</Text></View>
                    <View style={styles.nameCol}><Text style={[styles.tableCellText, styles.subjectText]} numberOfLines={compact ? 2 : 1} ellipsizeMode="tail">{item.subject}</Text></View>
                    <View style={styles.unitsCol}><Text style={[styles.tableCellText, styles.centerCellText]}>{item.units}</Text></View>
                    <View style={styles.gradeCol}>
                      <View style={[styles.gradeBadge, item.remarks === 'Failed' ? styles.gradeBadgeFailed : item.remarks === 'Incomplete' ? styles.gradeBadgeIncomplete : styles.gradeBadgePassed]}>
                        <Text style={[styles.gradeBadgeText, item.remarks === 'Failed' ? styles.gradeBadgeTextFailed : item.remarks === 'Incomplete' ? styles.gradeBadgeTextIncomplete : styles.gradeBadgeTextPassed]}>{item.grade}</Text>
                      </View>
                    </View>
                    <View style={styles.remarksCol}>
                      <View style={[styles.remarksBadge, item.remarks === 'Passed' ? styles.remarksBadgePassed : item.remarks === 'Failed' ? styles.remarksBadgeFailed : styles.remarksBadgeIncomplete]}>
                        <Text style={styles.remarksBadgeText}>{item.remarks}</Text>
                      </View>
                    </View>
                  </View>
                ))}

                <View style={styles.totalUnitsRow}>
                  <Text style={styles.totalUnitsLabel}>Total Units This Semester:</Text>
                  <Text style={styles.totalUnitsValue}>{totalUnitsThisSemester}</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.whiteCard}>
            <View style={styles.honorsHeader}>
              <Ionicons name="trending-up-outline" size={20} color={colors.primary} />
              <Text style={styles.cardTitle}>Latin Honors Eligibility</Text>
            </View>
            <View style={[styles.metricCard, styles.metricCardGold]}>
              <Text style={styles.metricLabel}>Current GWA</Text>
              <Text style={styles.metricValue}>{gwa}</Text>
            </View>
            <View style={[styles.metricCard, styles.metricCardBlue]}>
              <Text style={styles.metricLabel}>Total Units Completed</Text>
              <Text style={styles.metricValue}>{totalUnitsThisSemester}</Text>
            </View>
            <View style={[styles.metricCard, styles.metricCardGreen]}>
              <Text style={styles.metricLabel}>This Semester</Text>
              <Text style={styles.metricValue}>{totalUnitsThisSemester}</Text>
            </View>

            <View style={[styles.congratsCard, styles.congratsNotEligible]}>
              <Ionicons name="alert-circle-outline" size={24} color="#DC2626" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.congratsSmall, { color: '#DC2626' }]}>Advisory</Text>
                <Text style={[styles.congratsTitle, { color: '#DC2626' }]}>Check your grades</Text>
                <Text style={styles.congratsMessage}>
                  Latin Honors eligibility is determined by your cumulative GWA across all semesters.
                </Text>
              </View>
            </View>

            <View style={styles.requirementsCard}>
              <Text style={styles.requirementsTitle}>Latin Honors Requirements</Text>
              <View style={styles.requirementRow}>
                <Text style={styles.requirementLabel}>Summa Cum Laude</Text>
                <View style={[styles.requirementBadge, styles.summaBadge]}>
                  <Text style={styles.requirementBadgeText}>GWA ≤ 1.20</Text>
                </View>
              </View>
              <View style={styles.requirementRow}>
                <Text style={styles.requirementLabel}>Magna Cum Laude</Text>
                <View style={[styles.requirementBadge, styles.magnaBadge]}>
                  <Text style={styles.requirementBadgeText}>GWA 1.21 - 1.45</Text>
                </View>
              </View>
              <View style={styles.requirementRow}>
                <Text style={styles.requirementLabel}>Cum Laude</Text>
                <View style={[styles.requirementBadge, styles.cumBadge]}>
                  <Text style={styles.requirementBadgeText}>GWA 1.46 - 1.75</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },

  topBar: {
    height: 56,
    backgroundColor: '#0B0F14',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },

  topTitle: {
    color: 'white',
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  campusText: {
    color: colors.primary,
  },

  screenWrap: {
    padding: 14,
  },

  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 14,
  },

  summaryCard: {
    backgroundColor: '#374151',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },

  summaryHeaderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
    columnGap: 20,
  },

  summaryCol: {
    width: '46%',
  },

  summaryLabel: {
    color: '#E5E7EB',
    fontSize: 12.5,
    fontWeight: '500',
    marginBottom: 6,
  },

  summaryValue: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 20,
  },

  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingTop: 16,
    paddingBottom: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },

  tableHeaderText: {
    color: '#374151',
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 18,
  },

  leftHeaderText: {
    textAlign: 'left',
  },

  centerHeaderText: {
    textAlign: 'center',
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  tableCellText: {
    color: '#111827',
    fontSize: 12.8,
    fontWeight: '500',
    lineHeight: 20,
  },

  codeCol: {
    width: '16%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  nameCol: {
    width: '36%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 8,
  },

  unitsCol: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gradeCol: {
    width: '18%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  remarksCol: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  codeText: {
    fontWeight: '600',
    textAlign: 'left',
  },

  subjectText: {
    lineHeight: 20,
    textAlign: 'left',
  },

  centerCellText: {
    textAlign: 'center',
  },

  gradeBadge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gradeBadgePassed: {
    backgroundColor: '#DCFCE7',
  },

  gradeBadgeFailed: {
    backgroundColor: '#FEE2E2',
  },

  gradeBadgeIncomplete: {
    backgroundColor: '#FEF3C7',
  },

  gradeBadgeText: {
    fontSize: 12.5,
    fontWeight: '600',
  },

  gradeBadgeTextPassed: {
    color: '#16A34A',
  },

  gradeBadgeTextFailed: {
    color: '#DC2626',
  },

  gradeBadgeTextIncomplete: {
    color: '#D97706',
  },

  remarksBadge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },

  remarksBadgePassed: {
    backgroundColor: '#22C55E',
  },

  remarksBadgeFailed: {
    backgroundColor: '#DC2626',
  },

  remarksBadgeIncomplete: {
    backgroundColor: '#F59E0B',
  },

  remarksBadgeText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
  },

  totalUnitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  totalUnitsLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },

  totalUnitsValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },

  honorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 2,
  },

  metricCard: {
    marginHorizontal: 16,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 22,
    marginTop: 12,
  },

  metricCardGold: {
    backgroundColor: '#EAB308',
  },

  metricCardBlue: {
    backgroundColor: '#3B82F6',
  },

  metricCardGreen: {
    backgroundColor: '#22C55E',
  },

  metricLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },

  metricValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },

  congratsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    gap: 14,
  },

  congratsEligible: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },

  congratsNotEligible: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#DC2626',
  },

  congratsSmall: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },

  congratsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },

  congratsMessage: {
    color: '#1F2937',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },

  requirementsCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },

  requirementsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },

  requirementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  requirementLabel: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },

  requirementBadge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  summaBadge: {
    backgroundColor: '#EAB308',
  },

  magnaBadge: {
    backgroundColor: '#3B82F6',
  },

  cumBadge: {
    backgroundColor: '#22C55E',
  },

  requirementBadgeText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
});