import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme/colors';
const colors = theme.colors;
import Card from '../../../components/Card';
import TopBar from '../../../components/TopBar';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';

const applicantDb = supabase.schema('applicant');
const studentDb = supabase.schema('student');

type ApplicantData = {
  id: string; email: string; first_name: string; last_name: string;
  middle_name: string; birthdate: string | null; mobile_number: string;
  address: string; program: string; status: string;
};
type ParentInfo = {
  father_name: string; father_address: string; father_contact: string;
  mother_name: string; mother_address: string; mother_contact: string;
  guardian_name: string; guardian_address: string;
  guardian_phone_home: string; guardian_phone_work: string;
};
type AcademicRow = { grade_level: string; school_name: string; completion_year: string };
type ProgramSelection = { college_department: string | null; college_program: string | null; senior_high_track: string | null };
type AlumniRelative = { name: string; relationship: string; college: string; batch_year: string; contact_number: string };

export default function ProfileScreen() {
  const { user } = useAuth();
  const [ap, setAp] = useState<ApplicantData | null>(null);
  const [parent, setParent] = useState<ParentInfo | null>(null);
  const [academic, setAcademic] = useState<AcademicRow[]>([]);
  const [programSel, setProgramSel] = useState<ProgramSelection | null>(null);
  const [alumni, setAlumni] = useState<AlumniRelative[]>([]);
  const [studentNumber, setStudentNumber] = useState<string | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user?.id) { setLoading(false); return; }
    const [apRes, piRes, abRes, psRes, arRes, saRes] = await Promise.all([
      applicantDb.from('applicant_profiles').select('id,email,first_name,last_name,middle_name,birthdate,mobile_number,address,program,status').eq('id', user.id).maybeSingle(),
      applicantDb.from('parent_information').select('*').eq('applicant_id', user.id).maybeSingle(),
      applicantDb.from('academic_background').select('grade_level,school_name,completion_year').eq('applicant_id', user.id).order('completion_year', { ascending: false }),
      applicantDb.from('program_selections').select('college_department,college_program,senior_high_track').eq('applicant_id', user.id).maybeSingle(),
      applicantDb.from('alumni_relatives').select('name,relationship,college,batch_year,contact_number').eq('applicant_id', user.id),
      studentDb.from('student_accounts').select('student_number').eq('applicant_id', user.id).maybeSingle(),
    ]);
    if (apRes.data) setAp(apRes.data as ApplicantData);
    if (piRes.data) setParent(piRes.data as ParentInfo);
    if (abRes.data) setAcademic(abRes.data as AcademicRow[]);
    if (psRes.data) setProgramSel(psRes.data as ProgramSelection);
    if (arRes.data) setAlumni(arRes.data as AlumniRelative[]);
    if (saRes.data) setStudentNumber((saRes.data as any).student_number ?? null);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const formatDate = (iso: string | null) => {
    if (!iso) return '�';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const fullName = ap
    ? `${ap.first_name} ${ap.middle_name ? ap.middle_name + ' ' : ''}${ap.last_name}`.trim()
    : '�';

  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
        ) : (
          <>
            <Card style={styles.centerCard}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={54} color="white" />
                </View>
              </View>
              <Text style={styles.title}>Student Profile</Text>
              <Info icon="person-outline" label="Full Name" value={fullName} />
              <Info icon="card-outline" label="Student Number" value={studentNumber ?? '�'} />
              <Info icon="mail-outline" label="Email" value={ap?.email ?? '�'} />
              <Info icon="call-outline" label="Contact Number" value={ap?.mobile_number ?? '�'} />
              <Info icon="location-outline" label="Address" value={ap?.address ?? '�'} />
              <Info icon="calendar-outline" label="Date of Birth" value={formatDate(ap?.birthdate ?? null)} />
              <Info icon="school-outline" label="Program" value={ap?.program ?? '�'} />
              <Info icon="checkmark-circle-outline" label="Status" value={ap?.status ?? '�'} />
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditVisible(true)}>
                <Text style={styles.editText}>Edit Profile</Text>
              </TouchableOpacity>
            </Card>

            {programSel && (
              <Card style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>College / Course Information</Text>
                <Info icon="library-outline" label="Program" value={programSel.college_program ?? programSel.senior_high_track ?? '�'} />
                <Info icon="grid-outline" label="Department" value={programSel.college_department ?? '�'} />
              </Card>
            )}

            {parent && (
              <Card style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Parents / Guardian Information</Text>
                <Info icon="person-outline" label="Father" value={parent.father_name} />
                <Info icon="person-outline" label="Mother" value={parent.mother_name} />
                <Info icon="call-outline" label="Contact No." value={parent.father_contact} />
                <Info icon="location-outline" label="Address" value={parent.father_address} />
                <Info icon="person-circle-outline" label="Guardian" value={parent.guardian_name} />
                <Info icon="location-outline" label="Guardian Address" value={parent.guardian_address} />
                <Info icon="call-outline" label="Phone (Home)" value={parent.guardian_phone_home} />
                <Info icon="call-outline" label="Phone (Work)" value={parent.guardian_phone_work} />
              </Card>
            )}

            {academic.length > 0 && (
              <Card style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Educational Background</Text>
                {academic.map((row, i) => (
                  <View key={i} style={styles.tableRow}>
                    <Text style={styles.tableLevel}>{row.grade_level}</Text>
                    <Text style={styles.tableSchool}>{row.school_name}</Text>
                    <Text style={styles.tableYear}>{row.completion_year}</Text>
                  </View>
                ))}
              </Card>
            )}

            {alumni.length > 0 && (
              <Card style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Alumni Information</Text>
                {alumni.map((row, i) => (
                  <View key={i} style={styles.infoCard}>
                    <Ionicons name="people-outline" size={18} color="#6B7280" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>{row.relationship}</Text>
                      <Text style={styles.infoValue}>{row.name}</Text>
                      <Text style={[styles.infoLabel, { marginTop: 2 }]}>{row.college} � {row.batch_year}</Text>
                    </View>
                  </View>
                ))}
              </Card>
            )}
          </>
        )}
      </ScrollView>
      <EditModal visible={editVisible} onClose={() => setEditVisible(false)} onSaved={() => { setEditVisible(false); load(); }} ap={ap} />
    </View>
  );
}

function Info({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <Ionicons name={icon} size={18} color="#6B7280" />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function EditModal({ visible, onClose, onSaved, ap }: {
  visible: boolean; onClose: () => void; onSaved: () => void; ap: ApplicantData | null;
}) {
  const [firstName, setFirstName] = useState(ap?.first_name ?? '');
  const [lastName, setLastName] = useState(ap?.last_name ?? '');
  const [middleName, setMiddleName] = useState(ap?.middle_name ?? '');
  const [mobile, setMobile] = useState(ap?.mobile_number ?? '');
  const [address, setAddress] = useState(ap?.address ?? '');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setFirstName(ap?.first_name ?? '');
    setLastName(ap?.last_name ?? '');
    setMiddleName(ap?.middle_name ?? '');
    setMobile(ap?.mobile_number ?? '');
    setAddress(ap?.address ?? '');
  }, [ap, visible]);

  const handleSave = async () => {
    if (!ap?.id) return;
    setSaving(true);
    try {
      const { error } = await applicantDb.from('applicant_profiles').update({
        first_name: firstName.trim(), last_name: lastName.trim(),
        middle_name: middleName.trim(), mobile_number: mobile.trim(), address: address.trim(),
        full_name: `${firstName.trim()} ${middleName.trim()} ${lastName.trim()}`.replace(/\s+/g, ' ').trim(),
      }).eq('id', ap.id);
      if (error) Alert.alert('Save failed', error.message);
      else onSaved();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Something went wrong.');
    } finally { setSaving(false); }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <View style={modal.header}>
            <Text style={modal.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={modal.avatarSection}>
              <View style={modal.avatarPlaceholder}>
                <Ionicons name="person" size={48} color="white" />
              </View>
            </View>
            <Field label="First Name" value={firstName} onChangeText={setFirstName} placeholder="Enter first name" />
            <Field label="Middle Name" value={middleName} onChangeText={setMiddleName} placeholder="Enter middle name" />
            <Field label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Enter last name" />
            <Field label="Contact Number" value={mobile} onChangeText={setMobile} placeholder="+63 9XX XXX XXXX" keyboardType="phone-pad" />
            <Field label="Address" value={address} onChangeText={setAddress} placeholder="Enter address" multiline />
            <TouchableOpacity style={[modal.saveBtn, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving} activeOpacity={0.9}>
              {saving ? <ActivityIndicator size="small" color="#111827" /> : <Text style={modal.saveBtnText}>Save Changes</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType, multiline }: any) {
  return (
    <View style={modal.field}>
      <Text style={modal.fieldLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder}
        placeholderTextColor="#9CA3AF" keyboardType={keyboardType ?? 'default'} multiline={multiline}
        style={[modal.fieldInput, multiline && { height: 80, textAlignVertical: 'top' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E7EB' },
  centerCard: { margin: 14 },
  sectionCard: { margin: 14, marginTop: 0 },
  avatarWrap: { alignSelf: 'center', marginBottom: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  title: { textAlign: 'center', fontSize: 20, fontWeight: '700', color: '#181818', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  infoCard: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 10 },
  infoLabel: { color: '#6B7280' },
  infoValue: { color: '#111827', fontWeight: '700', marginTop: 2 },
  editBtn: { marginTop: 8, height: 46, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  editText: { color: '#fff', fontWeight: '600' },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 8 },
  tableLevel: { flex: 1.2, color: '#374151', fontSize: 12.5 },
  tableSchool: { flex: 2, color: '#111827', fontWeight: '600', fontSize: 12.5 },
  tableYear: { flex: 0.8, color: '#6B7280', fontSize: 12.5, textAlign: 'right' },
});

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '92%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 12.5, fontWeight: '600', color: '#111827', marginBottom: 6 },
  fieldInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13.5, color: '#111827', backgroundColor: '#F9FAFB' },
  saveBtn: { marginTop: 6, height: 48, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { fontWeight: '700', color: '#111827', fontSize: 14 },
});



