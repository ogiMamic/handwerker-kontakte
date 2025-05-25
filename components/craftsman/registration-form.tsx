"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { registerCraftsman } from "@/lib/actions/craftsman-actions"
import type { Locale } from "@/lib/i18n-config"
import { Save } from "lucide-react"

// Definicija sheme za validaciju formulara
const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Der Firmenname muss mindestens 2 Zeichen lang sein.",
  }),
  contactPerson: z.string().min(2, {
    message: "Der Name des Ansprechpartners muss mindestens 2 Zeichen lang sein.",
  }),
  email: z.string().email({
    message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  }),
  phone: z.string().min(5, {
    message: "Die Telefonnummer muss mindestens 5 Zeichen lang sein.",
  }),
  address: z.string().min(5, {
    message: "Die Adresse muss mindestens 5 Zeichen lang sein.",
  }),
  postalCode: z.string().min(5, {
    message: "Die Postleitzahl muss mindestens 5 Zeichen lang sein.",
  }),
  city: z.string().min(2, {
    message: "Der Ort muss mindestens 2 Zeichen lang sein.",
  }),
  description: z.string().min(10, {
    message: "Die Beschreibung muss mindestens 10 Zeichen lang sein.",
  }),
  skills: z.array(z.string()).min(1, {
    message: "Bitte wählen Sie mindestens eine Fähigkeit aus.",
  }),
  hourlyRate: z.coerce.number().min(10, {
    message: "Der Stundensatz muss mindestens 10 € betragen.",
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Sie müssen die AGB und Datenschutzbestimmungen akzeptieren." }),
  }),
})

type FormValues = z.infer<typeof formSchema>

// Verfügbare Fähigkeiten für die Auswahl
const AVAILABLE_SKILLS = [
  { label: "Renovierung", value: "Renovierung" },
  { label: "Installation", value: "Installation" },
  { label: "Sanitär", value: "Sanitär" },
  { label: "Elektrik", value: "Elektrik" },
  { label: "Malerarbeiten", value: "Malerarbeiten" },
  { label: "Fliesenlegen", value: "Fliesenlegen" },
  { label: "Tischlerei", value: "Tischlerei" },
  { label: "Dachdeckerarbeiten", value: "Dachdeckerarbeiten" },
  { label: "Gartenarbeit", value: "Gartenarbeit" },
  { label: "Umzug", value: "Umzug" },
]

interface CraftsmanRegistrationFormProps {
  dictionary: any
  lang: Locale
}

// Lokalni ključ za spremanje podataka u localStorage
const STORAGE_KEY = "craftsman_registration_form"

export function CraftsmanRegistrationForm({ dictionary, lang }: CraftsmanRegistrationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [progress, setProgress] = useState(0)

  // Inicijalizacija forme
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
      skills: [],
      hourlyRate: 35,
      termsAccepted: false,
    },
  })

  // Učitavanje spremljenih podataka iz localStorage pri prvom renderiranju
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        form.reset(parsedData)
        // Izračunaj progres nakon učitavanja podataka
        setTimeout(() => {
          calculateAndSetProgress()
        }, 100)
      } catch (error) {
        console.error("Error parsing saved form data:", error)
      }
    }
  }, [form])

  // Funkcija za izračunavanje progresa
  const calculateAndSetProgress = () => {
    const values = form.getValues()
    const fields = Object.keys(formSchema.shape) as Array<keyof FormValues>
    const filledFields = fields.filter((field) => {
      if (field === "skills") return values.skills.length > 0
      if (field === "termsAccepted") return values.termsAccepted
      if (field === "hourlyRate") return values.hourlyRate > 0
      return !!values[field] && String(values[field]).trim() !== ""
    })

    // Izračunavanje postotka ispunjenosti
    const calculatedProgress = Math.round((filledFields.length / fields.length) * 100)
    setProgress(calculatedProgress > 100 ? 100 : calculatedProgress)
  }

  // Praćenje napretka ispunjavanja formulara
  useEffect(() => {
    calculateAndSetProgress()
  }, [form.watch()])

  // Funkcija za privremeno spremanje podataka
  const handleSaveProgress = async () => {
    setIsSaving(true)
    try {
      const values = form.getValues()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values))

      toast({
        title: dictionary.craftsman?.registration?.saveSuccessTitle || "Fortschritt gespeichert",
        description:
          dictionary.craftsman?.registration?.saveSuccessMessage ||
          "Ihre Daten wurden erfolgreich zwischengespeichert.",
      })
    } catch (error) {
      console.error("Error saving form data:", error)
      toast({
        title: dictionary.craftsman?.registration?.saveErrorTitle || "Fehler beim Speichern",
        description:
          dictionary.craftsman?.registration?.saveErrorMessage ||
          "Beim Speichern der Daten ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Funkcija za slanje formulara
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const result = await registerCraftsman(data)

      if (result?.success) {
        // Brisanje privremeno spremljenih podataka
        localStorage.removeItem(STORAGE_KEY)

        // Postavljanje korisnika kao zanatlije u localStorage
        localStorage.setItem("currentRole", "craftsman")

        toast({
          title: dictionary.craftsman?.registration?.successTitle || "Registrierung erfolgreich",
          description: dictionary.craftsman?.registration?.successMessage || "Ihre Registrierung war erfolgreich.",
        })

        // Preusmjeravanje na stranicu za uspješnu registraciju
        router.push(`/${lang}/handwerker/registrierung-erfolgreich`)
      } else {
        throw new Error("Registration failed")
      }
    } catch (error) {
      console.error("Error registering craftsman:", error)
      toast({
        title: dictionary.craftsman?.registration?.errorTitle || "Registrierungsfehler",
        description:
          dictionary.craftsman?.registration?.errorMessage || "Bei der Registrierung ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{dictionary.craftsman?.registration?.formTitle || "Handwerker Registrierung"}</CardTitle>
        <CardDescription>
          {dictionary.craftsman?.registration?.description ||
            "Registrieren Sie sich als Handwerker auf unserer Plattform"}
        </CardDescription>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{dictionary.craftsman?.registration?.progress || "Fortschritt"}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.craftsman?.registration?.companyName || "Firmenname"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={dictionary.craftsman?.registration?.companyNamePlaceholder || "Muster GmbH"}
                        {...field}
                      />
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
                    <FormLabel>{dictionary.craftsman?.registration?.contactPerson || "Ansprechpartner"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={dictionary.craftsman?.registration?.contactPersonPlaceholder || "Max Mustermann"}
                        {...field}
                      />
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
                    <FormLabel>{dictionary.craftsman?.registration?.email || "E-Mail"}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="max@mustermann.de" {...field} />
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
                    <FormLabel>{dictionary.craftsman?.registration?.phone || "Telefon"}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="0123 456789" {...field} />
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
                    <FormLabel>{dictionary.craftsman?.registration?.address || "Adresse"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={dictionary.craftsman?.registration?.addressPlaceholder || "Musterstraße 123"}
                        {...field}
                      />
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
                      <FormLabel>{dictionary.craftsman?.registration?.postalCode || "PLZ"}</FormLabel>
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
                      <FormLabel>{dictionary.craftsman?.registration?.city || "Ort"}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={dictionary.craftsman?.registration?.cityPlaceholder || "Musterstadt"}
                          {...field}
                        />
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
                  <FormLabel>{dictionary.craftsman?.registration?.description || "Beschreibung"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        dictionary.craftsman?.registration?.descriptionPlaceholder ||
                        "Beschreiben Sie Ihre Dienstleistungen..."
                      }
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.craftsman?.registration?.skills || "Fähigkeiten"}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {AVAILABLE_SKILLS.map((skill) => (
                        <div key={skill.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill.value}`}
                            checked={field.value.includes(skill.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, skill.value])
                              } else {
                                field.onChange(field.value.filter((value) => value !== skill.value))
                              }
                            }}
                          />
                          <label
                            htmlFor={`skill-${skill.value}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {skill.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    {dictionary.craftsman?.registration?.skillsDescription || "Wählen Sie Ihre Fähigkeiten aus"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.craftsman?.registration?.hourlyRate || "Stundensatz"}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" min="10" step="0.5" {...field} className="pl-8" />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    {dictionary.craftsman?.registration?.hourlyRateDescription || "Ihr Stundensatz in Euro"}
                  </FormDescription>
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
                      {dictionary.craftsman?.registration?.termsText || "Ich akzeptiere die"}{" "}
                      <a href={`/${lang}/agb`} className="text-primary hover:underline">
                        {dictionary.craftsman?.registration?.terms || "AGB"}
                      </a>{" "}
                      {dictionary.craftsman?.registration?.andText || "und"}{" "}
                      <a href={`/${lang}/datenschutz`} className="text-primary hover:underline">
                        {dictionary.craftsman?.registration?.privacy || "Datenschutzbestimmungen"}
                      </a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button type="button" variant="outline" onClick={handleSaveProgress} disabled={isSaving || isSubmitting}>
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    {dictionary.craftsman?.registration?.saving || "Speichern..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {dictionary.craftsman?.registration?.saveProgress || "Jetzt speichern"}
                  </>
                )}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    {dictionary.craftsman?.registration?.submitting || "Registrierung..."}
                  </>
                ) : (
                  dictionary.craftsman?.registration?.submit || "Registrierung abschließen"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

// Default export za lakše importovanje
export default CraftsmanRegistrationForm
