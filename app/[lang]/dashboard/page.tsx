import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, PenToolIcon as Tool, MessageSquare, Bell, Settings, User } from "lucide-react"

export default async function DashboardPage({
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
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Willkommen im Dashboard</h1>
            <p className="text-gray-500">Verwalten Sie Ihre Projekte und Einstellungen</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Aufträge
                </CardTitle>
                <CardDescription>Verwalten Sie Ihre Aufträge</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Sehen Sie Ihre aktuellen Aufträge ein und erstellen Sie neue.</p>
                <Button asChild className="w-full">
                  <Link href={`/${lang}/auftraege`}>Zu den Aufträgen</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tool className="mr-2 h-5 w-5" />
                  Handwerker
                </CardTitle>
                <CardDescription>Finden Sie qualifizierte Handwerker</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Durchsuchen Sie unser Netzwerk von verifizierten Handwerkern.</p>
                <Button asChild className="w-full">
                  <Link href={`/${lang}/handwerker`}>Handwerker finden</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Nachrichten
                </CardTitle>
                <CardDescription>Kommunizieren Sie mit Handwerkern</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Sehen Sie Ihre Konversationen mit Handwerkern ein.</p>
                <Button asChild className="w-full">
                  <Link href={`/${lang}/nachrichten`}>Zu den Nachrichten</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Benachrichtigungen
                </CardTitle>
                <CardDescription>Bleiben Sie auf dem Laufenden</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Sehen Sie Ihre neuesten Benachrichtigungen ein.</p>
                <Button asChild className="w-full">
                  <Link href={`/${lang}/benachrichtigungen`}>Benachrichtigungen anzeigen</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profil
                </CardTitle>
                <CardDescription>Verwalten Sie Ihr Profil</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Aktualisieren Sie Ihre persönlichen Informationen.</p>
                <Button asChild className="w-full">
                  <Link href={`/${lang}/profil`}>Profil bearbeiten</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Einstellungen
                </CardTitle>
                <CardDescription>Passen Sie Ihre Einstellungen an</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Ändern Sie Ihre Konto- und Benachrichtigungseinstellungen.</p>
                <Button asChild className="w-full">
                  <Link href={`/${lang}/einstellungen`}>Einstellungen ändern</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter dictionary={dict.footer} />
    </>
  )
}
