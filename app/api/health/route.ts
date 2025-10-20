import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Jednostavan health check
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      clerk: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "configured" : "missing",
      database: process.env.DATABASE_URL ? "configured" : "missing",
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
