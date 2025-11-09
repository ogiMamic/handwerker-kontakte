"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/shared/file-uploader"
import { Calendar } from "@/components/ui/calendar"
import { Save } from "lucide-react"
import { CraftsmanGallery } from "./craftsman-gallery"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Star, Crown } from "lucide-react"

// Define the form schema
const profileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactPerson: z.string().min(2, "Contact person name must be at least 2 characters"),
  phone: z.string().min(5, "Phone number must be at least 5 characters"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  description: z.string().min(20, "Description must be at least 20 characters"),
  serviceRadius: z.coerce.number().min(1, "Service radius must be at least 1 km"),
  hourlyRate: z.coerce.number().min(1, "Hourly rate must be at least 1"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
})

const businessSchema = z.object({
  businessLicense: z.string().min(1, "Business license is required"),
  taxId: z.string().min(1, "Tax ID is required"),
  businessAddress: z.string().min(5, "Business address must be at least 5 characters"),
  businessCity: z.string().min(2, "City must be at least 2 characters"),
  businessPostalCode: z.string().regex(/^\d{5}$/, "Please enter a valid postal code (5 digits)"),
  foundingYear: z.coerce
    .number()
    .min(1900, "Please enter a valid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  insuranceProvider: z.string().min(1, "Insurance provider is required"),
  insurancePolicyNumber: z.string().min(1, "Insurance policy number is required"),
})

const availabilitySchema = z.object({
  availableDays: z.array(z.string()),
  workHoursStart: z.string(),
  workHoursEnd: z.string(),
  vacationDates: z.array(z.date()).optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type BusinessFormValues = z.infer<typeof businessSchema>
type AvailabilityFormValues = z.infer<typeof availabilitySchema>

const skillOptions = [
  { id: "plumbing", label: "Plumbing" },
  { id: "electrical", label: "Electrical" },
  { id: "carpentry", label: "Carpentry" },
  { id: "painting", label: "Painting" },
  { id: "flooring", label: "Flooring" },
  { id: "roofing", label: "Roofing" },
  { id: "landscaping", label: "Landscaping" },
  { id: "masonry", label: "Masonry" },
  { id: "hvac", label: "HVAC" },
  { id: "tiling", label: "Tiling" },
]

const dayOptions = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
]

interface CraftsmanProfileProps {
  craftsman: any
  dictionary: any
}

export function CraftsmanProfile({ craftsman, dictionary }: CraftsmanProfileProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [licenseFile, setLicenseFile] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      companyName: craftsman?.companyName || "",
      contactPerson: craftsman?.contactPerson || "",
      phone: craftsman?.phone || "",
      website: craftsman?.website || "",
      description: craftsman?.description || "",
      serviceRadius: craftsman?.serviceRadius || 20,
      hourlyRate: craftsman?.hourlyRate || 50,
      skills: craftsman?.skills || [],
    },
  })

  // Business form
  const businessForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessLicense: craftsman?.businessLicense || "",
      taxId: craftsman?.taxId || "",
      businessAddress: craftsman?.businessAddress || "",
      businessCity: craftsman?.businessCity || "",
      businessPostalCode: craftsman?.businessPostalCode || "",
      foundingYear: craftsman?.foundingYear || 2020,
      insuranceProvider: craftsman?.insuranceProvider || "",
      insurancePolicyNumber: craftsman?.insurancePolicyNumber || "",
    },
  })

  // Availability form
  const availabilityForm = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      availableDays: craftsman?.availableDays || ["monday", "tuesday", "wednesday", "thursday", "friday"],
      workHoursStart: craftsman?.workHoursStart || "08:00",
      workHoursEnd: craftsman?.workHoursEnd || "17:00",
      vacationDates: craftsman?.vacationDates || [],
    },
  })

  const handleLicenseUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setLicenseFile(urls[0])
      businessForm.setValue("businessLicense", urls[0])
    }
  }

  const updateCraftsmanProfile = async (data: any) => {
    // Placeholder for updateCraftsmanProfile function
    console.log("Updating craftsman profile with data:", data)
  }

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)
    try {
      await updateCraftsmanProfile({
        type: "profile",
        data,
      })
      console.log("Profile updated:", data)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onBusinessSubmit = async (data: BusinessFormValues) => {
    setIsSubmitting(true)
    try {
      await updateCraftsmanProfile({
        type: "business",
        data,
      })
      console.log("Business info updated:", data)
    } catch (error) {
      console.error("Error updating business info:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onAvailabilitySubmit = async (data: AvailabilityFormValues) => {
    setIsSubmitting(true)
    try {
      await updateCraftsmanProfile({
        type: "availability",
        data,
      })
      console.log("Availability updated:", data)
    } catch (error) {
      console.error("Error updating availability:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
              <img
                src={
                  craftsman.id === "eni-elektro-001"
                    ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dOlu6eb7kXF05OAlEikqeJtNKnEjtM.png"
                    : craftsman.profileImage || craftsman.imageUrl || "/placeholder.svg?height=128&width=128"
                }
                alt={craftsman.name || craftsman.companyName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{craftsman.name || craftsman.companyName}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{craftsman.city || craftsman.businessCity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{craftsman.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{craftsman.rating || craftsman.averageRating || "5.0"}</span>
                  </div>
                  <span className="text-muted-foreground">|</span>
                  <span className="font-medium text-green-600">€{craftsman.hourlyRate}/h</span>
                </div>
              </div>

              {craftsman.isSponsored && (
                <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-yellow-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Gesponsert
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-4">{craftsman.bio || craftsman.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {(craftsman.skills || []).map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>

            <Button size="lg" className="w-full md:w-auto">
              <Mail className="h-4 w-4 mr-2" />
              Jetzt kontaktieren
            </Button>
          </div>
        </div>
      </div>

      {craftsman.portfolio && craftsman.portfolio.length > 0 && <CraftsmanGallery portfolio={craftsman.portfolio} />}

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+49 123 456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourwebsite.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your services and expertise..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>This will be displayed on your public profile.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="serviceRadius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Radius (km)</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormDescription>How far are you willing to travel for jobs?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate (€)</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormDescription>Your standard hourly rate.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="skills"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Skills</FormLabel>
                          <FormDescription>Select all the skills that apply to your services.</FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {skillOptions.map((skill) => (
                            <FormField
                              key={skill.id}
                              control={profileForm.control}
                              name="skills"
                              render={({ field }) => {
                                return (
                                  <FormItem key={skill.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(skill.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, skill.id])
                                            : field.onChange(field.value?.filter((value) => value !== skill.id))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{skill.label}</FormLabel>
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

                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...businessForm}>
                <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Business License</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Upload your business license or trade certificate (Gewerbeschein).
                      </p>

                      {licenseFile ? (
                        <div className="mb-4">
                          <div className="flex items-center p-2 bg-gray-50 rounded">
                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                              <span className="text-xs">PDF</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">Business License</div>
                              <div className="text-xs text-gray-500">Uploaded successfully</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setLicenseFile(null)
                                businessForm.setValue("businessLicense", "")
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <FileUploader
                          onUpload={handleLicenseUpload}
                          maxFiles={1}
                          acceptedFileTypes={["application/pdf", "image/jpeg", "image/png"]}
                        />
                      )}

                      {businessForm.formState.errors.businessLicense && (
                        <p className="text-sm text-red-500 mt-1">
                          {businessForm.formState.errors.businessLicense.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={businessForm.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax ID / VAT Number</FormLabel>
                            <FormControl>
                              <Input placeholder="DE123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessForm.control}
                        name="foundingYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year Founded</FormLabel>
                            <FormControl>
                              <Input type="number" min={1900} max={new Date().getFullYear()} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={businessForm.control}
                      name="businessAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Street and number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={businessForm.control}
                        name="businessCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessForm.control}
                        name="businessPostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={businessForm.control}
                        name="insuranceProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Provider</FormLabel>
                            <FormControl>
                              <Input placeholder="Insurance company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessForm.control}
                        name="insurancePolicyNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Policy Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Policy number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Business Details"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...availabilityForm}>
                <form onSubmit={availabilityForm.handleSubmit(onAvailabilitySubmit)} className="space-y-6">
                  <FormField
                    control={availabilityForm.control}
                    name="availableDays"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Available Days</FormLabel>
                          <FormDescription>Select the days you are available for work.</FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {dayOptions.map((day) => (
                            <FormField
                              key={day.id}
                              control={availabilityForm.control}
                              name="availableDays"
                              render={({ field }) => {
                                return (
                                  <FormItem key={day.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(day.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, day.id])
                                            : field.onChange(field.value?.filter((value) => value !== day.id))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{day.label}</FormLabel>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={availabilityForm.control}
                      name="workHoursStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Hours Start</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={availabilityForm.control}
                      name="workHoursEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Hours End</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormLabel>Vacation Dates</FormLabel>
                    <FormDescription className="mb-4">
                      Select dates when you are not available for work.
                    </FormDescription>

                    <div className="border rounded-md p-4">
                      <Calendar
                        mode="multiple"
                        selected={availabilityForm.getValues().vacationDates}
                        onSelect={(dates) => {
                          availabilityForm.setValue("vacationDates", dates || [])
                        }}
                        className="rounded-md border"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Availability"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Work Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              {craftsman.portfolio && craftsman.portfolio.length > 0 ? (
                <CraftsmanGallery portfolio={craftsman.portfolio} />
              ) : (
                <p className="text-muted-foreground text-center py-8">Noch keine Bilder in der Galerie vorhanden.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
