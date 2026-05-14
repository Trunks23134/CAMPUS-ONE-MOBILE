import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme/colors';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import {
  fetchStudent, fetchOfferings, fetchCurriculumOfferings,
  submitEnrollment, isEnrollmentError, type SubjectOffering, type StudentRecord,
} from '../../../api/enrollment';
import TopBar from '../../../components/TopBar';
import Card from '../../../components/Card';

const colors = theme.colors;
type Mode = 'block' | 'manual';

export default function RegularPathEnrollmentScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { schoolYear, term } = route.params as { schoolYear: string; term: string };
  const { user } = useAuth();
  const { items, addItem, removeItem, totalUnits, clearCart } = useCart();

  const [mode, setMode] = useState<Mode>('block');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [blockOfferings, setBlockOfferings] = useState<SubjectOffering[]>([]);
  const [allOfferings, setAllOfferings] = useState<SubjectOffering[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState<{ enrollmentId: string; status: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      setLoadError(null);

      const studentResult = await fetchStudent(user.id);
      if (isEnrollmentError(studentResult)) {
        setLoadError(studentResult.message);
        setLoading(false);
        return;
      }
      setStudent(studentResult);

      // Load block schedule (curriculum-based) if program + year_level exist
      if (studentResult.program && studentResult.yearLevel) {
        const currResult = await fetchCurriculumOfferings(
          studentResult.program, studentResult.yearLevel, schoolYear, term,
        );
        if (!isEnrollmentError(currResult)) setBlockOfferings(currResult);
      }

      // Always load all offerings for manual mode
      const allResult = await fetchOfferings(schoolYear, term);
      if (!isEnrollmentError(allResult)) setAllOfferings(allResult);

      setLoading(false);
    };
    load();
  }, [user, schoolYear, term]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allOfferings;
    return allOfferings.filter((o) =>
      (o.subjectTitle + o.subjectCode + (o.instructor ?? '')).toLowerCase().includes(q),
    );
  }, [query, allOfferings]);

  const handleBlockConfirm = async () => {
    if (!student || blockOfferings.length === 0) return;
    setSubmitting(true);
    const result = await submitEnrollment(
      student.id, schoolYear, term, blockOfferings.map((o) => o.id),
    );
    setSubmitting(false);
    if (isEnrollmentError(result)) {
      Alert.alert('Enrollment Failed', result.code === 'ALREADY_ENROLLED'
        ? 'You are already enrolled for this term.' : result.message);
      return;
    }
    setSuccessModal({ enrollmentId: result.enrollmentId, status: result.status });
  };

  const handleManualSubmit = async () => {
    if (!student || items.length === 0) return;
    setSubmitting(true);
    const result = await submitEnrollment(
      student.id, schoolYear, term, items.map((i) => i.offeringId),
    );
    setSubmitting(false);
    setConfirmModal(false);
    if (isEnrollmentError(result)) {
      Alert.alert('Enrollment Failed', result.message);
      return;
    }
    clearCart();
    setSuccessModal({ enrollmentId: result.enrollmentId, status: result.status });
  };

  const blockTotal = blockOfferings.reduce((s, o) => s + o.units, 0);

  return (
    <View style={styles.page}>
      <TopBar />

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.wrap}>
          <Text style={styles.title}>Enrollment</Text>
          <Text style={styles.subtitle}>
            {student?.program ?? '—'} • Year {student?.yearLevel ?? '—'}
          </Text>

          {/* Mode toggle */}
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'block' && styles.toggleActive]}
              onPress={() => setMode('block')}
            >
              <Ionicons name="grid-outline" size={15} color={mode === 'block' ? '#fff' : '#6B7280'} />
              <Text style={[styles.toggleText, mode === 'block' && styles.toggleTextActive]}>
                Block Schedule
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'manual' && styles.toggleActive]}
              onPress={() => setMode('manual')}
            >
              <Ionicons name="list-outline" size={15} color={mode === 'manual' ? '#fff' : '#6B7280'} />
              <Text style={[styles.toggleText, mode === 'manual' && styles.toggleTextActive]}>
                Pick Subjects
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : loadError ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>{loadError}</Text>
            </View>
          ) : mode === 'block' ? (
            // ── BLOCK SCHEDULE MODE ──────────────────────────────────────
            <View style={styles.outerCard}>
              {blockOfferings.length === 0 ? (
                <View style={styles.centered}>
                  <Ionicons name="alert-circle-outline" size={36} color="#F59E0B" />
                  <Text style={{ color: '#6B7280', marginTop: 10, textAlign: 'center' }}>
                    No curriculum found for your program and year level.{'\n'}
                    Please use "Pick Subjects" mode or contact your adviser.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.summaryCard}>
                    <SummaryItem label="Courses" value={String(blockOfferings.length)} />
                    <SummaryItem label="Units" value={String(blockTotal)} />
                    <SummaryItem label="Section" value={blockOfferings[0]?.section ?? '—'} />
                  </View>

                  {blockOfferings.map((o, i) => (
                    <OfferingCard key={o.id} offering={o} last={i === blockOfferings.length - 1} />
                  ))}

                  <TouchableOpacity
                    style={[styles.primaryBtn, submitting && styles.btnDisabled]}
                    onPress={handleBlockConfirm}
                    disabled={submitting}
                    activeOpacity={0.9}
                  >
                    {submitting
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <Text style={styles.primaryBtnText}>Confirm Block Schedule</Text>}
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            // ── MANUAL PICK MODE ─────────────────────────────────────────
            <>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search subjects..."
                placeholderTextColor="#9CA3AF"
                style={styles.search}
              />

              <FlatList
                data={filtered}
                keyExtractor={(o) => o.id}
                scrollEnabled={false}
                renderItem={({ item }) => {
                  const added = items.some((i) => i.offeringId === item.id);
                  return (
                    <Card>
                      <View style={styles.subjectRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.subjectName}>{item.subjectTitle}</Text>
                          <Text style={styles.subjectMeta}>
                            {item.subjectCode} • {item.instructor ?? 'TBA'}
                          </Text>
                          <Text style={styles.subjectMeta}>
                            {item.schedule ?? 'TBA'} •{' '}
                            {item.slotsTotal - item.slotsTaken}/{item.slotsTotal} slots
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.addBtn,
                            added && styles.addedBtn,
                            item.isFull && !added && styles.fullBtn,
                          ]}
                          disabled={item.isFull && !added}
                          onPress={() => {
                            if (added) { removeItem(item.id); return; }
                            const r = addItem({
                              offeringId: item.id,
                              subjectCode: item.subjectCode,
                              subjectTitle: item.subjectTitle,
                              units: item.units,
                              schedule: item.schedule,
                              instructor: item.instructor,
                              section: item.section,
                            });
                            if (!r.success && r.error) Alert.alert('Cannot Add', r.error);
                          }}
                        >
                          <Text style={styles.addBtnText}>
                            {added ? '✓' : item.isFull ? '✕' : '+'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Card>
                  );
                }}
              />

              {/* Cart summary */}
              <Card style={styles.cartCard}>
                <Text style={styles.cartTitle}>Subject Cart</Text>
                {items.length === 0 ? (
                  <Text style={styles.emptyCart}>No subjects added yet.</Text>
                ) : (
                  items.map((ci) => (
                    <View key={ci.offeringId} style={styles.cartRow}>
                      <View>
                        <Text style={styles.cartCode}>{ci.subjectCode}</Text>
                        <Text style={styles.cartUnits}>{ci.units} units</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeItem(ci.offeringId)}>
                        <Text style={styles.removeText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
                <View style={styles.cartSummaryRow}>
                  <Text style={styles.cartSummaryLabel}>Total Units</Text>
                  <Text style={styles.cartSummaryValue}>{totalUnits} / 24</Text>
                </View>
                <TouchableOpacity
                  style={[styles.primaryBtn, items.length === 0 && styles.btnDisabled]}
                  disabled={items.length === 0}
                  onPress={() => setConfirmModal(true)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.primaryBtnText}>Submit for Review</Text>
                </TouchableOpacity>
                <Text style={styles.note}>Enrollment is subject to adviser approval.</Text>
              </Card>
            </>
          )}
        </View>
      </ScrollView>

      {/* Manual confirm modal */}
      <Modal visible={confirmModal} transparent animationType="fade"
        onRequestClose={() => !submitting && setConfirmModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Submit for Review</Text>
            <Text style={styles.modalMsg}>
              Submit {items.length} subject{items.length !== 1 ? 's' : ''} ({totalUnits} units)?
            </Text>
            <TouchableOpacity
              style={[styles.primaryBtn, submitting && styles.btnDisabled]}
              disabled={submitting}
              onPress={handleManualSubmit}
            >
              {submitting
                ? <ActivityIndicator size="small" color="#111827" />
                : <Text style={styles.primaryBtnText}>Submit</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} disabled={submitting}
              onPress={() => setConfirmModal(false)}>
              <Text style={styles.secondaryBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success modal */}
      <Modal visible={!!successModal} transparent animationType="fade"
        onRequestClose={() => { setSuccessModal(null); nav.goBack(); }}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Ionicons name="checkmark-circle" size={48} color="#22C55E" style={{ alignSelf: 'center', marginBottom: 10 }} />
            <Text style={styles.modalTitle}>Enrollment Submitted</Text>
            <Text style={styles.modalMsg}>
              Status: {successModal?.status}{'\n'}ID: {successModal?.enrollmentId}
            </Text>
            <TouchableOpacity style={styles.primaryBtn}
              onPress={() => { setSuccessModal(null); nav.goBack(); }}>
              <Text style={styles.primaryBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function OfferingCard({ offering, last }: { offering: SubjectOffering; last: boolean }) {
  return (
    <View style={[styles.courseCard, last && { marginBottom: 0 }]}>
      <View style={styles.courseTopRow}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.courseCode}>{offering.subjectCode}</Text>
          <Text style={styles.courseName}>{offering.subjectTitle}</Text>
        </View>
        <View style={styles.unitsPill}>
          <Text style={styles.unitsText}>{offering.units} Units</Text>
        </View>
      </View>
      <View style={styles.metaBlock}>
        <MetaRow icon="person-outline" text={offering.instructor ?? '—'} />
        <MetaRow icon="time-outline" text={offering.schedule ?? '—'} />
        <MetaRow icon="location-outline" text={offering.room ?? '—'} />
      </View>
      <View style={styles.courseDivider} />
      <Text style={styles.sectionText}>
        Section: <Text style={styles.sectionValue}>{offering.section}</Text>
      </Text>
    </View>
  );
}

function MetaRow({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.metaRow}>
      <Ionicons name={icon} size={16} color="#6B7280" style={{ marginRight: 8 }} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}:</Text>
      <Text style={styles.summaryValue}> {value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E7EB' },
  wrap: { margin: 14 },
  title: { fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 2 },
  subtitle: { fontSize: 13, color: '#6B7280', marginBottom: 14 },

  toggle: {
    flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12,
    padding: 4, marginBottom: 14, gap: 4,
  },
  toggleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 10,
  },
  toggleActive: { backgroundColor: colors.primary },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  toggleTextActive: { color: '#fff' },

  centered: { paddingVertical: 40, alignItems: 'center' },
  errorText: { color: '#EF4444', textAlign: 'center' },

  outerCard: {
    backgroundColor: '#fff', borderRadius: 18, borderWidth: 1,
    borderColor: '#D1D5DB', padding: 14, elevation: 2,
  },
  summaryCard: {
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 14, paddingVertical: 16, paddingHorizontal: 14,
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14,
  },
  summaryItem: { flexDirection: 'row', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  summaryValue: { fontSize: 13, color: '#111827', fontWeight: '600' },

  courseCard: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1,
  },
  courseTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  courseCode: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  courseName: { fontSize: 14, color: '#111827', fontWeight: '600', lineHeight: 20 },
  unitsPill: {
    backgroundColor: '#EAB308', borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center',
  },
  unitsText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  metaBlock: { marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  metaText: { fontSize: 13, color: '#6B7280' },
  courseDivider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 10 },
  sectionText: { fontSize: 13, color: '#6B7280' },
  sectionValue: { color: '#111827', fontWeight: '600' },

  search: {
    height: 44, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 10, paddingHorizontal: 12, marginBottom: 10, color: '#111827',
  },
  subjectRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  subjectName: { color: '#111827', fontWeight: '600' },
  subjectMeta: { color: '#6B7280', marginTop: 3, fontSize: 12.5 },
  addBtn: {
    width: 36, height: 36, borderRadius: 10, alignItems: 'center',
    justifyContent: 'center', backgroundColor: colors.primary,
  },
  addedBtn: { backgroundColor: '#10B981' },
  fullBtn: { backgroundColor: '#9CA3AF' },
  addBtnText: { color: '#fff', fontWeight: '900', fontSize: 18 },

  cartCard: { backgroundColor: '#0A1222', marginTop: 4 },
  cartTitle: { color: '#fff', fontWeight: '600', marginBottom: 10 },
  emptyCart: { color: '#D1D5DB', marginBottom: 10, fontSize: 12.5 },
  cartRow: {
    backgroundColor: '#111827', borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 10, marginBottom: 8, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  cartCode: { color: '#fff', fontWeight: '600', fontSize: 13.5 },
  cartUnits: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  removeText: { color: '#F87171', fontSize: 12.5, fontWeight: '600' },
  cartSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, marginBottom: 12 },
  cartSummaryLabel: { color: '#D1D5DB' },
  cartSummaryValue: { color: '#EAB308', fontWeight: '600' },
  note: { color: '#9CA3AF', marginTop: 8, fontSize: 12, textAlign: 'center' },

  primaryBtn: {
    height: 48, borderRadius: 12, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  btnDisabled: { opacity: 0.45 },
  primaryBtnText: { color: '#111827', fontWeight: '600', fontSize: 15 },
  secondaryBtn: {
    height: 48, borderRadius: 12, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
  },
  secondaryBtnText: { color: '#111827', fontWeight: '600', fontSize: 15 },

  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  modalCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 20,
  },
  modalTitle: { fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 8, textAlign: 'center' },
  modalMsg: { textAlign: 'center', color: '#6B7280', fontSize: 14, lineHeight: 22, marginBottom: 16 },
});



