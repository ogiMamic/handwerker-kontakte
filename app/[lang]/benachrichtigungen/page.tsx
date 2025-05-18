import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { NotificationList } from "@/components/notifications/notification-list"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getNotifications } from "@/lib/actions/notification-actions"

export default async function NotificationsPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const { userId } = auth()
  if (!userId) {
    redirect(`/${lang}/sign-in`)
  }

  const dict = await getDictionary(lang)
  const { notifications, pagination } = await getNotifications({ limit: 10 })

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <NotificationList initialNotifications={notifications} initialPagination={pagination} />
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
