import { SignIn } from "@clerk/nextjs"
import type { Locale } from "@/lib/i18n-config"

export default function SignInPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale }
  searchParams: { redirect_url?: string }
}) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn
        path={`/${lang}/sign-in`}
        signUpUrl={`/${lang}/sign-up`}
        redirectUrl={searchParams.redirect_url || `/${lang}`}
      />
    </div>
  )
}
