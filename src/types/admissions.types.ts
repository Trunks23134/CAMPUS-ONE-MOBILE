// ─── School Level & Applicant Type ──────────────────────────────────────────
export type SchoolLevel =
  | "Kinder"
  | "Elementary"
  | "Junior High School"
  | "Senior High School"
  | "College";

export type ApplicantType =
  | "Freshman"
  | "Transferee"
  | "Shiftee"
  | "Returnee";

export type AdmissionStatus = "Under Review" | "Passed" | "Not Accepted";

export type DocumentStatus = "not_uploaded" | "submitted" | "approved" | "rejected";

export type ExamResult = "PASSED" | "FAILED";

// ─── Program/Track Selection ──────────────────────────────────────────────────
export type CollegeDepartment =
  | "College of Architecture"
  | "College of Engineering"
  | "College of Information Technology"
  | "College of Business Administration"
  | "College of Education"
  | "College of Arts and Sciences"
  | "College of Nursing";

export type CollegeProgram =
  | "BS Information Technology"
  | "BS Computer Science"
  | "BS Information Systems"
  | "BS Civil Engineering"
  | "BS Mechanical Engineering"
  | "BS Electrical Engineering"
  | "BS Architecture"
  | "BS Business Administration"
  | "BS Education"
  | "BS Liberal Arts"
  | "BS Nursing";

export type SeniorHighTrack =
  | "STEM"
  | "ABM"
  | "HUMSS"
  | "GAS"
  | "ICT"
  | "TVL"
  | "HE"
  | "Other";

// ─── DTOs ────────────────────────────────────────────────────────────────────
export interface CreateAccountDTO {
  email: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
}

export interface ApplicantProfileDTO {
  applicant_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  birthdate: string;
  mobile_number: string;
  address: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
}

export interface ParentInformationDTO {
  applicant_id: string;
  father_name: string;
  father_address: string;
  father_contact: string;
  guardian_name: string;
  guardian_address: string;
  guardian_phone_home: string;
  guardian_phone_work: string;
  mother_name: string;
  mother_address: string;
  mother_contact: string;
}

export interface AcademicBackgroundDTO {
  applicant_id: string;
  entries: Array<{
    grade_level: string;
    school_name: string;
    completion_year: string;
  }>;
}

export interface AlumniRelativesDTO {
  applicant_id: string;
  relatives: Array<{
    name: string;
    relationship: string;
    college: string;
    batch_year: string;
    contact_number: string;
  }>;
}

export interface ProgramSelectionDTO {
  applicant_id: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
  college_department?: string;
  college_program?: string;
  senior_high_track?: string;
}

export interface DocumentUploadDTO {
  applicant_id: string;
  document_name: string;
  file_uri: string;
  file_name: string;
  file_type: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
}

// ─── Models ───────────────────────────────────────────────────────────────────
export interface RequirementItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export interface ApplicantDocument {
  id: string;
  applicant_id: string;
  document_name: string;
  file_name: string;
  file_url: string;
  status: DocumentStatus;
  submitted_at: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
}

// ─── Supabase Wrappers ────────────────────────────────────────────────────────
export interface SupabaseSuccess<T> { 
  data: T; 
  error: null; 
}

export interface SupabaseError { 
  data: null; 
  error: { message: string; code?: string }; 
}

export type SupabaseResponse<T> = SupabaseSuccess<T> | SupabaseError;

// ─── App Flow State ───────────────────────────────────────────────────────────
export type AppStep =
  | "select"
  | "create-account"
  | "personal-profile"
  | "parent-info"
  | "academic-background"
  | "alumni-info"
  | "program-selection"
  | "documents"
  | "confirmation";

export interface AppSession {
  step: AppStep;
  schoolLevel: SchoolLevel | null;
  applicantType: ApplicantType | null;
  applicantId: string | null;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  birthdate: string;
  mobileNumber: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
  fatherName: string;
  fatherAddress: string;
  fatherContact: string;
  motherName: string;
  motherAddress: string;
  motherContact: string;
  guardianName: string;
  guardianAddress: string;
  guardianPhoneHome: string;
  guardianPhoneWork: string;
  academicBackground: Array<{
    grade_level: string;
    school_name: string;
    completion_year: string;
  }>;
  relatives: any[];
  docStates: Record<string, any>;
  collegeDepartment: CollegeDepartment | null;
  collegeProgram: CollegeProgram | null;
  seniorHighTrack: SeniorHighTrack | null;
  referenceNumber: string | null;
}
