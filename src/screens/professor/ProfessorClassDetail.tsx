import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Tab = 'students' | 'grades' | 'announcements' | 'submissions';

export default function ProfessorClassDetail({ route, navigation }: any) {
  const { classId } = route.params;
  const [activeTab, setActiveTab] = useState<Tab>('students');
  const [classInfo, setClassInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClassInfo();
  }, [classId]);

  const loadClassInfo = () => {
    // Simulate loading class info
    setTimeout(() => {
      setClassInfo({
        id: classId,
        subject: {
          code: 'CS101',
          name: 'Introduction to Computer Science',
        },
        section: 'A',
      });
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleOrange}>CAMPUS</Text>
            <Text style={styles.headerTitleWhite}>Faculty</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={styles.loadingText}>Loading class...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!classInfo) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleOrange}>CAMPUS</Text>
            <Text style={styles.headerTitleWhite}>Faculty</Text>
          </View>
        </View>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Class not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleOrange}>CAMPUS</Text>
          <Text style={styles.headerTitleWhite}>Faculty</Text>
        </View>
      </View>

      {/* Class Header */}
      <View style={styles.classHeader}>
        <View style={styles.classHeaderTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#6b7280" />
          </TouchableOpacity>
          <View style={styles.classHeaderText}>
            <View style={styles.classHeaderBadges}>
              <View style={styles.codeBadge}>
                <Text style={styles.codeText}>{classInfo.subject.code}</Text>
              </View>
              <Text style={styles.sectionText}>Section {classInfo.section}</Text>
            </View>
            <Text style={styles.className}>{classInfo.subject.name}</Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'students' && styles.tabActive]}
              onPress={() => setActiveTab('students')}
            >
              <Ionicons name="people-outline" size={16} color={activeTab === 'students' ? '#fff' : '#6b7280'} />
              <Text style={[styles.tabText, activeTab === 'students' && styles.tabTextActive]}>Students</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'grades' && styles.tabActive]}
              onPress={() => setActiveTab('grades')}
            >
              <Ionicons name="clipboard-outline" size={16} color={activeTab === 'grades' ? '#fff' : '#6b7280'} />
              <Text style={[styles.tabText, activeTab === 'grades' && styles.tabTextActive]}>Grades</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'announcements' && styles.tabActive]}
              onPress={() => setActiveTab('announcements')}
            >
              <Ionicons name="notifications-outline" size={16} color={activeTab === 'announcements' ? '#fff' : '#6b7280'} />
              <Text style={[styles.tabText, activeTab === 'announcements' && styles.tabTextActive]}>Announcements</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'submissions' && styles.tabActive]}
              onPress={() => setActiveTab('submissions')}
            >
              <Ionicons name="document-text-outline" size={16} color={activeTab === 'submissions' ? '#fff' : '#6b7280'} />
              <Text style={[styles.tabText, activeTab === 'submissions' && styles.tabTextActive]}>Submissions</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'students' && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No Students</Text>
            <Text style={styles.emptyStateText}>No students enrolled in this class yet.</Text>
          </View>
        )}

        {activeTab === 'grades' && (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No Grades</Text>
            <Text style={styles.emptyStateText}>No grades have been recorded yet.</Text>
          </View>
        )}

        {activeTab === 'announcements' && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No Announcements</Text>
            <Text style={styles.emptyStateText}>No announcements posted yet.</Text>
          </View>
        )}

        {activeTab === 'submissions' && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No Submissions</Text>
            <Text style={styles.emptyStateText}>No submissions available yet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#1a1a1a',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleOrange: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  headerTitleWhite: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  classHeader: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  classHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classHeaderText: {
    flex: 1,
  },
  classHeaderBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  codeBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  sectionText: {
    fontSize: 12,
    color: '#6b7280',
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  tabActive: {
    backgroundColor: '#F59E0B',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
  },
  emptyCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
