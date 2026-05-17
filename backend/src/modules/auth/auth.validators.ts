import type { LoginRequestDto, LogoutRequestDto } from "@/src/modules/auth/auth.types";
import { assertEmail, assertNonEmptyString, assertOptionalString, assertUuidLike } from "@/src/shared/validation/assert";

export function validateLoginRequest(payload: LoginRequestDto): LoginRequestDto {
  return {
    actor_uuid: assertUuidLike(payload.actor_uuid, "actor_uuid"),
    email: assertEmail(payload.email, "email"),
    password: assertNonEmptyString(payload.password, "password"),
    device_name: assertOptionalString(payload.device_name),
    ip_address: assertOptionalString(payload.ip_address),
  };
}

export function validateLogoutRequest(payload: LogoutRequestDto): LogoutRequestDto {
  return {
    actor_uuid: assertUuidLike(payload.actor_uuid, "actor_uuid"),
    session_id: assertOptionalString(payload.session_id),
    device_name: assertOptionalString(payload.device_name),
  };
}
