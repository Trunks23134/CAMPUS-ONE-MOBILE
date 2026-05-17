import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/src/modules/auth/auth.service";
import { parseJsonBody } from "@/src/shared/http/request";
import { ApiError } from "@/src/shared/errors/api-error";
import { errorResponse } from "@/src/shared/http/response";
import type { LoginRequestDto } from "@/src/modules/auth/auth.types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await parseJsonBody<LoginRequestDto>(request);
    const result = await authService.login(payload);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
