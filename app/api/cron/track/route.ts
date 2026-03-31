import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!botToken || !chatId) {
    return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)

    const [todayStats] = await sql(`
      SELECT
        COUNT(*) as total_views,
        COUNT(DISTINCT path) as unique_pages,
        COUNT(DISTINCT user_agent) as unique_visitors
      FROM "PageView"
      WHERE created_at >= CURRENT_DATE
    `)

    const topPages = await sql(`
      SELECT path, COUNT(*) as views
      FROM "PageView"
      WHERE created_at >= CURRENT_DATE
      GROUP BY path
      ORDER BY views DESC
      LIMIT 5
    `)

    const [profileCount] = await sql(`SELECT COUNT(*) as total FROM "CraftsmanProfile"`)
    const [claimedCount] = await sql(`SELECT COUNT(*) as total FROM "CraftsmanProfile" WHERE claimed = true`)

    const topPagesText = topPages
      .map((p: any, i: number) => `  ${i + 1}. ${p.path} (${p.views}x)`)
      .join('\n')

    const message = [
      `📊 Tagesbericht handwerker-kontakte.de`,
      ``,
      `👁 Seitenaufrufe heute: ${todayStats.total_views}`,
      `📄 Verschiedene Seiten: ${todayStats.unique_pages}`,
      `👤 Eindeutige Besucher: ${todayStats.unique_visitors}`,
      ``,
      `🏗 Handwerker gesamt: ${profileCount.total}`,
      `✅ Davon verifiziert: ${claimedCount.total}`,
      ``,
      topPages.length > 0 ? `📈 Top-Seiten:\n${topPagesText}` : '',
    ].filter(Boolean).join('\n')

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    })

    return NextResponse.json({ ok: true, message })
  } catch (error) {
    console.error('Cron track error:', error)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
