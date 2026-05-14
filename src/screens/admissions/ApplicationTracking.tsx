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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchApplicationStatus,
  type FullApplicationStatus,
  type ApplicationProgress,
  type ApplicationDocument,
} from '../../services/tracking.service';
import { shadows } from '../../theme/shadows';

interface ApplicationTrackingProps {
  navigation: any;
}

export default function ApplicationTracking({ navigation }: ApplicationTrackingProps) {
  const [email, setEmail] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<FullApplicationStatus | null>(null);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!email.trim() || !referenceNumber.trim()) {
      setError('Please enter both email and reference number');
      return;
    }

    setLoading(true);
    setError('');

    const result = await fetchApplicationStatus(email.trim(), referenceNumber.trim());

    setLoading(false);

    if (result.error || !result.data) {
      setError(result.error?.message || 'Failed to load application');
      return;
    }

    setStatus(result.data);
  };

  const handleReset = () => {
    setStatus(null);
    setEmail('');
    setReferenceNumber('');
    setError('');
  };

  const getStatusColor = (statusText: string) => {
    switch (statusText) {
      case 'Passed':
        return { bg: '#dcfce7', border: '#86efac', text: '#166534' };
      case 'Not Accepted':
        return { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' };
      default:
        return { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' };
    }
  };

  const getStatusIcon = (statusText: string) => {
    switch (statusText) {
      case 'Passed':
        return 'checkmark-circle';
      case 'Not Accepted':
        return 'close-circle';
      default:
        return 'time';
    }
  };

  // If status is loaded, show status view
  if (status) {
    const statusColors = getStatusColor(status.application.status);

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleReset}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Ionicons name="school-outline" size={20} color="#F59E0B" />
            <Text style={styles.headerText}>CAMPUS Portal</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Status Overview */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusHeaderLeft}>
                <Text style={styles.applicantName}>{status.application.full_name}</Text>
                <Text style={styles.applicantInfo}>
                  {status.application.school_level} • {status.application.applicant_type}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColors.bg, borderColor: statusColors.border },
                ]}
              >
                <Ionicons
                  name={getStatusIcon(status.application.status) as any}
                  size={20}
                  color={statusColors.text}
                />
                <Text style={[styles.statusBadgeText, { color: statusColors.text }]}>
                  {status.application.status}
                </Text>
              </View>
            </View>

            <View style={styles.statusDetails}>
              <View style={styles.statusDetailItem}>
                <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                <View style={styles.statusDetailText}>
                  <Text style={styles.statusDetailLabel}>Submitted</Text>
                  <Text style={styles.statusDetailValue}>
                    {new Date(status.application.application_submitted_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              {status.application.reviewed_at && (
                <View style={styles.statusDetailItem}>
                  <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                  <View style={styles.statusDetailText}>
                    <Text style={styles.statusDetailLabel}>Last Updated</Text>
                    <Text style={styles.statusDetailValue}>
                      {new Date(status.application.reviewed_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Progress Tracker */}
          <View style={styles.progressCard}>
            <Text style={styles.cardTitle}>Application Progress</Text>
            <View style={styles.progressList}>
              {status.progress.map((step, index) => (
                <View key={step.step} style={styles.progressItem}>
                  {index < status.progress.length - 1 && (
                    <View
                      style={[
                        styles.progressLine,
                        step.status === 'completed' && styles.progressLineCompleted,
                      ]}
                    />
                  )}
                  <View
                    style={[
                      styles.progressDot,
                      step.status === 'completed' && styles.progressDotCompleted,
                      step.status === 'current' && styles.progressDotCurrent,
                    ]}
                  >
                    {step.status === 'completed' ? (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    ) : step.status === 'current' ? (
                      <Ionicons name="time" size={16} color="#fff" />
                    ) : (
                      <Text style={styles.progressDotText}>{step.step}</Text>
                    )}
                  </View>
                  <View style={styles.progressContent}>
                    <Text style={styles.progressLabel}>{step.label}</Text>
                    {step.date && (
                      <Text style={styles.progressDate}>
                        {new Date(step.date).toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Admin Remarks */}
          {status.remarks && (
            <View style={styles.remarksCard}>
              <View style={styles.remarksHeader}>
                <Ionicons name="alert-circle" size={20} color="#dc2626" />
                <Text style={styles.remarksTitle}>Admin Remarks</Text>
              </View>
              <Text style={styles.remarksText}>{status.remarks}</Text>
            </View>
          )}

          {/* Applicant Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Applicant Details</Text>
            <View style={styles.detailsList}>
              <View style={styles.detailItem}>
                <Ionicons name="person-outline" size={16} color="#6b7280" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Full Name</Text>
                  <Text style={styles.detailValue}>{status.application.full_name}</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="mail-outline" size={16} color="#6b7280" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{status.application.email}</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="key-outline" size={16} color="#6b7280" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Reference Number</Text>
                  <Text style={[styles.detailValue, styles.monoText]}>
                    {status.application.reference_number}
                  </Text>
                </View>
              </View>
              {status.application.applicant_number && (
                <View style={styles.applicantNumberCard}>
                  <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                  <View style={styles.detailContent}>
                    <Text style={styles.applicantNumberLabel}>Applicant Number</Text>
                    <Text style={[styles.applicantNumberValue, styles.monoText]}>
                      {status.application.applicant_number}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Uploaded Documents */}
          <View style={styles.documentsCard}>
            <Text style={styles.cardTitle}>Uploaded Documents</Text>
            {status.documents.length === 0 ? (
              <Text style={styles.emptyText}>No documents uploaded yet</Text>
            ) : (
              <View style={styles.documentsList}>
                {status.documents.map((doc) => (
                  <TouchableOpacity
                    key={doc.id}
                    style={styles.documentItem}
                    onPress={() => Linking.openURL(doc.file_url)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.documentInfo}>
                      <Ionicons name="document-text-outline" size={16} color="#6b7280" />
                      <View style={styles.documentText}>
                        <Text style={styles.documentName} numberOfLines={1}>
                          {doc.document_name}
                        </Text>
                        <Text style={styles.documentFileName} numberOfLines={1}>
                          {doc.file_name}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="download-outline" size={16} color="#F59E0B" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Show search form
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

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Track Application</Text>
          <Text style={styles.subtitle}>Check your application status</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reference Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your reference number"
              placeholderTextColor="#9ca3af"
              value={referenceNumber}
              onChangeText={setReferenceNumber}
              autoCapitalize="characters"
            />
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.trackButton, loading && styles.trackButtonDisabled]}
            onPress={handleTrack}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#fff" />
                <Text style={styles.trackButtonText}>Searching...</Text>
              </>
            ) : (
              <>
                <Ionicons name="search-outline" size={20} color="#fff" />
                <Text style={styles.trackButtonText}>Track Application</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you don't have your reference number, please contact the admissions office.
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadows.card,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 13,
    color: '#b91c1c',
    flex: 1,
  },
  trackButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trackButtonDisabled: {
    opacity: 0.6,
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  helpCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  // Status View Styles
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadows.cardMd,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  statusHeader: {
    marginBottom: 16,
  },
  statusHeaderLeft: {
    marginBottom: 12,
  },
  applicantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  applicantInfo: {
    fontSize: 13,
    color: '#6b7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  statusDetailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
  },
  statusDetailText: {
    flex: 1,
  },
  statusDetailLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  statusDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadows.card,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  progressList: {
    gap: 16,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    position: 'relative',
  },
  progressLine: {
    position: 'absolute',
    left: 15,
    top: 40,
    width: 2,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  progressLineCompleted: {
    backgroundColor: '#10b981',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotCompleted: {
    backgroundColor: '#10b981',
  },
  progressDotCurrent: {
    backgroundColor: '#F59E0B',
  },
  progressDotText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  progressContent: {
    flex: 1,
    paddingTop: 4,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  progressDate: {
    fontSize: 11,
    color: '#6b7280',
  },
  remarksCard: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#fecaca',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  remarksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  remarksTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  remarksText: {
    fontSize: 13,
    color: '#7f1d1d',
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadows.card,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  detailsList: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
  },
  monoText: {
    fontFamily: 'monospace',
  },
  applicantNumberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  applicantNumberLabel: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
    marginBottom: 2,
  },
  applicantNumberValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#14532d',
  },
  documentsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadows.card,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  emptyText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 16,
  },
  documentsList: {
    gap: 8,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  documentText: {
    flex: 1,
    minWidth: 0,
  },
  documentName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  documentFileName: {
    fontSize: 11,
    color: '#6b7280',
  },
});
