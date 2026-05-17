export interface BaseLogRecord {
  log_id: string;
  created_at: string;
  actor_uuid: string;
  action_type: string;
  status_code: number;
}

export interface EventWriteResult {
  ok: boolean;
  logId: string;
  actionType: string;
  tableName: string;
  createdAt: string;
}
