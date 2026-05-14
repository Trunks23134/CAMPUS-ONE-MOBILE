import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  TextInput, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Tab = 'registrations' | 'records' | 'notifications';

type AlumniRecord = {
  log_id: string; actor_uuid: string; full_name: string; email: string;
  graduation_year: number; academic_unit: string; program: string;
  is_legacy_registration: boolean; action_type: string; status_code: number; created_at: string;
};

type RecordRequest = {
  log_id: string; actor_uuid: string; document_type: string;
  fee_amount: number; payment_status: string; created_at: string;
};

const MOCK_ALUMNI: AlumniRecord[] = [
  { log_id: '1', actor_uuid: 'uuid-001', full_name: 'Juan dela Cruz', email: 'juan@example.com', graduation_year: 2023, academic_unit: 'College of Information and Computing Sciences', program: 'BS Information Systems', is_legacy_registration: false, action_type: 'alumni.registration.submitted.v1', status_code: 100, created_at: new Date().toISOString() },
  { log_id: '2', actor_uuid: 'uuid-002', full_name: 'Maria Santos', email: 'maria@example.com', graduation_year: 2019, academic_unit: 'Faculty of Engineering', program: 'BS Civil Engineering', is_legacy_registration: true, action_type: 'alumni.registration.submitted.v1', status_code: 100, created_at: new Date(Date.now() - 86400000).toISOString() },
  { log_id: '3', actor_uuid: 'uuid-003', full_name: 'Pedro Reyes', email: 'pedro@example.com', graduation_year: 2024, academic_unit: 'College of Nursing', program: 'BS Nursing', is_legacy_registration: false, action_type: 'alumni.graduation.verified.v1', status_code: 100, created_at: new Date(Date.now() - 172800000).toISOString() },
];

const MOCK_REQUESTS: RecordRequest[] = [
  { log_id: 'r1', actor_uuid: 'uuid-001', document_type: 'TOR', fee_amount: 150, payment_status: 'PENDING', created_at: new Date().toISOString() },
  { log_id: 'r2', actor_uuid: 'uuid-002', document_type: 'DIPLOMA', fee_amount: 200, payment_status: 'PAID', created_at: new Date(Date.now() - 3600000).toISOString() },
  { log_id: 'r3', actor_uuid: 'uuid-003', document_type: 'GOOD_MORAL', fee_amount: 100, payment_status: 'PENDING', created_at: new Date(Date.now() - 7200000).toISOString() },
];

interface Props { onLogout: () => void; }

export default function AlumniAdminScreen({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('registrations');
  const [search, setSearch] = useState('');

  const filtered = MOCK_ALUMNI.filter((a) =>
    `${a.full_name} ${a.email} ${a.academic_unit}`.toLowerCase().includes(search.toLowerCase())
  );

  const tabLabel = activeTab === 'registrations' ? 'Alumni Registrations'
    : activeTab === 'records' ? 'Record Requests' : 'Notifications';

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.logoMark}><Text style={s.logoMarkText}>C1</Text></View>
          <Text style={s.headerTitle}>{tabLabel}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={s.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={s.statsRow}>
        <View style={s.stat}>
          <Text style={s.statVal}>{MOCK_ALUMNI.length}</Text>
          <Text style={s.statLabel}>Total Alumni</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.statVal}>{MOCK_REQUESTS.filter(r => r.payment_status === 'PENDING').length}</Text>
          <Text style={s.statLabel}>Pending Requests</Text>
        </View>
        <View style={s.stat}>
          <Text style={[s.statVal, { color: '#F5A623' }]}>{MOCK_ALUMNI.filter(a => a.is_legacy_registration).length}</Text>
          <Text style={s.statLabel}>Legacy</Text>
        </View>
      </View>

      {/* Tab bar */}
      <View style={s.tabBar}>
        {(['registrations', 'records', 'notifications'] as Tab[]).map((t) => (
          <TouchableOpacity key={t} style={[s.tab, activeTab === t && s.tabActive]} onPress={() => setActiveTab(t)}>
            <Text style={[s.tabText, activeTab === t && s.tabTextActive]}>
              {t === 'registrations' ? '👤 Alumni' : t === 'records' ? '📄 Records' : '🔔 Notifs'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={s.content} contentContainerStyle={s.contentPad}>
        {/* Registrations */}
        {activeTab === 'registrations' && (
          <>
            <TextInput
              style={s.searchInput}
              placeholder="Search by name, email, or unit…"
              placeholderTextColor="#555"
              value={search}
              onChangeText={setSearch}
            />
            {filtered.map((a) => (
              <View key={a.log_id} style={s.card}>
                <View style={s.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardName}>{a.full_name}</Text>
                    <Text style={s.cardSub}>{a.email}</Text>
                  </View>
                  <Badge label={a.is_legacy_registration ? 'Legacy' : 'Standard'} color={a.is_legacy_registration ? '#a78bfa' : '#818cf8'} bg={a.is_legacy_registration ? 'rgba(139,92,246,0.12)' : 'rgba(99,102,241,0.12)'} />
                </View>
                <Text style={s.cardUnit}>{a.academic_unit}</Text>
                <View style={s.cardRow}>
                  <Text style={s.cardMeta}>Grad: {a.graduation_year}</Text>
                  <Badge label={a.status_code === 100 ? '100 OK' : '501 Error'} color={a.status_code === 100 ? '#4ade80' : '#f87171'} bg={a.status_code === 100 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'} />
                </View>
                <Text style={s.cardEvent}>{a.action_type}</Text>
                <Text style={s.cardDate}>{new Date(a.created_at).toLocaleDateString()}</Text>
              </View>
            ))}
          </>
        )}

        {/* Record Requests */}
        {activeTab === 'records' && MOCK_REQUESTS.map((r) => (
          <View key={r.log_id} style={s.card}>
            <View style={s.cardRow}>
              <Badge label={r.document_type} color="#38bdf8" bg="rgba(14,165,233,0.12)" />
              <Badge label={r.payment_status} color={r.payment_status === 'PAID' ? '#4ade80' : '#F5A623'} bg={r.payment_status === 'PAID' ? 'rgba(34,197,94,0.12)' : 'rgba(245,166,35,0.12)'} />
            </View>
            <Text style={s.cardMeta}>Actor: {r.actor_uuid}</Text>
            <Text style={s.cardMeta}>Fee: ₱{r.fee_amount}</Text>
            <Text style={s.cardEvent}>alumni.record.requested.v1</Text>
            <Text style={s.cardDate}>{new Date(r.created_at).toLocaleDateString()}</Text>
          </View>
        ))}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <>
            <NotifItem icon="🎓" title="Graduation event received" body="actor_uuid: uuid-003 — graduation.verified.v1 processed. Alumni log created." time="Just now" type="info" />
            <NotifItem icon="📋" title="Legacy verification pending" body="Maria Santos (uuid-002) submitted a legacy registration. Manual identity verification required." time="1 day ago" type="warning" />
            <NotifItem icon="✅" title="New alumni registered" body="Juan dela Cruz successfully registered via standard student ID verification." time="2 hours ago" type="success" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View style={[s.badge, { backgroundColor: bg }]}>
      <Text style={[s.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

function NotifItem({ icon, title, body, time, type }: { icon: string; title: string; body: string; time: string; type: 'info' | 'warning' | 'success' }) {
  const borderColor = type === 'info' ? 'rgba(14,165,233,0.2)' : type === 'warning' ? 'rgba(245,166,35,0.2)' : 'rgba(34,197,94,0.2)';
  const bg = type === 'info' ? 'rgba(14,165,233,0.05)' : type === 'warning' ? 'rgba(245,166,35,0.05)' : 'rgba(34,197,94,0.05)';
  return (
    <View style={[s.notifCard, { borderColor, backgroundColor: bg }]}>
      <Text style={s.notifIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.notifTitle}>{title}</Text>
        <Text style={s.notifBody}>{body}</Text>
        <Text style={s.notifTime}>{time}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    backgroundColor: '#111', height: 56, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#1f1f1f',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { backgroundColor: '#F5A623', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  logoMarkText: { color: '#111', fontWeight: '800', fontSize: 13 },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  logoutBtn: { padding: 8 },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#111',
    borderBottomWidth: 1, borderBottomColor: '#1f1f1f', paddingVertical: 12,
  },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#111',
    borderBottomWidth: 1, borderBottomColor: '#1f1f1f',
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#F5A623' },
  tabText: { fontSize: 12, color: '#666', fontWeight: '500' },
  tabTextActive: { color: '#F5A623', fontWeight: '700' },
  content: { flex: 1 },
  contentPad: { padding: 16 },
  searchInput: {
    backgroundColor: '#111', borderWidth: 1.5, borderColor: '#2a2a2a',
    borderRadius: 10, padding: 11, fontSize: 13, color: '#fff', marginBottom: 12,
  },
  card: {
    backgroundColor: '#111', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#1f1f1f',
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  cardSub: { fontSize: 11, color: '#666', marginTop: 1 },
  cardUnit: { fontSize: 12, color: '#888', marginBottom: 6 },
  cardMeta: { fontSize: 12, color: '#888', marginBottom: 4 },
  cardEvent: { fontSize: 11, color: '#555', fontFamily: 'monospace', marginBottom: 2 },
  cardDate: { fontSize: 11, color: '#555' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  notifCard: {
    flexDirection: 'row', gap: 12, padding: 16, borderRadius: 12,
    borderWidth: 1, marginBottom: 10, alignItems: 'flex-start',
  },
  notifIcon: { fontSize: 22 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 },
  notifBody: { fontSize: 12, color: '#888', lineHeight: 18, marginBottom: 4 },
  notifTime: { fontSize: 11, color: '#555' },
});
