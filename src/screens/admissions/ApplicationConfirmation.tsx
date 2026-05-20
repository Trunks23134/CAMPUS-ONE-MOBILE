import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import type { SchoolLevel, ApplicantType } from '../../types/admissions.types';

interface Props {
  navigation: any;
  route: {
    params: {
      referenceNumber: string;
      email: string;
      schoolLevel: SchoolLevel;
      applicantType: ApplicantType;
      applicantName: string;
    };
  };
}

export default function ApplicationConfirmation({ navigation, route }: Props) {
  const { referenceNumber, email, schoolLevel, applicantType, applicantName } = route.params;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referenceNumber);
    setCopied(true);
    Alert.alert('Copied!', 'Reference number copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrackApplication = () => {
    navigation.navigate('ApplicationTracking');
  };

  const handleReturnHome = () => {
    navigation.navigate('Welcome');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:admissions@campus.edu');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <View style={styles.headerContent}>
          <Ionicons name="school-outline" size={20} color="#F59E0B" />
          <Text style={styles.headerText}>CAMPUS Portal</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Success Icon */}
        <View style={styles.successSection}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Application Submitted!</Text>
          <Text style={styles.successSubtitle}>
            Thank you, {applicantName}! Your application has been received.
          </Text>
        </View>

        {/* Reference Number Card */}
        <View style={styles.referenceCard}>
          <Text style={styles.referenceLabel}>YOUR REFERENCE NUMBER</Text>
          <View style={styles.referenceNumberContainer}>
            <Text style={styles.referenceNumber}>{referenceNumber}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopy}
              activeOpacity={0.7}
            >
              <Ionicons
                name={copied ? 'checkmark-circle' : 'copy-outline'}
                size={20}
                color={copied ? '#10b981' : '#9ca3af'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ IMPORTANT: Save this reference number! You'll need it to track your application.
            </Text>
          </View>
        </View>

        {/* Application Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Application Details</Text>
          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Applicant Name</Text>
              <Text style={styles.detailValue}>{applicantName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email Address</Text>
              <Text style={styles.detailValue}>{email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>School Level</Text>
              <Text style={styles.detailValue}>{schoolLevel}</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Text style={styles.detailLabel}>Applicant Type</Text>
              <Text style={styles.detailValue}>{applicantType}</Text>
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.stepsCard}>
          <View style={styles.stepsHeader}>
            <Ionicons name="document-text-outline" size={20} color="#F59E0B" />
            <Text style={styles.cardTitle}>What Happens Next?</Text>
          </View>
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Email Confirmation</Text>
                <Text style={styles.stepDescription}>
                  Check your email at {email} for your reference number and next steps.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Application Review</Text>
                <Text style={styles.stepDescription}>
                  Our admissions team will review your application and documents. This typically
                  takes 3-5 business days.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Track Your Status</Text>
                <Text style={styles.stepDescription}>
                  Use your reference number to check your application status anytime.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Admission Decision</Text>
                <Text style={styles.stepDescription}>
                  You'll receive an email notification once a decision has been made on your
                  application.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleTrackApplication}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Track My Application</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReturnHome}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Need help? Contact the Admissions Office</Text>
          <View style={styles.contactLinks}>
            <Text style={styles.contactText}>Email: </Text>
            <TouchableOpacity onPress={handleEmailPress}>
              <Text style={styles.contactLink}>admissions@campus.edu</Text>
            </TouchableOpacity>
            <Text style={styles.contactText}> | Phone: </Text>
            <TouchableOpacity onPress={handlePhonePress}>
              <Text style={styles.contactLink}>(123) 456-7890</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    backgroundColor: '#1a1a1a',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  referenceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  referenceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  referenceNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  referenceNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F59E0B',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  copyButton: {
    padding: 8,
  },
  warningBox: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 12,
    padding: 12,
  },
  warningText: {
    fontSize: 11,
    color: '#92400e',
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsCard: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  detailsList: {
    gap: 0,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  stepsCard: {
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
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stepsList: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  emailNotice: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  emailNoticeContent: {
    flex: 1,
  },
  emailNoticeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  emailNoticeText: {
    fontSize: 11,
    color: '#1e40af',
    lineHeight: 16,
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
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
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  contactLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 11,
    color: '#9ca3af',
  },
  contactLink: {
    fontSize: 11,
    color: '#F59E0B',
    textDecorationLine: 'underline',
  },
});
