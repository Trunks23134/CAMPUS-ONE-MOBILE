import { ApiError } from "@/src/shared/errors/api-error";
import { getSupabaseServerClient } from "@/src/shared/supabase/supabase.server";
import type { BaseLogRecord, EventWriteResult } from "@/src/shared/events/event.types";

export async function appendEvent<TRecord extends BaseLogRecord>(
  tableName: string,
  record: TRecord,
): Promise<EventWriteResult> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from(tableName).insert(record);

  if (error) {
    throw new ApiError(500, "database_insert_failed", `Failed to write event to ${tableName}.`);
  }

  return {
    ok: true,
    logId: record.log_id,
    actionType: record.action_type,
    tableName,
    createdAt: record.created_at,
  };
}
