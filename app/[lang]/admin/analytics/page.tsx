// @ts-nocheck
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import type { Locale } from "@/lib/i18n-config"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const { userId } = auth()
  if (!userId) redirect(`/${lang}/sign-in`)

  const sql = neon(process.env.DATABASE_URL!)

  // Today's stats
  const [todayStats] = await sql(`
    SELECT
      COUNT(*) as total_views,
      COUNT(DISTINCT user_agent) as unique_visitors
    FROM "PageView"
    WHERE created_at >= CURRENT_DATE
  `)

  // Active in last 5 minutes
  const [activeNow] = await sql(`
    SELECT COUNT(DISTINCT user_agent) as active
    FROM "PageView"
    WHERE created_at >= NOW() - INTERVAL '5 minutes'
  `)

  // Top pages today
  const topPages = await sql(`
    SELECT path, COUNT(*) as views
    FROM "PageView"
    WHERE created_at >= CURRENT_DATE
    GROUP BY path
    ORDER BY views DESC
    LIMIT 15
  `)

  // Top referrers today
  const topReferrers = await sql(`
    SELECT referrer, COUNT(*) as views
    FROM "PageView"
    WHERE created_at >= CURRENT_DATE AND referrer != '' AND referrer IS NOT NULL
    GROUP BY referrer
    ORDER BY views DESC
    LIMIT 10
  `)

  // Last 7 days trend
  const weekTrend = await sql(`
    SELECT
      DATE(created_at) as day,
      COUNT(*) as views,
      COUNT(DISTINCT user_agent) as visitors
    FROM "PageView"
    WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY DATE(created_at)
    ORDER BY day ASC
  `)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Analytics</h1>

      {/* Live stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Aktive Besucher (5 Min)" value={activeNow.active} highlight />
        <StatCard label="Aufrufe heute" value={todayStats.total_views} />
        <StatCard label="Besucher heute" value={todayStats.unique_visitors} />
        <StatCard label="Seiten heute" value={String(topPages.length)} />
      </div>

      {/* Weekly trend */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Letzte 7 Tage</h2>
        <div className="space-y-2">
          {weekTrend.map((day: any) => (
            <div key={day.day} className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">
                {new Date(day.day).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full flex items-center px-2"
                  style={{ width: `${Math.min(100, (Number(day.views) / Math.max(...weekTrend.map((d: any) => Number(d.views)), 1)) * 100)}%` }}
                >
                  <span className="text-xs text-white font-medium">{day.views}</span>
                </div>
              </div>
              <span className="text-sm text-gray-500 w-20 text-right">{day.visitors} Besucher</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Top pages */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Top-Seiten heute</h2>
          <div className="space-y-2">
            {topPages.map((page: any, i: number) => (
              <div key={page.path} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 truncate max-w-[250px]">
                  {i + 1}. {page.path}
                </span>
                <span className="text-gray-500 font-medium">{page.views}</span>
              </div>
            ))}
            {topPages.length === 0 && (
              <p className="text-sm text-gray-500">Noch keine Aufrufe heute</p>
            )}
          </div>
        </div>

        {/* Top referrers */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Referrer</h2>
          <div className="space-y-2">
            {topReferrers.map((ref: any, i: number) => (
              <div key={ref.referrer} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 truncate max-w-[250px]">
                  {i + 1}. {ref.referrer}
                </span>
                <span className="text-gray-500 font-medium">{ref.views}</span>
              </div>
            ))}
            {topReferrers.length === 0 && (
              <p className="text-sm text-gray-500">Keine Referrer heute</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`rounded-xl px-4 py-3 ${highlight ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${highlight ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
        {value}
      </div>
    </div>
  )
}
