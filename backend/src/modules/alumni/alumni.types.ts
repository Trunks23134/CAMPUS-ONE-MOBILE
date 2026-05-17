export interface AlumniRegistrationRequestDto {
  actor_uuid: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone?: string;
  student_id?: string;
  academic_unit?: string;
  graduation_year?: string;
  last_program?: string;
  proof_reference?: string;
  verification_type: "student_record" | "manual_alumni_verification";
}

export interface AlumniProfileUpdateRequestDto {
  actor_uuid: string;
  email?: string;
  phone?: string;
  employment_status?: string;
  employer_name?: string;
  job_title?: string;
  city?: string;
  country?: string;
}

export interface AlumniRecordRequestDto {
  actor_uuid: string;
  document_type: string;
  purpose: string;
  copies: number;
  delivery_method?: string;
  remarks?: string;
}

export interface AlumniCardApplicationRequestDto {
  actor_uuid: string;
  card_type: string;
  delivery_method: string;
  contact_email: string;
  contact_phone?: string;
  remarks?: string;
}

export interface AlumniRegistrationLogRecord {
  log_id: string;
  created_at: string;
  actor_uuid: string;
  action_type: string;
  status_code: number;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone?: string;
  student_id?: string;
  academic_unit?: string;
  graduation_year?: string;
  last_program?: string;
  proof_reference?: string;
  verification_type: string;
}

export interface AlumniProfileUpdateLogRecord {
  log_id: string;
  created_at: string;
  actor_uuid: string;
  action_type: string;
  status_code: number;
  email?: string;
  phone?: string;
  employment_status?: string;
  employer_name?: string;
  job_title?: string;
  city?: string;
  country?: string;
}

export interface AlumniRecordRequestLogRecord {
  log_id: string;
  created_at: string;
  actor_uuid: string;
  action_type: string;
  status_code: number;
  document_type: string;
  purpose: string;
  copies: number;
  delivery_method?: string;
  remarks?: string;
}

export interface AlumniCardApplicationLogRecord {
  log_id: string;
  created_at: string;
  actor_uuid: string;
  action_type: string;
  status_code: number;
  card_type: string;
  delivery_method: string;
  contact_email: string;
  contact_phone?: string;
  remarks?: string;
}
