import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { SchoolLevel, ApplicantType } from '../../types/admissions.types';
import { saveParentInformation } from '../../services/admissions.service';
import { invokeFlowCallback } from '../../navigation/flowCallbacks';

interface Props {
  navigation: any;
  route: {
    params: {
      schoolLevel: SchoolLevel;
      applicantType: ApplicantType;
      applicantId: string;
      onSuccessId: string;
      onBackId: string;
      initialData?: any;
    };
  };
}

interface FormState {
  fatherName: string;
  fatherAddress: string;
  fatherContact: string;
  guardianName: string;
  guardianAddress: string;
  guardianPhoneHome: string;
  guardianPhoneWork: string;
  motherName: string;
  motherAddress: string;
  motherContact: string;
}

export default function ParentInformation({ navigation, route }: Props) {
  const { schoolLevel, applicantType, applicantId, onSuccessId, onBackId, initialData } = route.params;

  const [form, setForm] = useState<FormState>({
    fatherName: initialData?.fatherName || '',
    fatherAddress: initialData?.fatherAddress || '',
    fatherContact: initialData?.fatherContact || '',
    guardianName: initialData?.guardianName || '',
    guardianAddress: initialData?.guardianAddress || '',
    guardianPhoneHome: initialData?.guardianPhoneHome || '',
    guardianPhoneWork: initialData?.guardianPhoneWork || '',
    motherName: initialData?.motherName || '',
    motherAddress: initialData?.motherAddress || '',
    motherContact: initialData?.motherContact || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const setField = (field: keyof FormState) => (value: string) => {
    let finalValue = value;
    if (['fatherContact', 'motherContact', 'guardianPhoneHome', 'guardianPhoneWork'].includes(field)) {
      // Numbers only
      finalValue = value.replace(/[^0-9]/g, '');
    }
    setForm((prev) => ({ ...prev, [field]: finalValue }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    console.log('[ParentInformation] Starting validation...');
    const errs: Record<string, string> = {};

    // Father Information
    if (!form.fatherName.trim()) {
      errs.fatherName = "Father's name is required";
    }
    if (!form.fatherAddress.trim()) {
      errs.fatherAddress = "Father's address is required";
    }
    if (!form.fatherContact.trim()) {
      errs.fatherContact = "Father's contact number is required";
    } else if (!/^\d{11}$/.test(form.fatherContact)) {
      errs.fatherContact = "Must be exactly 11 digits (e.g., 09123456789)";
    }

    // Mother Information
    if (!form.motherName.trim()) {
      errs.motherName = "Mother's name is required";
    }
    if (!form.motherAddress.trim()) {
      errs.motherAddress = "Mother's address is required";
    }
    if (!form.motherContact.trim()) {
      errs.motherContact = "Mother's contact number is required";
    } else if (!/^\d{11}$/.test(form.motherContact)) {
      errs.motherContact = "Must be exactly 11 digits (e.g., 09123456789)";
    }

    // Guardian Information is optional
    if (form.guardianName.trim() || form.guardianAddress.trim()) {
      if (!form.guardianName.trim()) errs.guardianName = "Guardian's name is required";
      if (!form.guardianAddress.trim()) errs.guardianAddress = "Guardian's address is required";
    }

    if (Object.keys(errs).length > 0) {
      Alert.alert('Incomplete Information', 'Please fill in all mandatory fields (*) with valid information.');
      setErrors(errs);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = async () => {
    console.log('[ParentInformation] Continue button pressed.');
    if (!validate()) {
      console.log('[ParentInformation] handleSave aborted due to validation errors.');
      return;
    }

    setLoading(true);
    console.log('[ParentInformation] Saving to database...', { applicantId });
    try {
      // Add a 10-second timeout to prevent the app from hanging on slow networks
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out. Please check your internet connection.')), 10000)
      );

      const res = await Promise.race([
        saveParentInformation({
          applicant_id: applicantId,
          father_name: form.fatherName,
          father_address: form.fatherAddress,
          father_contact: form.fatherContact,
          guardian_name: form.guardianName,
          guardian_address: form.guardianAddress,
          guardian_phone_home: form.guardianPhoneHome,
          guardian_phone_work: form.guardianPhoneWork,
          mother_name: form.motherName,
          mother_address: form.motherAddress,
          mother_contact: form.motherContact,
        }),
        timeoutPromise
      ]) as any;

      console.log('[ParentInformation] Save response:', res);

      if (res.error) {
        console.error('[ParentInformation] Save error:', res.error);
        Alert.alert('Error', res.error.message);
      } else {
        console.log('[ParentInformation] Save successful. Triggering onSuccess...');
        invokeFlowCallback(onSuccessId, {
          father_name: form.fatherName,
          father_address: form.fatherAddress,
          father_contact: form.fatherContact,
          guardian_name: form.guardianName,
          guardian_address: form.guardianAddress,
          guardian_phone_home: form.guardianPhoneHome,
          guardian_phone_work: form.guardianPhoneWork,
          mother_name: form.motherName,
          mother_address: form.motherAddress,
          mother_contact: form.motherContact,
        });
      }
    } catch (error) {
      console.error('[ParentInformation] Unexpected error in handleSave:', error);
      Alert.alert('Error', 'Failed to save parent information: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
      console.log('[ParentInformation] handleSave process finished.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => invokeFlowCallback(onBackId)}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="school-outline" size={20} color="#F59E0B" />
          <Text style={styles.headerText}>CAMPUS Portal</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Parent Information</Text>
        <Text style={styles.subtitle}>Provide parent or guardian information</Text>
      </View>

      {/* Content */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Selection Tags */}
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{schoolLevel}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{applicantType}</Text>
          </View>
        </View>

        {/* Father Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Father Information</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Father's Name <Text style={styles.required}>*</Text></Text>
            <Text style={styles.formatGuide}>Format: First Name Middle Name, Last Name</Text>
            <TextInput
              style={[styles.input, errors.fatherName && styles.inputError]}
              value={form.fatherName}
              onChangeText={setField('fatherName')}
              placeholder="Juan Santos, Dela Cruz"
              placeholderTextColor="#9ca3af"
            />
            {errors.fatherName ? <Text style={styles.errorText}>{errors.fatherName}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Address <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.textArea, errors.fatherAddress && styles.inputError]}
              value={form.fatherAddress}
              onChangeText={setField('fatherAddress')}
              placeholder="House No., Street, Barangay, City, Province"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
            />
            {errors.fatherAddress ? <Text style={styles.errorText}>{errors.fatherAddress}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contact No. <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.fatherContact && styles.inputError]}
              value={form.fatherContact}
              onChangeText={setField('fatherContact')}
              placeholder="09123456789"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={11}
            />
            {errors.fatherContact ? <Text style={styles.errorText}>{errors.fatherContact}</Text> : null}
          </View>
        </View>

        {/* Mother Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Mother Information</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Mother's Name <Text style={styles.required}>*</Text></Text>
            <Text style={styles.formatGuide}>Format: First Name Middle Name, Last Name</Text>
            <TextInput
              style={[styles.input, errors.motherName && styles.inputError]}
              value={form.motherName}
              onChangeText={setField('motherName')}
              placeholder="Maria Santos, Dela Cruz"
              placeholderTextColor="#9ca3af"
            />
            {errors.motherName ? <Text style={styles.errorText}>{errors.motherName}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Address <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.textArea, errors.motherAddress && styles.inputError]}
              value={form.motherAddress}
              onChangeText={setField('motherAddress')}
              placeholder="House No., Street, Barangay, City, Province"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
            />
            {errors.motherAddress ? <Text style={styles.errorText}>{errors.motherAddress}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contact No. <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.motherContact && styles.inputError]}
              value={form.motherContact}
              onChangeText={setField('motherContact')}
              placeholder="09123456789"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={11}
            />
            {errors.motherContact ? <Text style={styles.errorText}>{errors.motherContact}</Text> : null}
          </View>
        </View>

        {/* Guardian Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Guardian Information</Text>
            <Text style={styles.cardSubtitle}>(Optional - if different from parents)</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Guardian's Name <Text style={styles.optional}>(optional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={form.guardianName}
              onChangeText={setField('guardianName')}
              placeholder="Enter guardian's full name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Address <Text style={styles.optional}>(optional)</Text>
            </Text>
            <TextInput
              style={styles.textArea}
              value={form.guardianAddress}
              onChangeText={setField('guardianAddress')}
              placeholder="House No., Street, Barangay, City, Province"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Phone (Home) <Text style={styles.optional}>(optional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={form.guardianPhoneHome}
              onChangeText={setField('guardianPhoneHome')}
              placeholder="02 XXXX XXXX"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Phone (Work) <Text style={styles.optional}>(optional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={form.guardianPhoneWork}
              onChangeText={setField('guardianPhoneWork')}
              placeholder="02 XXXX XXXX"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.submitButtonText}>Saving...</Text>
            </>
          ) : (
            <Text style={styles.submitButtonText}>Continue →</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButtonFooter} onPress={() => invokeFlowCallback(onBackId)} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#1a1a1a',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  titleSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 140,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardHeader: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 6,
  },
  formatGuide: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  optional: {
    fontWeight: '400',
    color: '#9ca3af',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: '#f9fafb',
    color: '#1f2937',
  },
  textArea: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#f9fafb',
    color: '#1f2937',
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#f87171',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
    gap: 10,
  },
  submitButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  backButtonFooter: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
});
