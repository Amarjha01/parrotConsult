import { Briefcase, ShoppingCart, Gavel, Info, UserPlus, LifeBuoy, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-10 px-6 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <img
              src="/parrot1.png"
              alt="Parrot Consult Logo"
              className="h-14 w-auto mb-4"
            />
            <p className="text-gray-200">
              Connecting experts with clients who need their specialized knowledge.
            </p>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-bold mb-4">Categories</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center gap-2 hover:underline">
                  <Briefcase className="w-4 h-4 text-emerald-300" />
                  IT Consulting
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:underline">
                  <ShoppingCart className="w-4 h-4 text-emerald-300" />
                  Ecommerce
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:underline">
                  <Gavel className="w-4 h-4 text-emerald-300" />
                  Legal
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="/howitworks" className="flex items-center gap-2 hover:underline">
                  <Info className="w-4 h-4 text-emerald-300" />
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:underline">
                  <UserPlus className="w-4 h-4 text-emerald-300" />
                  Sign Up
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:underline">
                  <LifeBuoy className="w-4 h-4 text-emerald-300" />
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold mb-4">Contact</h3>
            <a href="mailto:info@parrotconsult.com" className="flex items-center gap-2 hover:underline">
              <Mail className="w-4 h-4 text-emerald-300" />
              info@parrotconsult.com
            </a>
            <a href="tel:8868864441" className="flex items-center gap-2 hover:underline">
              <Phone className="w-4 h-4 text-emerald-300" />
              +91 8868864441
            </a>
          </div>
        </div>

        <div className="border-t border-green-800 mt-10 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Parrot Consult. All rights reserved.
            <span className="ml-2">Product of FEB TECH IT SOLUTIONS Pvt. Ltd.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
