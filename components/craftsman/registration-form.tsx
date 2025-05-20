"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { registerCraftsman } from "@/lib/actions/craftsman-actions"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  companyName: z.string().min(2, "Der Firmenname muss mindestens 2 Zeichen lang sein"),
  contactPerson: z.string().min(2, "Der Name der Kontaktperson muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  phone: z.string().min(5, "Die Telefonnummer muss mindestens 5 Zeichen lang sein"),
  address: z.string().min(5, "Die Adresse muss mindestens 5 Zeichen lang sein"),
  postalCode: z.string().regex(/^\d{5}$/, "Bitte geben Sie eine gültige Postleitzahl ein (5 Ziffern)"),
  city: z.string().min(2, "Der Stadtname muss mindestens 2 Zeichen lang sein"),
  description: z.string().min(20, "Die Beschreibung muss mindestens 20 Zeichen lang sein"),
  services: z.array(z.string()).min(1, "Bitte wählen Sie mindestens einen Service aus"),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Sie müssen die AGB akzeptieren, um fortzufahren" }),
  }),
})

type FormValues = z.infer<typeof formSchema>

const serviceOptions = [
  { id: "plumbing", label: "Sanitär" },
  { id: "electrical", label: "Elektrik" },
  { id: "carpentry", label: "Tischlerei" },
  { id: "painting", label: "Malerarbeiten" },
  { id: "flooring", label: "Bodenbeläge" },
  { id: "roofing", label: "Dacharbeiten" },
  { id: "landscaping", label: "Gartenarbeiten" },
  { id: "masonry", label: "Mauerwerk" },
  { id: "hvac", label: "Heizung & Klima" },
  { id: "tiling", label: "Fliesenarbeiten" },
]

export function CraftsmanRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      description: "",
      services: [],
      termsAccepted: false,
    },
  })

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true)

      // Call the registration action
      await registerCraftsman(data)

      // Show success toast
      toast({
        title: "Registrierung erfolgreich",
        description: "Ihre Registrierung wurde erfolgreich abgeschlossen. Wir werden uns in Kürze bei Ihnen melden.",
        duration: 5000,
      })

      // Redirect to confirmation page after a short delay
      setTimeout(() => {
        router.push("/de/handwerker/registrierung-erfolgreich")
      }, 2000)
    } catch (error) {
      console.error("Registration error:", error)

      // Show error toast
      toast({
        title: "Registrierung fehlgeschlagen",
        description: "Bei der Registrierung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Als Handwerker registrieren</CardTitle>
        <CardDescription>
          Füllen Sie das Formular aus, um sich als Handwerker zu registrieren und Aufträge zu erhalten.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firmenname</FormLabel>
                    <FormControl>
                      <Input placeholder="Ihre Firma GmbH" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kontaktperson</FormLabel>
                    <FormControl>
                      <Input placeholder="Max Mustermann" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="info@ihrefirma.de" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input placeholder="+49 123 456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Hauptstraße 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PLZ</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stadt</FormLabel>
                      <FormControl>
                        <Input placeholder="Berlin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschreibung Ihrer Dienstleistungen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beschreiben Sie Ihre Dienstleistungen und Expertise..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Diese Beschreibung wird auf Ihrem öffentlichen Profil angezeigt.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Angebotene Dienstleistungen</FormLabel>
                    <FormDescription>Wählen Sie alle Dienstleistungen aus, die Sie anbieten.</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {serviceOptions.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="services"
                        render={({ field }) => {
                          return (
                            <FormItem key={service.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, service.id])
                                      : field.onChange(field.value?.filter((value) => value !== service.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{service.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Ich akzeptiere die{" "}
                      <a href="/de/agb" className="text-primary hover:underline">
                        AGB
                      </a>{" "}
                      und{" "}
                      <a href="/de/datenschutz" className="text-primary hover:underline">
                        Datenschutzbestimmungen
                      </a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button onClick={form.handleSubmit(onSubmit)} className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird registriert...
            </>
          ) : (
            "Registrieren"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
