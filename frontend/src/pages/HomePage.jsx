import { SignedIn, UserButton,SignedOut,SignInButton,SignUpButton } from "@clerk/clerk-react"
import logo from "../assets/logo.png"
import heroImage from "../assets/hero.png"

function HomePage() {
  return (
    <div>
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 p-5 flex backdrop-blur-sm bg-black/20 justify-between items-center gap-5">
        {/* LOGO AND BRAND NAME */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="w-14 h-9"
          />
          <h1 className="text-2xl font-bold text-white font-jet">ZERO VAULT</h1>
        </div>

        {/* SIGNED OUT BUTTONS */}
        <SignedOut>
          <div className="flex gap-5">
            <SignInButton>
              <button className="cursor-pointer text-white font-jet">
                Login
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="border-[#008B1E] border-2 px-2 py-1 cursor-pointer text-[#008B1E] rounded-lg font-jet">
                Register
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        {/* Main Hero Grid */}
        <div className="grid grid-cols-2 gap-12 items-center">

          {/* Left Content Section */}
          <div className="flex flex-col gap-8">

            {/* Heading */}
            <div>

              <h1 className="text-5xl font-bold text-white leading-tight">
                Manage Your Passwords With <span className="text-[#008B1E]">Zero Vault</span>
              </h1>

            </div>

            {/* Subheading */}
            <div>
              <p className="text-lg text-gray-400">
                Zero Vault helps you securely manage passwords,
                credentials, and sensitive information with
                end-to-end encryption.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {/* Getting Started Button */}
              <SignUpButton>
                <button className="border-[#008B1E] border-2 px-2 py-1 cursor-pointer text-[#008B1E] rounded-lg font-jet">
                  Get Started
                </button>
              </SignUpButton>

              {/* Learn More Button */}
              <button className="px-6 py-3 border border-[#008B1E] text-[#008B1E] rounded-lg cursor-pointer font-jet">
                Learn More
              </button>
            </div>

          </div>

          {/* Right Image Section  */}
          <div className="flex justify-center">
            {/* Hero Image */}
            <img 
              src={heroImage} 
              alt="Zero Vault Hero" 
              className="w-full max-w-lg object-contain rounded-3xl shadow-lg shadow-[#008B1E]/20"  
            />
          </div>

        </div>
        
      </section>
    </div>
  )
}

export default HomePage