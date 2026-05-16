import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { AppSession, SchoolLevel, ApplicantType } from '../../types/admissions.types';
import SchoolLevelSelection from './SchoolLevelSelection';
import ApplicantTypeSelection from './ApplicantTypeSelection';
import { submitApplication, saveProgramSelection } from '../../services/admissions.service';

interface Props {
  navigation: any;
}

export default function AdmissionsFlow({ navigation }: Props) {
  const initialSession: AppSession = {
    step: 'select',
    schoolLevel: null,
    applicantType: null,
    applicantId: null,
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    birthdate: '',
    mobileNumber: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipCode: '',
    fatherName: '',
    fatherAddress: '',
    fatherContact: '',
    motherName: '',
    motherAddress: '',
    motherContact: '',
    guardianName: '',
    guardianAddress: '',
    guardianPhoneHome: '',
    guardianPhoneWork: '',
    academicBackground: [],
    relatives: [],
    docStates: {},
    collegeDepartment: null,
    collegeProgram: null,
    seniorHighTrack: null,
    tvlStrand: null,
    referenceNumber: null,
  };

  const [session, setSession] = useState<AppSession>(initialSession);

  // sessionRef is ALWAYS the latest session value, even inside stale closures.
  // This is critical because navigation callbacks are passed as route.params and
  // become frozen at the render time they were created — so they cannot see
  // updated session state via the normal closure mechanism.
  const sessionRef = useRef<AppSession>(initialSession);

  const updateSession = (patch: Partial<AppSession>) => {
    const next = { ...sessionRef.current, ...patch };
    sessionRef.current = next;
    setSession(next);
  };

  const handleLevelSelect = (level: SchoolLevel) => {
    updateSession({ schoolLevel: level, applicantType: null });
  };

  const handleTypeSelect = (type: ApplicantType) => {
    updateSession({ applicantType: type });
  };

  const canContinue = !!session.schoolLevel && !!session.applicantType;

  const handleContinue = () => {
    if (!canContinue) return;

    navigation.navigate('CreateAccount', {
      schoolLevel: session.schoolLevel,
      applicantType: session.applicantType,
      onSuccess: handleAccountCreated,
    });
  };

  const handleAccountCreated = (applicantId: string, email: string) => {
    console.log('Account success callback triggered for:', applicantId);
    
    // Update local state first
    updateSession({ applicantId, email, step: 'personal-profile' });

    // Navigate to Personal Profile with all necessary data
    navigation.navigate('PersonalProfile', {
      schoolLevel: sessionRef.current.schoolLevel,
      applicantType: sessionRef.current.applicantType,
      applicantId: applicantId,
      email: email,
      initialData: {},
      onSuccess: handleProfileCompleted,
      onBack: () => navigation.goBack(),
    });
  };

  const handleProfileCompleted = (data: any) => {
    // sessionRef.current.applicantId is the value set by handleAccountCreated
    // which is now synchronously reflected in the ref.
    const applicantId = sessionRef.current.applicantId;
    console.log('[AdmissionsFlow] Profile completed. applicantId from ref:', applicantId);

    updateSession({ 
      firstName: data.first_name, 
      lastName: data.last_name,
      middleName: data.middle_name,
      birthdate: data.birthdate,
      mobileNumber: data.mobile_number,
      street: data.street,
      barangay: data.barangay,
      city: data.city,
      province: data.province,
      zipCode: data.zipCode,
      step: 'parent-info' 
    });

    navigation.navigate('ParentInformation', {
      schoolLevel: sessionRef.current.schoolLevel,
      applicantType: sessionRef.current.applicantType,
      applicantId,
      initialData: { ...sessionRef.current, ...data },
      onSuccess: handleParentInfoCompleted,
      onBack: () => navigation.goBack(),
    });
  };

  const handleParentInfoCompleted = (data: any) => {
    try {
      const applicantId = sessionRef.current.applicantId;
      console.log('[AdmissionsFlow] Parent info completed. applicantId from ref:', applicantId);

      updateSession({ 
        fatherName: data.father_name,
        fatherAddress: data.father_address,
        fatherContact: data.father_contact,
        motherName: data.mother_name,
        motherAddress: data.mother_address,
        motherContact: data.mother_contact,
        guardianName: data.guardian_name,
        guardianAddress: data.guardian_address,
        guardianPhoneHome: data.guardian_phone_home,
        guardianPhoneWork: data.guardian_phone_work,
        step: 'academic-background' 
      });

      console.log('[AdmissionsFlow] Navigating to AcademicBackground...');
      navigation.navigate('AcademicBackground', {
        schoolLevel: sessionRef.current.schoolLevel,
        applicantType: sessionRef.current.applicantType,
        applicantId,
        initialData: { ...sessionRef.current, ...data },
        onSuccess: handleAcademicBackgroundCompleted,
        onBack: (partialData?: any) => {
          if (partialData?.entries) {
            console.log('[AdmissionsFlow] Saving partial Academic Background on back...');
            updateSession({ academicBackground: partialData.entries });
          }
          navigation.goBack();
        },
      });
      console.log('[AdmissionsFlow] Navigation triggered.');
    } catch (error) {
      console.error('[AdmissionsFlow] handleParentInfoCompleted error:', error);
      Alert.alert('System Error', 'An error occurred during navigation: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleAcademicBackgroundCompleted = (data: any) => {
    try {
      const applicantId = sessionRef.current.applicantId;
      console.log('[AdmissionsFlow] Academic background completed. applicantId from ref:', applicantId);

      updateSession({ 
        academicBackground: data.entries,
        step: 'alumni-info' 
      });

      console.log('[AdmissionsFlow] Navigating to AlumniRelativeInformation...');
      navigation.navigate('AlumniRelativeInformation', {
        schoolLevel: sessionRef.current.schoolLevel,
        applicantType: sessionRef.current.applicantType,
        applicantId,
        initialData: { ...sessionRef.current, ...data },
        onSuccess: handleAlumniInfoCompleted,
        onBack: (partialData?: any) => {
          if (partialData?.relatives) {
            updateSession({ relatives: partialData.relatives });
          }
          navigation.goBack();
        },
      });
      console.log('[AdmissionsFlow] Navigation triggered.');
    } catch (error) {
      console.error('[AdmissionsFlow] handleAcademicBackgroundCompleted error:', error);
      Alert.alert('System Error', 'An error occurred during navigation: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleAlumniInfoCompleted = (data: any) => {
    const applicantId = sessionRef.current.applicantId;

    updateSession({ 
      relatives: data.relatives,
      step: 'program-selection' 
    });

    console.log('[AdmissionsFlow] Alumni info completed. Processing next step...');

    // Skip Program Selection for Kinder, Elementary, and JHS
    const skipProgramSelection = 
      sessionRef.current.schoolLevel === 'Kinder' || 
      sessionRef.current.schoolLevel === 'Elementary' || 
      sessionRef.current.schoolLevel === 'Junior High School';

    if (skipProgramSelection) {
      console.log('[AdmissionsFlow] Skipping ProgramSelection for', sessionRef.current.schoolLevel);
      
      // Save program selection with nulls in background for data consistency
      saveProgramSelection({
        applicant_id: applicantId,
        school_level: sessionRef.current.schoolLevel!,
        applicant_type: sessionRef.current.applicantType!,
      });

      updateSession({ step: 'documents' });
      navigation.navigate('DocumentUpload', {
        schoolLevel: sessionRef.current.schoolLevel,
        applicantType: sessionRef.current.applicantType,
        applicantId,
        initialData: { ...sessionRef.current, ...data },
        onSuccess: handleDocumentsCompleted,
        onBack: () => navigation.goBack(),
      });
      return;
    }

    console.log('[AdmissionsFlow] Navigating to ProgramSelection...');
    navigation.navigate('ProgramSelection', {
      schoolLevel: sessionRef.current.schoolLevel,
      applicantType: sessionRef.current.applicantType,
      applicantId,
      initialData: { ...sessionRef.current, ...data },
      onSuccess: handleProgramSelectionCompleted,
      onBack: (partialData?: any) => {
        if (partialData) {
          updateSession({
            collegeDepartment: partialData.collegeDepartment,
            collegeProgram: partialData.collegeProgram,
            seniorHighTrack: partialData.seniorHighTrack,
          });
        }
        navigation.goBack();
      },
    });
  };

  const handleProgramSelectionCompleted = (data: any) => {
    const applicantId = sessionRef.current.applicantId;

    updateSession({ 
      collegeDepartment: data.college_department,
      collegeProgram: data.college_program,
      seniorHighTrack: data.senior_high_track,
      step: 'documents' 
    });

    navigation.navigate('DocumentUpload', {
      schoolLevel: sessionRef.current.schoolLevel,
      applicantType: sessionRef.current.applicantType,
      applicantId,
      initialData: { ...sessionRef.current, ...data },
      onSuccess: handleDocumentsCompleted,
      onBack: (partialData?: any) => {
        if (partialData?.docStates) {
          updateSession({ docStates: partialData.docStates });
        }
        navigation.goBack();
      },
    });
  };

  const handleDocumentsCompleted = async (data: any) => {
    const s = sessionRef.current;  // snapshot of latest session

    updateSession({ 
      docStates: data.docStates,
      step: 'confirmation' 
    });

    console.log('[AdmissionsFlow] Submitting application for:', s.applicantId);
    const res = await submitApplication(s.applicantId!);

    if (res.error) {
      Alert.alert('Database Error', 'Your application profile was found but the final submission failed: ' + res.error.message);
      return;
    }

    Alert.alert('Success!', 'Your application has been received. Navigating to confirmation...');

    const referenceNumber = res.data!.reference_number;
    updateSession({ referenceNumber });

    navigation.navigate('ApplicationConfirmation', {
      referenceNumber,
      email: s.email,
      schoolLevel: s.schoolLevel,
      applicantType: s.applicantType,
      applicantName: `${s.firstName} ${s.lastName}`,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
        <Text style={styles.title}>Start Your Application</Text>
        <Text style={styles.subtitle}>Select your school level and applicant type</Text>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View
            style={[
              styles.progressDot,
              session.schoolLevel ? styles.progressDotActive : styles.progressDotInactive,
            ]}
          >
            <Text
              style={[
                styles.progressDotText,
                session.schoolLevel
                  ? styles.progressDotTextActive
                  : styles.progressDotTextInactive,
              ]}
            >
              1
            </Text>
          </View>
          <Text
            style={[
              styles.progressLabel,
              session.schoolLevel ? styles.progressLabelActive : styles.progressLabelInactive,
            ]}
          >
            School Level
          </Text>
        </View>

        <View
          style={[
            styles.progressLine,
            session.schoolLevel ? styles.progressLineActive : styles.progressLineInactive,
          ]}
        />

        <View style={styles.progressStep}>
          <View
            style={[
              styles.progressDot,
              session.applicantType ? styles.progressDotActive : styles.progressDotInactive,
            ]}
          >
            <Text
              style={[
                styles.progressDotText,
                session.applicantType
                  ? styles.progressDotTextActive
                  : styles.progressDotTextInactive,
              ]}
            >
              2
            </Text>
          </View>
          <Text
            style={[
              styles.progressLabel,
              session.applicantType ? styles.progressLabelActive : styles.progressLabelInactive,
            ]}
          >
            Applicant Type
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <SchoolLevelSelection selected={session.schoolLevel} onSelect={handleLevelSelect} />

        {session.schoolLevel && (
          <View style={styles.section}>
            <ApplicantTypeSelection
              schoolLevel={session.schoolLevel}
              selected={session.applicantType}
              onSelect={handleTypeSelect}
            />
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue →</Text>
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    backgroundColor: '#F59E0B',
  },
  progressDotInactive: {
    backgroundColor: '#e5e7eb',
  },
  progressDotText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressDotTextActive: {
    color: '#fff',
  },
  progressDotTextInactive: {
    color: '#9ca3af',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressLabelActive: {
    color: '#F59E0B',
  },
  progressLabelInactive: {
    color: '#d1d5db',
  },
  progressLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#F59E0B',
  },
  progressLineInactive: {
    backgroundColor: '#e5e7eb',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginTop: 20,
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
  },
  continueButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#e5e7eb',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
