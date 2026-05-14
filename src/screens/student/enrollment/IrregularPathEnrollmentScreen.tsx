import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../../components/Card';
import { theme } from '../../../theme/colors';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useNotifications } from '../../../context/NotificationsContext';
import { supabase } from '../../../lib/supabase';
import {
  fetchStudent,
  fetchOfferings,
  submitEnrollment,
  isEnrollmentError,
  SubjectOffering,
} from '../../../api/enrollment';

const colors = theme.colors;

import TopBar from '../../../components/TopBar';

export default function IrregularPathEnrollmentScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { schoolYear, term } = route.params as { schoolYear: string; term: string };

  const { user } = useAuth();
  const { items, addItem, removeItem, totalUnits, clearCart } = useCart();
  const { refresh: refreshNotifications } = useNotifications();

  const [query, setQuery] = useState('');
  const [offerings, setOfferings] = useState<SubjectOffering[]>([]);
  const [loadingOfferings, setLoadingOfferings] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ enrollmentId: string; status: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchStudent(user.id).then((result) => {
      if (!isEnrollmentError(result)) {
        setStudentId(result.id);
      }
    });
  }, [user]);

  useEffect(() => {
    setLoadingOfferings(true);
    fetchOfferings(schoolYear, term).then((result) => {
      if (!isEnrollmentError(result)) {
        setOfferings(result);
      }
      setLoadingOfferings(false);
    });
  }, [schoolYear, term]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return offerings;
    return offerings.filter((item) =>
      (item.subjectTitle + item.subjectCode + (item.instructor ?? '')).toLowerCase().includes(q),
    );
  }, [query, offerings]);

  const handleSubmit = async () => {
    if (!studentId || items.length === 0) return;
    setSubmitting(true);
    const result = await submitEnrollment(
      studentId,
      schoolYear,
      term,
      items.map((i) => i.offeringId),
    );
    setSubmitting(false);
    setReviewModalVisible(false);
    if (isEnrollmentError(result)) {
      Alert.alert('Enrollment Failed', result.message);
    } else {
      // Push a notification so it appears in the notifications screen
      if (user?.id) {
        await supabase.from('notifications').insert({
          profile_id: user.id,
          title: 'Enrollment Under Review',
          body: `Your enrollment request for ${term}, AY ${schoolYear} has been submitted and is currently under review. You will be notified once it is approved.`,
          is_read: false,
        });
        refreshNotifications();
      }
      setConfirmModal({ enrollmentId: result.enrollmentId, status: result.status });
      clearCart();
    }
  };

  return (
    <View style={styles.page}>
      <TopBar />

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Subject Drafter</Text>
          <Text style={styles.subtitle}>
            For irregular students, shiftees, transferees, and returnees.
          </Text>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search subjects..."
            style={styles.search}
            placeholderTextColor="#9CA3AF"
          />

          {loadingOfferings ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const added = items.some((i) => i.offeringId === item.id);
                const slotsText = `${item.slotsTotal - item.slotsTaken} / ${item.slotsTotal} slots available`;
                return (
                  <Card>
                    <View style={styles.subjectRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.subjectName}>{item.subjectTitle}</Text>
                        <Text style={styles.subjectMeta}>
                          {item.subjectCode} • {item.instructor ?? 'TBA'}
                        </Text>
                        <Text style={styles.subjectMeta}>
                          {item.schedule ?? 'TBA'} • {slotsText}
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
                          if (added) {
                            removeItem(item.id);
                          } else {
                            addItem({
                              offeringId: item.id,
                              subjectCode: item.subjectCode,
                              subjectTitle: item.subjectTitle,
                              units: item.units,
                              schedule: item.schedule,
                              instructor: item.instructor,
                              section: item.section,
                            });
                          }
                        }}
                      >
                        <Text style={styles.addBtnText}>{added ? '✓' : item.isFull ? '✕' : '+'}</Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                );
              }}
            />
          )}

          <Card style={styles.cartCard}>
            <Text style={styles.cartTitle}>Subject Cart</Text>

            {items.length === 0 ? (
              <Text style={styles.emptyCartText}>No subjects added yet.</Text>
            ) : (
              items.map((cartItem) => (
                <View key={cartItem.offeringId} style={styles.selectedRow}>
                  <View>
                    <Text style={styles.selectedCode}>{cartItem.subjectCode}</Text>
                    <Text style={styles.selectedUnits}>{cartItem.units} units</Text>
                  </View>

                  <TouchableOpacity onPress={() => removeItem(cartItem.offeringId)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            <Row label="Total Subjects" value={String(items.length)} />
            <Row label="Total Units" value={String(totalUnits)} accent />
            <Row label="Unit Limit" value="24" />

            <TouchableOpacity
              style={[
                styles.submitBtn,
                items.length === 0 && styles.submitBtnDisabled,
              ]}
              disabled={items.length === 0}
              onPress={() => setReviewModalVisible(true)}
            >
              <Text style={styles.submitText}>Submit for Review</Text>
            </TouchableOpacity>

            <Text style={styles.note}>Enrollment is subject to advisor approval.</Text>
          </Card>
        </View>
      </ScrollView>

      {/* Review confirmation modal */}
      <Modal
        visible={reviewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !submitting && setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Submit for Review</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to submit {items.length} subject{items.length !== 1 ? 's' : ''} ({totalUnits} units)?
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, submitting && styles.submitBtnDisabled]}
              disabled={submitting}
              onPress={handleSubmit}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#111827" />
              ) : (
                <Text style={styles.modalButtonText}>Submit</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryButton}
              disabled={submitting}
              onPress={() => setReviewModalVisible(false)}
            >
              <Text style={styles.modalSecondaryText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success confirmation modal */}
      <Modal
        visible={!!confirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="time-outline" size={44} color="#2563EB" style={{ alignSelf: 'center', marginBottom: 8 }} />
            <Text style={styles.modalTitle}>Request Submitted</Text>
            <Text style={styles.modalMessage}>
              Your enrollment request is now under review. We'll notify you once it's been approved.
            </Text>

            <View style={styles.inProgressBadge}>
              <Ionicons name="ellipse" size={8} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.inProgressText}>In Progress</Text>
            </View>

            {confirmModal && (
              <Text style={styles.enrollmentIdText}>
                Enrollment ID: {confirmModal.enrollmentId}
              </Text>
            )}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => { setConfirmModal(null); nav.navigate('Notifications'); }}
            >
              <Text style={styles.modalButtonText}>View Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryButton}
              onPress={() => setConfirmModal(null)}
            >
              <Text style={styles.modalSecondaryText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.cartRow}>
      <Text style={styles.cartRowLabel}>{label}</Text>
      <Text style={[styles.cartRowValue, accent && { color: '#EAB308' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E7EB' },

  topBar: {
    height: 56,
    backgroundColor: '#0B0F14',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },

  topTitle: { color: 'white', fontWeight: '800', letterSpacing: 0.3 },
  campusText: { color: colors.primary },

  contentContainer: { marginHorizontal: 14 },

  title: { fontSize: 18, fontWeight: '600', color: '#181818' },

  subtitle: {
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 10,
    fontSize: 12.5,
  },

  search: {
    height: 44,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  subjectRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },

  subjectName: { color: '#111827', fontWeight: '600' },

  subjectMeta: { color: '#6B7280', marginTop: 4, fontSize: 12.5 },

  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },

  addedBtn: { backgroundColor: '#10B981' },

  fullBtn: { backgroundColor: '#9CA3AF' },

  addBtnText: { color: '#fff', fontWeight: '900', fontSize: 18 },

  cartCard: { backgroundColor: '#0A1222' },

  cartTitle: { color: '#fff', fontWeight: '600', marginBottom: 10 },

  emptyCartText: { color: '#D1D5DB', marginBottom: 10, fontSize: 12.5 },

  selectedRow: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectedCode: { color: '#FFFFFF', fontWeight: '600', fontSize: 13.5 },

  selectedUnits: { color: '#9CA3AF', fontSize: 12, marginTop: 3 },

  removeText: { color: '#F87171', fontSize: 12.5, fontWeight: '600' },

  cartRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },

  cartRowLabel: { color: '#D1D5DB' },

  cartRowValue: { color: '#fff', fontWeight: '600' },

  submitBtn: {
    marginTop: 12,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitBtnDisabled: { opacity: 0.45 },

  submitText: { color: '#111827', fontWeight: '600' },

  note: { color: '#9CA3AF', marginTop: 8, fontSize: 12 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },

  modalTitle: { fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 8 },

  modalMessage: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },

  inProgressBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  inProgressText: { color: '#2563EB', fontWeight: '600', fontSize: 13 },

  enrollmentIdText: { color: '#6B7280', fontSize: 11.5, marginBottom: 14 },

  modalButton: {
    width: '100%',
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  modalButtonText: { color: '#111827', fontWeight: '600', fontSize: 14 },

  modalSecondaryButton: {
    width: '100%',
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  modalSecondaryText: { color: '#111827', fontWeight: '600', fontSize: 14 },
});



