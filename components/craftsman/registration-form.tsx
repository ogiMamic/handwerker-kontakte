"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"
import { Progress } from "@/components/ui/progress"
import { registerCraftsman } from "@/lib/actions/craftsman-actions"
import { useToast } from "@/components/ui/use-toast"
import type { Locale } from "@/lib/i18n-config"

// Definiere die Formularvalidierung mit Zod
const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Der Firmenname muss mindestens 2 Zeichen lang sein.",
  }),
  contactPerson: z.string().min(2, {
    message: "Der Name der Kontaktperson muss mindestens 2 Zeichen lang sein.",
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
})

type FormValues = z.infer<typeof formSchema>

// Verfügbare Fähigkeiten für die Mehrfachauswahl
const availableSkills = [
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
  lang: Locale
  dictionary: any
}

export function CraftsmanRegistrationForm({ lang, dictionary }: CraftsmanRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  // Initialisiere das Formular mit react-hook-form und zod
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
      hourlyRate: 0,
    },
  })

  // Berechne den Fortschritt des Formulars
  const calculateProgress = () => {
    const values = form.getValues()
    const fields = Object.keys(formSchema.shape)
    let filledFields = 0

    fields.forEach((field) => {
      const value = values[field as keyof FormValues]
      if (field === "skills" && Array.isArray(value) && value.length > 0) {
        filledFields++
      } else if (value && typeof value === "string" && value.trim() !== "") {
        filledFields++
      } else if (typeof value === "number" && value > 0) {
        filledFields++
      }
    })

    return Math.round((filledFields / fields.length) * 100)
  }

  // Aktualisiere den Fortschritt bei Änderungen im Formular
  const handleFormChange = () => {
    setFormProgress(calculateProgress())
  }

  // Verarbeite das Formular bei Absenden
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      // Hier würden wir die Daten an den Server senden
      await registerCraftsman(data)

      toast({
        title: dictionary.craftsman.registration.successTitle,
        description: dictionary.craftsman.registration.successMessage,
      })

      // Weiterleitung zur Erfolgsseite
      router.push(`/${lang}/handwerker/registrierung-erfolgreich`)
    } catch (error) {
      console.error("Fehler bei der Registrierung:", error)
      toast({
        title: dictionary.craftsman.registration.errorTitle,
        description: dictionary.craftsman.registration.errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.craftsman.registration.formTitle}</CardTitle>
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Formular-Fortschritt</span>
            <span className="text-sm font-medium">{formProgress}%</span>
          </div>
          <Progress value={formProgress} className="h-2" />
        </div>
      </CardHeader>
      <Form {...form}>
        <form onChange={handleFormChange} onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.craftsman.registration.companyName}</FormLabel>
                    <FormControl>
                      <Input placeholder="Mustermann GmbH" {...field} />
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
                      <Input placeholder="Max Mustermann" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.craftsman.registration.email}</FormLabel>
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
                    <FormLabel>{dictionary.craftsman.registration.phone}</FormLabel>
                    <FormControl>
                      <Input placeholder="0123 456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.craftsman.registration.address}</FormLabel>
                  <FormControl>
                    <Input placeholder="Hauptstraße 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.craftsman.registration.postalCode}</FormLabel>
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
                    <FormLabel>{dictionary.craftsman.registration.city}</FormLabel>
                    <FormControl>
                      <Input placeholder="Berlin" {...field} />
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
                <FormItem>
                  <FormLabel>{dictionary.craftsman.registration.description}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={dictionary.craftsman.registration.descriptionPlaceholder}
                      className="min-h-[100px]"
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
                      options={availableSkills}
                      placeholder={dictionary.craftsman.registration.skillsPlaceholder}
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
                    <div className="relative">
                      <Input type="number" placeholder="45" {...field} className="pl-8" />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                    </div>
                  </FormControl>
                  <FormDescription>{dictionary.craftsman.registration.hourlyRateDescription}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  {dictionary.craftsman.registration.submitting}
                </>
              ) : (
                dictionary.craftsman.registration.submit
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
