import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/src/modules/auth/auth.service";
import { parseJsonBody } from "@/src/shared/http/request";
import { errorResponse } from "@/src/shared/http/response";
import type { LogoutRequestDto } from "@/src/modules/auth/auth.types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await parseJsonBody<LogoutRequestDto>(request);
    const result = await authService.logout(payload);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
