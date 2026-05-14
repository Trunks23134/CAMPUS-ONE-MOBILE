import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import Card from "../../../components/Card";
import TopBar from "../../../components/TopBar";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";

type CourseRow = {
  offeringId: string;
  subjectCode: string;
  subjectName: string;
  units: number;
  section: string;
  schedule: string | null;
  room: string | null;
  instructor: string | null;
};

export default function MyCoursesScreen() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    const load = async () => {
      const { data } = await supabase
        .from('class_enrollments')
        .select(`
          id,
          class_assignments!inner(
            id, section, schedule, room,
            subjects!inner(code, name, units)
          )
        `)
        .eq('student_id', user.id)
        .eq('enrollment_status', 'enrolled');

      if (data) {
        setCourses(data.map((e: any) => ({
          offeringId: e.class_assignments.id,
          subjectCode: e.class_assignments.subjects?.code ?? '—',
          subjectName: e.class_assignments.subjects?.name ?? '—',
          units: e.class_assignments.subjects?.units ?? 0,
          section: e.class_assignments.section ?? '—',
          schedule: e.class_assignments.schedule ?? null,
          room: e.class_assignments.room ?? null,
          instructor: null,
        })));
      }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const totalUnits = courses.reduce((s, c) => s + c.units, 0);

  return (
    <View style={styles.page}>
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 30 }}>
        <Text style={styles.h1}>My Courses</Text>
        <Text style={styles.sub}>Currently enrolled courses</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : courses.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="book-outline" size={40} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No enrolled courses</Text>
            <Text style={styles.emptySub}>You are not enrolled in any courses yet.</Text>
          </Card>
        ) : (
          <Card>
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Total Courses</Text>
                <Text style={styles.summaryValue}>{courses.length}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.summaryLabel}>Total Units</Text>
                <Text style={styles.summaryValue}>{totalUnits}</Text>
              </View>
            </View>

            {courses.map((course) => (
              <View key={course.offeringId} style={styles.courseCard}>
                <View style={{ flex: 1 }}>
                  <View style={styles.courseTop}>
                    <Text style={styles.courseTitle}>{course.subjectName}</Text>
                    <View style={styles.badgePill}>
                      <Text style={styles.badgeText}>Enrolled</Text>
                    </View>
                  </View>
                  <Text style={styles.courseCode}>{course.subjectCode} • {course.section} • {course.units} units</Text>
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
                  {course.instructor && (
                    <View style={styles.metaRow}>
                      <Ionicons name="person-outline" size={14} color="#6B7280" />
                      <Text style={styles.metaText}>{course.instructor}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F3F4F6" },
  h1: { fontSize: 18, fontWeight: "900", color: "#111827" },
  sub: { marginTop: 4, color: "#6B7280", fontSize: 12.5, marginBottom: 12 },
  emptyCard: { alignItems: "center", paddingVertical: 36 },
  emptyTitle: { marginTop: 10, fontWeight: "900", color: "#111827" },
  emptySub: { marginTop: 6, color: "#6B7280", fontSize: 12.5, textAlign: "center" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { color: "#6B7280", fontSize: 12.2, fontWeight: "700" },
  summaryValue: { color: "#111827", fontSize: 18, fontWeight: "900", marginTop: 4 },
  courseCard: { marginTop: 6, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12 },
  courseTop: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  courseTitle: { fontWeight: "900", color: "#111827", flex: 1 },
  courseCode: { color: "#6B7280", fontSize: 12.2, marginTop: 2 },
  badgePill: { backgroundColor: "#DCFCE7", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontWeight: "900", color: "#16A34A", fontSize: 11.5 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  metaText: { marginLeft: 6, color: "#374151", fontSize: 12.5 },
});



