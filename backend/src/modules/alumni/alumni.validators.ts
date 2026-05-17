import type {
  AlumniCardApplicationRequestDto,
  AlumniProfileUpdateRequestDto,
  AlumniRecordRequestDto,
  AlumniRegistrationRequestDto,
} from "@/src/modules/alumni/alumni.types";
import {
  assertCondition,
  assertEmail,
  assertNonEmptyString,
  assertOptionalString,
  assertUuidLike,
} from "@/src/shared/validation/assert";

export function validateRegistrationRequest(payload: AlumniRegistrationRequestDto): AlumniRegistrationRequestDto {
  const verificationType = assertNonEmptyString(payload.verification_type, "verification_type");
  assertCondition(
    verificationType === "student_record" || verificationType === "manual_alumni_verification",
    "verification_type must be either student_record or manual_alumni_verification.",
    "invalid_verification_type",
  );

  return {
    actor_uuid: assertUuidLike(payload.actor_uuid, "actor_uuid"),
    email: assertEmail(payload.email, "email"),
    first_name: assertNonEmptyString(payload.first_name, "first_name"),
    middle_name: assertOptionalString(payload.middle_name),
    last_name: assertNonEmptyString(payload.last_name, "last_name"),
    phone: assertOptionalString(payload.phone),
    student_id: assertOptionalString(payload.student_id),
    academic_unit: assertOptionalString(payload.academic_unit),
    graduation_year: assertOptionalString(payload.graduation_year),
    last_program: assertOptionalString(payload.last_program),
    proof_reference: assertOptionalString(payload.proof_reference),
    verification_type: verificationType as AlumniRegistrationRequestDto["verification_type"],
  };
}

export function validateProfileUpdateRequest(payload: AlumniProfileUpdateRequestDto): AlumniProfileUpdateRequestDto {
  return {
    actor_uuid: assertUuidLike(payload.actor_uuid, "actor_uuid"),
    email: assertOptionalString(payload.email),
    phone: assertOptionalString(payload.phone),
    employment_status: assertOptionalString(payload.employment_status),
    employer_name: assertOptionalString(payload.employer_name),
    job_title: assertOptionalString(payload.job_title),
    city: assertOptionalString(payload.city),
    country: assertOptionalString(payload.country),
  };
}

export function validateRecordRequest(payload: AlumniRecordRequestDto): AlumniRecordRequestDto {
  assertCondition(Number.isInteger(payload.copies) && payload.copies > 0, "copies must be a positive integer.", "invalid_copies");

  return {
    actor_uuid: assertUuidLike(payload.actor_uuid, "actor_uuid"),
    document_type: assertNonEmptyString(payload.document_type, "document_type"),
    purpose: assertNonEmptyString(payload.purpose, "purpose"),
    copies: payload.copies,
    delivery_method: assertOptionalString(payload.delivery_method),
    remarks: assertOptionalString(payload.remarks),
  };
}

export function validateCardApplicationRequest(
  payload: AlumniCardApplicationRequestDto,
): AlumniCardApplicationRequestDto {
  return {
    actor_uuid: assertUuidLike(payload.actor_uuid, "actor_uuid"),
    card_type: assertNonEmptyString(payload.card_type, "card_type"),
    delivery_method: assertNonEmptyString(payload.delivery_method, "delivery_method"),
    contact_email: assertEmail(payload.contact_email, "contact_email"),
    contact_phone: assertOptionalString(payload.contact_phone),
    remarks: assertOptionalString(payload.remarks),
  };
}
