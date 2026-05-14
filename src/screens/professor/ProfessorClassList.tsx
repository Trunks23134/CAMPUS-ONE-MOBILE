import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfessorClassList({ navigation }: any) {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    // Simulate loading classes
    setTimeout(() => {
      setClasses([
        {
          id: '1',
          subject: {
            code: 'CS101',
            name: 'Introduction to Computer Science',
            description: 'Fundamentals of programming and computer science',
            units: 3,
            semester: '1st Semester',
            school_year: '2025-2026',
          },
          section: 'A',
          schedule: 'MWF 9:00-10:00',
          room: 'Room 301',
          enrolled_count: 30,
          max_students: 35,
        },
        {
          id: '2',
          subject: {
            code: 'CS201',
            name: 'Data Structures and Algorithms',
            description: 'Advanced programming concepts and algorithms',
            units: 3,
            semester: '1st Semester',
            school_year: '2025-2026',
          },
          section: 'B',
          schedule: 'TTH 10:30-12:00',
          room: 'Room 302',
          enrolled_count: 28,
          max_students: 30,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleViewClass = (classId: string) => {
    navigation.navigate('ProfessorClassDetail', { classId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleOrange}>CAMPUS</Text>
          <Text style={styles.headerTitleWhite}>Faculty</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#6b7280" />
          </TouchableOpacity>
          <View style={styles.pageHeaderText}>
            <Text style={styles.pageTitle}>My Classes</Text>
            <Text style={styles.pageSubtitle}>{classes.length} class{classes.length !== 1 ? 'es' : ''}</Text>
          </View>
        </View>

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingText}>Loading classes...</Text>
          </View>
        ) : classes.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="book-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Classes Assigned</Text>
            <Text style={styles.emptyText}>You don't have any classes assigned yet.</Text>
          </View>
        ) : (
          <View style={styles.classList}>
            {classes.map((classItem) => (
              <TouchableOpacity
                key={classItem.id}
                style={styles.classCard}
                onPress={() => handleViewClass(classItem.id)}
              >
                {/* Subject Info */}
                <View style={styles.classHeader}>
                  <View style={styles.classHeaderTop}>
                    <View style={styles.codeBadge}>
                      <Text style={styles.codeText}>{classItem.subject.code}</Text>
                    </View>
                    <Text style={styles.sectionText}>Section {classItem.section}</Text>
                  </View>
                  <Text style={styles.className}>{classItem.subject.name}</Text>
                  <Text style={styles.classDescription}>{classItem.subject.description}</Text>
                </View>

                {/* Class Details */}
                <View style={styles.classDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Ionicons name="people-outline" size={14} color="#6b7280" />
                      <Text style={styles.detailText}>
                        {classItem.enrolled_count}/{classItem.max_students} students
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <Text style={styles.detailText}>{classItem.schedule}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Ionicons name="location-outline" size={14} color="#6b7280" />
                      <Text style={styles.detailText}>{classItem.room}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="book-outline" size={14} color="#6b7280" />
                      <Text style={styles.detailText}>{classItem.subject.units} units</Text>
                    </View>
                  </View>
                </View>

                {/* Semester Info */}
                <View style={styles.classSemester}>
                  <Text style={styles.semesterText}>
                    {classItem.subject.semester} • {classItem.subject.school_year}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageHeaderText: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: '#6b7280',
  },
  classList: {
    gap: 12,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  classHeader: {
    marginBottom: 12,
  },
  classHeaderTop: {
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  classDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  classDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  classSemester: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  semesterText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
