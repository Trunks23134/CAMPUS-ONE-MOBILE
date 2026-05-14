import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { AppSession, SchoolLevel, ApplicantType } from '../../types/admissions.types';
import SchoolLevelSelection from './SchoolLevelSelection';
import ApplicantTypeSelection from './ApplicantTypeSelection';
import { submitApplication } from '../../services/admissions.service';
import { shadows } from '../../theme/shadows';

interface Props {
  navigation: any;
}

export default function AdmissionsFlow({ navigation }: Props) {
  const [session, setSession] = useState<AppSession>({
    step: 'select',
    schoolLevel: null,
    applicantType: null,
    applicantId: null,
    firstName: '',
    lastName: '',
    email: '',
    collegeDepartment: null,
    collegeProgram: null,
    seniorHighTrack: null,
    tvlStrand: null,
    referenceNumber: null,
  });

  const updateSession = (patch: Partial<AppSession>) => {
    setSession((prev) => ({ ...prev, ...patch }));
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

    // Navigate to create account screen
    navigation.navigate('CreateAccount', {
      schoolLevel: session.schoolLevel,
      applicantType: session.applicantType,
      onSuccess: handleAccountCreated,
    });
  };

  const handleAccountCreated = (applicantId: string, email: string) => {
    updateSession({ applicantId, email, step: 'personal-profile' });

    // Navigate to personal profile screen
    navigation.navigate('PersonalProfile', {
      schoolLevel: session.schoolLevel,
      applicantType: session.applicantType,
      applicantId,
      email,
      onSuccess: handleProfileCompleted,
      onBack: () => navigation.goBack(),
    });
  };

  const handleProfileCompleted = (firstName: string, lastName: string) => {
    updateSession({ firstName, lastName, step: 'parent-info' });

    // Navigate to parent info screen
    navigation.navigate('ParentInformation', {
      schoolLevel: session.schoolLevel,
      applicantType: session.applicantType,
      applicantId: session.applicantId,
      onSuccess: handleParentInfoCompleted,
      onBack: () => navigation.goBack(),
    });
  };

  const handleParentInfoCompleted = () => {
    updateSession({ step: 'academic-background' });

    // Navigate to academic background screen
    navigation.navigate('AcademicBackground', {
      schoolLevel: session.schoolLevel,
      applicantType: session.applicantType,
      applicantId: session.applicantId,
      onSuccess: handleAcademicBackgroundCompleted,
      onBack: () => navigation.goBack(),
    });
  };

  const handleAcademicBackgroundCompleted = () => {
    updateSession({ step: 'alumni-info' });

    // Navigate to alumni relatives screen
    navigation.navigate('AlumniRelativeInformation', {
      schoolLevel: session.schoolLevel,
      applicantType: session.applicantType,
      applicantId: session.applicantId,
      onSuccess: handleAlumniInfoCompleted,
      onBack: () => navigation.goBack(),
    });
  };

  const handleAlumniInfoCompleted = () => {
    updateSession({ step: 'program-selection' });

    // Navigate to program selection screen
    navigation.navigate('ProgramSelection', {
      schoolLevel: session.schoolLevel,
      applicantType: session.applicantType,
      applicantId: session.applicantId,
      onSuccess: handleProgramSelectionCompleted,
      onBack: () => navigation.goBack(),
    });
  };

  const handleProgramSelectionCompleted = (data: any) => {
    updateSession({
      step: 'documents',
      collegeDepartment: data.collegeDepartment || null,
      collegeProgram: data.collegeProgram || null,
      seniorHighTrack: data.seniorHighTrack || null,
      tvlStrand: data.tvlStrand || null,
    });

    // Navigate to document upload screen
    navigation.navigate('DocumentUpload', {
      schoolLevel: session.schoolLevel,
      applicantType: session.applicantType,
      applicantId: session.applicantId,
      onSuccess: handleDocumentUploadCompleted,
      onBack: () => navigation.goBack(),
    });
  };

  const handleDocumentUploadCompleted = async () => {
    updateSession({ step: 'confirmation' });

    // Submit the application
    const res = await submitApplication(session.applicantId!);

    if (res.error) {
      Alert.alert('Error', res.error.message);
      return;
    }

    const referenceNumber = res.data!.reference_number;
    updateSession({ referenceNumber });

    // Navigate to confirmation screen
    navigation.navigate('ApplicationConfirmation', {
      referenceNumber,
      email: session.email,
      schoolLevel: session.schoolLevel,
      applicantType: session.applicantType,
      applicantName: `${session.firstName} ${session.lastName}`,
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
    ...shadows.primaryBtnSm,
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
