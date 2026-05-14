import type {
  SchoolLevel,
  CollegeDepartment,
  CollegeProgram,
  SeniorHighTrack,
  TVLStrand,
} from '../types/admissions.types';

// ─── College Program Mapping ────────────────────────────────────────────────
export const COLLEGE_DEPARTMENTS: CollegeDepartment[] = [
  'College of Architecture',
  'College of Engineering',
  'College of Information Technology',
  'College of Business Administration',
  'College of Education',
  'College of Arts and Sciences',
  'College of Nursing',
];

export const COLLEGE_PROGRAMS: Record<CollegeDepartment, CollegeProgram[]> = {
  'College of Information Technology': [
    'BS Information Technology',
    'BS Computer Science',
    'BS Information Systems',
  ],
  'College of Engineering': [
    'BS Civil Engineering',
    'BS Mechanical Engineering',
    'BS Electrical Engineering',
  ],
  'College of Architecture': ['BS Architecture'],
  'College of Business Administration': ['BS Business Administration'],
  'College of Education': ['BS Education'],
  'College of Arts and Sciences': ['BS Liberal Arts'],
  'College of Nursing': ['BS Nursing'],
};

// ─── Senior High School Track Mapping ──────────────────────────────────────
export const SENIOR_HIGH_TRACKS: SeniorHighTrack[] = ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL'];

export const TVL_STRANDS: TVLStrand[] = ['ICT', 'Home Economics', 'Industrial Arts'];

// ─── Helper Functions ───────────────────────────────────────────────────────
export function getProgramsForDepartment(department: CollegeDepartment): CollegeProgram[] {
  return COLLEGE_PROGRAMS[department] || [];
}

export function getEducationLevelDisplay(schoolLevel: SchoolLevel): string {
  const map: Record<SchoolLevel, string> = {
    Kinder: 'Kinder',
    Elementary: 'Elementary Education',
    'Junior High School': 'Junior High School',
    'Senior High School': 'Senior High School',
    College: 'College',
  };
  return map[schoolLevel];
}
