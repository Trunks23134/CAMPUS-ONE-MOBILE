import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '../../../theme/colors';
const colors = theme.colors;
import TopBar from '../../../components/TopBar';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationsContext';
import { fetchStudent, isEnrollmentError } from '../../../api/enrollment';
import { supabase } from '../../../lib/supabase';

type PickedFile = { name: string; uri: string; size: number | null; mimeType: string | null };

export default function AddDropCoursesScreen() {
  const nav = useNavigation<any>();
  const { user } = useAuth();
  const { refresh: refreshNotifications } = useNotifications();
  const [uploadedFile, setUploadedFile] = useState<PickedFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [program, setProgram] = useState('');
  const [sectionYear, setSectionYear] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [subjectCode, setSubjectCode] = useState('');

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetchStudent(user.id).then((result) => {
      if (!isEnrollmentError(result)) {
        setFirstName(result.firstName ?? '');
        setLastName(result.lastName ?? '');
        setProgram(result.program ?? '');
      }
      setLoading(false);
    });
  }, [user?.id]);

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword',
             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setUploadedFile({
        name: asset.name,
        uri: asset.uri,
        size: asset.size ?? null,
        mimeType: asset.mimeType ?? null,
      });
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Required: lastName, firstName, program, subjectCode, and a file
  const canSubmit = !submitting
    && lastName.trim() !== ''
    && firstName.trim() !== ''
    && program.trim() !== ''
    && subjectCode.trim() !== ''
    && uploadedFile !== null;

  const handleSubmit = async () => {
    if (!user?.id) return;
    setSubmitting(true);
    await supabase.from('notifications').insert({
      profile_id: user.id,
      title: 'Add/Drop Request Submitted',
      body: `Your request to add/drop courses (${subjectCode || 'N/A'}) is currently under review. You will be notified once it has been processed.`,
      is_read: false,
    });
    refreshNotifications();
    setSubmitting(false);
    setSubmitted(true);
  };

  const fields = [
    { label: 'Last Name', value: lastName, onChange: setLastName },
    { label: 'First Name', value: firstName, onChange: setFirstName },
    { label: 'Middle Name', value: middleName, onChange: setMiddleName },
    { label: 'Suffix', value: suffix, onChange: setSuffix },
    { label: 'Degree Program', value: program, onChange: setProgram },
    { label: 'Section / Year', value: sectionYear, onChange: setSectionYear },
    { label: 'Contact Number', value: contactNumber, onChange: setContactNumber },
    { label: 'Subject Code', value: subjectCode, onChange: setSubjectCode },
  ];

  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Adding / Dropping of Courses</Text>

          <View style={styles.banner}>
            <Ionicons name="alert-circle-outline" size={18} color="#7C3AED" />
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Instructions</Text>
              <Text style={styles.bannerText}>
                Fill out the form below to request adding or dropping courses. Attach the required documentation and submit for advisor approval.
              </Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            fields.map(({ label, value, onChange }, index) => (
              <View key={label} style={{ marginTop: index === 0 ? 0 : 10 }}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
              </View>
            ))
          )}

          <Text style={[styles.label, { marginTop: 14 }]}>
            Attached Document <Text style={{ color: '#EF4444' }}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.fileBox, !uploadedFile && submitted === false && { borderColor: '#E5E7EB' }]}
            onPress={handlePickDocument}
            activeOpacity={0.8}
          >
            {uploadedFile ? (
              <View style={styles.fileRow}>
                <View style={styles.pdfIcon}>
                  <Ionicons name="document-text" size={20} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName} numberOfLines={1}>{uploadedFile.name}</Text>
                  <Text style={styles.fileMeta}>{uploadedFile.mimeType ?? 'Document'} • {formatSize(uploadedFile.size)}</Text>
                </View>
                <TouchableOpacity onPress={() => setUploadedFile(null)} hitSlop={10}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadState}>
                <Ionicons name="cloud-upload-outline" size={26} color="#6B7280" />
                <Text style={styles.uploadTitle}>Tap to upload document</Text>
                <Text style={styles.uploadMeta}>PDF, DOC, DOCX up to 10MB</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => nav.goBack()}>
            <Text style={styles.secondaryText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryBtn, !canSubmit && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            {submitting
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.primaryText}>Submit Request</Text>}
          </TouchableOpacity>
        </View>

        {/* In-progress toast */}
        {submitted && (
          <View style={styles.toast}>
            <View style={styles.toastInner}>
              <Ionicons name="time-outline" size={18} color="#2563EB" />
              <View style={{ flex: 1 }}>
                <Text style={styles.toastTitle}>Request In Progress</Text>
                <Text style={styles.toastBody}>Your add/drop request has been submitted and is under review.</Text>
              </View>
              <TouchableOpacity onPress={() => nav.navigate('Notifications')} hitSlop={10}>
                <Text style={styles.toastLink}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSubmitted(false)} hitSlop={10} style={{ marginLeft: 8 }}>
                <Ionicons name="close" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E7EB' },
  card: { backgroundColor: '#fff', margin: 14, borderRadius: 14, padding: 14, elevation: 3 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 10 },
  banner: { backgroundColor: '#DCCCF5', borderWidth: 1, borderColor: '#A78BFA', borderRadius: 12, padding: 12, flexDirection: 'row', gap: 10, marginBottom: 12 },
  bannerTitle: { color: '#111827', fontWeight: '700' },
  bannerText: { color: '#111827', marginTop: 4, fontSize: 12.5 },
  label: { color: '#374151', marginBottom: 6, fontWeight: '700' },
  input: { height: 44, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#fff', color: '#111827' },
  fileBox: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, backgroundColor: '#F9FAFB' },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pdfIcon: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#EB0D0D', alignItems: 'center', justifyContent: 'center' },
  fileName: { color: '#111827', fontWeight: '800' },
  fileMeta: { color: '#6B7280', marginTop: 2, fontSize: 12.5 },
  removeText: { color: '#EB0D0D', fontWeight: '700' },
  uploadState: { alignItems: 'center', paddingVertical: 10 },
  uploadTitle: { color: '#111827', fontWeight: '700', marginTop: 8 },
  uploadMeta: { color: '#6B7280', marginTop: 4, fontSize: 12.5 },
  actionRow: { flexDirection: 'row', gap: 10, marginHorizontal: 14 },
  secondaryBtn: { flex: 1, height: 46, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: '#374151', fontWeight: '600' },
  primaryBtn: { flex: 1, height: 46, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#fff', fontWeight: '600' },
  btnDisabled: { opacity: 0.4 },
  toast: { marginHorizontal: 14, marginTop: 10 },
  toastInner: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  toastTitle: { fontWeight: '700', color: '#1E40AF', fontSize: 13 },
  toastBody: { color: '#374151', fontSize: 12, marginTop: 2, lineHeight: 17 },
  toastLink: { color: colors.primary, fontWeight: '700', fontSize: 13, marginTop: 2 },
});



