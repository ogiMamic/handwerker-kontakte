import { clerkClient } from "@clerk/nextjs"

export async function configureClerk() {
  try {
    // Provjeri da li su Clerk environment variables postavljene
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
      console.warn("Clerk environment variables are not set")
      return { status: "warning", message: "Clerk environment variables are not set" }
    }

    // Provjeri konekciju sa Clerk API
    const response = await clerkClient.users.getUserList({
      limit: 1,
    })

    return {
      status: "ok",
      message: "Clerk configuration is valid",
      users: response.length,
    }
  } catch (error) {
    console.error("Clerk configuration error:", error)
    return {
      status: "error",
      message: "Clerk configuration error",
      error: (error as Error).message,
    }
  }
}
