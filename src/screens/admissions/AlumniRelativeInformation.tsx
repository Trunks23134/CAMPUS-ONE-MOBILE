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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import type { SchoolLevel, ApplicantType } from '../../types/admissions.types';
import { saveAlumniRelatives } from '../../services/admissions.service';

interface Props {
  navigation: any;
  route: {
    params: {
      schoolLevel: SchoolLevel;
      applicantType: ApplicantType;
      applicantId: string;
      onSuccess: () => void;
      onBack: () => void;
    };
  };
}

interface AlumniEntry {
  id: string;
  name: string;
  relationship: string;
  college: string;
  batch: string;
  contactNumber: string;
}

const RELATIONSHIP_OPTIONS = [
  'Parent',
  'Sibling',
  'Grandparent',
  'Aunt/Uncle',
  'Cousin',
  'Other Relative',
];

const COLLEGE_OPTIONS = [
  'College of Arts and Sciences',
  'College of Business Administration',
  'College of Engineering',
  'College of Education',
  'College of Nursing',
  'College of Computer Studies',
  'College of Law',
  'College of Medicine',
];

function generateBatchYears(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let i = 0; i <= 50; i++) {
    years.push((currentYear - i).toString());
  }
  return years;
}

export default function AlumniRelativeInformation({ navigation, route }: Props) {
  const { schoolLevel, applicantType, applicantId, onSuccess, onBack } = route.params;
  const batchYears = generateBatchYears();

  const [alumni, setAlumni] = useState<AlumniEntry[]>([
    {
      id: 'initial-1',
      name: '',
      relationship: '',
      college: '',
      batch: '',
      contactNumber: '',
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const updateAlumni = (id: string, field: keyof AlumniEntry, value: string) => {
    let finalValue = value;
    if (field === 'contactNumber') {
      // Numbers only
      finalValue = value.replace(/[^0-9]/g, '');
    }
    setAlumni((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: finalValue } : item))
    );
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${id}-${field}`];
      return newErrors;
    });
  };

  const addNewRow = () => {
    const newId = `alumni-${Date.now()}`;
    setAlumni((prev) => [
      ...prev,
      {
        id: newId,
        name: '',
        relationship: '',
        college: '',
        batch: '',
        contactNumber: '',
      },
    ]);
  };

  const deleteRow = (id: string) => {
    if (alumni.length === 1) return;

    setAlumni((prev) => prev.filter((item) => item.id !== id));
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`${id}-`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const validate = (): boolean => {
    // Requirements: "If there are no relative alumni, leave the fields blank."
    // We will allow partial or empty data. 
    setErrors({});
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    const filledAlumni = alumni.filter(
      (item) =>
        item.name.trim() ||
        item.relationship.trim() ||
        item.college.trim() ||
        item.batch.trim() ||
        item.contactNumber.trim()
    );

    // If blank, skip database call and proceed immediately
    if (filledAlumni.length === 0) {
      onSuccess({ relatives: [] });
      return;
    }

    const relatives = filledAlumni.map((item) => ({
      name: item.name,
      relationship: item.relationship,
      college: item.college,
      batch_year: item.batch,
      contact_number: item.contactNumber,
    }));

    try {
      // Add a 10-second timeout to prevent the app from hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out. Please check your internet connection.')), 10000)
      );

      const res = await Promise.race([
        saveAlumniRelatives({
          applicant_id: applicantId,
          relatives,
        }),
        timeoutPromise
      ]) as any;

      setLoading(false);

      if (res.error) {
        Alert.alert('Error', res.error.message);
      } else {
        onSuccess({ relatives });
      }
    } catch (error) {
      setLoading(false);
      console.error('[AlumniRelativeInformation] Save error:', error);
      Alert.alert('Error', 'Failed to save information: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
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
        <Text style={styles.title}>Alumni Relative Information</Text>
        <Text style={styles.subtitle}>Provide alumni relative information (optional)</Text>
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

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle" size={16} color="#6b7280" />
          <Text style={styles.infoNoteText}>
            NOTE: If there are no relative alumni, leave the fields blank.
          </Text>
        </View>

        {/* Alumni Entries */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Alumni-Relative Information</Text>
          </View>

          {alumni.map((item, index) => (
            <View key={item.id} style={styles.alumniEntry}>
              <View style={styles.alumniHeader}>
                <Text style={styles.alumniNumber}>Entry {index + 1}</Text>
                {alumni.length > 1 && (
                  <TouchableOpacity onPress={() => deleteRow(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Name */}
              <View style={styles.field}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={[styles.input, errors[`${item.id}-name`] && styles.inputError]}
                  value={item.name}
                  onChangeText={(value) => updateAlumni(item.id, 'name', value)}
                  placeholder="Enter name"
                  placeholderTextColor="#9ca3af"
                />
                {errors[`${item.id}-name`] ? (
                  <Text style={styles.errorText}>{errors[`${item.id}-name`]}</Text>
                ) : null}
              </View>

              {/* Relationship */}
              <View style={styles.field}>
                <Text style={styles.label}>Relationship</Text>
                <View style={[styles.pickerContainer, errors[`${item.id}-relationship`] && styles.inputError]}>
                  <Picker
                    selectedValue={item.relationship}
                    onValueChange={(value) => updateAlumni(item.id, 'relationship', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select relationship" value="" />
                    {RELATIONSHIP_OPTIONS.map((rel) => (
                      <Picker.Item key={rel} label={rel} value={rel} />
                    ))}
                  </Picker>
                </View>
                {errors[`${item.id}-relationship`] ? (
                  <Text style={styles.errorText}>{errors[`${item.id}-relationship`]}</Text>
                ) : null}
              </View>

              {/* College */}
              <View style={styles.field}>
                <Text style={styles.label}>College</Text>
                <TextInput
                  style={[styles.input, errors[`${item.id}-college`] && styles.inputError]}
                  value={item.college}
                  onChangeText={(value) => updateAlumni(item.id, 'college', value)}
                  placeholder="Enter college name"
                  placeholderTextColor="#9ca3af"
                />
                {errors[`${item.id}-college`] ? (
                  <Text style={styles.errorText}>{errors[`${item.id}-college`]}</Text>
                ) : null}
              </View>

              {/* Batch Year */}
              <View style={styles.field}>
                <Text style={styles.label}>Batch Year</Text>
                <View style={[styles.pickerContainer, errors[`${item.id}-batch`] && styles.inputError]}>
                  <Picker
                    selectedValue={item.batch}
                    onValueChange={(value) => updateAlumni(item.id, 'batch', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select year" value="" />
                    {batchYears.map((year) => (
                      <Picker.Item key={year} label={year} value={year} />
                    ))}
                  </Picker>
                </View>
                {errors[`${item.id}-batch`] ? (
                  <Text style={styles.errorText}>{errors[`${item.id}-batch`]}</Text>
                ) : null}
              </View>

              {/* Contact Number */}
              <View style={styles.field}>
                <Text style={styles.label}>Contact Number</Text>
                <TextInput
                  style={[styles.input, errors[`${item.id}-contactNumber`] && styles.inputError]}
                  value={item.contactNumber}
                  onChangeText={(value) => updateAlumni(item.id, 'contactNumber', value)}
                  placeholder="09XX XXX XXXX"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />
                {errors[`${item.id}-contactNumber`] ? (
                  <Text style={styles.errorText}>{errors[`${item.id}-contactNumber`]}</Text>
                ) : null}
              </View>
            </View>
          ))}

          {/* Add Button */}
          <TouchableOpacity style={styles.addButton} onPress={addNewRow} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" size={20} color="#F59E0B" />
            <Text style={styles.addButtonText}>Add a new entry</Text>
          </TouchableOpacity>
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
            <Text style={styles.submitButtonText}>Next</Text>
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
    marginBottom: 12,
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
  infoNote: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
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
  alumniEntry: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  alumniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alumniNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  deleteButton: {
    padding: 4,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 6,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  picker: {
    height: 48,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
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
