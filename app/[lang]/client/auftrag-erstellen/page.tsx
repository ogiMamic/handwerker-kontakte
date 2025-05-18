import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { JobWizard } from "@/components/client/job-wizard"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function JobWizardPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const { userId } = auth()
  if (!userId) {
    redirect(`/${lang}/sign-in`)
  }

  const dict = await getDictionary(lang)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <JobWizard />
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
