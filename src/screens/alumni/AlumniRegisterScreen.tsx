import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type RegisterForm = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  lastProgram: string;
  proofReference: string;
  academicUnit: string;
  gradYear: string;
  password: string;
  confirmPassword: string;
};

const initialForm: RegisterForm = {
  firstName: '', middleName: '', lastName: '',
  email: '', phone: '', studentId: '',
  lastProgram: '', proofReference: '',
  academicUnit: '', gradYear: '',
  password: '', confirmPassword: '',
};

const ACADEMIC_UNITS = [
  'College of Accountancy', 'College of Architecture',
  'Faculty of Arts and Letters', 'Faculty of Civil Law',
  'College of Commerce and Business Administration', 'College of Education',
  'Faculty of Engineering', 'College of Fine Arts and Design',
  'College of Information and Computing Sciences', 'Faculty of Medicine and Surgery',
  'Conservatory of Music', 'College of Nursing', 'Faculty of Pharmacy',
  'Institute of Physical Education and Athletics', 'College of Rehabilitation Sciences',
  'College of Science', 'College of Tourism and Hospitality Management',
  'Ecclesiastical Faculties', 'Graduate School',
  'Education High School', 'Junior High School', 'Senior High School',
];

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AlumniRegisterScreen({ onBack, onSuccess }: Props) {
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [isLegacy, setIsLegacy] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const setField = (key: keyof RegisterForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.academicUnit || !form.gradYear || !form.password || !form.confirmPassword) {
      Alert.alert('Missing Fields', 'Please complete all required fields.'); return;
    }
    if (!isLegacy && !form.studentId) {
      Alert.alert('Missing Fields', 'Please enter your Student ID or enable legacy verification.'); return;
    }
    if (isLegacy && (!form.lastProgram || !form.proofReference)) {
      Alert.alert('Missing Fields', 'Please provide your last program and proof reference.'); return;
    }
    if (form.password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters.'); return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.'); return;
    }
    if (!agreed) {
      Alert.alert('Terms Required', 'Please agree to the Terms and Privacy Policy.'); return;
    }

    setLoading(true);
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';
      const res = await fetch(`${API_URL}/api/alumni/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor_uuid: Math.random().toString(36).slice(2),
          tenant_id: 'campus-one',
          first_name: form.firstName,
          middle_name: form.middleName || undefined,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          academic_unit: form.academicUnit,
          graduation_year: parseInt(form.gradYear, 10),
          program: form.lastProgram || form.academicUnit,
          is_legacy_registration: isLegacy,
          student_id: isLegacy ? undefined : form.studentId,
          proof_reference: isLegacy ? form.proofReference : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? 'Registration failed. Please try again.');
      }
      setSubmitted(true);
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={36} color="#111" />
          </View>
          <Text style={styles.successTitle}>Registration Submitted</Text>
          <Text style={styles.successBody}>
            Your account request has been received under{' '}
            <Text style={styles.bold}>{isLegacy ? 'manual alumni verification' : 'student record verification'}</Text>.
            {'\n\n'}A confirmation email will be sent to{' '}
            <Text style={styles.bold}>{form.email}</Text>.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={onSuccess}>
            <Text style={styles.primaryBtnText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerOrange}>C1</Text>
          <Text style={styles.headerWhite}> Alumni Registration</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Sidebar info strip */}
        <View style={styles.infoStrip}>
          <Text style={styles.infoStripTitle}>Join Our Alumni Network</Text>
          <Text style={styles.infoStripItem}>📄 Request official documents (TOR, Diploma)</Text>
          <Text style={styles.infoStripItem}>🪪 Apply for your Alumni ID card</Text>
          <Text style={styles.infoStripItem}>✅ Track your clearance routing</Text>
          <Text style={styles.infoStripItem}>🔔 Receive real-time status updates</Text>
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PERSONAL INFO</Text>
          <Field label="First Name *" value={form.firstName} onChangeText={(v) => setField('firstName', v)} />
          <Field label="Middle Name" value={form.middleName} onChangeText={(v) => setField('middleName', v)} />
          <Field label="Last Name *" value={form.lastName} onChangeText={(v) => setField('lastName', v)} />
          <Field label="Email Address *" value={form.email} onChangeText={(v) => setField('email', v)} keyboardType="email-address" autoCapitalize="none" />
          <Field label="Phone *" value={form.phone} onChangeText={(v) => setField('phone', v)} keyboardType="phone-pad" placeholder="+63 XXX XXX XXXX" />
        </View>

        {/* Academic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACADEMIC INFO</Text>

          {/* Legacy toggle */}
          <TouchableOpacity style={styles.toggleRow} onPress={() => setIsLegacy(!isLegacy)}>
            <View style={[styles.checkbox, isLegacy && styles.checkboxChecked]}>
              {isLegacy && <Ionicons name="checkmark" size={12} color="#111" />}
            </View>
            <View style={styles.toggleText}>
              <Text style={styles.toggleBold}>I do not have a pre-existing student record</Text>
              <Text style={styles.toggleSub}>Use manual alumni verification instead of student ID lookup.</Text>
            </View>
          </TouchableOpacity>

          {!isLegacy && (
            <Field label="Student ID Number *" value={form.studentId} onChangeText={(v) => setField('studentId', v.replace(/\D/g, ''))} keyboardType="numeric" placeholder="e.g. 202012345" />
          )}
          {isLegacy && (
            <>
              <Field label="Last Program or Course *" value={form.lastProgram} onChangeText={(v) => setField('lastProgram', v)} placeholder="e.g. BS Information Systems" />
              <Field label="Proof Reference *" value={form.proofReference} onChangeText={(v) => setField('proofReference', v)} placeholder="Diploma no., TOR ref, or alumni clearance ref" />
            </>
          )}

          {/* Academic Unit picker */}
          <Text style={styles.fieldLabel}>Academic Unit *</Text>
          <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowUnitPicker(!showUnitPicker)}>
            <Text style={[styles.pickerText, !form.academicUnit && styles.placeholder]}>
              {form.academicUnit || 'Select academic unit'}
            </Text>
            <Ionicons name={showUnitPicker ? 'chevron-up' : 'chevron-down'} size={16} color="#888" />
          </TouchableOpacity>
          {showUnitPicker && (
            <View style={styles.pickerList}>
              {ACADEMIC_UNITS.map((u) => (
                <TouchableOpacity key={u} style={styles.pickerItem} onPress={() => { setField('academicUnit', u); setShowUnitPicker(false); }}>
                  <Text style={[styles.pickerItemText, form.academicUnit === u && styles.pickerItemActive]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Field label="Year of Graduation *" value={form.gradYear} onChangeText={(v) => setField('gradYear', v)} keyboardType="numeric" placeholder="e.g. 2024" />
        </View>

        {/* Account Security */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT SECURITY</Text>
          <Text style={styles.fieldLabel}>Password *</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={form.password}
              onChangeText={(v) => setField('password', v)}
              secureTextEntry={!showPass}
              placeholderTextColor="#555"
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              <Ionicons name={showPass ? 'eye-off' : 'eye'} size={18} color="#888" />
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>At least 8 characters</Text>

          <Text style={styles.fieldLabel}>Confirm Password *</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={form.confirmPassword}
              onChangeText={(v) => setField('confirmPassword', v)}
              secureTextEntry={!showConfirm}
              placeholderTextColor="#555"
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
              <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={18} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms */}
        <TouchableOpacity style={styles.toggleRow} onPress={() => setAgreed(!agreed)}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={12} color="#111" />}
          </View>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms and Conditions</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text> of Campus One.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#111" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#555" {...props} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: {
    backgroundColor: '#111', height: 56, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 16, gap: 12,
    borderBottomWidth: 1, borderBottomColor: '#1f1f1f',
  },
  backBtn: { padding: 4 },
  headerTitle: { flexDirection: 'row', alignItems: 'center' },
  headerOrange: { color: '#F5A623', fontSize: 16, fontWeight: 'bold' },
  headerWhite: { color: '#fff', fontSize: 16, fontWeight: '300' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  infoStrip: {
    backgroundColor: '#F5A623', borderRadius: 14, padding: 20, marginBottom: 16,
  },
  infoStripTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 10 },
  infoStripItem: { fontSize: 13, color: '#111', marginBottom: 4, fontWeight: '500' },
  section: {
    backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#2a2a2a',
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#F5A623',
    letterSpacing: 0.8, marginBottom: 12,
  },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#ccc', marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: '#111', borderWidth: 1.5, borderColor: '#2a2a2a',
    borderRadius: 10, padding: 11, fontSize: 14, color: '#fff', marginBottom: 4,
  },
  hint: { fontSize: 11, color: '#888', marginBottom: 4 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  eyeBtn: { padding: 10, marginLeft: 4 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#111', borderWidth: 1.5, borderColor: '#2a2a2a',
    borderRadius: 10, padding: 14, marginBottom: 12,
  },
  checkbox: {
    width: 18, height: 18, borderRadius: 4, borderWidth: 1.5,
    borderColor: '#555', alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  checkboxChecked: { backgroundColor: '#F5A623', borderColor: '#F5A623' },
  toggleText: { flex: 1 },
  toggleBold: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 2 },
  toggleSub: { fontSize: 12, color: '#888' },
  pickerBtn: {
    backgroundColor: '#111', borderWidth: 1.5, borderColor: '#2a2a2a',
    borderRadius: 10, padding: 11, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', marginBottom: 4,
  },
  pickerText: { fontSize: 14, color: '#fff' },
  placeholder: { color: '#555' },
  pickerList: {
    backgroundColor: '#111', borderWidth: 1, borderColor: '#2a2a2a',
    borderRadius: 10, marginBottom: 8, maxHeight: 200, overflow: 'hidden',
  },
  pickerItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  pickerItemText: { fontSize: 13, color: '#ccc' },
  pickerItemActive: { color: '#F5A623', fontWeight: '700' },
  termsText: { flex: 1, fontSize: 13, color: '#888', lineHeight: 20 },
  termsLink: { color: '#F5A623', fontWeight: '600' },
  primaryBtn: {
    backgroundColor: '#F5A623', borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: 16, fontWeight: '800', color: '#111' },
  successContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  successIcon: {
    width: 72, height: 72, backgroundColor: '#F5A623', borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 14, textAlign: 'center' },
  successBody: { fontSize: 14, color: '#888', lineHeight: 22, textAlign: 'center', marginBottom: 32 },
  bold: { color: '#fff', fontWeight: '700' },
});
