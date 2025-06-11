import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { CraftsmanProfile } from "@/components/craftsman/profile"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getCraftsmanProfile } from "@/lib/actions/craftsman-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User, Building } from "lucide-react"

export default async function ProfilePage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const { userId } = auth()
  if (!userId) {
    redirect(`/${lang}/sign-in`)
  }

  const dict = await getDictionary(lang)
  const craftsmanProfile = await getCraftsmanProfile(userId)

  return (
    <>
      <SiteHeader dictionary={dict.navigation} />
      <main className="flex-1 container py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Mein Profil</h1>

          {craftsmanProfile ? (
            <CraftsmanProfile initialData={craftsmanProfile} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Handwerker-Profil erstellen
                </CardTitle>
                <CardDescription>
                  Sie haben noch kein Handwerker-Profil. Erstellen Sie eines, um Aufträge zu erhalten.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={`/${lang}/handwerker/registrieren`}>
                    <User className="mr-2 h-4 w-4" />
                    Handwerker-Profil erstellen
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
