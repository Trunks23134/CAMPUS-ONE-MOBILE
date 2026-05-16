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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { SchoolLevel, ApplicantType } from '../../types/admissions.types';
import { saveApplicantProfile } from '../../services/admissions.service';

interface Props {
  navigation: any;
  route: {
    params: {
      schoolLevel: SchoolLevel;
      applicantType: ApplicantType;
      applicantId: string;
      email: string;
      onSuccess: (firstName: string, lastName: string) => void;
      onBack: () => void;
    };
  };
}

interface FormState {
  firstName: string;
  lastName: string;
  middleName: string;
  birthdate: Date | null;
  mobileNumber: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
}

export default function PersonalProfile({ navigation, route }: Props) {
  const { schoolLevel, applicantType, applicantId, onSuccess, onBack } = route.params;

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    middleName: '',
    birthdate: null,
    mobileNumber: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const setField = (field: keyof FormState) => (value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.birthdate) errs.birthdate = 'Birthdate is required';

    if (!form.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9+\-\s()]{7,15}$/.test(form.mobileNumber)) {
      errs.mobileNumber = 'Enter a valid mobile number';
    }

    if (!form.street.trim()) errs.street = 'Street address is required';
    if (!form.barangay.trim()) errs.barangay = 'Barangay is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.province.trim()) errs.province = 'Province is required';
    if (!form.zipCode.trim()) errs.zipCode = 'ZIP code is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    const fullAddress = [form.street, form.barangay, form.city, form.province, form.zipCode]
      .filter(Boolean)
      .join(', ');

    const birthdateStr = form.birthdate
      ? form.birthdate.toISOString().split('T')[0]
      : '';

    const res = await saveApplicantProfile({
      applicant_id: applicantId,
      first_name: form.firstName,
      last_name: form.lastName,
      middle_name: form.middleName,
      birthdate: birthdateStr,
      mobile_number: form.mobileNumber,
      address: fullAddress,
      school_level: schoolLevel,
      applicant_type: applicantType,
    });

    setLoading(false);

    if (res.error) {
      Alert.alert('Error', res.error.message);
    } else {
      onSuccess(form.firstName, form.lastName);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
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
        <Text style={styles.title}>Fill Out Personal Profile</Text>
        <Text style={styles.subtitle}>Step 2 of 2</Text>
      </View>

      {/* Content */}
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

        {/* Form Card */}
        <View style={styles.card}>
          {/* Name Fields */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>First Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.firstName && styles.inputError]}
                value={form.firstName}
                onChangeText={setField('firstName')}
                placeholder="Juan"
                placeholderTextColor="#9ca3af"
              />
              {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Last Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.lastName && styles.inputError]}
                value={form.lastName}
                onChangeText={setField('lastName')}
                placeholder="Dela Cruz"
                placeholderTextColor="#9ca3af"
              />
              {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Middle Name <Text style={styles.optional}>(optional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={form.middleName}
              onChangeText={setField('middleName')}
              placeholder="Santos"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Birthdate */}
          <View style={styles.field}>
            <Text style={styles.label}>Birthdate <Text style={styles.required}>*</Text></Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput, errors.birthdate && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={form.birthdate ? styles.dateText : styles.datePlaceholder}>
                {form.birthdate ? formatDate(form.birthdate) : 'Select birthdate'}
              </Text>
              <Ionicons name="calendar" size={20} color="#9ca3af" />
            </TouchableOpacity>
            {errors.birthdate ? <Text style={styles.errorText}>{errors.birthdate}</Text> : null}
          </View>

          {/* Mobile Number */}
          <View style={styles.field}>
            <Text style={styles.label}>Mobile Number <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.mobileNumber && styles.inputError]}
              value={form.mobileNumber}
              onChangeText={setField('mobileNumber')}
              placeholder="09XX XXX XXXX"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />
            {errors.mobileNumber ? <Text style={styles.errorText}>{errors.mobileNumber}</Text> : null}
          </View>

          {/* Address Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Street <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.street && styles.inputError]}
                value={form.street}
                onChangeText={setField('street')}
                placeholder="House No., Street"
                placeholderTextColor="#9ca3af"
              />
              {errors.street ? <Text style={styles.errorText}>{errors.street}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Barangay <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.barangay && styles.inputError]}
                value={form.barangay}
                onChangeText={setField('barangay')}
                placeholder="Enter barangay"
                placeholderTextColor="#9ca3af"
              />
              {errors.barangay ? <Text style={styles.errorText}>{errors.barangay}</Text> : null}
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>City / Municipality <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.city && styles.inputError]}
                  value={form.city}
                  onChangeText={setField('city')}
                  placeholder="Enter city"
                  placeholderTextColor="#9ca3af"
                />
                {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}
              </View>

              <View style={styles.halfField}>
                <Text style={styles.label}>Province <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.province && styles.inputError]}
                  value={form.province}
                  onChangeText={setField('province')}
                  placeholder="Enter province"
                  placeholderTextColor="#9ca3af"
                />
                {errors.province ? <Text style={styles.errorText}>{errors.province}</Text> : null}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>ZIP Code <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.zipCode && styles.inputError]}
                value={form.zipCode}
                onChangeText={setField('zipCode')}
                placeholder="Enter ZIP code"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
              {errors.zipCode ? <Text style={styles.errorText}>{errors.zipCode}</Text> : null}
            </View>
          </View>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={form.birthdate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              setField('birthdate')(selectedDate);
            }
          }}
          maximumDate={new Date()}
        />
      )}

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
            <Text style={styles.submitButtonText}>Save Profile</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButtonFooter} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
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
  inputError: {
    borderColor: '#f87171',
    backgroundColor: '#fef2f2',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    color: '#1f2937',
  },
  datePlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 12,
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
