create table if not exists public.auth_login_log (
  log_id uuid,
  created_at timestamp,
  actor_uuid uuid,
  action_type text,
  status_code integer,
  email text,
  device_name text,
  ip_address text
);

create table if not exists public.auth_logout_log (
  log_id uuid,
  created_at timestamp,
  actor_uuid uuid,
  action_type text,
  status_code integer,
  session_id text,
  device_name text
);

create table if not exists public.alumni_registration_log (
  log_id uuid,
  created_at timestamp,
  actor_uuid uuid,
  action_type text,
  status_code integer,
  email text,
  first_name text,
  middle_name text,
  last_name text,
  phone text,
  student_id text,
  academic_unit text,
  graduation_year text,
  last_program text,
  proof_reference text,
  verification_type text
);

create table if not exists public.alumni_profile_update_log (
  log_id uuid,
  created_at timestamp,
  actor_uuid uuid,
  action_type text,
  status_code integer,
  email text,
  phone text,
  employment_status text,
  employer_name text,
  job_title text,
  city text,
  country text
);

create table if not exists public.alumni_record_request_log (
  log_id uuid,
  created_at timestamp,
  actor_uuid uuid,
  action_type text,
  status_code integer,
  document_type text,
  purpose text,
  copies integer,
  delivery_method text,
  remarks text
);

create table if not exists public.alumni_card_application_log (
  log_id uuid,
  created_at timestamp,
  actor_uuid uuid,
  action_type text,
  status_code integer,
  card_type text,
  delivery_method text,
  contact_email text,
  contact_phone text,
  remarks text
);
