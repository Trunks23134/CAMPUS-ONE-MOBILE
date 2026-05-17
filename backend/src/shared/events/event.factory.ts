import type { BaseLogRecord } from "@/src/shared/events/event.types";

export function buildBaseLogRecord(actorUuid: string, actionType: string, statusCode = 100): BaseLogRecord {
  return {
    log_id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    actor_uuid: actorUuid,
    action_type: actionType,
    status_code: statusCode,
  };
}
