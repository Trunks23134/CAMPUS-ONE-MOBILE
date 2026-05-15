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
import { saveAcademicBackground } from '../../services/admissions.service';

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

interface GradeEntry {
  id: string;
  level: string;
  schoolName: string;
  completionYear: string;
}

function getGradeLevels(schoolLevel: SchoolLevel): string[] {
  switch (schoolLevel) {
    case 'College':
      return ['Grade 12', 'Grade 11', 'Grade 10', 'Grade 9', 'Grade 8', 'Grade 7', 'Grade 6'];
    case 'Senior High School':
      return ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 7', 'Grade 6'];
    case 'Junior High School':
      return ['Grade 6', 'Grade 5', 'Grade 4', 'Grade 3', 'Grade 2', 'Grade 1'];
    case 'Elementary':
      return ['Kindergarten', 'Nursery'];
    case 'Kinder':
      return ['Nursery', 'Preschool'];
    default:
      return [];
  }
}

function generateYearOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let i = 0; i <= 20; i++) {
    years.push((currentYear - i).toString());
  }
  return years;
}

export default function AcademicBackground({ navigation, route }: Props) {
  const { schoolLevel, applicantType, applicantId, onSuccess, onBack } = route.params;
  const gradeLevels = getGradeLevels(schoolLevel);
  const yearOptions = generateYearOptions();

  const [grades, setGrades] = useState<GradeEntry[]>(
    gradeLevels.map((level, index) => ({
      id: `initial-${index}`,
      level,
      schoolName: '',
      completionYear: '',
    }))
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const updateGrade = (id: string, field: keyof GradeEntry, value: string) => {
    setGrades((prev) =>
      prev.map((grade) => (grade.id === id ? { ...grade, [field]: value } : grade))
    );
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${id}-${field}`];
      return newErrors;
    });
  };

  const addNewRow = () => {
    const newId = `custom-${Date.now()}`;
    setGrades((prev) => [
      ...prev,
      {
        id: newId,
        level: '',
        schoolName: '',
        completionYear: '',
      },
    ]);
  };

  const deleteRow = (id: string) => {
    setGrades((prev) => prev.filter((grade) => grade.id !== id));
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
    const errs: Record<string, string> = {};

    grades.forEach((grade) => {
      if (!grade.level.trim()) {
        errs[`${grade.id}-level`] = 'Required';
      }
      if (!grade.schoolName.trim()) {
        errs[`${grade.id}-schoolName`] = 'Required';
      }
      if (!grade.completionYear.trim()) {
        errs[`${grade.id}-completionYear`] = 'Required';
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    const entries = grades.map((grade) => ({
      grade_level: grade.level,
      school_name: grade.schoolName,
      completion_year: grade.completionYear,
    }));

    const res = await saveAcademicBackground({
      applicant_id: applicantId,
      entries,
    });

    setLoading(false);

    if (res.error) {
      Alert.alert('Error', res.error.message);
    } else {
      onSuccess();
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
        <Text style={styles.title}>Academic Background</Text>
        <Text style={styles.subtitle}>Share your academic history</Text>
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

        {/* Academic Background Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Academic Background</Text>
          </View>

          {/* Grade Entries */}
          {grades.map((grade, index) => {
            const isCustomRow = grade.id.startsWith('custom-');

            return (
              <View key={grade.id} style={styles.gradeEntry}>
                <View style={styles.gradeHeader}>
                  <Text style={styles.gradeNumber}>Entry {index + 1}</Text>
                  {isCustomRow && (
                    <TouchableOpacity onPress={() => deleteRow(grade.id)} style={styles.deleteButton}>
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Grade Level */}
                <View style={styles.field}>
                  <Text style={styles.label}>Grade Level</Text>
                  {isCustomRow ? (
                    <TextInput
                      style={[styles.input, errors[`${grade.id}-level`] && styles.inputError]}
                      value={grade.level}
                      onChangeText={(value) => updateGrade(grade.id, 'level', value)}
                      placeholder="e.g., Grade 10"
                      placeholderTextColor="#9ca3af"
                    />
                  ) : (
                    <View style={styles.readOnlyInput}>
                      <Text style={styles.readOnlyText}>{grade.level}</Text>
                    </View>
                  )}
                  {errors[`${grade.id}-level`] ? (
                    <Text style={styles.errorText}>{errors[`${grade.id}-level`]}</Text>
                  ) : null}
                </View>

                {/* School Name */}
                <View style={styles.field}>
                  <Text style={styles.label}>School Name</Text>
                  <TextInput
                    style={[styles.input, errors[`${grade.id}-schoolName`] && styles.inputError]}
                    value={grade.schoolName}
                    onChangeText={(value) => updateGrade(grade.id, 'schoolName', value)}
                    placeholder="Enter school name"
                    placeholderTextColor="#9ca3af"
                  />
                  {errors[`${grade.id}-schoolName`] ? (
                    <Text style={styles.errorText}>{errors[`${grade.id}-schoolName`]}</Text>
                  ) : null}
                </View>

                {/* Completion Year */}
                <View style={styles.field}>
                  <Text style={styles.label}>Completion Year</Text>
                  <View style={[styles.pickerContainer, errors[`${grade.id}-completionYear`] && styles.inputError]}>
                    <Picker
                      selectedValue={grade.completionYear}
                      onValueChange={(value) => updateGrade(grade.id, 'completionYear', value)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select year" value="" />
                      {yearOptions.map((year) => (
                        <Picker.Item key={year} label={year} value={year} />
                      ))}
                    </Picker>
                  </View>
                  {errors[`${grade.id}-completionYear`] ? (
                    <Text style={styles.errorText}>{errors[`${grade.id}-completionYear`]}</Text>
                  ) : null}
                </View>
              </View>
            );
          })}

          {/* Add Button */}
          <TouchableOpacity style={styles.addButton} onPress={addNewRow} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" size={20} color="#F59E0B" />
            <Text style={styles.addButtonText}>Add Another Grade Level</Text>
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
  gradeEntry: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gradeNumber: {
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
  readOnlyInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
  },
  readOnlyText: {
    fontSize: 14,
    color: '#6b7280',
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
    borderWidth: 2,
    borderStyle: 'dashed',
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
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  backButtonFooter: {
    borderWidth: 2,
    borderColor: '#d1d5db',
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
