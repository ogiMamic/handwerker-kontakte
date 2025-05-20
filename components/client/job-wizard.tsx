"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useI18n } from "@/components/i18n-provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createJob } from "@/lib/actions/job-actions"
import { ImageIcon, Loader2 } from "lucide-react"
import { ArrowLeft, ArrowRight, Calendar, Euro, FileText, MapPin, Pencil } from "lucide-react"
import { FileUploader } from "@/components/file-uploader"
import { useToast } from "@/components/ui/use-toast"

// Define the form schema for each step
const basicInfoSchema = z.object({
  title: z.string().min(5, "Der Titel muss mindestens 5 Zeichen lang sein"),
  category: z.string().min(1, "Bitte wählen Sie eine Kategorie aus"),
  description: z.string().min(20, "Die Beschreibung muss mindestens 20 Zeichen lang sein"),
})

const locationSchema = z.object({
  postalCode: z.string().regex(/^\d{5}$/, "Bitte geben Sie eine gültige Postleitzahl ein (5 Ziffern)"),
  city: z.string().min(2, "Der Stadtname muss mindestens 2 Zeichen lang sein"),
  address: z.string().min(5, "Die Adresse muss mindestens 5 Zeichen lang sein"),
})

const detailsSchema = z.object({
  budget: z.string().regex(/^\d+(\.\d{1,2})?$/, "Bitte geben Sie ein gültiges Budget ein"),
  deadline: z.string().min(1, "Bitte wählen Sie einen Termin aus"),
})

// Combine all schemas for the final submission
const jobSchema = z.object({
  ...basicInfoSchema.shape,
  ...locationSchema.shape,
  ...detailsSchema.shape,
  images: z.array(z.string()).optional(),
})

type JobFormValues = z.infer<typeof jobSchema>

const steps = [
  { id: "basic-info", title: "Grundinformationen", icon: Pencil },
  { id: "location", title: "Standort", icon: MapPin },
  { id: "details", title: "Projektdetails", icon: FileText },
  { id: "images", title: "Bilder hochladen", icon: ImageIcon },
  { id: "review", title: "Überprüfen & Absenden", icon: Calendar },
]

export function JobWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<JobFormValues>>({})
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { locale } = useI18n()
  const { toast } = useToast()

  // Create a form for each step
  const basicInfoForm = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: formData.title || "",
      category: formData.category || "",
      description: formData.description || "",
    },
  })

  const locationForm = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      postalCode: formData.postalCode || "",
      city: formData.city || "",
      address: formData.address || "",
    },
  })

  const detailsForm = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      budget: formData.budget || "",
      deadline: formData.deadline || "",
    },
  })

  const handleNext = async () => {
    switch (currentStep) {
      case 0:
        const basicInfoValid = await basicInfoForm.trigger()
        if (basicInfoValid) {
          const data = basicInfoForm.getValues()
          setFormData({ ...formData, ...data })
          setCurrentStep(currentStep + 1)
        }
        break
      case 1:
        const locationValid = await locationForm.trigger()
        if (locationValid) {
          const data = locationForm.getValues()
          setFormData({ ...formData, ...data })
          setCurrentStep(currentStep + 1)
        }
        break
      case 2:
        const detailsValid = await detailsForm.trigger()
        if (detailsValid) {
          const data = detailsForm.getValues()
          setFormData({ ...formData, ...data })
          setCurrentStep(currentStep + 1)
        }
        break
      case 3:
        setFormData({ ...formData, images })
        setCurrentStep(currentStep + 1)
        break
      case 4:
        await handleSubmit()
        break
      default:
        setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Combine all form data
      const completeFormData: JobFormValues = {
        ...(formData as JobFormValues),
        images,
      }

      // Submit the job
      await createJob(completeFormData)

      // Show success toast
      toast({
        title: "Auftrag erfolgreich erstellt",
        description: "Ihr Auftrag wurde erfolgreich erstellt und wird nun veröffentlicht.",
        duration: 5000,
      })

      // Redirect to the jobs page after a short delay
      setTimeout(() => {
        router.push(`/${locale}/client/jobs`)
      }, 2000)
    } catch (error) {
      console.error("Error submitting job:", error)
      toast({
        title: "Fehler beim Erstellen des Auftrags",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (urls: string[]) => {
    setImages([...images, ...urls])
  }

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Neuen Auftrag erstellen</h1>

        {/* Step indicator */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${index <= currentStep ? "text-primary" : "text-gray-400"}`}
            >
              <div
                className={`
                flex items-center justify-center w-10 h-10 rounded-full mb-2
                ${
                  index < currentStep
                    ? "bg-primary text-white"
                    : index === currentStep
                      ? "border-2 border-primary"
                      : "border-2 border-gray-200"
                }
              `}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <span className="text-xs hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <Form {...basicInfoForm}>
              <form className="space-y-6">
                <FormField
                  control={basicInfoForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auftragstitel</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Badezimmerrenovierung" {...field} />
                      </FormControl>
                      <FormDescription>Ein klarer Titel hilft Handwerkern, Ihr Projekt zu verstehen.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={basicInfoForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategorie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wählen Sie eine Kategorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="plumbing">Sanitär</SelectItem>
                          <SelectItem value="electrical">Elektrik</SelectItem>
                          <SelectItem value="carpentry">Tischlerei</SelectItem>
                          <SelectItem value="painting">Malerarbeiten</SelectItem>
                          <SelectItem value="flooring">Bodenbeläge</SelectItem>
                          <SelectItem value="roofing">Dacharbeiten</SelectItem>
                          <SelectItem value="landscaping">Gartenarbeiten</SelectItem>
                          <SelectItem value="other">Sonstiges</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={basicInfoForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beschreibung</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Beschreiben Sie Ihr Projekt im Detail..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Fügen Sie Details zum Umfang, zu Materialien und zu spezifischen Anforderungen hinzu.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}

          {currentStep === 1 && (
            <Form {...locationForm}>
              <form className="space-y-6">
                <FormField
                  control={locationForm.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postleitzahl</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. 10115" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ihre Postleitzahl hilft uns, Handwerker in Ihrer Nähe zu finden.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={locationForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stadt</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Berlin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={locationForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Hauptstraße 1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Diese wird nur mit Handwerkern geteilt, mit denen Sie zusammenarbeiten möchten.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}

          {currentStep === 2 && (
            <Form {...detailsForm}>
              <form className="space-y-6">
                <FormField
                  control={detailsForm.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (€)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Euro className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input type="text" placeholder="z.B. 1000" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Geben Sie ein geschätztes Budget für Ihr Projekt an.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frist</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>Bis wann soll dieses Projekt abgeschlossen sein?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Bilder hochladen</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Laden Sie Bilder Ihres Projekts hoch, um Handwerkern zu helfen, Ihre Anforderungen besser zu
                  verstehen.
                </p>
                <FileUploader onUpload={handleImageUpload} maxFiles={5} />
              </div>

              {images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Hochgeladene Bilder</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Projektbild ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleImageRemove(index)}
                        >
                          <span className="sr-only">Bild entfernen</span>×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Überprüfen Sie Ihren Auftrag</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Grundinformationen</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Titel:</span>
                      <p className="text-sm">{formData.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Kategorie:</span>
                      <p className="text-sm capitalize">{formData.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Beschreibung:</span>
                      <p className="text-sm">{formData.description}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Standort</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Postleitzahl:</span>
                      <p className="text-sm">{formData.postalCode}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Stadt:</span>
                      <p className="text-sm">{formData.city}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Adresse:</span>
                      <p className="text-sm">{formData.address}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Projektdetails</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Budget:</span>
                      <p className="text-sm">€{formData.budget}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Frist:</span>
                      <p className="text-sm">{formData.deadline}</p>
                    </div>
                  </div>
                </div>
                {images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Bilder</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Projektbild ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting}>
            {currentStep === steps.length - 1 ? (
              isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird eingereicht...
                </>
              ) : (
                "Auftrag einreichen"
              )
            ) : (
              <>
                Weiter
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
