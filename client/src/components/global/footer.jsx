export default function Footer() {
    return (
      <footer className="py-8 px-6 bg-green-900 text-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
            <img
                    src="/parrot1.png" // 👈 path is relative to /public
                    alt="Logo"
                    className="h-50 w-auto" // adjust size as needed
                  />
              <p className="mt-4">Connecting experts with clients who need their specialized knowledge.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">IT Consulting</a></li>
                <li><a href="#" className="hover:underline">Ecommerce</a></li>
                <li><a href="#" className="hover:underline">Legal</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/howitworks" className="hover:underline">How It Works</a></li>
                <li><a href="" className="hover:underline">Sign Up</a></li>
                <li><a href="" className="hover:underline">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <a href="mailto:info@parrotconsult.com">info@parrotconsult.com</a>
             <a href="tel:8868864441">+91 8868864441</a>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()}  Parrot Consult. All rights reserved. product of FEB TECH IT SOLUTIONS Pvt. ltd.</p>
          </div>
        </div>
      </footer>
    );
  }