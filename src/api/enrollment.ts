import { supabase } from '../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type EnrollmentError = {
  message: string;
  code: string;
};

export type StudentRecord = {
  id: string;
  studentNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  program: string | null;
  yearLevel: number | null;
  status: string | null;
};

export type SubjectOffering = {
  id: string;
  subjectId: string;
  term: string;
  schoolYear: string;
  section: string;
  schedule: string | null;
  room: string | null;
  instructor: string | null;
  slotsTotal: number;
  slotsTaken: number;
  isFull: boolean;
  subjectCode: string;
  subjectTitle: string;
  units: number;
};

export type EnrollmentResult = {
  enrollmentId: string;
  status: string;
};

export type EnrollmentStatus = {
  enrollmentId: string;
  status: string;
  schoolYear: string;
  term: string;
  totalUnits: number;
  items: Array<{ offeringId: string; subjectCode: string; subjectTitle: string }>;
};

// ─── Type Guard ───────────────────────────────────────────────────────────────

export function isEnrollmentError(result: unknown): result is EnrollmentError {
  return (
    typeof result === 'object' &&
    result !== null &&
    'message' in result &&
    'code' in result
  );
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function fetchStudent(
  userId: string,
): Promise<StudentRecord | EnrollmentError> {
  try {
    // Get name, program, status from applicant_profiles (id = auth.uid())
    const { data, error } = await supabase
      .from('applicant_profiles')
      .select('id, first_name, last_name, program, status')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return { message: error.message, code: error.code ?? 'SUPABASE_ERROR' };
    }

    if (!data) {
      return {
        message: 'Student profile not found. Please contact the registrar.',
        code: 'STUDENT_NOT_FOUND',
      };
    }

    // Get student_number from student_accounts (linked via applicant_id)
    const { data: sa } = await supabase
      .from('student_accounts')
      .select('student_number')
      .eq('applicant_id', userId)
      .maybeSingle();

    return {
      id: data.id,
      studentNumber: sa?.student_number ?? null,
      firstName: data.first_name || null,
      lastName: data.last_name || null,
      program: data.program || null,
      yearLevel: null,
      status: data.status === 'Passed' ? 'regular' : 'irregular',
    };
  } catch (e) {
    return { message: 'An unexpected error occurred.', code: 'UNKNOWN_ERROR' };
  }
}

export async function fetchOfferings(
  schoolYear: string,
  term: string,
): Promise<SubjectOffering[] | EnrollmentError> {
  try {
    const { data, error } = await supabase
      .from('subject_offerings')
      .select(
        `id, subject_id, term, school_year, section, schedule, room, instructor,
         slots_total, slots_taken,
         subjects!inner ( code, title, units )`,
      )
      .eq('school_year', schoolYear)
      .eq('term', term)
      .eq('is_open', true);

    if (error) {
      return { message: error.message, code: error.code ?? 'SUPABASE_ERROR' };
    }

    if (!data) {
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      subjectId: row.subject_id,
      term: row.term,
      schoolYear: row.school_year,
      section: row.section,
      schedule: row.schedule,
      room: row.room,
      instructor: row.instructor,
      slotsTotal: row.slots_total,
      slotsTaken: row.slots_taken,
      isFull: row.slots_taken >= row.slots_total,
      subjectCode: row.subjects.code,
      subjectTitle: row.subjects.title,
      units: row.subjects.units,
    }));
  } catch (e) {
    return { message: 'An unexpected error occurred.', code: 'UNKNOWN_ERROR' };
  }
}

export async function submitEnrollment(
  studentId: string,
  schoolYear: string,
  term: string,
  offeringIds: string[],
): Promise<EnrollmentResult | EnrollmentError> {
  try {
    const { data, error } = await supabase.rpc('enroll_student', {
      p_student_id: studentId,
      p_school_year: schoolYear,
      p_term: term,
      p_offering_ids: offeringIds,
    });

    if (error) {
      return { message: error.message, code: error.code ?? 'SUPABASE_ERROR' };
    }

    // RPC returns a table row; data is an array with one element
    const row = Array.isArray(data) ? data[0] : data;

    if (!row) {
      return { message: 'No response from enrollment service.', code: 'NO_DATA' };
    }

    if (row.error_code) {
      return { message: row.error_message ?? row.error_code, code: row.error_code };
    }

    return {
      enrollmentId: row.enrollment_id,
      status: row.status,
    };
  } catch (e) {
    return { message: 'An unexpected error occurred.', code: 'UNKNOWN_ERROR' };
  }
}

/**
 * Fetch subject offerings that match the curriculum for a given
 * program + year_level + term. Used by the Regular Path block schedule.
 */
export async function fetchCurriculumOfferings(
  program: string,
  yearLevel: number,
  schoolYear: string,
  term: string,
): Promise<SubjectOffering[] | EnrollmentError> {
  try {
    // 1. Get subject IDs from curriculum for this program/year/term
    const { data: curriculumRows, error: currErr } = await supabase
      .from('curriculum')
      .select('subject_id')
      .eq('program', program)
      .eq('year_level', yearLevel)
      .eq('term', term);

    if (currErr) {
      return { message: currErr.message, code: currErr.code ?? 'SUPABASE_ERROR' };
    }

    if (!curriculumRows || curriculumRows.length === 0) {
      return [];
    }

    const subjectIds = curriculumRows.map((r: any) => r.subject_id);

    // 2. Find open offerings for those subjects this school year/term
    const { data, error } = await supabase
      .from('subject_offerings')
      .select(
        `id, subject_id, term, school_year, section, schedule, room, instructor,
         slots_total, slots_taken,
         subjects!inner ( code, title, units )`,
      )
      .eq('school_year', schoolYear)
      .eq('term', term)
      .eq('is_open', true)
      .in('subject_id', subjectIds);

    if (error) {
      return { message: error.message, code: error.code ?? 'SUPABASE_ERROR' };
    }

    return (data ?? []).map((row: any) => ({
      id: row.id,
      subjectId: row.subject_id,
      term: row.term,
      schoolYear: row.school_year,
      section: row.section,
      schedule: row.schedule,
      room: row.room,
      instructor: row.instructor,
      slotsTotal: row.slots_total,
      slotsTaken: row.slots_taken,
      isFull: row.slots_taken >= row.slots_total,
      subjectCode: row.subjects.code,
      subjectTitle: row.subjects.title,
      units: row.subjects.units,
    }));
  } catch (e) {
    return { message: 'An unexpected error occurred.', code: 'UNKNOWN_ERROR' };
  }
}

export async function fetchEnrollmentStatus(
  studentId: string,
  schoolYear: string,
  term: string,
): Promise<EnrollmentStatus | null | EnrollmentError> {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(
        `id, status, school_year, term, total_units,
         enrollment_items (
           offering_id,
           subject_offerings!inner (
             subjects!inner ( code, title )
           )
         )`,
      )
      .eq('student_id', studentId)
      .eq('school_year', schoolYear)
      .eq('term', term)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      return { message: error.message, code: error.code ?? 'SUPABASE_ERROR' };
    }

    if (!data) {
      return null;
    }

    const items = (data.enrollment_items ?? []).map((item: any) => ({
      offeringId: item.offering_id,
      subjectCode: item.subject_offerings?.subjects?.code ?? '',
      subjectTitle: item.subject_offerings?.subjects?.title ?? '',
    }));

    return {
      enrollmentId: data.id,
      status: data.status,
      schoolYear: data.school_year,
      term: data.term,
      totalUnits: data.total_units,
      items,
    };
  } catch (e) {
    return { message: 'An unexpected error occurred.', code: 'UNKNOWN_ERROR' };
  }
}
