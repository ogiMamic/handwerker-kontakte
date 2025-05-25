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
import { MultiSelect } from "@/components/ui/multi-select"
import { registerCraftsman } from "@/lib/actions/craftsman-actions"
import type { Locale } from "@/lib/i18n-config"

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

interface RegistrationFormProps {
  dictionary: any
  lang: Locale
}

export function RegistrationForm({ dictionary, lang }: RegistrationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [progress, setProgress] = useState(0)

  // Lokalni ključ za spremanje podataka u localStorage
  const STORAGE_KEY = "craftsman_registration_form"

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
      } catch (error) {
        console.error("Error parsing saved form data:", error)
      }
    }
  }, [form])

  // Praćenje napretka ispunjavanja formulara
  useEffect(() => {
    const values = form.getValues()
    const fields = Object.keys(formSchema.shape) as Array<keyof FormValues>
    const filledFields = fields.filter((field) => {
      if (field === "skills") return values.skills.length > 0
      if (field === "termsAccepted") return values.termsAccepted
      return !!values[field]
    })

    // Izračunavanje postotka ispunjenosti (bez termsAccepted)
    const calculatedProgress = Math.round((filledFields.length / (fields.length - 1)) * 100)
    setProgress(calculatedProgress > 100 ? 100 : calculatedProgress)
  }, [form.watch()])

  // Funkcija za privremeno spremanje podataka
  const handleSaveProgress = async () => {
    setIsSaving(true)
    try {
      const values = form.getValues()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values))

      toast({
        title: dictionary.craftsman.registration.saveSuccessTitle,
        description: dictionary.craftsman.registration.saveSuccessMessage,
      })
    } catch (error) {
      console.error("Error saving form data:", error)
      toast({
        title: dictionary.craftsman.registration.saveErrorTitle,
        description: dictionary.craftsman.registration.saveErrorMessage,
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

      if (result.success) {
        // Brisanje privremeno spremljenih podataka
        localStorage.removeItem(STORAGE_KEY)

        // Postavljanje korisnika kao zanatlije u localStorage
        localStorage.setItem("currentRole", "craftsman")

        // Preusmjeravanje na stranicu za uspješnu registraciju
        router.push(`/${lang}/handwerker/registrierung-erfolgreich`)
      } else {
        throw new Error("Registration failed")
      }
    } catch (error) {
      console.error("Error registering craftsman:", error)
      toast({
        title: dictionary.craftsman.registration.errorTitle,
        description: dictionary.craftsman.registration.errorMessage,
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{dictionary.craftsman.registration.formTitle}</CardTitle>
        <CardDescription>{dictionary.craftsman.registration.description}</CardDescription>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{dictionary.craftsman.registration.progress}</span>
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
                    <FormLabel>{dictionary.craftsman.registration.companyName}</FormLabel>
                    <FormControl>
                      <Input placeholder={dictionary.craftsman.registration.companyNamePlaceholder} {...field} />
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
                    <FormLabel>{dictionary.craftsman.registration.contactPerson}</FormLabel>
                    <FormControl>
                      <Input placeholder={dictionary.craftsman.registration.contactPersonPlaceholder} {...field} />
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
                    <FormLabel>{dictionary.craftsman.registration.email}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                    <FormLabel>{dictionary.craftsman.registration.phone}</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
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
                    <FormLabel>{dictionary.craftsman.registration.address}</FormLabel>
                    <FormControl>
                      <Input placeholder={dictionary.craftsman.registration.addressPlaceholder} {...field} />
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
                      <FormLabel>{dictionary.craftsman.registration.postalCode}</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>{dictionary.craftsman.registration.city}</FormLabel>
                      <FormControl>
                        <Input placeholder={dictionary.craftsman.registration.cityPlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>{dictionary.craftsman.registration.description}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={dictionary.craftsman.registration.descriptionPlaceholder}
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
                    <FormLabel>{dictionary.craftsman.registration.skills}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder={dictionary.craftsman.registration.skillsPlaceholder}
                        options={AVAILABLE_SKILLS}
                        selected={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>{dictionary.craftsman.registration.skillsDescription}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.craftsman.registration.hourlyRate}</FormLabel>
                    <FormControl>
                      <Input type="number" min="10" step="0.5" {...field} />
                    </FormControl>
                    <FormDescription>{dictionary.craftsman.registration.hourlyRateDescription}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 col-span-1 md:col-span-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {dictionary.craftsman.registration.termsText}{" "}
                        <a href="#" className="text-primary hover:underline">
                          {dictionary.craftsman.registration.terms}
                        </a>{" "}
                        {dictionary.craftsman.registration.andText}{" "}
                        <a href="#" className="text-primary hover:underline">
                          {dictionary.craftsman.registration.privacy}
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button type="button" variant="outline" onClick={handleSaveProgress} disabled={isSaving || isSubmitting}>
                {isSaving ? dictionary.craftsman.registration.saving : dictionary.craftsman.registration.saveProgress}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? dictionary.craftsman.registration.submitting : dictionary.craftsman.registration.submit}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
