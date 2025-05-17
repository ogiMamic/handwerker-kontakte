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
import { ImageIcon } from "lucide-react"
import { ArrowLeft, ArrowRight, Calendar, Euro, FileText, MapPin, Pencil } from "lucide-react"
import { FileUploader } from "@/components/file-uploader" // Import FileUploader component

// Define the form schema for each step
const basicInfoSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(20, "Description must be at least 20 characters"),
})

const locationSchema = z.object({
  postalCode: z.string().regex(/^\d{5}$/, "Please enter a valid postal code (5 digits)"),
  city: z.string().min(2, "City name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
})

const detailsSchema = z.object({
  budget: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid budget"),
  deadline: z.string().min(1, "Please select a deadline"),
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
  { id: "basic-info", title: "Basic Information", icon: Pencil },
  { id: "location", title: "Location", icon: MapPin },
  { id: "details", title: "Project Details", icon: FileText },
  { id: "images", title: "Upload Images", icon: ImageIcon },
  { id: "review", title: "Review & Submit", icon: Calendar },
]

export function JobWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<JobFormValues>>({})
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { locale } = useI18n()

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

      // Redirect to the jobs page
      router.push(`/${locale}/client/jobs`)
    } catch (error) {
      console.error("Error submitting job:", error)
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
        <h1 className="text-2xl font-bold mb-4">Create a New Job</h1>

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
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bathroom Renovation" {...field} />
                      </FormControl>
                      <FormDescription>A clear title helps craftsmen understand your project.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={basicInfoForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="carpentry">Carpentry</SelectItem>
                          <SelectItem value="painting">Painting</SelectItem>
                          <SelectItem value="flooring">Flooring</SelectItem>
                          <SelectItem value="roofing">Roofing</SelectItem>
                          <SelectItem value="landscaping">Landscaping</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your project in detail..." className="min-h-32" {...field} />
                      </FormControl>
                      <FormDescription>
                        Include details about the scope, materials, and any specific requirements.
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
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 10115" {...field} />
                      </FormControl>
                      <FormDescription>Your postal code helps us find craftsmen in your area.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={locationForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Berlin" {...field} />
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
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Hauptstraße 1" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will only be shared with craftsmen you choose to work with.
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
                          <Input type="text" placeholder="e.g. 1000" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Provide an estimated budget for your project.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>When do you need this project completed by?</FormDescription>
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
                <h3 className="text-lg font-medium mb-2">Upload Images</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Upload images of your project to help craftsmen understand your requirements better.
                </p>
                <FileUploader onUpload={handleImageUpload} maxFiles={5} />
              </div>

              {images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Uploaded Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleImageRemove(index)}
                        >
                          <span className="sr-only">Remove image</span>×
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
              <h3 className="text-lg font-medium">Review Your Job</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Title:</span>
                      <p className="text-sm">{formData.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Category:</span>
                      <p className="text-sm capitalize">{formData.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Description:</span>
                      <p className="text-sm">{formData.description}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Location</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Postal Code:</span>
                      <p className="text-sm">{formData.postalCode}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">City:</span>
                      <p className="text-sm">{formData.city}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Address:</span>
                      <p className="text-sm">{formData.address}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Project Details</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Budget:</span>
                      <p className="text-sm">€{formData.budget}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Deadline:</span>
                      <p className="text-sm">{formData.deadline}</p>
                    </div>
                  </div>
                </div>
                {images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Images</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Project image ${index + 1}`}
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
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting}>
            {currentStep === steps.length - 1 ? (
              isSubmitting ? (
                "Submitting..."
              ) : (
                "Submit Job"
              )
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
