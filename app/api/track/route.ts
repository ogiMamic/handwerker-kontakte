import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json()
    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'path required' }, { status: 400 })
    }

    const userAgent = req.headers.get('user-agent') || ''
    const sql = neon(process.env.DATABASE_URL!)

    await sql(
      `INSERT INTO "PageView" (path, referrer, user_agent) VALUES ($1, $2, $3)`,
      [path.slice(0, 500), (referrer || '').slice(0, 500), userAgent.slice(0, 500)]
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
