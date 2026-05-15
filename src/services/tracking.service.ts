import { supabase } from '../lib/supabase';
import type { SupabaseResponse } from '../types/admissions.types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApplicationStatus {
  id: string;
  reference_number: string;
  applicant_number: string | null;
  full_name: string;
  email: string;
  school_level: string;
  applicant_type: string;
  status: 'Under Review' | 'Passed' | 'Not Accepted';
  application_submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface ApplicationDocument {
  id: string;
  document_name: string;
  file_name: string;
  file_url: string;
  status: string;
  submitted_at: string;
}

export interface ApplicationProgress {
  step: number;
  label: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
}

export interface FullApplicationStatus {
  application: ApplicationStatus;
  documents: ApplicationDocument[];
  progress: ApplicationProgress[];
  remarks: string | null;
}

// ─── Fetch Application Status ─────────────────────────────────────────────────

export async function fetchApplicationStatus(
  email: string,
  referenceNumber: string
): Promise<SupabaseResponse<FullApplicationStatus>> {
  try {
    // Fetch application details
    const { data: appData, error: appError } = await supabase
      .from('applicant_profiles')
      .select('*')
      .eq('email', email)
      .eq('reference_number', referenceNumber)
      .single();

    if (appError || !appData) {
      return {
        data: null,
        error: { message: 'Invalid email or reference number' },
      };
    }

    // Fetch documents
    const { data: docsData } = await supabase
      .from('applicant_documents')
      .select('*')
      .eq('applicant_id', appData.id)
      .order('submitted_at', { ascending: false });

    // Build progress steps
    const progress = buildProgressSteps(appData);

    const fullStatus: FullApplicationStatus = {
      application: appData as ApplicationStatus,
      documents: (docsData || []) as ApplicationDocument[],
      progress,
      remarks: appData.rejection_reason,
    };

    return { data: fullStatus, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ─── Build Progress Steps ─────────────────────────────────────────────────────

function buildProgressSteps(application: any): ApplicationProgress[] {
  const steps: ApplicationProgress[] = [
    {
      step: 1,
      label: 'Application Submitted',
      status: 'completed',
      date: application.application_submitted_at,
    },
    {
      step: 2,
      label: 'Under Review',
      status: application.status === 'Under Review' ? 'current' : 'completed',
      date: application.application_submitted_at,
    },
    {
      step: 3,
      label: 'Verified by Admin',
      status:
        application.status === 'Passed' || application.status === 'Not Accepted'
          ? 'completed'
          : 'pending',
      date: application.reviewed_at,
    },
    {
      step: 4,
      label: 'Decision Released',
      status:
        application.status === 'Passed' || application.status === 'Not Accepted'
          ? 'completed'
          : 'pending',
      date: application.reviewed_at,
    },
  ];

  return steps;
}
