import { supabase } from '../lib/supabase';
import type {
  SchoolLevel,
  ApplicantType,
  CreateAccountDTO,
  ApplicantProfileDTO,
  ParentInformationDTO,
  AcademicBackgroundDTO,
  AlumniRelativesDTO,
  ProgramSelectionDTO,
  DocumentUploadDTO,
  ApplicantDocument,
  SupabaseResponse,
} from '../types/admissions.types';

const STORAGE_BUCKET = 'applicant-documents';

// ─── Account Creation ─────────────────────────────────────────────────────────
export async function createApplicantProfile(
  dto: CreateAccountDTO
): Promise<SupabaseResponse<{ id: string }>> {
  const applicantId = generateUUID();
  const referenceNumber = generateReferenceNumber();

  console.log('Inserting Profile:', {
    id: applicantId,
    email: dto.email,
    reference_number: referenceNumber,
  });

  // Add a 10-second timeout to the request
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Connection timed out. Please check your internet.')), 10000)
  );

  try {
    const cleanEmail = dto.email.trim().toLowerCase();

    // 1. Check if email already exists
    const { data: existingList } = await supabase
      .from('applicant_profiles')
      .select('id')
      .ilike('email', cleanEmail)
      .limit(1);

    if (existingList && existingList.length > 0) {
      console.log('Existing applicant found, resuming flow:', existingList[0].id);
      return { data: { id: existingList[0].id }, error: null };
    }

    // 2. If not, create new
    let insertData: any = {
      id: applicantId,
      email: cleanEmail,
      school_level: dto.school_level,
      applicant_type: dto.applicant_type,
      reference_number: referenceNumber,
      status: 'pending',
    };

    const { error } = (await Promise.race([
      supabase.from('applicant_profiles').insert(insertData),
      timeout
    ])) as any;

    // 3. Safety Fallback: If enum fails, try without status
    if (error && error.message.includes('enum')) {
      console.warn('Enum failed, retrying without status field...');
      delete insertData.status;
      const { error: retryError } = await supabase.from('applicant_profiles').insert(insertData);
      if (retryError) return { data: null, error: { message: retryError.message } };
      return { data: { id: applicantId }, error: null };
    }

    if (error) return { data: null, error: { message: error.message } };
    return { data: { id: applicantId }, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.message } };
  }
}

// ─── Profile Save ─────────────────────────────────────────────────────────────
export async function saveApplicantProfile(
  dto: ApplicantProfileDTO
): Promise<SupabaseResponse<{ id: string }>> {
  const fullName = `${dto.first_name} ${dto.last_name}`.trim();

  const { error } = await supabase
    .from('applicant_profiles')
    .update({
      first_name: dto.first_name,
      last_name: dto.last_name,
      middle_name: dto.middle_name,
      full_name: fullName,
      birthdate: dto.birthdate,
      mobile_number: dto.mobile_number,
      address: dto.address,
      school_level: dto.school_level,
      applicant_type: dto.applicant_type,
    })
    .eq('id', dto.applicant_id);

  if (error) return { data: null, error: { message: error.message } };
  return { data: { id: dto.applicant_id }, error: null };
}

// ─── Parent Information ───────────────────────────────────────────────────────
export async function saveParentInformation(
  data: ParentInformationDTO
): Promise<SupabaseResponse<{ id: string }>> {
  const { error } = await supabase
    .from('parent_information')
    .upsert(
      {
        applicant_id: data.applicant_id,
        father_name: data.father_name,
        father_address: data.father_address,
        father_contact: data.father_contact,
        guardian_name: data.guardian_name,
        guardian_address: data.guardian_address,
        guardian_phone_home: data.guardian_phone_home,
        guardian_phone_work: data.guardian_phone_work,
        mother_name: data.mother_name,
        mother_address: data.mother_address,
        mother_contact: data.mother_contact,
      },
      { onConflict: 'applicant_id' }
    );

  if (error) return { data: null, error: { message: error.message } };
  return { data: { id: data.applicant_id }, error: null };
}

// ─── Academic Background ──────────────────────────────────────────────────────
export async function saveAcademicBackground(
  data: AcademicBackgroundDTO
): Promise<SupabaseResponse<{ count: number }>> {
  // Delete existing entries
  await supabase.from('academic_background').delete().eq('applicant_id', data.applicant_id);

  // Insert new entries
  const records = data.entries.map((entry) => ({
    applicant_id: data.applicant_id,
    grade_level: entry.grade_level,
    school_name: entry.school_name,
    completion_year: entry.completion_year,
  }));

  const { error } = await supabase.from('academic_background').insert(records);
  if (error) return { data: null, error: { message: error.message } };
  return { data: { count: records.length }, error: null };
}

// ─── Alumni Relatives ─────────────────────────────────────────────────────────
export async function saveAlumniRelatives(
  data: AlumniRelativesDTO
): Promise<SupabaseResponse<{ count: number }>> {
  // Delete existing entries
  await supabase.from('alumni_relatives').delete().eq('applicant_id', data.applicant_id);

  // Insert new entries (only if there are relatives)
  if (data.relatives.length === 0) {
    return { data: { count: 0 }, error: null };
  }

  const records = data.relatives.map((relative) => ({
    applicant_id: data.applicant_id,
    name: relative.name,
    relationship: relative.relationship,
    college: relative.college,
    batch_year: relative.batch_year,
    contact_number: relative.contact_number,
  }));

  const { error } = await supabase.from('alumni_relatives').insert(records);
  if (error) return { data: null, error: { message: error.message } };
  return { data: { count: records.length }, error: null };
}

// ─── Program Selection ────────────────────────────────────────────────────────
export async function saveProgramSelection(
  data: ProgramSelectionDTO
): Promise<SupabaseResponse<{ id: string }>> {
  const { error } = await supabase
    .from('program_selections')
    .upsert(
      {
        applicant_id: data.applicant_id,
        school_level: data.school_level,
        applicant_type: data.applicant_type,
        college_department: data.college_department ?? null,
        college_program: data.college_program ?? null,
        senior_high_track: data.senior_high_track ?? null,
        tvl_strand: data.tvl_strand ?? null,
      },
      { onConflict: 'applicant_id' }
    );

  if (error) return { data: null, error: { message: error.message } };

  // Update program field in applicant_profiles
  const programName = data.college_program || data.senior_high_track || data.school_level;
  await supabase.from('applicant_profiles').update({ program: programName }).eq('id', data.applicant_id);

  return { data: { id: data.applicant_id }, error: null };
}

// ─── Document Upload ──────────────────────────────────────────────────────────
export async function uploadApplicantDocument(
  dto: DocumentUploadDTO
): Promise<SupabaseResponse<ApplicantDocument>> {
  try {
    // Read file as blob
    const response = await fetch(dto.file_uri);
    const blob = await response.blob();

    const timestamp = Date.now();
    const sanitized = dto.file_name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${dto.applicant_id}/${timestamp}_${sanitized}`;

    // Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, blob, {
        contentType: dto.file_type,
        upsert: true,
      });

    if (storageError) {
      return { data: null, error: { message: storageError.message } };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    // Save to database
    const { data, error: dbError } = await supabase
      .from('applicant_documents')
      .insert({
        applicant_id: dto.applicant_id,
        document_name: dto.document_name,
        file_name: dto.file_name,
        file_url: urlData.publicUrl,
        status: 'submitted',
        school_level: dto.school_level,
        applicant_type: dto.applicant_type,
      })
      .select()
      .single();

    if (dbError) {
      return { data: null, error: { message: dbError.message } };
    }

    return { data: data as ApplicantDocument, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Upload failed' },
    };
  }
}

// ─── Submit Application ───────────────────────────────────────────────────────
export async function submitApplication(
  applicantId: string
): Promise<SupabaseResponse<{ reference_number: string }>> {
  try {
    const { data, error } = await supabase
      .from('applicant_profiles')
      .update({
        application_submitted_at: new Date().toISOString(),
        status: 'under_review',
      })
      .eq('id', applicantId)
      .select('reference_number')
      .single();

    if (error) {
      // Safety Fallback: If enum fails, try without status field
      if (error.message.includes('enum')) {
        console.warn('Submission status enum failed, retrying without status field...');
        const { data: retryData, error: retryError } = await supabase
          .from('applicant_profiles')
          .update({
            application_submitted_at: new Date().toISOString(),
          })
          .eq('id', applicantId)
          .select('reference_number')
          .single();

        if (retryError) return { data: null, error: { message: retryError.message } };
        return { data: { reference_number: retryData.reference_number }, error: null };
      }
      return { data: null, error: { message: error.message } };
    }

    return { data: { reference_number: data.reference_number }, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.message } };
  }
}

// ─── Get Documents ────────────────────────────────────────────────────────────
export async function getApplicantDocuments(
  applicantId: string
): Promise<SupabaseResponse<ApplicantDocument[]>> {
  const { data, error } = await supabase
    .from('applicant_documents')
    .select('*')
    .eq('applicant_id', applicantId)
    .order('submitted_at', { ascending: false });

  if (error) {
    return { data: null, error: { message: error.message } };
  }

  return { data: data as ApplicantDocument[], error: null };
}

// ─── Helper: Generate UUID ────────────────────────────────────────────────────
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Helper: Generate Reference Number ────────────────────────────────────────
function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `APP-${year}-${random}`;
}
