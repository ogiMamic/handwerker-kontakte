import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.75 2L10.25 2C10.1119 2 10 2.11193 10 2.25V6.25C10 6.38807 10.1119 6.5 10.25 6.5H13.75C13.8881 6.5 14 6.38807 14 6.25V2.25C14 2.11193 13.8881 2 13.75 2Z"
            fill="currentColor"
          />
          <path d="M6 8L3.5 10.5L12 19L20.5 10.5L18 8L12 14L6 8Z" fill="currentColor" opacity="0.9" />
          <rect x="11" y="19" width="2" height="3" fill="currentColor" opacity="0.8" />
        </svg>
      </div>
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-none tracking-tight text-gray-900">Handwerker</span>
          <span className="text-xs font-medium leading-none text-orange-600">Kontakte</span>
        </div>
      )}
    </div>
  )
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn("h-8 w-8", className)} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="url(#logo-gradient)" />
      <path
        d="M18 3L14 3C13.4477 3 13 3.44772 13 4V8C13 8.55228 13.4477 9 14 9H18C18.5523 9 19 8.55228 19 8V4C19 3.44772 18.5523 3 18 3Z"
        fill="white"
      />
      <path d="M8 11L4.5 14.5L16 26L27.5 14.5L24 11L16 19L8 11Z" fill="white" opacity="0.95" />
      <rect x="15" y="26" width="2" height="3" rx="1" fill="white" opacity="0.9" />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>
    </svg>
  )
}
