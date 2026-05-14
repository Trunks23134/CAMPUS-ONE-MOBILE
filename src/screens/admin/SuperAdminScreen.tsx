import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Tab = 'dashboard' | 'services' | 'users' | 'tenants';
type ModuleStatus = 'online' | 'degraded' | 'offline';

const MOCK_HEALTH = [
  { module: 'alumni', status: 'online' as ModuleStatus, port: 3002, version: '1.0.0' },
  { module: 'enrollment', status: 'online' as ModuleStatus, port: 3001, version: '1.0.0' },
  { module: 'application', status: 'online' as ModuleStatus, port: 3003, version: '1.0.0' },
  { module: 'graduation', status: 'degraded' as ModuleStatus, port: 3004, version: '1.0.0' },
];

const MOCK_USERS = [
  { id: 'su-001', full_name: 'Super Admin', email: 'super@campus-one.edu', role: 'SUPER_ADMIN', tenant_id: 'global', status: 'active' },
  { id: 'aa-001', full_name: 'Alumni Admin', email: 'alumni.admin@campus-one.edu', role: 'ALUMNI_ADMIN', tenant_id: 'campus-one', status: 'active' },
  { id: 'sa-001', full_name: 'Student Admin', email: 'student.admin@campus-one.edu', role: 'STUDENT_ADMIN', tenant_id: 'campus-one', status: 'active' },
  { id: 'aa-002', full_name: 'Applicant Admin', email: 'app.admin@campus-one.edu', role: 'APPLICANT_ADMIN', tenant_id: 'campus-one', status: 'suspended' },
];

const KAFKA_TOPICS = [
  { topic: 'graduation.verified.v1', module: 'graduation → alumni', desc: 'Triggers alumni log creation and push notification' },
  { topic: 'enrollment.subject.selected.v1', module: 'enrollment', desc: 'Student adds subject to cart' },
  { topic: 'enrollment.checkout.submitted.v1', module: 'enrollment', desc: 'Enrollment confirmed button clicked' },
  { topic: 'alumni.registration.submitted.v1', module: 'alumni', desc: 'Alumni registration submitted' },
  { topic: 'alumni.record.requested.v1', module: 'alumni', desc: 'Document request submitted' },
  { topic: 'auth.user.login.v1', module: 'auth', desc: 'User login attempt' },
];

interface Props { onLogout: () => void; }

export default function SuperAdminScreen({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const statusColor = (s: ModuleStatus) =>
    s === 'online' ? '#4ade80' : s === 'degraded' ? '#F5A623' : '#f87171';
  const statusBg = (s: ModuleStatus) =>
    s === 'online' ? 'rgba(34,197,94,0.12)' : s === 'degraded' ? 'rgba(245,166,35,0.12)' : 'rgba(239,68,68,0.12)';

  const tabLabel = activeTab === 'dashboard' ? 'System Overview'
    : activeTab === 'services' ? 'Microservice Health'
    : activeTab === 'users' ? 'Admin Users' : 'Tenant Management';

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.logoMark}><Text style={s.logoMarkText}>C1</Text></View>
          <View>
            <Text style={s.headerTitle}>Campus One</Text>
            <Text style={s.headerSub}>Super Admin</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onLogout} style={s.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabScroll} contentContainerStyle={s.tabBar}>
        {(['dashboard', 'services', 'users', 'tenants'] as Tab[]).map((t) => (
          <TouchableOpacity key={t} style={[s.tab, activeTab === t && s.tabActive]} onPress={() => setActiveTab(t)}>
            <Text style={[s.tabText, activeTab === t && s.tabTextActive]}>
              {t === 'dashboard' ? '🏠 Dashboard' : t === 'services' ? '⚙️ Services' : t === 'users' ? '👥 Users' : '🏫 Tenants'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={s.content} contentContainerStyle={s.contentPad}>
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            <View style={s.kpiGrid}>
              <KpiCard icon="⚙️" val={`${MOCK_HEALTH.filter(h => h.status === 'online').length}/${MOCK_HEALTH.length}`} label="Services Online" accent />
              <KpiCard icon="👥" val={String(MOCK_USERS.filter(u => u.status === 'active').length)} label="Active Admins" />
              <KpiCard icon="🏫" val="1" label="Tenants" />
              <KpiCard icon="⚠️" val={String(MOCK_HEALTH.filter(h => h.status === 'degraded').length)} label="Degraded" warn />
            </View>

            <Text style={s.sectionTitle}>Service Status</Text>
            {MOCK_HEALTH.map((svc) => (
              <View key={svc.module} style={[s.serviceCard, { borderColor: statusBg(svc.status) }]}>
                <View style={s.serviceRow}>
                  <Text style={s.serviceName}>{svc.module}</Text>
                  <View style={[s.badge, { backgroundColor: statusBg(svc.status) }]}>
                    <Text style={[s.badgeText, { color: statusColor(svc.status) }]}>{svc.status}</Text>
                  </View>
                </View>
                <Text style={s.serviceMeta}>Port: {svc.port} · v{svc.version}</Text>
                <Text style={s.serviceEndpoint}>/api/v1/{svc.module}/health</Text>
              </View>
            ))}

            <Text style={s.sectionTitle}>Event Bus Topics (Kafka)</Text>
            {KAFKA_TOPICS.map((t) => (
              <View key={t.topic} style={s.topicCard}>
                <Text style={s.topicName}>{t.topic}</Text>
                <Text style={s.topicModule}>{t.module}</Text>
                <Text style={s.topicDesc}>{t.desc}</Text>
              </View>
            ))}
          </>
        )}

        {/* Services */}
        {activeTab === 'services' && MOCK_HEALTH.map((svc) => (
          <View key={svc.module} style={s.card}>
            <View style={s.serviceRow}>
              <Text style={s.serviceName}>{svc.module}</Text>
              <View style={[s.badge, { backgroundColor: statusBg(svc.status) }]}>
                <Text style={[s.badgeText, { color: statusColor(svc.status) }]}>{svc.status}</Text>
              </View>
            </View>
            <Text style={s.serviceMeta}>Port: {svc.port} · v{svc.version}</Text>
            <Text style={s.serviceEndpoint}>/api/v1/{svc.module}/health</Text>
          </View>
        ))}

        {/* Users */}
        {activeTab === 'users' && MOCK_USERS.map((u) => (
          <View key={u.id} style={s.card}>
            <View style={s.serviceRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.userName}>{u.full_name}</Text>
                <Text style={s.userEmail}>{u.email}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: u.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)' }]}>
                <Text style={[s.badgeText, { color: u.status === 'active' ? '#4ade80' : '#f87171' }]}>{u.status}</Text>
              </View>
            </View>
            <Text style={s.userRole}>{u.role}</Text>
            <Text style={s.serviceMeta}>Tenant: {u.tenant_id}</Text>
          </View>
        ))}

        {/* Tenants */}
        {activeTab === 'tenants' && (
          <View style={s.tenantCard}>
            <View style={s.serviceRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.tenantName}>Campus One (UST)</Text>
                <Text style={s.serviceMeta}>tenant_id: campus-one</Text>
              </View>
              <View style={s.tenantBadges}>
                <View style={[s.badge, { backgroundColor: 'rgba(34,197,94,0.12)' }]}>
                  <Text style={[s.badgeText, { color: '#4ade80' }]}>active</Text>
                </View>
                <View style={[s.badge, { backgroundColor: 'rgba(99,102,241,0.12)' }]}>
                  <Text style={[s.badgeText, { color: '#818cf8' }]}>enterprise</Text>
                </View>
              </View>
            </View>
            <Text style={s.modulesLabel}>Enabled Modules:</Text>
            <View style={s.modulesList}>
              {['alumni', 'enrollment', 'application', 'graduation'].map((m) => (
                <View key={m} style={s.moduleTag}>
                  <Text style={s.moduleTagText}>{m}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function KpiCard({ icon, val, label, accent, warn }: { icon: string; val: string; label: string; accent?: boolean; warn?: boolean }) {
  return (
    <View style={[s.kpi, accent && s.kpiAccent, warn && s.kpiWarn]}>
      <Text style={s.kpiIcon}>{icon}</Text>
      <Text style={[s.kpiVal, accent && { color: '#F5A623' }, warn && { color: '#f87171' }]}>{val}</Text>
      <Text style={s.kpiLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },
  header: {
    backgroundColor: '#0f0f0f', height: 60, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { backgroundColor: '#F5A623', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  logoMarkText: { color: '#111', fontWeight: '800', fontSize: 13 },
  headerTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  headerSub: { color: '#F5A623', fontSize: 11, fontWeight: '600' },
  logoutBtn: { padding: 8 },
  tabScroll: { maxHeight: 48, backgroundColor: '#0f0f0f', borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  tabBar: { flexDirection: 'row', paddingHorizontal: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 14 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#F5A623' },
  tabText: { fontSize: 13, color: '#555', fontWeight: '500' },
  tabTextActive: { color: '#F5A623', fontWeight: '700' },
  content: { flex: 1 },
  contentPad: { padding: 16 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  kpi: {
    width: '47%', backgroundColor: '#111', borderRadius: 14,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a',
  },
  kpiAccent: { borderColor: 'rgba(245,166,35,0.2)', backgroundColor: 'rgba(245,166,35,0.04)' },
  kpiWarn: { borderColor: 'rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.04)' },
  kpiIcon: { fontSize: 24, marginBottom: 6 },
  kpiVal: { fontSize: 28, fontWeight: '800', color: '#fff' },
  kpiLabel: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#ccc', marginBottom: 10, marginTop: 4 },
  serviceCard: {
    backgroundColor: '#111', borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 1,
  },
  card: {
    backgroundColor: '#111', borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: '#1a1a1a',
  },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  serviceName: { fontSize: 14, fontWeight: '700', color: '#fff', textTransform: 'capitalize' },
  serviceMeta: { fontSize: 12, color: '#666', marginBottom: 2 },
  serviceEndpoint: { fontSize: 11, color: '#555', fontFamily: 'monospace', marginTop: 4 },
  topicCard: {
    backgroundColor: '#0f0f0f', borderRadius: 10, padding: 12,
    marginBottom: 8, borderWidth: 1, borderColor: '#1a1a1a',
  },
  topicName: { fontSize: 12, color: '#888', fontFamily: 'monospace', marginBottom: 2 },
  topicModule: { fontSize: 11, color: '#F5A623', fontWeight: '600', marginBottom: 2 },
  topicDesc: { fontSize: 12, color: '#666' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  userName: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 2 },
  userEmail: { fontSize: 11, color: '#666' },
  userRole: { fontSize: 12, color: '#888', fontFamily: 'monospace', marginTop: 4 },
  tenantCard: {
    backgroundColor: '#0f0f0f', borderRadius: 14, padding: 20,
    borderWidth: 1, borderColor: '#1a1a1a',
  },
  tenantName: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 2 },
  tenantBadges: { flexDirection: 'row', gap: 6 },
  modulesLabel: { fontSize: 12, color: '#666', marginTop: 14, marginBottom: 8 },
  modulesList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moduleTag: {
    backgroundColor: 'rgba(245,166,35,0.1)', borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4,
  },
  moduleTagText: { color: '#F5A623', fontSize: 12, fontWeight: '600' },
});
