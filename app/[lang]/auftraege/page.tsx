import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { getMockJobs } from "@/lib/mock-data"

export const dynamic = 'force-dynamic';

export default async function JobsPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const { userId } = auth()
  if (!userId) {
    redirect(`/${lang}/sign-in`)
  }

  const dict = await getDictionary(lang)
  const jobs = getMockJobs()

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Aufträge</h1>
            <p className="text-gray-500 mt-2">Finden Sie passende Aufträge in Ihrer Nähe</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <p className="text-gray-500 mb-4">{job.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded">
                    {job.category}
                  </span>
                  <span className="text-green-600 font-bold">{job.budget} €</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} locale={lang} />
    </>
  )
}
