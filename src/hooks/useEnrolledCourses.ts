import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { resolveTerm } from '../utils/termResolver';

export type EnrolledCourse = {
  offeringId: string;
  subjectCode: string;
  subjectTitle: string;
  units: number;
  section: string;
  schedule: string | null;
  room: string | null;
  instructor: string | null;
};

export function useEnrolledCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState('');
  const [schoolYear, setSchoolYear] = useState('');

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }

    const termResult = resolveTerm();
    if (!('code' in termResult)) {
      setTerm(termResult.term);
      setSchoolYear(termResult.schoolYear);
    }

    const load = async () => {
      // Query class_enrollments directly using auth user ID
      const { data, error } = await supabase
        .from('class_enrollments')
        .select(`
          id,
          class_assignments!inner(
            id,
            section,
            schedule,
            room,
            subjects!inner(code, name, units)
          )
        `)
        .eq('student_id', user.id)
        .eq('enrollment_status', 'enrolled');

      if (!error && data) {
        setCourses(data.map((e: any) => ({
          offeringId: e.class_assignments.id,
          subjectCode: e.class_assignments.subjects?.code ?? '—',
          subjectTitle: e.class_assignments.subjects?.name ?? '—',
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

  return { courses, loading, term, schoolYear };
}
