export interface LoginRequestDto {
  actor_uuid: string;
  email: string;
  password: string;
  device_name?: string;
  ip_address?: string;
}

export interface LogoutRequestDto {
  actor_uuid: string;
  session_id?: string;
  device_name?: string;
}

export interface AuthLoginLogRecord {
  log_id: string;
  created_at: string;
  actor_uuid: string;
  action_type: string;
  status_code: number;
  email: string;
  device_name?: string;
  ip_address?: string;
}

export interface AuthLogoutLogRecord {
  log_id: string;
  created_at: string;
  actor_uuid: string;
  action_type: string;
  status_code: number;
  session_id?: string;
  device_name?: string;
}
