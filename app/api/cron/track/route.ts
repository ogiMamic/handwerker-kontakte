import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(req: NextRequest) {
  // Vercel cron sends this header automatically
  const authHeader = req.headers.get('authorization')
  const cronSecret = req.headers.get('x-vercel-cron') // Vercel sets this for cron jobs
  if (!cronSecret && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!botToken || !chatId) {
    return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Today's page view stats
    const [todayStats] = await sql(`
      SELECT
        COUNT(*) as total_views,
        COUNT(DISTINCT path) as unique_pages,
        COUNT(DISTINCT user_agent) as unique_visitors
      FROM "PageView"
      WHERE created_at >= CURRENT_DATE
    `)

    // Top 5 pages today
    const topPages = await sql(`
      SELECT path, COUNT(*) as views
      FROM "PageView"
      WHERE created_at >= CURRENT_DATE
      GROUP BY path
      ORDER BY views DESC
      LIMIT 5
    `)

    // Yesterday comparison
    const [yesterdayStats] = await sql(`
      SELECT COUNT(*) as total_views
      FROM "PageView"
      WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
        AND created_at < CURRENT_DATE
    `)

    // New users registered today
    const [newUsersToday] = await sql(`
      SELECT COUNT(*) as total
      FROM "User"
      WHERE "createdAt" >= CURRENT_DATE
    `)

    // New craftsman profiles registered today
    const [newProfilesToday] = await sql(`
      SELECT COUNT(*) as total
      FROM "CraftsmanProfile"
      WHERE "createdAt" >= CURRENT_DATE AND claimed = true
    `)

    // Total counts
    const [totalUsers] = await sql(`SELECT COUNT(*) as total FROM "User"`)
    const [totalProfiles] = await sql(`SELECT COUNT(*) as total FROM "CraftsmanProfile"`)
    const [claimedProfiles] = await sql(`SELECT COUNT(*) as total FROM "CraftsmanProfile" WHERE claimed = true`)

    // Top referrers today
    const topReferrers = await sql(`
      SELECT referrer, COUNT(*) as views
      FROM "PageView"
      WHERE created_at >= CURRENT_DATE
        AND referrer IS NOT NULL AND referrer != ''
      GROUP BY referrer
      ORDER BY views DESC
      LIMIT 3
    `)

    const topPagesText = topPages
      .map((p: any, i: number) => `  ${i + 1}. ${p.path} (${p.views}x)`)
      .join('\n')

    const referrersText = topReferrers
      .map((r: any, i: number) => `  ${i + 1}. ${r.referrer} (${r.views}x)`)
      .join('\n')

    const yesterdayViews = Number(yesterdayStats.total_views) || 0
    const todayViews = Number(todayStats.total_views) || 0
    const trend = yesterdayViews > 0
      ? `${todayViews >= yesterdayViews ? '+' : ''}${Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100)}% vs gestern`
      : 'kein Vergleich'

    const now = new Date().toLocaleDateString('de-DE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

    const message = [
      `📊 Tagesbericht - ${now}`,
      `handwerker-kontakte.de`,
      ``,
      `--- Traffic ---`,
      `👁 Seitenaufrufe: ${todayViews} (${trend})`,
      `📄 Verschiedene Seiten: ${todayStats.unique_pages}`,
      `👤 Eindeutige Besucher: ${todayStats.unique_visitors}`,
      ``,
      `--- Registrierungen ---`,
      `🆕 Neue Nutzer heute: ${newUsersToday.total}`,
      `🔧 Neue Handwerker heute: ${newProfilesToday.total}`,
      ``,
      `--- Gesamt ---`,
      `👥 Nutzer: ${totalUsers.total}`,
      `🏗 Handwerker: ${totalProfiles.total} (${claimedProfiles.total} verifiziert)`,
      ``,
      topPages.length > 0 ? `📈 Top 5 Seiten:\n${topPagesText}` : '',
      topReferrers.length > 0 ? `\n🔗 Top Referrer:\n${referrersText}` : '',
    ].filter(Boolean).join('\n')

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    if (!telegramResponse.ok) {
      const errorBody = await telegramResponse.text()
      console.error('Telegram API error:', errorBody)
      return NextResponse.json({ error: 'Telegram send failed', details: errorBody }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message })
  } catch (error) {
    console.error('Cron track error:', error)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
