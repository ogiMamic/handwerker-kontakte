import { SignUp } from "@clerk/nextjs"
import type { Locale } from "@/lib/i18n-config"

export default function SignUpPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale }
  searchParams: { redirect_url?: string }
}) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp
        path={`/${lang}/sign-up`}
        signInUrl={`/${lang}/sign-in`}
        redirectUrl={searchParams.redirect_url || `/${lang}`}
      />
    </div>
  )
}
