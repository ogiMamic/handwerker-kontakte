import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

interface FooterDictionary {
  copyright: string
}

export function SiteFooter({ dictionary }: { dictionary: FooterDictionary }) {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Handwerker-Kontakte</h3>
            <p className="text-sm text-gray-500">Connecting clients with skilled craftsmen for successful projects.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">For Clients</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="text-gray-500 hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-500 hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/client/signup" className="text-gray-500 hover:text-primary">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-500 hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">For Craftsmen</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/craftsman/signup" className="text-gray-500 hover:text-primary">
                  Join as Craftsman
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-gray-500 hover:text-primary">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-500 hover:text-primary">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-500 hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-500 hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="text-gray-500 hover:text-primary">
                  Imprint
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">{dictionary.copyright}</div>
      </div>
    </footer>
  )
}
