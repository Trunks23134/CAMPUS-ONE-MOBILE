import { NextRequest, NextResponse } from "next/server";
import { alumniService } from "@/src/modules/alumni/alumni.service";
import { parseJsonBody } from "@/src/shared/http/request";
import { errorResponse } from "@/src/shared/http/response";
import type { AlumniProfileUpdateRequestDto } from "@/src/modules/alumni/alumni.types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await parseJsonBody<AlumniProfileUpdateRequestDto>(request);
    const result = await alumniService.updateProfile(payload);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
