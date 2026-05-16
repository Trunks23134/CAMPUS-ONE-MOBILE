import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { resolveTerm, getTermOptions } from '../../utils/termResolver';
import {
  fetchStudent, fetchEnrollmentStatus, isEnrollmentError,
  type EnrollmentStatus, type StudentRecord,
} from '../../api/enrollment';
import TopBar from '../../components/TopBar';

const colors = theme.colors;

export default function OnlineEnrollmentScreen() {
  const nav = useNavigation<any>();
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentStatus | null>(null);
  const [schoolYear, setSchoolYear] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [autoTerm, setAutoTerm] = useState('');
  const [termPickerVisible, setTermPickerVisible] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  const isIrregular = student?.status !== 'regular';
  const termOptions = getTermOptions(profile?.campus ?? null, isIrregular);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);

      // Resolve term from Manila time using campus type
      const termResult = resolveTerm(undefined, profile?.campus);
      if ('code' in termResult) {
        Alert.alert('Error', termResult.message);
        setLoading(false);
        return;
      }
      const { schoolYear: sy, term: t } = termResult;
      if (!cancelled) {
        setSchoolYear(sy);
        setAutoTerm(t);
        setSelectedTerm(''); // no pre-selection
      }

      if (!user?.id) {
        Alert.alert('Error', 'No authenticated user found.');
        setLoading(false);
        return;
      }

      const studentResult = await fetchStudent(user.id);
      console.log('fetchStudent result:', JSON.stringify(studentResult));
      if (isEnrollmentError(studentResult)) {
        if (!cancelled) {
          setLoading(false);
          // Show error visibly so we can debug
          Alert.alert('Student Lookup Failed', `Code: ${studentResult.code}\n${studentResult.message}\n\nUser ID: ${user.id}`);
        }
        return;
      }
      if (!cancelled) setStudent(studentResult);

      const statusResult = await fetchEnrollmentStatus(studentResult.id, sy, t);
      if (isEnrollmentError(statusResult)) {
        if (!cancelled) { Alert.alert('Error', statusResult.message); setLoading(false); }
        return;
      }
      if (!cancelled) { setEnrollment(statusResult); setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [user?.id, profile?.campus]);

  // Re-check enrollment when term changes
  const handleTermSelect = async (term: string) => {
    setTermPickerVisible(false);
    setSelectedTerm(term);
    if (!student) return;
    setCheckingEnrollment(true);
    const statusResult = await fetchEnrollmentStatus(student.id, schoolYear, term);
    setEnrollment(isEnrollmentError(statusResult) ? null : statusResult);
    setCheckingEnrollment(false);
  };

  const handleProceed = () => {
    if (!student) return;
    const params = { schoolYear, term: selectedTerm };
    if (student.status === 'regular') {
      nav.navigate('Regular Path Enrollment', params);
    } else {
      nav.navigate('Irregular Path Enrollment', params);
    }
  };

  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Online Enrollment</Text>
          <View style={styles.orangeLine} />

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading enrollment info…</Text>
            </View>
          ) : (
            <>
              <Text style={styles.subHeader}>Student Details</Text>
              <View style={styles.infoBox}>
                <Row label="Student Name" value={student ? `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim() : '—'} />
                <Row label="Student Number" value={student?.studentNumber ?? '—'} />
                <Row label="Program" value={student?.program ?? '—'} />
                <Row label="School Year" value={schoolYear ? `A.Y. ${schoolYear}` : '—'} />
                <Row label="Status" value={student?.status === 'regular' ? 'Regular' : 'Irregular'} isLast />
              </View>

              <Text style={styles.subHeader}>Select Term</Text>
              <View style={{ zIndex: 999 }}>
                <TouchableOpacity
                  style={styles.termSelector}
                  onPress={() => setTermPickerVisible(v => !v)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.termSelectorText, !selectedTerm && { color: '#9CA3AF' }]}>
                    {selectedTerm ? `A.Y. ${schoolYear}: ${selectedTerm}` : 'Select a term'}
                  </Text>
                  <Ionicons name={termPickerVisible ? 'chevron-up' : 'chevron-down'} size={16} color="#6B7280" />
                </TouchableOpacity>

                {termPickerVisible && (
                  <View style={styles.termListWrap}>
                    {termOptions.map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[styles.termOption, t === selectedTerm && styles.termOptionActive]}
                        onPress={() => handleTermSelect(t)}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.termOptionText, t === selectedTerm && styles.termOptionTextActive]}>
                          {`A.Y. ${schoolYear}: ${t}`}
                        </Text>
                        {t === selectedTerm && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>


              {checkingEnrollment ? (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 16 }} />
              ) : enrollment ? (
                <EnrollmentBanner enrollment={enrollment} />
              ) : (
                <>
                  <View style={styles.noteBox}>
                    <Text style={styles.noteText}>
                      You are eligible to enroll for A.Y. {schoolYear}: {selectedTerm}. Tap below to proceed.
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.primaryBtn, !student && styles.btnDisabled]}
                    activeOpacity={0.9}
                    onPress={handleProceed}
                    disabled={!student || !selectedTerm}
                  >
                    <Text style={styles.primaryText}>Proceed to Enrollment</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>

    </View>
  );
}

function EnrollmentBanner({ enrollment }: { enrollment: EnrollmentStatus }) {
  return (
    <View style={styles.bannerBox}>
      <View style={styles.bannerHeader}>
        <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
        <Text style={styles.bannerTitle}>Already Enrolled</Text>
      </View>
      <Text style={styles.bannerMeta}>Status: <Text style={styles.bannerBold}>{enrollment.status}</Text></Text>
      <Text style={styles.bannerMeta}>{enrollment.schoolYear} — {enrollment.term}</Text>
      <Text style={styles.bannerMeta}>Total Units: <Text style={styles.bannerBold}>{enrollment.totalUnits}</Text></Text>
      {enrollment.items.length > 0 && (
        <>
          <Text style={styles.subjectsLabel}>Enrolled Subjects</Text>
          {enrollment.items.map((item) => (
            <View key={item.offeringId} style={styles.subjectRow}>
              <Text style={styles.subjectCode}>{item.subjectCode}</Text>
              <Text style={styles.subjectTitle}>{item.subjectTitle}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
}

function Row({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <Text style={styles.rowL}>{label}</Text>
      <Text style={styles.rowR}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E7EB' },
  card: { backgroundColor: '#FFFFFF', margin: 14, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#111827' },
  orangeLine: { height: 6, width: 110, backgroundColor: colors.primary, borderRadius: 999, marginTop: 8, marginBottom: 4 },
  loadingBox: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  loadingText: { color: '#6B7280', fontSize: 13 },
  subHeader: { marginTop: 14, color: '#111827', fontWeight: '600', fontSize: 13, marginBottom: 6 },
  infoBox: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  rowLast: { borderBottomWidth: 0 },
  rowL: { color: '#757575', fontSize: 12.5, fontWeight: '500' },
  rowR: { color: '#111827', fontSize: 12.5, fontWeight: '600' },

  termSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, height: 44, backgroundColor: '#F9FAFB' },
  termSelectorText: { fontSize: 13, fontWeight: '600', color: '#111827' },
  termListWrap: {
    position: 'absolute',
    top: 46,
    left: 0,
    right: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  termList: { maxHeight: 200 },
  termOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  termOptionActive: { backgroundColor: '#FFF7ED' },
  termOptionText: { fontSize: 13, color: '#111827' },
  termOptionTextActive: { fontWeight: '800', color: '#111827' },

  noteBox: { backgroundColor: '#EFF6FF', borderRadius: 10, padding: 10, marginTop: 12 },
  noteText: { fontSize: 12.2, color: '#1F2937' },
  primaryBtn: { marginTop: 12, height: 44, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.45 },
  primaryText: { fontWeight: '600', color: '#fcfcfc' },

  bannerBox: { marginTop: 14, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0', backgroundColor: '#F0FDF4', padding: 14 },
  bannerHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: '#15803D' },
  bannerMeta: { fontSize: 12.5, color: '#374151', marginBottom: 2 },
  bannerBold: { fontWeight: '700' },
  subjectsLabel: { marginTop: 10, marginBottom: 4, fontSize: 12.5, fontWeight: '600', color: '#111827' },
  subjectRow: { flexDirection: 'row', gap: 8, paddingVertical: 5, borderTopWidth: 1, borderTopColor: '#D1FAE5' },
  subjectCode: { fontSize: 12, fontWeight: '700', color: '#065F46', minWidth: 70 },
  subjectTitle: { flex: 1, fontSize: 12, color: '#374151' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  pickerCard: { width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 20, maxHeight: '60%' },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  pickerTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
});
