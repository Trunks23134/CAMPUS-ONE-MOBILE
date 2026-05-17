import { ApiError } from "@/src/shared/errors/api-error";

export function assertCondition(condition: boolean, message: string, code = "validation_error"): void {
  if (!condition) {
    throw new ApiError(400, code, message);
  }
}

export function assertNonEmptyString(value: unknown, fieldName: string): string {
  const parsedValue = typeof value === "string" ? value.trim() : "";
  assertCondition(parsedValue.length > 0, `${fieldName} is required.`, "missing_field");
  return parsedValue;
}

export function assertOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ApiError(400, "invalid_field_type", "Optional text fields must be strings.");
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function assertUuidLike(value: unknown, fieldName: string): string {
  const parsedValue = assertNonEmptyString(value, fieldName);
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  assertCondition(uuidPattern.test(parsedValue), `${fieldName} must be a valid UUID string.`, "invalid_uuid");
  return parsedValue;
}

export function assertEmail(value: unknown, fieldName: string): string {
  const parsedValue = assertNonEmptyString(value, fieldName);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  assertCondition(emailPattern.test(parsedValue), `${fieldName} must be a valid email address.`, "invalid_email");
  return parsedValue.toLowerCase();
}
