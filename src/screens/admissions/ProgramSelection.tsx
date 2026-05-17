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
import type {
  SchoolLevel,
  ApplicantType,
  CollegeDepartment,
  CollegeProgram,
  SeniorHighTrack,
} from '../../types/admissions.types';
import { saveProgramSelection } from '../../services/admissions.service';
import {
  COLLEGE_DEPARTMENTS,
  getProgramsForDepartment,
  SENIOR_HIGH_TRACKS,
  getEducationLevelDisplay,
} from '../../services/program.config';

interface Props {
  navigation: any;
  route: {
    params: {
      schoolLevel: SchoolLevel;
      applicantType: ApplicantType;
      applicantId: string;
      onSuccess: (data: any) => void;
      onBack: (partialData?: any) => void;
      initialData?: any;
    };
  };
}

export default function ProgramSelection({ navigation, route }: Props) {
  const { schoolLevel, applicantType, applicantId, onSuccess, onBack, initialData } = route.params;

  const [collegeDepartment, setCollegeDepartment] = useState<any>(
    initialData?.collegeDepartment 
      ? (COLLEGE_DEPARTMENTS.includes(initialData.collegeDepartment as any) ? initialData.collegeDepartment as any : 'Others')
      : null
  );
  const [otherDepartment, setOtherDepartment] = useState(
    initialData?.collegeDepartment && !COLLEGE_DEPARTMENTS.includes(initialData.collegeDepartment as any)
      ? initialData.collegeDepartment
      : ''
  );
  const [collegeProgram, setCollegeProgram] = useState<any>(
    initialData?.collegeProgram 
      ? (getProgramsForDepartment(collegeDepartment as any).includes(initialData.collegeProgram as any) ? initialData.collegeProgram as any : 'Others')
      : null
  );
  const [otherProgram, setOtherProgram] = useState(
    initialData?.collegeProgram && !getProgramsForDepartment(collegeDepartment as any).includes(initialData.collegeProgram as any)
      ? initialData.collegeProgram
      : ''
  );
  const [seniorHighTrack, setSeniorHighTrack] = useState<SeniorHighTrack | null>(
    initialData?.seniorHighTrack || null
  );
  const [otherTrack, setOtherTrack] = useState(initialData?.otherTrack || '');
  const [loading, setLoading] = useState(false);

  const getAvailablePrograms = (): CollegeProgram[] => {
    if (!collegeDepartment) return [];
    return getProgramsForDepartment(collegeDepartment);
  };

  const canContinue = (): boolean => {
    if (schoolLevel === 'College') {
      if (!collegeDepartment) return false;
      if (collegeDepartment === 'Others' && !otherDepartment.trim()) return false;
      if (!collegeProgram) return false;
      if (collegeProgram === 'Others' && !otherProgram.trim()) return false;
      return true;
    }
    if (schoolLevel === 'Senior High School') {
      if (!seniorHighTrack) return false;
      if (seniorHighTrack === 'Other' && !otherTrack.trim()) return false;
      return true;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!canContinue()) return;

    setLoading(true);

    if (schoolLevel === 'College') {
      const finalDept = collegeDepartment === 'Others' ? otherDepartment : collegeDepartment;
      const finalProgram = collegeProgram === 'Others' ? otherProgram : collegeProgram;
      const res = await saveProgramSelection({
        applicant_id: applicantId,
        school_level: schoolLevel,
        applicant_type: applicantType,
        college_department: finalDept!,
        college_program: finalProgram!,
      });

      setLoading(false);

      if (res.error) {
        Alert.alert('Error', res.error.message);
        return;
      }

      onSuccess({
        collegeDepartment: collegeDepartment!,
        collegeProgram: collegeProgram!,
      });
    } else if (schoolLevel === 'Senior High School') {
      const finalTrack = seniorHighTrack === 'Other' ? otherTrack : seniorHighTrack;
      const res = await saveProgramSelection({
        applicant_id: applicantId,
        school_level: schoolLevel,
        applicant_type: applicantType,
        senior_high_track: finalTrack!,
      });

      setLoading(false);

      if (res.error) {
        Alert.alert('Error', res.error.message);
        return;
      }

      onSuccess({ seniorHighTrack: finalTrack! as SeniorHighTrack });
    } else {
      // For other levels (Junior High, Elementary, Kinder)
      const res = await saveProgramSelection({
        applicant_id: applicantId,
        school_level: schoolLevel,
        applicant_type: applicantType,
      });

      setLoading(false);

      if (res.error) {
        Alert.alert('Error', res.error.message);
        return;
      }

      onSuccess({});
    }
  };

  // ─── Render: Junior High, Elementary, Kinder ─────────────────────────────────
  if (
    schoolLevel === 'Junior High School' ||
    schoolLevel === 'Elementary' ||
    schoolLevel === 'Kinder'
  ) {
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
          <Text style={styles.title}>Program Selection</Text>
          <Text style={styles.subtitle}>Your education level</Text>
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

          {/* Education Level Card */}
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Education Level</Text>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyText}>{getEducationLevelDisplay(schoolLevel)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleContinue}
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

          <TouchableOpacity style={styles.backButtonFooter} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Render: College ──────────────────────────────────────────────────────────
  if (schoolLevel === 'College') {
    const availablePrograms = getAvailablePrograms();

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              onBack({
                collegeDepartment,
                otherDepartment,
                collegeProgram,
                otherProgram,
                seniorHighTrack,
                otherTrack
              });
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
          <Text style={styles.title}>Program Selection</Text>
          <Text style={styles.subtitle}>Choose your department and program</Text>
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

          {/* Program Selection Card */}
          <View style={styles.card}>
            {/* Department Selection */}
            <View style={styles.field}>
              <Text style={styles.label}>College Department <Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={collegeDepartment ?? ''}
                  onValueChange={(value) => {
                    setCollegeDepartment(value as CollegeDepartment);
                    setCollegeProgram(null); // Reset program when department changes
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a department..." value="" />
                  {COLLEGE_DEPARTMENTS.map((dept) => (
                    <Picker.Item key={dept} label={dept} value={dept} />
                  ))}
                  <Picker.Item label="Others (Please specify)" value="Others" />
                </Picker>
              </View>
            </View>

            {/* Other Department Text Entry */}
            {collegeDepartment === 'Others' && (
              <View style={styles.field}>
                <Text style={styles.label}>Please specify your department <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={otherDepartment}
                  onChangeText={setOtherDepartment}
                  placeholder="Enter your department name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            )}

            {/* Program Selection */}
            <View style={styles.field}>
              <Text style={styles.label}>Program / Course <Text style={styles.required}>*</Text></Text>
              <View style={[styles.pickerContainer, !collegeDepartment && styles.pickerDisabled]}>
                <Picker
                  selectedValue={collegeProgram ?? ''}
                  onValueChange={(value) => setCollegeProgram(value as CollegeProgram)}
                  enabled={!!collegeDepartment}
                  style={styles.picker}
                >
                  <Picker.Item
                    label={collegeDepartment ? 'Select a program...' : 'Select a department first'}
                    value=""
                  />
                  {availablePrograms.map((prog) => (
                    <Picker.Item key={prog} label={prog} value={prog} />
                  ))}
                  <Picker.Item label="Others (Please specify)" value="Others" />
                </Picker>
              </View>
            </View>

            {/* Other Program Text Entry */}
            {collegeProgram === 'Others' && (
              <View style={styles.field}>
                <Text style={styles.label}>Please specify your program <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={otherProgram}
                  onChangeText={setOtherProgram}
                  placeholder="Enter your program name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            )}

            {/* Program Description */}
            {collegeProgram && (
              <View style={styles.field}>
                <Text style={styles.label}>Program Description</Text>
                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionText}>
                    Program description will be available soon.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!canContinue() || loading) && styles.submitButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!canContinue() || loading}
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

          <TouchableOpacity 
            style={styles.backButtonFooter} 
            onPress={() => {
              onBack({
                collegeDepartment,
                otherDepartment,
                collegeProgram,
                otherProgram,
                seniorHighTrack,
                otherTrack
              });
            }} 
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Render: Senior High School ───────────────────────────────────────────────
  if (schoolLevel === 'Senior High School') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              onBack({
                collegeDepartment,
                otherDepartment,
                collegeProgram,
                otherProgram,
                seniorHighTrack,
                otherTrack
              });
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
          <Text style={styles.title}>Program Selection</Text>
          <Text style={styles.subtitle}>Choose your track and strand</Text>
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

          {/* Track Selection Card */}
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Track <Text style={styles.required}>*</Text></Text>
              <View style={styles.trackButtons}>
                {SENIOR_HIGH_TRACKS.map((track) => (
                  <TouchableOpacity
                    key={track}
                    onPress={() => {
                      setSeniorHighTrack(track);
                    }}
                    style={[
                      styles.trackButton,
                      seniorHighTrack === track && styles.trackButtonActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.trackButtonText,
                        seniorHighTrack === track && styles.trackButtonTextActive,
                      ]}
                    >
                      {track}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {seniorHighTrack === 'Other' && (
              <View style={[styles.field, { marginTop: 16 }]}>
                <Text style={styles.label}>Please specify your track <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={otherTrack}
                  onChangeText={setOtherTrack}
                  placeholder="e.g., Sports Track, Arts & Design"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!canContinue() || loading) && styles.submitButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!canContinue() || loading}
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

          <TouchableOpacity 
            style={styles.backButtonFooter} 
            onPress={() => {
              onBack({
                collegeDepartment,
                otherDepartment,
                collegeProgram,
                otherProgram,
                seniorHighTrack,
                otherTrack
              });
            }} 
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
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
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: {
    color: '#ef4444',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  pickerDisabled: {
    backgroundColor: '#f3f4f6',
    opacity: 0.6,
  },
  picker: {
    height: 48,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 14,
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
    color: '#1f2937',
    fontWeight: '600',
  },
  descriptionBox: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  descriptionText: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  trackButtons: {
    gap: 10,
  },
  trackButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  trackButtonActive: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'left',
  },
  trackButtonTextActive: {
    color: '#92400E',
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
    backgroundColor: '#e5e7eb',
    shadowOpacity: 0,
    elevation: 0,
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
