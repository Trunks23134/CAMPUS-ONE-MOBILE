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
      onSuccess: (data: any) => void;
      onBack: () => void;
      initialData?: any;
    };
  };
}

interface FormState {
  firstName: string;
  lastName: string;
  middleName: string;
  birthdate: Date | null;
  birthdateInput: string;
  mobileNumber: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
}

const formatDateForInput = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function PersonalProfile({ navigation, route }: Props) {
  const { schoolLevel, applicantType, applicantId, onSuccess, onBack, initialData } = route.params;

  const [form, setForm] = useState<FormState>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    middleName: initialData?.middleName || '',
    birthdate: initialData?.birthdate ? new Date(initialData.birthdate) : null,
    birthdateInput: initialData?.birthdate ? formatDateForInput(new Date(initialData.birthdate)) : '',
    mobileNumber: initialData?.mobileNumber || '',
    street: initialData?.street || '',
    barangay: initialData?.barangay || '',
    city: initialData?.city || '',
    province: initialData?.province || '',
    zipCode: initialData?.zipCode || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const setField = (field: keyof FormState) => (value: any) => {
    let finalValue = value;
    if (field === 'zipCode' || field === 'mobileNumber') {
      // Numbers only
      finalValue = value.replace(/[^0-9]/g, '');
    }
    setForm((prev) => ({ ...prev, [field]: finalValue }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.middleName.trim()) errs.middleName = 'Middle name is required';
    
    const currentYear = new Date().getFullYear();
    if (!form.birthdate && !form.birthdateInput) {
      errs.birthdate = 'Birthdate is required';
    } else if (form.birthdateInput && (!form.birthdate || isNaN(form.birthdate.getTime()))) {
      errs.birthdate = 'Invalid date';
    } else if (form.birthdate) {
      const birthYear = form.birthdate.getFullYear();
      if (birthYear < 1920 || birthYear > currentYear - 2) {
        errs.birthdate = 'Invalid date';
      }
    }

    if (!form.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{11}$/.test(form.mobileNumber)) {
      errs.mobileNumber = 'Mobile number must be exactly 11 digits (e.g., 09123456789)';
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
      ? `${form.birthdate.getFullYear()}-${String(form.birthdate.getMonth() + 1).padStart(2, '0')}-${String(form.birthdate.getDate()).padStart(2, '0')}`
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
      onSuccess({
        first_name: form.firstName,
        last_name: form.lastName,
        middle_name: form.middleName,
        birthdate: birthdateStr,
        mobile_number: form.mobileNumber,
        street: form.street,
        barangay: form.barangay,
        city: form.city,
        province: form.province,
        zipCode: form.zipCode,
      });
    }
  };

  const handleBirthdateChange = (text: string) => {
    // Auto-format MM/DD/YYYY
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
    
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    if (cleaned.length > 4) formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
    
    setForm(prev => ({ ...prev, birthdateInput: formatted }));
    
    // Try to parse
    if (cleaned.length === 8) {
      const month = parseInt(cleaned.slice(0, 2), 10);
      const day = parseInt(cleaned.slice(2, 4), 10);
      const year = parseInt(cleaned.slice(4, 8), 10);
      
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() === year && 
        date.getMonth() === month - 1 && 
        date.getDate() === day &&
        date <= new Date()
      ) {
        setForm(prev => ({ ...prev, birthdate: date }));
      } else {
        setForm(prev => ({ ...prev, birthdate: null }));
      }
    } else {
      setForm(prev => ({ ...prev, birthdate: null }));
    }
  };

  const handleDateSelect = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const formatted = `${month}/${day}/${year}`;
    
    setForm(prev => ({ 
      ...prev, 
      birthdate: date, 
      birthdateInput: formatted 
    }));
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
              Middle Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.middleName && styles.inputError]}
              value={form.middleName}
              onChangeText={setField('middleName')}
              placeholder="Santos"
              placeholderTextColor="#9ca3af"
            />
            {errors.middleName ? <Text style={styles.errorText}>{errors.middleName}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Birthdate <Text style={styles.required}>*</Text></Text>
            <View style={[styles.inputContainer, errors.birthdate && styles.inputError]}>
              <TextInput
                style={styles.flexInput}
                value={form.birthdateInput}
                onChangeText={handleBirthdateChange}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                maxLength={10}
              />
              <TouchableOpacity
                style={styles.calendarIcon}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar" size={20} color="#F59E0B" />
              </TouchableOpacity>
            </View>
            {errors.birthdate ? <Text style={styles.errorText}>{errors.birthdate}</Text> : null}
          </View>

          {/* Mobile Number */}
          <View style={styles.field}>
            <Text style={styles.label}>Mobile Number <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.mobileNumber && styles.inputError]}
              value={form.mobileNumber}
              onChangeText={setField('mobileNumber')}
              placeholder="09123456789"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={11}
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
                maxLength={6}
              />
              {errors.zipCode ? <Text style={styles.errorText}>{errors.zipCode}</Text> : null}
            </View>
          </View>
        </View>
      </ScrollView>

      {showDatePicker && (
        Platform.OS === 'ios' ? (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={form.birthdate || new Date()}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    handleDateSelect(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            </View>
          </View>
        ) : (
          <DateTimePicker
            value={form.birthdate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                handleDateSelect(selectedDate);
              }
            }}
            maximumDate={new Date()}
          />
        )
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 4,
  },
  flexInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  calendarIcon: {
    padding: 10,
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
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  doneButtonText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
