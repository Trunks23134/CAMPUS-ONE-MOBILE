import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme/colors';
import TopBar from '../../../components/TopBar';
import { useEnrolledCourses } from '../../../hooks/useEnrolledCourses';

const colors = theme.colors;

export default function CourseDetailsScreen() {
  const { courses, loading, term, schoolYear } = useEnrolledCourses();
  const totalUnits = courses.reduce((s, c) => s + c.units, 0);

  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 30 }}>
        <Text style={styles.h1}>Course Details</Text>
        <Text style={styles.sub}>{term} • AY {schoolYear}</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : courses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="book-outline" size={40} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No enrolled courses</Text>
            <Text style={styles.emptySub}>You have no enrolled courses for this term.</Text>
          </View>
        ) : (
          <>
            {/* Summary */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{courses.length}</Text>
                <Text style={styles.summaryLabel}>Courses</Text>
              </View>
              <View style={styles.dividerV} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{totalUnits}</Text>
                <Text style={styles.summaryLabel}>Total Units</Text>
              </View>
              <View style={styles.dividerV} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{courses[0]?.section ?? '—'}</Text>
                <Text style={styles.summaryLabel}>Section</Text>
              </View>
            </View>

            {/* Course cards */}
            {courses.map((course) => (
              <View key={course.offeringId} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardCode}>{course.subjectCode}</Text>
                    <Text style={styles.cardTitle}>{course.subjectTitle}</Text>
                  </View>
                  <View style={styles.unitsPill}>
                    <Text style={styles.unitsText}>{course.units} Units</Text>
                  </View>
                </View>

                <View style={styles.metaBlock}>
                  {course.instructor && (
                    <View style={styles.metaRow}>
                      <Ionicons name="person-outline" size={14} color="#6B7280" />
                      <Text style={styles.metaText}>{course.instructor}</Text>
                    </View>
                  )}
                  {course.schedule && (
                    <View style={styles.metaRow}>
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text style={styles.metaText}>{course.schedule}</Text>
                    </View>
                  )}
                  {course.room && (
                    <View style={styles.metaRow}>
                      <Ionicons name="location-outline" size={14} color="#6B7280" />
                      <Text style={styles.metaText}>{course.room}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.sectionRow}>
                  <Text style={styles.sectionLabel}>Section</Text>
                  <Text style={styles.sectionValue}>{course.section}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F3F4F6' },
  h1: { fontSize: 20, fontWeight: '900', color: '#111827' },
  sub: { color: '#6B7280', fontSize: 13, marginBottom: 14 },

  emptyCard: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#fff', borderRadius: 14, gap: 8 },
  emptyTitle: { fontWeight: '900', color: '#111827' },
  emptySub: { color: '#6B7280', fontSize: 13, textAlign: 'center' },

  summaryRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, justifyContent: 'space-around', alignItems: 'center' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 22, fontWeight: '900', color: '#111827' },
  summaryLabel: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  dividerV: { width: 1, height: 36, backgroundColor: '#E5E7EB' },

  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardCode: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cardTitle: { fontSize: 14, color: '#374151', marginTop: 2, fontWeight: '600' },
  unitsPill: { backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  unitsText: { color: '#111827', fontWeight: '700', fontSize: 12 },
  metaBlock: { gap: 6, marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { color: '#6B7280', fontSize: 13 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  sectionLabel: { color: '#9CA3AF', fontSize: 12.5 },
  sectionValue: { color: '#111827', fontWeight: '700', fontSize: 12.5 },
});



