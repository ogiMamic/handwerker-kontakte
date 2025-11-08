import { Hammer } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-sm">
        <Hammer className="h-4 w-4 text-white" />
      </div>
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-none tracking-tight">Handwerker</span>
          <span className="text-xs font-medium leading-none text-blue-600">Kontakte</span>
        </div>
      )}
    </div>
  )
}
