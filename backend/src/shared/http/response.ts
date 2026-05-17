import { NextResponse } from "next/server";
import { ApiError } from "@/src/shared/errors/api-error";

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "internal_server_error",
        message: "An unexpected server error occurred.",
      },
    },
    { status: 500 },
  );
}
