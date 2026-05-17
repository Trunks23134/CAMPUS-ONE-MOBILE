import { appendEvent } from "@/src/shared/events/event.repository";
import { buildBaseLogRecord } from "@/src/shared/events/event.factory";
import { validateLoginRequest, validateLogoutRequest } from "@/src/modules/auth/auth.validators";
import type { AuthLoginLogRecord, AuthLogoutLogRecord, LoginRequestDto, LogoutRequestDto } from "@/src/modules/auth/auth.types";

const AUTH_LOGIN_ACTION = "auth.user.login.v1";
const AUTH_LOGOUT_ACTION = "auth.user.logout.v1";

class AuthService {
  public async login(payload: LoginRequestDto) {
    const dto = validateLoginRequest(payload);
    const baseRecord = buildBaseLogRecord(dto.actor_uuid, AUTH_LOGIN_ACTION);

    const logRecord: AuthLoginLogRecord = {
      ...baseRecord,
      email: dto.email,
      device_name: dto.device_name,
      ip_address: dto.ip_address,
    };

    return appendEvent("auth_login_log", logRecord);
  }

  public async logout(payload: LogoutRequestDto) {
    const dto = validateLogoutRequest(payload);
    const baseRecord = buildBaseLogRecord(dto.actor_uuid, AUTH_LOGOUT_ACTION);

    const logRecord: AuthLogoutLogRecord = {
      ...baseRecord,
      session_id: dto.session_id,
      device_name: dto.device_name,
    };

    return appendEvent("auth_logout_log", logRecord);
  }
}

export const authService = new AuthService();
