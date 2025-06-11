import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Jednostavan health check bez database konekcije za početak
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
