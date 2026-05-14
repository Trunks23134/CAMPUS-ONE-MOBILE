import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  FlatList, ActivityIndicator, Alert, ScrollView, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../theme/colors';
import { shadows } from '../../../theme/shadows';
import { resolveTerm } from '../../../utils/termResolver';
import { fetchOfferings, isEnrollmentError, SubjectOffering, fetchStudent, submitEnrollment } from '../../../api/enrollment';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';import { supabase } from '../../../lib/supabase';
import TopBar from '../../../components/TopBar';

const colors = theme.colors;

// Pastel banner colors cycling per card
const BANNER_COLORS = ['#E9D5FF', '#BFDBFE', '#BBF7D0', '#FED7AA', '#FBCFE8', '#DDD6FE'];

export default function BrowseSubjectsScreen() {
  const nav = useNavigation<any>();
  const { user, profile } = useAuth();
  const { items, totalUnits, addItem, removeItem, clearCart, hasItem } = useCart();

  const [q, setQ] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [offerings, setOfferings] = useState<SubjectOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'search' | 'cart'>('search');
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [schoolYear, setSchoolYear] = useState('');
  const [term, setTerm] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    fetchStudent(user.id).then((r) => { if (!isEnrollmentError(r)) setStudentId(r.id); });
  }, [user?.id]);

  useEffect(() => {
    const termResult = resolveTerm();
    if ('code' in termResult) return;
    setSchoolYear(termResult.schoolYear);
    setTerm(termResult.term);

    fetchOfferings(termResult.schoolYear, termResult.term).then((r) => {
      if (!isEnrollmentError(r)) setOfferings(r);
      setLoading(false);
    });
  }, []);

  // Realtime slot updates
  useEffect(() => {
    const channel = supabase
      .channel('browse_slots')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'subject_offerings' }, (payload) => {
        const u = payload.new as { id: string; slots_taken: number; slots_total: number };
        setOfferings((prev) => prev.map((o) =>
          o.id === u.id ? { ...o, slotsTaken: u.slots_taken, isFull: u.slots_taken >= u.slots_total } : o
        ));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const dropdownResults = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s || s.length < 2) return [];
    return offerings.filter((x) =>
      (x.subjectTitle + x.subjectCode + (x.instructor ?? '')).toLowerCase().includes(s)
    ).slice(0, 5);
  }, [q, offerings]);

  const handleSubmit = async () => {
    if (!studentId || items.length === 0) return;
    setSubmitting(true);
    const result = await submitEnrollment(studentId, schoolYear, term, items.map((i) => i.offeringId));
    setSubmitting(false);
    setConfirmModal(false);
    if (isEnrollmentError(result)) {
      Alert.alert('Enrollment Failed', result.message);
    } else {
      clearCart();
      Alert.alert('Submitted', `Enrollment ID: ${result.enrollmentId}`);
      setView('search');
    }
  };

  const unitsProgress = Math.min((totalUnits / 24) * 100, 100);

  return (
    <View style={styles.page}>
      <TopBar />

      {view === 'search' ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.wrap}>
            {/* Header */}
            <Text style={styles.welcome}>Welcome, {profile?.full_name ?? 'Student'}</Text>
            <Text style={styles.welcomeSub}>Find and enroll in your subjects</Text>

            {/* Current Enrollment card */}
            <View style={styles.enrollCard}>
              <View style={styles.enrollRow}>
                <Text style={styles.enrollLabel}>Current Enrollment</Text>
                <View style={styles.inProgressBadge}>
                  <Text style={styles.inProgressText}>In Progress</Text>
                </View>
              </View>
              <Text style={styles.enrollUnits}>{totalUnits}</Text>
              <Text style={styles.enrollUnitsSub}>units selected</Text>
              <Text style={styles.enrollMeta}>Maximum: 24 units • Remaining: {24 - totalUnits} units</Text>
            </View>

            {/* Search bar with dropdown */}
            <View style={{ zIndex: 10 }}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={16} color="#9CA3AF" />
                <TextInput
                  value={q}
                  onChangeText={(t) => { setQ(t); setShowDropdown(t.trim().length >= 2); }}
                  placeholder="Search subjects..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.searchInput}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                />
                {q.length > 0 && (
                  <TouchableOpacity onPress={() => { setQ(''); setShowDropdown(false); }}>
                    <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>

              {showDropdown && dropdownResults.length > 0 && (
                <View style={styles.dropdown}>
                  <Text style={styles.dropdownCount}>{dropdownResults.length} results found</Text>
                  {dropdownResults.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.dropdownRow}
                      onPress={() => {
                        const r = addItem({
                          offeringId: item.id, subjectCode: item.subjectCode,
                          subjectTitle: item.subjectTitle, units: item.units,
                          schedule: item.schedule, instructor: item.instructor, section: item.section,
                        });
                        if (!r.success && r.error) Alert.alert('Cannot Add', r.error);
                        setShowDropdown(false); setQ('');
                      }}
                    >
                      <View style={styles.dropdownIcon}>
                        <Ionicons name="book-outline" size={14} color={colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.dropdownTitle} numberOfLines={1}>{item.subjectTitle}</Text>
                        <Text style={styles.dropdownMeta}>{item.subjectCode} • {item.section}</Text>
                        {item.schedule && <Text style={styles.dropdownMeta}>{item.schedule} • {item.instructor ?? 'TBA'}</Text>}
                      </View>
                      <Text style={styles.dropdownUnits}>{item.units} units</Text>
                      <Text style={styles.dropdownSlots}>{item.slotsTotal - item.slotsTaken}/{item.slotsTotal} slots</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Filter row */}
            <View style={styles.filterRow}>
              <Ionicons name="funnel-outline" size={15} color="#6B7280" />
              <Text style={styles.filterText}>All Departments</Text>
              <Ionicons name="chevron-down" size={15} color="#6B7280" style={{ marginLeft: 'auto' }} />
            </View>

            {/* Available subjects */}
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Available Subjects</Text>
              <Text style={styles.sectionCount}>{loading ? '…' : `${offerings.length} results`}</Text>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
              offerings.map((item, index) => {
                const inCart = hasItem(item.id);
                const slotsLeft = item.slotsTotal - item.slotsTaken;
                const lowSlots = slotsLeft <= 5 && slotsLeft > 0;
                return (
                  <View key={item.id} style={styles.subjectCard}>
                    <View style={[styles.cardBanner, { backgroundColor: BANNER_COLORS[index % BANNER_COLORS.length] }]} />
                    <View style={styles.cardBody}>
                      <View style={styles.cardRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cardTitle}>{item.subjectTitle}</Text>
                          <Text style={styles.cardCode}>{item.subjectCode}</Text>
                          {item.schedule && (
                            <View style={styles.metaRow}>
                              <Ionicons name="time-outline" size={13} color="#6B7280" />
                              <Text style={styles.metaText}>{item.schedule}</Text>
                            </View>
                          )}
                          {item.instructor && (
                            <View style={styles.metaRow}>
                              <Ionicons name="person-outline" size={13} color="#6B7280" />
                              <Text style={styles.metaText}>{item.instructor}</Text>
                            </View>
                          )}
                          <View style={styles.metaRow}>
                            <Ionicons name="people-outline" size={13} color={lowSlots ? '#EF4444' : '#6B7280'} />
                            <Text style={[styles.metaText, lowSlots && { color: '#EF4444', fontWeight: '700' }]}>
                              {slotsLeft} / {item.slotsTotal} slots available
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={[styles.addBtn, inCart && styles.addBtnAdded, item.isFull && !inCart && styles.addBtnFull]}
                          disabled={item.isFull && !inCart}
                          onPress={() => {
                            if (inCart) { removeItem(item.id); return; }
                            const r = addItem({
                              offeringId: item.id, subjectCode: item.subjectCode,
                              subjectTitle: item.subjectTitle, units: item.units,
                              schedule: item.schedule, instructor: item.instructor, section: item.section,
                            });
                            if (!r.success && r.error) Alert.alert('Cannot Add', r.error);
                          }}
                        >
                          <Ionicons name={inCart ? 'checkmark' : item.isFull ? 'close' : 'add'} size={20} color="#fff" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.unitsRow}>
                        <Text style={styles.unitsLabel}>Units</Text>
                        <Text style={styles.unitsValue}>{item.units}</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      ) : (
        // ── CART VIEW ──────────────────────────────────────────────────────
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.wrap}>
            <TouchableOpacity style={styles.backRow} onPress={() => setView('search')}>
              <Ionicons name="arrow-back" size={16} color="#6B7280" />
              <Text style={styles.backText}>Back to Search</Text>
            </TouchableOpacity>

            <Text style={styles.cartTitle}>Subject Cart</Text>
            <Text style={styles.cartSub}>Review your selected subjects before enrolling</Text>

            {items.length === 0 ? (
              <View style={styles.emptyCart}>
                <Ionicons name="cart-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptySub}>Add subjects from the search page to get started</Text>
                <TouchableOpacity style={styles.browseBtn} onPress={() => setView('search')}>
                  <Text style={styles.browseBtnText}>Browse Subjects</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {items.map((ci) => (
                  <View key={ci.offeringId} style={styles.cartItem}>
                    <View style={styles.cartItemRow}>
                      <Text style={styles.cartItemTitle} numberOfLines={1}>{ci.subjectTitle}</Text>
                      <TouchableOpacity onPress={() => removeItem(ci.offeringId)} hitSlop={8}>
                        <Ionicons name="close" size={18} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.cartItemCode}>{ci.subjectCode}</Text>
                    {ci.schedule && (
                      <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={13} color="#6B7280" />
                        <Text style={styles.metaText}>{ci.schedule}</Text>
                      </View>
                    )}
                    {ci.instructor && (
                      <View style={styles.metaRow}>
                        <Ionicons name="person-outline" size={13} color="#6B7280" />
                        <Text style={styles.metaText}>{ci.instructor}</Text>
                      </View>
                    )}
                    <View style={styles.unitsRow}>
                      <Text style={styles.unitsLabel}>Units</Text>
                      <Text style={styles.unitsValue}>{ci.units}</Text>
                    </View>
                  </View>
                ))}

                {/* Enrollment Summary */}
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Enrollment Summary</Text>
                  <View style={styles.sumRow}>
                    <Text style={styles.sumLabel}>Total Subjects</Text>
                    <Text style={styles.sumValue}>{items.length}</Text>
                  </View>
                  <View style={styles.sumRow}>
                    <Text style={styles.sumLabel}>Total Units</Text>
                    <Text style={[styles.sumValue, { color: colors.primary }]}>{totalUnits}</Text>
                  </View>
                  <View style={styles.sumRow}>
                    <Text style={styles.sumLabel}>Units Limit</Text>
                    <Text style={styles.sumValue}>24 units</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${unitsProgress}%` as any }]} />
                  </View>
                  <View style={{ marginTop: 10 }}>
                    {['Review your selected subjects carefully', 'Enrollment is subject to slot availability', 'Changes can be made during add/drop period'].map((t) => (
                      <View key={t} style={styles.bulletRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.confirmBtn} onPress={() => setConfirmModal(true)} activeOpacity={0.9}>
                  <Text style={styles.confirmText}>Confirm Enrollment</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      )}

      {/* Cart FAB */}
      {view === 'search' && items.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={() => setView('cart')} activeOpacity={0.9}>
          <Ionicons name="cart" size={22} color="#111827" />
          <View style={styles.fabBadge}>
            <Text style={styles.fabBadgeText}>{items.length}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Confirm modal */}
      <Modal visible={confirmModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Enrollment</Text>
            <Text style={styles.modalSub}>
              Submit {items.length} subject{items.length !== 1 ? 's' : ''} ({totalUnits} units) for enrollment?
            </Text>
            <TouchableOpacity
              style={[styles.confirmBtn, submitting && { opacity: 0.6 }]}
              onPress={handleSubmit} disabled={submitting} activeOpacity={0.9}
            >
              {submitting ? <ActivityIndicator size="small" color="#111827" /> : <Text style={styles.confirmText}>Submit</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setConfirmModal(false)} disabled={submitting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F3F4F6' },
  wrap: { padding: 14 },

  welcome: { fontSize: 20, fontWeight: '900', color: '#111827' },
  welcomeSub: { color: '#6B7280', fontSize: 13, marginBottom: 12 },

  enrollCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  enrollRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  enrollLabel: { fontWeight: '700', color: '#111827', fontSize: 13 },
  inProgressBadge: { backgroundColor: '#DBEAFE', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  inProgressText: { color: '#2563EB', fontWeight: '700', fontSize: 11 },
  enrollUnits: { fontSize: 28, fontWeight: '900', color: '#111827' },
  enrollUnitsSub: { color: '#6B7280', fontSize: 12 },
  enrollMeta: { color: '#9CA3AF', fontSize: 11.5, marginTop: 4 },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, height: 44, gap: 8 },
  searchInput: { flex: 1, color: '#111827', fontSize: 13.5 },

  dropdown: { backgroundColor: '#0B0F14', borderRadius: 10, marginTop: 4, overflow: 'hidden', elevation: 8 },
  dropdownCount: { color: '#9CA3AF', fontSize: 11.5, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 },
  dropdownRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#1F2937' },
  dropdownIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center' },
  dropdownTitle: { color: '#fff', fontWeight: '700', fontSize: 13 },
  dropdownMeta: { color: '#9CA3AF', fontSize: 11.5, marginTop: 1 },
  dropdownUnits: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  dropdownSlots: { color: '#6B7280', fontSize: 11, marginLeft: 6 },

  filterRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, height: 42, gap: 8, marginTop: 10 },
  filterText: { color: '#111827', fontWeight: '700', fontSize: 13 },

  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 10 },
  sectionTitle: { fontWeight: '900', color: '#111827', fontSize: 15 },
  sectionCount: { color: '#6B7280', fontSize: 12.5 },

  subjectCard: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  cardBanner: { height: 80 },
  cardBody: { padding: 14 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardTitle: { fontWeight: '900', color: '#111827', fontSize: 15, marginBottom: 2 },
  cardCode: { color: '#6B7280', fontSize: 12.5, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  metaText: { color: '#6B7280', fontSize: 12.5 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  addBtnAdded: { backgroundColor: '#22C55E' },
  addBtnFull: { backgroundColor: '#9CA3AF' },
  unitsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  unitsLabel: { color: '#6B7280', fontSize: 12.5 },
  unitsValue: { fontWeight: '900', color: '#111827', fontSize: 14 },

  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  backText: { color: '#6B7280', fontSize: 13 },
  cartTitle: { fontSize: 22, fontWeight: '900', color: '#111827' },
  cartSub: { color: '#6B7280', fontSize: 13, marginBottom: 14 },

  emptyCart: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontWeight: '900', color: '#111827', marginTop: 12, fontSize: 16 },
  emptySub: { color: '#6B7280', fontSize: 13, marginTop: 6, textAlign: 'center' },
  browseBtn: { marginTop: 16, backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  browseBtnText: { fontWeight: '700', color: '#111827' },

  cartItem: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  cartItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cartItemTitle: { fontWeight: '900', color: '#111827', flex: 1, marginRight: 8 },
  cartItemCode: { color: '#6B7280', fontSize: 12.5, marginTop: 2 },

  summaryCard: { backgroundColor: '#0B1220', borderRadius: 14, padding: 16, marginTop: 4 },
  summaryTitle: { color: '#fff', fontWeight: '900', fontSize: 15, marginBottom: 12 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  sumLabel: { color: '#D1D5DB', fontSize: 13 },
  sumValue: { color: '#fff', fontWeight: '700', fontSize: 13 },
  progressBar: { height: 6, backgroundColor: '#1F2937', borderRadius: 999, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 999 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  bullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#6B7280' },
  bulletText: { color: '#9CA3AF', fontSize: 12 },

  confirmBtn: { marginTop: 14, height: 48, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  confirmText: { fontWeight: '900', color: '#111827', fontSize: 15 },
  cancelBtn: { marginTop: 10, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontWeight: '700', color: '#374151' },

  fab: { position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...shadows.fab },
  fabBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', borderRadius: 999, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  fabBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  modalTitle: { fontWeight: '900', color: '#111827', fontSize: 16, textAlign: 'center' },
  modalSub: { color: '#6B7280', fontSize: 13, textAlign: 'center', marginTop: 8, marginBottom: 4 },
});



