import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/colors';
const colors = theme.colors;
import TopBar from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

type Course = { id: string; code: string; name: string; section: string; units: number };

export default function AdvisedCoursesScreen() {
  const nav = useNavigation<any>();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    const load = async () => {
      const { data } = await supabase
        .from('class_enrollments')
        .select(`
          id,
          class_assignments!inner(
            id, section,
            subjects!inner(code, name, units)
          )
        `)
        .eq('student_id', user.id)
        .eq('enrollment_status', 'enrolled');

      if (data) {
        setCourses(data.map((e: any) => ({
          id: e.class_assignments.id,
          code: e.class_assignments.subjects?.code ?? '—',
          name: e.class_assignments.subjects?.name ?? '—',
          section: e.class_assignments.section ?? '—',
          units: e.class_assignments.subjects?.units ?? 0,
        })));
      }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const totalUnits = courses.reduce((sum, c) => sum + c.units, 0);

  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Advised Courses</Text>
          <Text style={styles.subtitle}>Your enrolled subjects for the current term</Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />
          ) : courses.length === 0 ? (
            <Text style={{ color: '#6B7280', textAlign: 'center', paddingVertical: 20 }}>No advised courses found for this term.</Text>
          ) : (
            <>
              <View style={styles.summaryRow}>
                <Summary label="Total Courses:" value={String(courses.length)} />
                <Summary label="Total Units:" value={String(totalUnits)} />
                <Summary label="Section:" value={courses[0]?.section ?? '—'} />
              </View>

              {courses.map((course, index) => (
                <View key={course.id} style={styles.courseCard}>
                  <View style={styles.courseTop}>
                    <View style={styles.indexCircle}><Text style={styles.indexText}>{index + 1}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.courseCode}>{course.code}</Text>
                      <Text style={styles.courseName}>{course.name}</Text>
                      <Text style={styles.courseMeta}>Section: {course.section} • {course.units} Units</Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>

        <View style={styles.buttonWrap}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => nav.navigate('Add/Drop Courses')}>
            <Text style={styles.primaryText}>Add / Drop Courses</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#E5E7EB' },
  card: { backgroundColor: '#fff', margin: 14, borderRadius: 14, padding: 14, elevation: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { color: '#6B7280', marginTop: 4, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', padding: 12, marginBottom: 12 },
  summaryItem: { flex: 1 },
  summaryLabel: { color: '#6B7280', fontSize: 12 },
  summaryValue: { color: '#111827', fontWeight: '700', marginTop: 2 },
  courseCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, marginBottom: 10 },
  courseTop: { flexDirection: 'row', gap: 10 },
  indexCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  indexText: { color: '#fff', fontWeight: '700' },
  courseCode: { color: '#181818', fontWeight: '700' },
  courseName: { color: '#111827', marginTop: 2 },
  courseMeta: { color: '#6B7280', marginTop: 6 },
  buttonWrap: { paddingHorizontal: 14 },
  primaryBtn: { height: 46, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#fff', fontWeight: '600' },
});
