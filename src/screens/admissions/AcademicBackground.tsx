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
      onSuccess: (data: any) => void;
      onBack: () => void;
      initialData?: any;
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
      return ['Primary', 'Intermediate', 'Junior High School', 'Senior High School'];
    case 'Senior High School':
      return ['Primary', 'Intermediate', 'Junior High School'];
    case 'Junior High School':
      return ['Primary', 'Intermediate'];
    case 'Elementary':
      return ['Preparatory', 'Kindergarten', 'Nursery'];
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
  const { schoolLevel, applicantType, applicantId, onSuccess, onBack, initialData } = route.params;
  const gradeLevels = getGradeLevels(schoolLevel);
  const yearOptions = generateYearOptions();

  const [grades, setGrades] = useState<GradeEntry[]>(() => {
    const requiredLevels = getGradeLevels(schoolLevel);
    
    // Create initial rows for all required levels
    const initialRows = requiredLevels.map((level, index) => ({
      id: `initial-${index}`,
      level,
      schoolName: '',
      completionYear: '',
    }));

    // If we have persisted data, prioritize it completely
    if (initialData?.academicBackground && initialData.academicBackground.length > 0) {
      return initialData.academicBackground.map((entry: any, index: number) => ({
        id: entry.id || `persisted-${index}`,
        level: entry.grade_level || '',
        schoolName: entry.school_name || '',
        completionYear: entry.completion_year || '',
      }));
    }
    
    return initialRows;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Sync grades when schoolLevel changes (e.g. if user went back and changed level)
  React.useEffect(() => {
    const requiredLevels = getGradeLevels(schoolLevel);
    const initialRows = requiredLevels.map((level, index) => ({
      id: `initial-${index}`,
      level,
      schoolName: '',
      completionYear: '',
    }));

    setGrades(prev => {
      // If the number of rows or the levels themselves changed, we need to re-initialize
      // but try to preserve existing data for matching levels.
      return initialRows.map(row => {
        const matchingEntry = prev.find(p => p.level === row.level);
        if (matchingEntry) {
          return {
            ...row,
            schoolName: matchingEntry.schoolName,
            completionYear: matchingEntry.completionYear,
          };
        }
        return row;
      });
    });
  }, [schoolLevel]);
  
  const updateGrade = (id: string, field: keyof GradeEntry, value: string) => {
    let finalValue = value;
    if (field === 'completionYear') {
      // Numbers only, max 4 chars
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 4);
    }

    setGrades((prev) =>
      prev.map((grade) => (grade.id === id ? { ...grade, [field]: finalValue } : grade))
    );
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${id}-${field}`];
      return newErrors;
    });
  };

  const addGrade = () => {
    setGrades((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        level: '',
        schoolName: '',
        completionYear: '',
      },
    ]);
  };

  const removeGrade = (id: string) => {
    // Prevent removing initial rows if you want them mandatory, 
    // or just allow removing any row. Let's allow removing any except if it's the last one.
    if (grades.length <= 1) return;
    setGrades((prev) => prev.filter((g) => g.id !== id));
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

    if (Object.keys(errs).length > 0) {
      Alert.alert('Incomplete Information', 'Please provide the level, school name, and completion year for all entries.');
    }

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
      // Proceed immediately without the intermediate success alert
      onSuccess({ entries });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            const entries = grades.map((grade) => ({
              grade_level: grade.level,
              school_name: grade.schoolName,
              completion_year: grade.completionYear,
            }));
            onBack({ entries });
          }}
        >
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

        {/* Academic Background Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Academic Background</Text>
          </View>

          {/* Grade Entries */}
          {grades.map((grade, index) => {
            return (
              <View key={grade.id} style={styles.gradeEntry}>
                <View style={styles.gradeHeader}>
                  <View style={[styles.pickerContainer, { flex: 1, marginRight: 10 }, errors[`${grade.id}-level`] && styles.inputError]}>
                    <Picker
                      selectedValue={grade.level}
                      onValueChange={(value) => updateGrade(grade.id, 'level', value)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select level" value="" />
                      <Picker.Item label="Primary" value="Primary" />
                      <Picker.Item label="Intermediate" value="Intermediate" />
                      <Picker.Item label="Junior High School" value="Junior High School" />
                      <Picker.Item label="Senior High School" value="Senior High School" />
                      <Picker.Item label="College (Transferee)" value="College" />
                    </Picker>
                  </View>
                  {grades.length > 1 && (
                    <TouchableOpacity onPress={() => removeGrade(grade.id)} style={styles.removeBtn}>
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* School Name */}
                <View style={styles.field}>
                  <Text style={styles.label}>School Name <Text style={styles.required}>*</Text></Text>
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
                  <Text style={styles.label}>Completion Year <Text style={styles.required}>*</Text></Text>
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
          <TouchableOpacity style={styles.addButton} onPress={addGrade}>
            <Ionicons name="add-circle-outline" size={20} color="#F59E0B" />
            <Text style={styles.addButtonText}>Add Another School</Text>
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

        <TouchableOpacity 
          style={styles.backButtonFooter} 
          onPress={() => {
            const entries = grades.map((grade) => ({
              grade_level: grade.level,
              school_name: grade.schoolName,
              completion_year: grade.completionYear,
            }));
            onBack({ entries });
          }} 
          activeOpacity={0.7}
        >
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
  gradeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F59E0B',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fef3c7',
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
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#F59E0B',
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: '#fffbeb',
  },
  addButtonText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  removeBtn: {
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
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
