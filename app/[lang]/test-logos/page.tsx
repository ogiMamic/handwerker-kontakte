import { Logo } from "@/components/brand/logo"

export default function TestLogosPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-12 text-4xl font-bold">Logo Variants</h1>

      <div className="grid gap-12">
        {/* Variant 1: Default */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Default - Detailed Hammer</h2>
          <div className="flex items-center gap-8 rounded-lg border p-8">
            <Logo variant="default" />
            <Logo variant="default" iconOnly />
            <div className="rounded-lg bg-gray-900 p-4">
              <Logo variant="default" />
            </div>
          </div>
        </div>

        {/* Variant 2: Simple */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Simple - Clean Hammer</h2>
          <div className="flex items-center gap-8 rounded-lg border p-8">
            <Logo variant="simple" />
            <Logo variant="simple" iconOnly />
            <div className="rounded-lg bg-gray-900 p-4">
              <Logo variant="simple" />
            </div>
          </div>
        </div>

        {/* Variant 3: Badge */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Badge - Tool Icon</h2>
          <div className="flex items-center gap-8 rounded-lg border p-8">
            <Logo variant="badge" />
            <Logo variant="badge" iconOnly />
            <div className="rounded-lg bg-gray-900 p-4">
              <Logo variant="badge" />
            </div>
          </div>
        </div>

        {/* Variant 4: Geometric */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Geometric - Abstract Construction</h2>
          <div className="flex items-center gap-8 rounded-lg border p-8">
            <Logo variant="geometric" />
            <Logo variant="geometric" iconOnly />
            <div className="rounded-lg bg-gray-900 p-4">
              <Logo variant="geometric" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
