"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Settings, Cookie } from 'lucide-react'
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowBanner(true)
    } else {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
    }
  }, [])

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    saveCookiePreferences(allAccepted)
    setShowBanner(false)
  }

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    saveCookiePreferences(necessaryOnly)
    setShowBanner(false)
  }

  const saveCustomPreferences = () => {
    saveCookiePreferences(preferences)
    setShowSettings(false)
    setShowBanner(false)
  }

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(prefs))
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    
    // Initialize analytics if accepted
    if (prefs.analytics) {
      console.log("[v0] Analytics cookies enabled")
    }
    
    // Initialize marketing if accepted
    if (prefs.marketing) {
      console.log("[v0] Marketing cookies enabled")
    }
  }

  if (!showBanner) return null

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 p-4 pb-safe">
        <Card className="mx-auto max-w-3xl border-2 shadow-lg">
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-6 md:p-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Cookie className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">Wir verwenden Cookies</h3>
              <p className="text-sm text-muted-foreground">
                Wir verwenden Cookies und ähnliche Technologien, um Ihre Erfahrung zu verbessern, 
                Inhalte zu personalisieren und den Traffic zu analysieren. Sie können Ihre Einstellungen 
                jederzeit anpassen.{" "}
                <Link 
                  href="/de/cookies" 
                  className="text-blue-600 hover:underline"
                  onClick={() => setShowBanner(false)}
                >
                  Mehr erfahren
                </Link>
              </p>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="w-full md:w-auto"
              >
                <Settings className="mr-2 h-4 w-4" />
                Einstellungen
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={acceptNecessary}
                className="w-full md:w-auto"
              >
                Nur notwendige
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="w-full md:w-auto"
              >
                Alle akzeptieren
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cookie-Einstellungen</DialogTitle>
            <DialogDescription>
              Wählen Sie, welche Cookies Sie akzeptieren möchten. Notwendige Cookies können nicht deaktiviert werden.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="necessary" className="font-semibold">
                      Notwendige Cookies
                    </Label>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                      Erforderlich
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden. 
                    Sie speichern keine persönlichen Informationen.
                  </p>
                </div>
                <Switch
                  id="necessary"
                  checked={true}
                  disabled
                  className="mt-1"
                />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="analytics" className="font-semibold">
                    Analyse-Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren, 
                    indem sie Informationen anonym sammeln und melden.
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, analytics: checked })
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="marketing" className="font-semibold">
                    Marketing-Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Diese Cookies werden verwendet, um Besuchern relevante Werbung und Marketingkampagnen 
                    anzuzeigen. Sie verfolgen Besucher über Websites hinweg.
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, marketing: checked })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Abbrechen
            </Button>
            <Button onClick={saveCustomPreferences}>
              Einstellungen speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
