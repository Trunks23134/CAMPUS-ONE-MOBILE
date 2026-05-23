import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import type {
  SchoolLevel,
  ApplicantType,
  RequirementItem,
  DocumentStatus,
} from '../../types/admissions.types';
import { 
  uploadApplicantDocument, 
  getApplicantDocuments 
} from '../../services/admissions.service';
import { getRequirements } from '../../services/requirements.config';
import { invokeFlowCallback } from '../../navigation/flowCallbacks';

interface Props {
  navigation: any;
  route: {
    params: {
      schoolLevel: SchoolLevel;
      applicantType: ApplicantType;
      applicantId: string;
      onSuccessId: string;
      onBackId: string;
      initialData?: any;
    };
  };
}

interface DocState {
  status: DocumentStatus;
  fileName: string | null;
  fileUrl: string | null;
  submittedAt: string | null;
}

export default function DocumentUpload({ navigation, route }: Props) {
  const { schoolLevel, applicantType, applicantId, onSuccessId, onBackId, initialData } = route.params;
  const requirements = getRequirements(schoolLevel, applicantType);

  const [docStates, setDocStates] = useState<Record<string, DocState>>(() => {
    if (initialData?.docStates) {
      return initialData.docStates;
    }
    return Object.fromEntries(
      requirements.map((r) => [
        r.id,
        { status: 'not_uploaded', fileName: null, fileUrl: null, submittedAt: null },
      ])
    );
  });

  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchExistingDocuments();
  }, []);

  const fetchExistingDocuments = async () => {
    try {
      const { data, error } = await getApplicantDocuments(applicantId);
      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      if (data && data.length > 0) {
        const newDocStates = { ...docStates };
        data.forEach((doc: any) => {
          // Find the requirement ID by name
          const req = requirements.find((r) => r.name === doc.document_name);
          if (req) {
            newDocStates[req.id] = {
              status: doc.status || 'submitted',
              fileName: doc.file_name,
              fileUrl: doc.file_url,
              submittedAt: doc.submitted_at,
            };
          }
        });
        setDocStates(newDocStates);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleFileSelect = async (req: RequirementItem) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size && file.size > maxSize) {
        setErrors((prev) => ({ ...prev, [req.id]: 'File size must not exceed 5MB' }));
        return;
      }

      setUploadingId(req.id);
      setErrors((prev) => ({ ...prev, [req.id]: '' }));

      const res = await uploadApplicantDocument({
        applicant_id: applicantId,
        document_name: req.name,
        file_uri: file.uri,
        file_name: file.name,
        file_type: file.mimeType || 'application/pdf',
        school_level: schoolLevel,
        applicant_type: applicantType,
      });

      setUploadingId(null);

      if (res.error) {
        setErrors((prev) => ({ ...prev, [req.id]: res.error!.message }));
        Alert.alert('Upload Failed', res.error.message);
      } else {
        setDocStates((prev) => ({
          ...prev,
          [req.id]: {
            status: 'submitted',
            fileName: file.name,
            fileUrl: res.data!.file_url,
            submittedAt: new Date().toLocaleDateString('en-PH'),
          },
        }));
        Alert.alert('Success', `${req.name} uploaded successfully!`);
      }
    } catch (error) {
      setUploadingId(null);
      setErrors((prev) => ({
        ...prev,
        [req.id]: error instanceof Error ? error.message : 'Upload failed',
      }));
      Alert.alert('Error', 'Failed to select document');
    }
  };

  const canContinue = (): boolean => {
    if (requirements.length === 0) return true;
    return requirements.every((r) => {
      const state = docStates[r.id];
      return state && state.status !== 'not_uploaded';
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    Alert.alert('System Check', 'Starting final submission... Please wait.');
    
    setIsSubmitting(true);
    try {
      invokeFlowCallback(onSuccessId, { docStates });
    } catch (err: any) {
      Alert.alert('Submission Error', err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => invokeFlowCallback(onBackId)}>
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
        <Text style={styles.title}>Document Upload</Text>
        <Text style={styles.subtitle}>Upload required documents</Text>
      </View>

      {/* Content */}
      {loadingInitial ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading requirements...</Text>
        </View>
      ) : (
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

        {/* Important Notes */}
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>IMPORTANT NOTES:</Text>
          <View style={styles.notesList}>
            <Text style={styles.noteItem}>• PDF or Image files (JPG, PNG) are accepted</Text>
            <Text style={styles.noteItem}>• Max file size: 5MB per document</Text>
            <Text style={styles.noteItem}>
              • Ensure you submit correct requirements to avoid delays
            </Text>
            <Text style={styles.noteItem}>
              • All required documents must be uploaded before submission
            </Text>
          </View>
        </View>

        {/* Required Documents */}
        <View style={styles.documentsCard}>
          <View style={styles.documentsHeader}>
            <Text style={styles.documentsHeaderText}>REQUIRED DOCUMENTS</Text>
          </View>

          <View style={styles.documentsList}>
            {requirements.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📄</Text>
                <Text style={styles.emptyStateText}>No requirements found</Text>
              </View>
            ) : (
              requirements.map((req, index) => {
                const state = docStates[req.id] ?? {
                  status: 'not_uploaded',
                  fileName: null,
                  fileUrl: null,
                  submittedAt: null,
                };
                const isUploading = uploadingId === req.id;
                const error = errors[req.id];

                return (
                  <View key={req.id}>
                    <View style={styles.documentItem}>
                      {/* Document Info */}
                      <View style={styles.documentInfo}>
                        <View style={styles.documentHeader}>
                          <Text style={styles.documentName}>{req.name}</Text>
                          {req.required && (
                            <View style={styles.requiredBadge}>
                              <Text style={styles.requiredBadgeText}>REQUIRED</Text>
                            </View>
                          )}
                        </View>
                        {req.description && (
                          <Text style={styles.documentDescription}>{req.description}</Text>
                        )}
                        {state.fileName && (
                          <View style={styles.fileNameContainer}>
                            <Ionicons name="document-text" size={14} color="#6b7280" />
                            <Text style={styles.fileName} numberOfLines={1}>
                              {state.fileName}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Upload Button */}
                      <TouchableOpacity
                        style={[
                          styles.uploadButton,
                          isUploading && styles.uploadButtonDisabled,
                          state.status !== 'not_uploaded' && styles.uploadButtonReplaced,
                        ]}
                        onPress={() => handleFileSelect(req)}
                        disabled={isUploading}
                        activeOpacity={0.7}
                      >
                        {isUploading ? (
                          <>
                            <ActivityIndicator size="small" color="#fff" />
                            <Text style={styles.uploadButtonText}>...</Text>
                          </>
                        ) : (
                          <>
                            <Ionicons
                              name="cloud-upload-outline"
                              size={16}
                              color={state.status !== 'not_uploaded' ? '#3b82f6' : '#fff'}
                            />
                            <Text
                              style={[
                                styles.uploadButtonText,
                                state.status !== 'not_uploaded' && styles.uploadButtonTextReplaced,
                              ]}
                            >
                              {state.status !== 'not_uploaded' ? 'Replace' : 'Upload'}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>

                    {/* Error Message */}
                    {error && (
                      <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                      </View>
                    )}

                    {/* Divider */}
                    {index < requirements.length - 1 && <View style={styles.divider} />}
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* Upload Progress Summary */}
        {requirements.length > 0 && (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Upload Progress</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${
                      (Object.values(docStates).filter((s) => s.status !== 'not_uploaded')
                        .length /
                        requirements.length) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Object.values(docStates).filter((s) => s.status !== 'not_uploaded').length} of{' '}
              {requirements.length} documents uploaded
            </Text>
          </View>
        )}
      </ScrollView>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, (!canContinue() || isSubmitting) && styles.submitButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue() || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.submitButtonText}>Finalizing...</Text>
            </>
          ) : (
            <Text style={styles.submitButtonText}>Continue →</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButtonFooter} onPress={() => invokeFlowCallback(onBackId, { docStates })} activeOpacity={0.7}>
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
  notesCard: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  notesList: {
    gap: 6,
  },
  noteItem: {
    fontSize: 11,
    color: '#92400e',
    lineHeight: 16,
  },
  documentsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 16,
  },
  documentsHeader: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  documentsHeaderText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  documentsList: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  documentInfo: {
    flex: 1,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  documentName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  documentDescription: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 6,
    lineHeight: 16,
  },
  fileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  fileName: {
    fontSize: 11,
    color: '#6b7280',
    flex: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 90,
    justifyContent: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: '#e5e7eb',
    opacity: 0.6,
  },
  uploadButtonReplaced: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  uploadButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  uploadButtonTextReplaced: {
    color: '#3b82f6',
  },
  errorContainer: {
    marginTop: 4,
    paddingLeft: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 12,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
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
