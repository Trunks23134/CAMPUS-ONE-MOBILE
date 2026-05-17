import { appendEvent } from "@/src/shared/events/event.repository";
import { buildBaseLogRecord } from "@/src/shared/events/event.factory";
import {
  validateCardApplicationRequest,
  validateProfileUpdateRequest,
  validateRecordRequest,
  validateRegistrationRequest,
} from "@/src/modules/alumni/alumni.validators";
import type {
  AlumniCardApplicationLogRecord,
  AlumniCardApplicationRequestDto,
  AlumniProfileUpdateLogRecord,
  AlumniProfileUpdateRequestDto,
  AlumniRecordRequestDto,
  AlumniRecordRequestLogRecord,
  AlumniRegistrationLogRecord,
  AlumniRegistrationRequestDto,
} from "@/src/modules/alumni/alumni.types";

const ALUMNI_REGISTRATION_ACTION = "alumni.registration.submitted.v1";
const ALUMNI_PROFILE_UPDATE_ACTION = "alumni.profile.updated.v1";
const ALUMNI_RECORD_REQUEST_ACTION = "alumni.record.requested.v1";
const ALUMNI_CARD_APPLICATION_ACTION = "alumni.card.application.submitted.v1";

class AlumniService {
  public async submitRegistration(payload: AlumniRegistrationRequestDto) {
    const dto = validateRegistrationRequest(payload);
    const baseRecord = buildBaseLogRecord(dto.actor_uuid, ALUMNI_REGISTRATION_ACTION);

    const logRecord: AlumniRegistrationLogRecord = {
      ...baseRecord,
      email: dto.email,
      first_name: dto.first_name,
      middle_name: dto.middle_name,
      last_name: dto.last_name,
      phone: dto.phone,
      student_id: dto.student_id,
      academic_unit: dto.academic_unit,
      graduation_year: dto.graduation_year,
      last_program: dto.last_program,
      proof_reference: dto.proof_reference,
      verification_type: dto.verification_type,
    };

    return appendEvent("alumni_registration_log", logRecord);
  }

  public async updateProfile(payload: AlumniProfileUpdateRequestDto) {
    const dto = validateProfileUpdateRequest(payload);
    const baseRecord = buildBaseLogRecord(dto.actor_uuid, ALUMNI_PROFILE_UPDATE_ACTION);

    const logRecord: AlumniProfileUpdateLogRecord = {
      ...baseRecord,
      email: dto.email,
      phone: dto.phone,
      employment_status: dto.employment_status,
      employer_name: dto.employer_name,
      job_title: dto.job_title,
      city: dto.city,
      country: dto.country,
    };

    return appendEvent("alumni_profile_update_log", logRecord);
  }

  public async requestRecord(payload: AlumniRecordRequestDto) {
    const dto = validateRecordRequest(payload);
    const baseRecord = buildBaseLogRecord(dto.actor_uuid, ALUMNI_RECORD_REQUEST_ACTION);

    const logRecord: AlumniRecordRequestLogRecord = {
      ...baseRecord,
      document_type: dto.document_type,
      purpose: dto.purpose,
      copies: dto.copies,
      delivery_method: dto.delivery_method,
      remarks: dto.remarks,
    };

    return appendEvent("alumni_record_request_log", logRecord);
  }

  public async submitCardApplication(payload: AlumniCardApplicationRequestDto) {
    const dto = validateCardApplicationRequest(payload);
    const baseRecord = buildBaseLogRecord(dto.actor_uuid, ALUMNI_CARD_APPLICATION_ACTION);

    const logRecord: AlumniCardApplicationLogRecord = {
      ...baseRecord,
      card_type: dto.card_type,
      delivery_method: dto.delivery_method,
      contact_email: dto.contact_email,
      contact_phone: dto.contact_phone,
      remarks: dto.remarks,
    };

    return appendEvent("alumni_card_application_log", logRecord);
  }
}

export const alumniService = new AlumniService();
