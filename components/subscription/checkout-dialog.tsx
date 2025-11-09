"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2, Sparkles, CreditCard } from "lucide-react"
import { startCheckoutSession } from "@/lib/actions/stripe-actions"
import { toast } from "sonner"

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  planName: string
  price: string
  features: string[]
}

export function CheckoutDialog({ open, onOpenChange, productId, planName, price, features }: CheckoutDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [testMode, setTestMode] = useState(true) // Default to test mode

  const handleTestPayment = async () => {
    setLoading(true)
    try {
      const result = await startCheckoutSession(productId, true)

      if (result.success && result.testMode) {
        toast.success("Plan erfolgreich aktiviert! (Test-Modus)")
        onOpenChange(false)
        router.push("/subscription")
        router.refresh()
      }
    } catch (error) {
      toast.error("Fehler beim Aktivieren des Plans")
      console.error("Test payment error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStripeCheckout = async () => {
    setLoading(true)
    try {
      const result = await startCheckoutSession(productId, false)

      if (result.success && result.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.checkoutUrl
      } else {
        toast.error("Fehler beim Erstellen der Checkout-Sitzung")
      }
    } catch (error) {
      toast.error("Fehler beim Starten des Checkouts")
      console.error("Stripe checkout error:", error)
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade zu {planName}</DialogTitle>
          <DialogDescription>Wählen Sie Ihre Zahlungsmethode</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{planName}</h3>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{price}</div>
                <div className="text-sm text-muted-foreground">pro Monat</div>
              </div>
            </div>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mode Selection */}
          <div className="flex gap-4">
            <Button variant={testMode ? "default" : "outline"} className="flex-1" onClick={() => setTestMode(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Test-Modus
            </Button>
            <Button variant={!testMode ? "default" : "outline"} className="flex-1" onClick={() => setTestMode(false)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Stripe Zahlung
            </Button>
          </div>

          {/* Test Mode */}
          {testMode && (
            <div className="space-y-4">
              <Badge variant="secondary" className="w-full justify-center py-2">
                Test-Modus: Keine echte Zahlung erforderlich
              </Badge>
              <p className="text-sm text-muted-foreground text-center">
                Aktivieren Sie den Plan sofort ohne Zahlung für Testzwecke
              </p>
              <Button onClick={handleTestPayment} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Aktiviere Plan...
                  </>
                ) : (
                  "Plan jetzt aktivieren (Test)"
                )}
              </Button>
            </div>
          )}

          {/* Real Stripe Checkout */}
          {!testMode && (
            <div className="space-y-4">
              <Badge variant="default" className="w-full justify-center py-2">
                Sichere Zahlung mit Stripe
              </Badge>
              <p className="text-sm text-muted-foreground text-center">
                Sie werden zu Stripe weitergeleitet, um die Zahlung abzuschließen
              </p>
              <Button onClick={handleStripeCheckout} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Weiterleitung...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Weiter zu Stripe Checkout
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
